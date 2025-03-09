import db from '@/services/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await db.getTeachers();
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, mobile, city, description, userId } = req.body;
    try {
      await db.addTeacher(name, mobile, city, description, userId);
      res.status(201).json({ message: 'Teacher added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { teacherId, userId } = req.body;
    try {
      await db.deleteTeacher(teacherId, userId);
      res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 