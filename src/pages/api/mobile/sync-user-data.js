const mysql = require('mysql2/promise');

async function getConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
}

export default async function handler(req, res) {
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

            const conn = await getConnection();

            // Get user's favorites
            const [favorites] = await conn.execute(`
                SELECT song_id, created_at
                FROM favorite_songs
                WHERE user_id = ?
                ORDER BY created_at DESC
            `, [userId]);

            // Get user's tonality settings
            const [tonalities] = await conn.execute(`
                SELECT song_id, tonality
                FROM user_song_tonality
                WHERE user_id = ?
            `, [userId]);

            await conn.end();

            res.json({
                status: "ok",
                data: {
                    favorites: favorites.map(f => ({
                        song_id: f.song_id,
                        created_at: f.created_at?.toISOString() || null
                    })),
                    tonalities: tonalities.map(t => ({
                        song_id: t.song_id,
                        tonality: t.tonality
                    }))
                }
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            res.json({
                status: "error",
                msg: "Failed to fetch user data"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
