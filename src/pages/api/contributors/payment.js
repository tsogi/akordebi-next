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

  // Check if user is authorized to update payment status
  const authorizedEmails = process.env.NEXT_PUBLIC_CAN_DELETE_SONG?.split(',') || [];
  if (!authorizedEmails.includes(user.email)) {
    return res.status(403).json({ error: 'Not authorized to update payment status' });
  }

  const { userId, songId, paid } = req.body;
  
  if (!userId || !songId || typeof paid !== 'boolean') {
    return res.status(400).json({ error: 'userId, songId, and paid status are required' });
  }

  try {
    console.log('Updating payment status:', { userId, songId, paid });
    await db.setContributorPaymentStatus(userId, songId, paid);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 