import { sendNotification } from '@/utils/pushover';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Send pushover notification
    const message = `BANK TRANSFER by ${user.email}`;
    const success = await sendNotification(message);

    if (success) {
      res.status(200).json({ message: 'Notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Error sending bank transfer notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 