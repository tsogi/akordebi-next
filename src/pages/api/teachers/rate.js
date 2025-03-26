import db from '@/services/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get user rating for a specific teacher
    const { teacherId, userId } = req.query;
    
    try {
      const userRating = await db.getUserTeacherRating(teacherId, userId);
      res.status(200).json(userRating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    const { teacherId, rating, userId } = req.body;

    try {
      const result = await db.rateTeacher(teacherId, userId, rating);
      res.status(200).json({ 
        message: 'Rating updated successfully',
        teacherRating: result 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 