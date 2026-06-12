import crypto from "crypto";
import appleSignin from "apple-signin-auth";
import db from "@/services/db";

// Native iOS "Sign in with Apple". The app sends Apple's identityToken (a JWT
// signed by Apple), which we verify here against Apple's public keys. No Supabase
// is involved in this flow. The stable `sub` claim is the canonical Apple id;
// email/full_name are only sent by Apple on the first authorization.
const APPLE_AUDIENCE = "ge.akordebi.app";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", msg: "Method not allowed" });
    }

    try {
        const { identityToken, rawNonce, email, fullName } = req.body;

        if (!identityToken) {
            return res.json({ status: "error", msg: "identityToken is required" });
        }

        let claims;
        try {
            // Validates signature against Apple's JWKS, plus issuer + audience + expiry.
            claims = await appleSignin.verifyIdToken(identityToken, {
                audience: APPLE_AUDIENCE,
                ignoreExpiration: false,
            });
        } catch (verifyErr) {
            console.error('Apple token verification failed:', verifyErr);
            return res.status(401).json({ status: "error", msg: "Invalid Apple token" });
        }

        // verifyIdToken does NOT check the nonce (it forwards options to
        // jsonwebtoken, which ignores unknown keys), so validate it manually.
        // The client passes SHA-256(rawNonce) to Apple, so the token's nonce
        // claim equals SHA-256(rawNonce).
        if (rawNonce) {
            const expectedNonce = crypto.createHash('sha256').update(rawNonce).digest('hex');
            if (claims.nonce !== expectedNonce) {
                return res.status(401).json({ status: "error", msg: "Nonce mismatch" });
            }
        }

        const appleSub = claims.sub;
        // Prefer the verified email from the token; fall back to the value the
        // client forwarded on first sign-in. May be a @privaterelay.appleid.com
        // address when the user chose "Hide My Email".
        const resolvedEmail = claims.email || email || null;
        const isPrivateEmail =
            claims.is_private_email === true ||
            claims.is_private_email === 'true' ||
            (resolvedEmail ? resolvedEmail.includes('@privaterelay.appleid.com') : false);

        // 1) Returning Apple user -> resolve via the stable apple_sub.
        const existingApple = await db.getAppleUserBySub(appleSub);
        if (existingApple) {
            const userDetails = await db.getUserByID(existingApple.user_id);
            return res.json({ status: "ok", data: userDetails, isNewUser: false, isPrivateRelay: !!existingApple.is_private_email });
        }

        // 2) Not linked yet. If Apple gave us a real (non-private) email that
        //    matches an existing account, link to it. Otherwise create a new user.
        let userRow = null;
        if (resolvedEmail && !isPrivateEmail) {
            userRow = await db.getUserByEmail(resolvedEmail);
        }

        let isNewUser = false;
        if (!userRow) {
            const newId = crypto.randomUUID();
            userRow = await db.createUser({
                id: newId,
                email: resolvedEmail,
                full_name: fullName || null,
            });
            isNewUser = true;
        } else if (fullName && !userRow.full_name) {
            await db.pool.execute(
                'UPDATE users SET full_name = ? WHERE id = ?',
                [fullName, userRow.id]
            );
            userRow.full_name = fullName;
        }

        await db.linkAppleUser({
            userId: userRow.id,
            appleSub,
            email: resolvedEmail,
            isPrivateEmail,
            fullName: fullName || null,
        });

        return res.json({ status: "ok", data: userRow, isNewUser, isPrivateRelay: isPrivateEmail });
    } catch (err) {
        console.error('Apple sign-in error:', err);
        return res.json({ status: "error", msg: "Failed to process Apple sign-in" });
    }
}
