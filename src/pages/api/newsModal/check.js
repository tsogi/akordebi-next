import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { name = 'default' } = req.query;
  
  try {
    const hasSeenModal = await db.hasSeenNewsModal(ip, name);
    res.json({ shouldShow: !hasSeenModal });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
} 