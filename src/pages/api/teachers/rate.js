import db from '@/services/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { teacherId, rating, userId } = req.body;

  try {
    await db.rateTeacher(teacherId, userId, rating);
    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 