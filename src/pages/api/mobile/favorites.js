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
            const { action, songId, userId } = req.body;

            if (!songId || !userId || !action) {
                return res.json({
                    status: "error",
                    msg: "Missing songId, userId, or action"
                });
            }

            if (action === 'add') {
                await db.addSongToFavorites(songId, userId);
            } else if (action === 'remove') {
                await db.removeSongFromFavorites(songId, userId);
            } else {
                return res.json({
                    status: "error",
                    msg: "Invalid action. Use 'add' or 'remove'"
                });
            }
            
            res.json({
                status: "ok",
                data: true
            });
        } catch (err) {
            console.error('Error updating favorite:', err);
            res.json({
                status: "error",
                msg: "Failed to update favorite"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
