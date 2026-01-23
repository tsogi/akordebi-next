import db from "@/services/db";

export default async function handler(req, res) {
    // Enable CORS for mobile app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.json({
                    status: "error",
                    msg: "Missing userId"
                });
            }

            const userDetails = await db.getUserByID(userId);
            
            if (userDetails) {
                res.json({
                    status: "ok",
                    data: userDetails
                });
            } else {
                res.json({
                    status: "error",
                    msg: "User not found"
                });
            }
        } catch (err) {
            console.error('Error getting user data:', err);
            res.json({
                status: "error",
                msg: "Failed to get user data"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
