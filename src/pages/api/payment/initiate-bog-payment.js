import { Buffer } from 'buffer';
import db from '@/services/db';
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { sendNotification } from '@/utils/pushover';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {

  // Get user from supabase
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('User Not authenticated');
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
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
    const externalOrderId = user.email; // Use user email as external_order_id
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
          total_amount: 0.1, // 5 GEL
          basket: [
            {
              quantity: 1,
              unit_price: 0.1,
              product_id: 'gamowera'
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

    // Activate subscription with payment_confirmed=0 (will be confirmed via callback)
    // await db.activateUserSubscription(user.id);

    // Return the redirect URL to the client
    return res.status(200).json({ 
      redirectUrl: orderData._links.redirect.href 
    });

  } catch (error) {
    console.error('Error initiating BOG payment:', error);
    await sendNotification(error.message);
    return res.status(500).json({ error: 'Failed to process payment request' });
  }
} 