import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";


export default async function handler(req, res) {
  if(req.method == "POST"){
    const { songId } = req.body;
        // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      if (!songId) {
        return res.status(400).json({ message: 'Missing id for song' });
      }
  
      const result = await db.removeSongFromFavorites(songId, user.id);
      
      res.status(200).json({ message: 'Song removed from favorites', result });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
