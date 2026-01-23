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
            const songs = await db.getAllSongsSorted(userId || null);
            
            res.json({
                status: "ok",
                data: songs
            });
        } catch (err) {
            console.error('Error fetching songs:', err);
            res.json({
                status: "error",
                msg: "Failed to fetch songs"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
