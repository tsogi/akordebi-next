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

  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    console.log('Marking all unpaid songs as paid for user:', userId);
    await db.setAllContributorSongsAsPaid(userId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating bulk payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
