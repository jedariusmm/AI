// Vercel Serverless Function to handle order submissions
// Sends notifications via Email, SMS, and Telegram

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const orderData = req.body;

        // Validate required fields
        if (!orderData.name || !orderData.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Format order details for notifications
        const orderText = `
🤖 NEW AI ASSISTANT ORDER! 🎉

👤 Customer: ${orderData.name}
📧 Email: ${orderData.email}
📱 Phone: ${orderData.phone}

🎭 Personality: ${orderData.personality}
💼 Use Case: ${orderData.useCase}
📝 Requirements: ${orderData.requirements}

💰 Price: $4.99
🕐 Time: ${new Date(orderData.timestamp).toLocaleString()}

Order ID: ${Date.now()}
        `.trim();

        // Send Telegram notification
        const telegramToken = '8177827077:AAHRgtXS6hRAQX6I7o6nFFDi-o8tjuQC1vY';
        
        // Try to send to your Telegram (you'll need to message the bot first to get chat ID)
        // For now, sending to a group/channel - you'll need to add the bot and get the chat ID
        try {
            // Get your chat ID by messaging this bot: https://t.me/YourBotUsername
            // Then use this API to get updates: https://api.telegram.org/bot<TOKEN>/getUpdates
            
            const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '@nupiai_orders', // Create a channel or use your personal chat ID
                    text: orderText,
                    parse_mode: 'HTML'
                })
            });
            
            const telegramData = await telegramResponse.json();
            if (!telegramData.ok) {
                console.log('Telegram notification not sent (need to setup chat ID):', telegramData);
            }
        } catch (err) {
            console.error('Telegram error:', err);
        }

        // Send SMS via Twilio (you'll need to set up Twilio account)
        // For now, just log it
        console.log('SMS would be sent to: 7042778009');
        console.log('Order details:', orderText);

        // Send Email notification
        // Using a simple email service (you can use SendGrid, AWS SES, etc.)
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .field { margin: 15px 0; padding: 12px; background: #f9fafb; border-left: 4px solid #667eea; border-radius: 4px; }
        .label { font-weight: bold; color: #667eea; font-size: 0.9rem; }
        .value { color: #333; margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🤖 New AI Assistant Order!</h1>
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
        
        <div class="field">
            <div class="label">💰 Price</div>
            <div class="value">$4.99</div>
        </div>
        
        <div class="field">
            <div class="label">🕐 Order Time</div>
            <div class="value">${new Date(orderData.timestamp).toLocaleString()}</div>
        </div>
        
        <div class="footer">
            <p>Order ID: ${Date.now()}</p>
            <p>NUPI AI - Personal AI Assistant Orders</p>
        </div>
    </div>
</body>
</html>
        `;

        // Send email using Resend API
        const RESEND_API_KEY = 're_X8ABhucU_MFRJ7WYbPkFYjuPuKgJkm46Z';
        
        try {
            const emailResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'NUPI Orders <orders@nupiai.com>',
                    to: 'jdautotintsllc@icloud.com',
                    subject: `🤖 New AI Assistant Order from ${orderData.name}`,
                    html: emailHTML
                })
            });
            
            const emailData = await emailResponse.json();
            if (!emailResponse.ok) {
                console.error('Email send failed:', emailData);
            } else {
                console.log('Email sent successfully:', emailData);
            }
        } catch (err) {
            console.error('Email error:', err);
        }

        // Return success
        return res.status(200).json({
            success: true,
            message: 'Order submitted successfully! You will receive confirmation shortly.',
            orderId: Date.now()
        });

    } catch (error) {
        console.error('Order submission error:', error);
        return res.status(500).json({
            error: 'Failed to process order',
            message: error.message
        });
    }
}
