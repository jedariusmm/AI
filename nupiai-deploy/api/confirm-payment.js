// Vercel Serverless Function to handle Stripe payment confirmation
const stripe = require('stripe')('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');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId } = req.body;

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Extract order details from metadata
        const orderData = {
            name: session.metadata.customerName,
            email: session.customer_email,
            phone: session.metadata.customerPhone,
            personality: session.metadata.personality,
            useCase: session.metadata.useCase,
            requirements: session.metadata.requirements,
            paid: true,
            paymentId: session.payment_intent,
            amount: session.amount_total / 100,
            timestamp: session.metadata.orderDate
        };

        // Send notifications (Email + Telegram)
        const orderText = `
🤖 NEW PAID AI ASSISTANT ORDER! 💰

👤 Customer: ${orderData.name}
📧 Email: ${orderData.email}
📱 Phone: ${orderData.phone}

🎭 Personality: ${orderData.personality}
💼 Use Case: ${orderData.useCase}
📝 Requirements: ${orderData.requirements}

💰 Amount: $${orderData.amount}
✅ Status: PAID
💳 Payment ID: ${orderData.paymentId}
🕐 Time: ${new Date(orderData.timestamp).toLocaleString()}

Order ID: ${sessionId}
        `.trim();

        // Send Telegram notification
        const telegramToken = '8587161286:AAFNtrcQUlSn3nwMPqcB9JpSLACOVLM7YJU';
        try {
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '6523159355',
                    text: orderText,
                    parse_mode: 'HTML'
                })
            });
        } catch (err) {
            console.error('Telegram error:', err);
        }

        // Send Email notification
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .paid-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-top: 10px; }
        .field { margin: 15px 0; padding: 12px; background: #f9fafb; border-left: 4px solid #10b981; border-radius: 4px; }
        .label { font-weight: bold; color: #059669; font-size: 0.9rem; }
        .value { color: #333; margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">💰 New PAID Order Received!</h1>
            <div class="paid-badge">✅ PAYMENT CONFIRMED</div>
        </div>
        
        <div class="field">
            <div class="label">👤 Customer Name</div>
            <div class="value">${orderData.name}</div>
        </div>
        
        <div class="field">
            <div class="label">📧 Email</div>
            <div class="value">${orderData.email}</div>
        </div>
        
        <div class="field">
            <div class="label">📱 Phone</div>
            <div class="value">${orderData.phone}</div>
        </div>
        
        <div class="field">
            <div class="label">🎭 AI Personality</div>
            <div class="value" style="text-transform: capitalize;">${orderData.personality}</div>
        </div>
        
        <div class="field">
            <div class="label">💼 Use Case</div>
            <div class="value">${orderData.useCase}</div>
        </div>
        
        <div class="field">
            <div class="label">📝 Special Requirements</div>
            <div class="value">${orderData.requirements}</div>
        </div>
        
        <div class="field" style="border-left-color: #10b981; background: #f0fdf4;">
            <div class="label">💰 Amount Paid</div>
            <div class="value" style="font-size: 1.5rem; font-weight: bold; color: #059669;">$${orderData.amount}</div>
        </div>
        
        <div class="field">
            <div class="label">💳 Payment ID</div>
            <div class="value">${orderData.paymentId}</div>
        </div>
        
        <div class="field">
            <div class="label">🕐 Order Time</div>
            <div class="value">${new Date(orderData.timestamp).toLocaleString()}</div>
        </div>
        
        <div class="footer">
            <p>Session ID: ${sessionId}</p>
            <p>NUPI AI - Personal AI Assistant Orders</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">Customer will receive setup instructions via email within 24-48 hours.</p>
        </div>
    </div>
</body>
</html>
        `;

        const RESEND_API_KEY = 're_X8ABhucU_MFRJ7WYbPkFYjuPuKgJkm46Z';
        try {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'NUPI Orders <orders@nupiai.com>',
                    to: 'jdautotintsllc@icloud.com',
                    subject: `💰 PAID Order: AI Assistant from ${orderData.name} - $${orderData.amount}`,
                    html: emailHTML
                })
            });
        } catch (err) {
            console.error('Email error:', err);
        }

        return res.status(200).json({
            success: true,
            message: 'Payment confirmed and notifications sent',
            orderData
        });

    } catch (error) {
        console.error('Confirmation error:', error);
        return res.status(500).json({
            error: 'Failed to confirm payment',
            message: error.message
        });
    }
}
