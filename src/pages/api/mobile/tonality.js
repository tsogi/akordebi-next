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
            const { songId, tonality, userId } = req.body;

            if (songId === undefined || tonality === undefined || !userId) {
                return res.json({
                    status: "error",
                    msg: "Missing songId, tonality, or userId"
                });
            }

            if (tonality === 0) {
                await db.deleteUserTonality(userId, songId);
            } else {
                await db.setUserTonality(userId, songId, tonality);
            }
            
            res.json({
                status: "ok",
                data: true
            });
        } catch (err) {
            console.error('Error setting tonality:', err);
            res.json({
                status: "error",
                msg: "Failed to set tonality"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
