import db from '@/services/db';

export default async function handler(req, res) {
  try {
    const cities = await db.getCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 