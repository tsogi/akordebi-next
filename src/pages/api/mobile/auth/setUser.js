import db from "@/services/db";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { id, email, full_name, provider } = req.body;

            if (!email) {
                return res.json({
                    status: "error",
                    msg: "Email is required"
                });
            }

            // Check if this is a private relay email (Apple hidden email)
            const isPrivateRelay = email.includes('@privaterelay.appleid.com');

            // First, check if a user with this email already exists
            const existingUser = await db.getUserByEmail(email);

            if (existingUser) {
                // User exists - return existing user (account linking)
                // Update full_name if provided and user doesn't have one
                if (full_name && !existingUser.full_name) {
                    await db.pool.execute(
                        'UPDATE users SET full_name = ? WHERE id = ?',
                        [full_name, existingUser.id]
                    );
                    existingUser.full_name = full_name;
                }

                return res.json({
                    status: "ok",
                    data: existingUser,
                    isNewUser: false,
                    isPrivateRelay
                });
            }

            // No existing user - create new one
            const user = {
                id: id || `${provider}_${Date.now()}`,
                email,
                user_metadata: {
                    full_name: full_name || ''
                }
            };

            // Create user and mark email as verified (Apple/Google verify emails)
            const userDetails = await db.setUserData(user);
            
            // Mark as email verified since it comes from Apple/Google
            await db.pool.execute(
                'UPDATE users SET email_verified = 1 WHERE id = ?',
                [userDetails.id]
            );

            res.json({
                status: "ok",
                data: userDetails,
                isNewUser: true,
                isPrivateRelay
            });
        } catch (err) {
            console.error('Error setting user data:', err);
            res.json({
                status: "error",
                msg: "Failed to set user data"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
