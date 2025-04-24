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
    const { event, body } = req.body;
    await sendNotification(JSON.stringify(req.body));
    
    if (event !== 'order_payment') {
      await sendNotification("Bog callback event is not order_payment");
      return res.status(200).json({ status: 'ignored' });
    }
    
    if (!body.external_order_id) {
      await sendNotification("No external_order_id in callback");
      throw new Error('Missing external_order_id in callback');
    }
    
    // Find user by email
    const [users] = await db.pool.execute('SELECT id FROM users WHERE email = ?', [body.external_order_id]);
    
    if (!users || users.length === 0) {
      await sendNotification("User not found with email: " + body.external_order_id);
      console.error(`User not found with email: ${body.external_order_id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userId = users[0].id;
    
    await db.pool.execute(
      'UPDATE users SET payment_date = NOW(), payment_confirmed = ? WHERE id = ?',
      [body.order_status.key === "completed" ? 1 : 0, userId]
    );
    
    return res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Error processing BOG callback:', error);
    await sendNotification(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 