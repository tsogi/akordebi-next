import db from "@/services/db";
import { getNotation, notations } from '@/utils/notations';

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
            const { notationFormat, url, userId } = req.query;

            let song = null;

            // First attempt: Try to find song by URL and notation format
            if (notationFormat) {
                song = await db.getSongByUrlAndNotation(url, notationFormat, userId || null);
            }

            // Second attempt: Try to find song by URL only
            if (!song) {
                song = await db.getSongByUrl(url, userId || null);
            }

            if (song) {
                // Increment view count
                await db.incrementSongViewCount(song.id);
                
                // Attach notation info
                const notation = getNotation(song.notation_format) || {
                    ...notations[0],
                    ...notations[0].tabs[0]
                };
                song.notation = notation;

                res.json({
                    status: "ok",
                    data: song
                });
            } else {
                res.json({
                    status: "error",
                    msg: "Song not found"
                });
            }
        } catch (err) {
            console.error('Error fetching song:', err);
            res.json({
                status: "error",
                msg: "Failed to fetch song"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
