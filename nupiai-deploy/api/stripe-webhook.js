// Vercel Serverless Function to handle Stripe Payment Link webhooks
// This will notify you when someone completes payment

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const event = req.body;

        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Extract customer info
            const customerEmail = session.customer_details?.email || session.customer_email;
            const orderId = session.client_reference_id;
            const amountPaid = (session.amount_total / 100).toFixed(2);
            
            const notificationText = `
🎉 PAYMENT RECEIVED! 💰

✅ Payment Completed Successfully

👤 Customer Email: ${customerEmail}
📦 Order ID: ${orderId || 'N/A'}
💵 Amount: $${amountPaid}
🕐 Time: ${new Date().toLocaleString()}

Payment ID: ${session.id}

Check admin dashboard for order details!
            `.trim();

            // Send Telegram notification
            const telegramToken = '8587161286:AAFNtrcQUlSn3nwMPqcB9JpSLACOVLM7YJU';
            try {
                await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: '6523159355',
                        text: notificationText,
                        parse_mode: 'HTML'
                    })
                });
                console.log('Telegram notification sent!');
            } catch (err) {
                console.error('Telegram error:', err);
            }

            // Send Email notification
            const RESEND_API_KEY = 're_X8ABhucU_MFRJ7WYbPkFYjuPuKgJkm46Z';
            
            const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .success { font-size: 3rem; margin: 0; }
        .field { margin: 15px 0; padding: 12px; background: #f9fafb; border-left: 4px solid #10b981; border-radius: 4px; }
        .label { font-weight: bold; color: #059669; font-size: 0.9rem; }
        .value { color: #333; margin-top: 5px; }
        .amount { font-size: 2rem; color: #10b981; font-weight: bold; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success">🎉</div>
            <h1 style="margin: 10px 0 0 0;">Payment Received!</h1>
        </div>
        
        <div class="amount">$${amountPaid}</div>
        
        <div class="field">
            <div class="label">👤 Customer Email</div>
            <div class="value">${customerEmail}</div>
        </div>
        
        <div class="field">
            <div class="label">📦 Order ID</div>
            <div class="value">${orderId || 'Not provided'}</div>
        </div>
        
        <div class="field">
            <div class="label">💳 Payment ID</div>
            <div class="value">${session.id}</div>
        </div>
        
        <div class="field">
            <div class="label">🕐 Payment Time</div>
            <div class="value">${new Date().toLocaleString()}</div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280;">Check your <a href="https://nupiai.com/admin-login.html">admin dashboard</a> for full order details!</p>
        </div>
    </div>
</body>
</html>
            `;

            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'NUPI Payments <payments@nupiai.com>',
                        to: 'jdautotintsllc@icloud.com',
                        subject: `💰 Payment Received - $${amountPaid} from ${customerEmail}`,
                        html: emailHTML
                    })
                });
                console.log('Email notification sent!');
            } catch (err) {
                console.error('Email error:', err);
            }
        }

        // Respond to Stripe
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
}
