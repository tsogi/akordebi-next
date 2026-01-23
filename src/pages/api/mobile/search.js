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
        const { searchText } = req.body;
        
        try {
            const rows = await db.searchSongs(searchText);
            res.json({
                status: "ok",
                data: rows
            });
        } catch (err) {
            console.error('Error searching songs:', err);
            res.json({
                status: "error",
                msg: "Search failed"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
