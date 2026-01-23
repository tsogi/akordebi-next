import db from "@/services/db";

export default async function handler(req, res) {
    // Enable CORS for mobile app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { id, email, full_name } = req.body;

            if (!id || !email) {
                return res.json({
                    status: "error",
                    msg: "Missing id or email"
                });
            }

            // Create user object matching the expected format
            const user = {
                id,
                email,
                user_metadata: {
                    full_name: full_name || ''
                }
            };

            const userDetails = await db.setUserData(user);
            
            res.json({
                status: "ok",
                data: userDetails
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
