import { Buffer } from 'buffer';
import { sendNotification } from '@/utils/pushover';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get amount from request body
    const { amount } = req.body;
    
    // Validate the donation amount
    if (!amount || isNaN(amount) || amount < 1 || amount > 500) {
      return res.status(400).json({ error: 'Invalid donation amount. Amount must be between 1 and 500 GEL.' });
    }
    
    const donationAmount = parseFloat(amount);
    
    // Step 1: Get access token from BOG
    const clientId = process.env.BOG_PUBLIC_KEY;
    const secretKey = process.env.BOG_SECRET_KEY;
    const credentials = Buffer.from(`${clientId}:${secretKey}`).toString('base64');

    const tokenResponse = await fetch('https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Failed to get BOG access token', tokenData);
      return res.status(500).json({ error: 'Failed to authenticate with payment provider' });
    }

    // Step 2: Create payment order
    const externalOrderId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Unique order ID for donations
    const callbackUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/payment/bog-callback`;
    const successUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/payment/success`;
    const failUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/payment/fail`;

    const orderResponse = await fetch('https://api.bog.ge/payments/v1/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Accept-Language': 'ka',
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback_url: callbackUrl,
        external_order_id: externalOrderId,
        purchase_units: {
          currency: 'GEL',
          total_amount: donationAmount,
          basket: [
            {
              quantity: 1,
              unit_price: donationAmount,
              product_id: 'donation'
            }
          ]
        },
        redirect_urls: {
          fail: failUrl,
          success: successUrl
        }
      })
    });

    const orderData = await orderResponse.json();
    
    if (!orderData._links?.redirect?.href) {
      console.error('Failed to create BOG payment order', orderData);
      return res.status(500).json({ error: 'Failed to create payment' });
    }

    // Return the redirect URL to the client
    return res.status(200).json({ 
      redirectUrl: orderData._links.redirect.href 
    });

  } catch (error) {
    console.error('Error initiating donation payment:', error);
    await sendNotification(error.message);
    return res.status(500).json({ error: 'Failed to process donation request' });
  }
} 