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
    let email = body.external_order_id;
    
    if (!email) {
      await sendNotification("User not found with email: " + email);
      return res.status(404).json({ error: 'User not found' });
    }

    if(body.order_status.key === "completed") {
        await db.pool.execute(
          'UPDATE users SET payment_date = NOW(), payment_confirmed = ? WHERE email = ?',
          [1, email]
        );
        await sendNotification("Successful payment: " + email);
    }

    await db.storeBogPayment(email, body.order_status.key, JSON.stringify(req.body));
    
    return res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Error processing BOG callback:', error);
    await sendNotification(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 