import { sendNotification } from '@/utils/pushover';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      await sendNotification(message);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending feedback:', error);
      res.status(500).json({ success: false, error: 'Failed to send feedback' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 