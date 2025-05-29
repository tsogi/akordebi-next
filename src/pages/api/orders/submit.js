import { sendNotification } from '@/utils/pushover';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, address, products, totalAmount } = req.body;

    // Validate required fields
    if (!name || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create notification message
    const message = `
ახალი შეკვეთა:
სახელი: ${name}
ტელეფონი: ${phone}
მისამართი: ${address}
პროდუქტები: ${products.map(p => p.id).join(', ')}
ჯამი: ${totalAmount}₾
    `.trim();

    // Send notification
    await sendNotification(message);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting order:', error);
    return res.status(500).json({ error: 'Failed to submit order' });
  }
} 