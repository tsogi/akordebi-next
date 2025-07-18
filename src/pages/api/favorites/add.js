import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createPagesServerClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { songId } = req.body;
  
  if (!songId) {
    return res.status(400).json({ error: 'Song ID is required' });
  }

  try {
    await db.addSongToFavorites(songId, user.id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
