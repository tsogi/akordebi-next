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
            const { songId } = req.query;
            const relatedSongs = await db.getRelatedSongs(parseInt(songId));
            
            res.json({
                status: "ok",
                data: relatedSongs
            });
        } catch (err) {
            console.error('Error fetching related songs:', err);
            res.json({
                status: "error",
                msg: "Failed to fetch related songs"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
