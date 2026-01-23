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
            const { songId, userId } = req.body;

            if (!songId || !userId) {
                return res.json({
                    status: "error",
                    msg: "Missing songId or userId"
                });
            }

            await db.removeSongFromFavorites(songId, userId);
            
            res.json({
                status: "ok",
                data: true
            });
        } catch (err) {
            console.error('Error removing from favorites:', err);
            res.json({
                status: "error",
                msg: "Failed to remove from favorites"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
