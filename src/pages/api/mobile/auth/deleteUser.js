import db from "@/services/db";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", msg: "Method not allowed" });
    }

    try {
        const { userId, email } = req.body;

        if (!userId || !email) {
            return res.json({
                status: "error",
                msg: "userId and email are required"
            });
        }

        // The id+email pair must match an existing account
        const [rows] = await db.pool.execute(
            'SELECT id FROM users WHERE id = ? AND email = ?',
            [userId, email]
        );

        if (!rows.length) {
            return res.json({
                status: "error",
                msg: "User not found"
            });
        }

        // Remove the user's data, then the account itself
        await db.pool.execute('DELETE FROM favorite_songs WHERE user_id = ?', [userId]);
        await db.pool.execute('DELETE FROM user_song_tonality WHERE user_id = ?', [userId]);
        await db.pool.execute('DELETE FROM downloads WHERE user_id = ?', [userId]);
        await db.pool.execute('DELETE FROM teachers_ratings WHERE user_id = ?', [userId]);
        await db.pool.execute('DELETE FROM apple_users WHERE user_id = ?', [userId]);
        await db.pool.execute('DELETE FROM users WHERE id = ?', [userId]);

        return res.json({ status: "ok", data: true });
    } catch (error) {
        console.error('deleteUser error:', error);
        return res.json({
            status: "error",
            msg: "Failed to delete account"
        });
    }
}
