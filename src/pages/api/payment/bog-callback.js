import db from '@/services/db';
import { sendNotification } from '@/utils/pushover';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const { body } = req.body;
    await sendNotification(JSON.stringify(req.body));
    
    // Find user by email
    const [users] = await db.pool.execute('SELECT id FROM users WHERE email = ?', [body.external_order_id]);
    
    if (!users || users.length === 0) {
      await sendNotification("User not found with email: " + body.external_order_id);
      return res.status(404).json({ error: 'User not found' });
    }

    if(body.order_status.key === "completed") {
        const userId = users[0].id;
        await db.pool.execute(
          'UPDATE users SET payment_date = NOW(), payment_confirmed = ? WHERE id = ?',
          [1, userId]
        );
    } else {
        await sendNotification("Bog payment did not complete! The status is: " + body.order_status.key);
    }
    
    return res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Error processing BOG callback:', error);
    await sendNotification(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 