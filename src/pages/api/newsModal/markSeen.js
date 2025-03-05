import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { name = 'default' } = req.body;
  
  try {
    await db.markNewsModalAsSeen(ip, name);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking modal as seen:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 