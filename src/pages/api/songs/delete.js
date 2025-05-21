import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { songId } = req.body;

    // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if user has permission to delete
    if (!process.env.NEXT_PUBLIC_CAN_DELETE_SONG.includes(user.email)) {
        return res.status(403).json({ error: "Not authorized to delete songs" });
    }

    try {
        if (!songId) {
            return res.status(400).json({ error: "Missing song ID" });
        }

        // Delete the song
        await db.deleteSong(songId);
        
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ error: "Error deleting song" });
    }
} 