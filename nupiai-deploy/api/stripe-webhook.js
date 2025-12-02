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
            
            console.log(`💰 Payment completed for order: ${orderId}`);
            
            // Try to retrieve full order details for auto-fulfillment
            let orderData = null;
            try {
                const orderResponse = await fetch(`${process.env.VERCEL_URL || 'https://nupiai.com'}/api/save-order?orderId=${orderId}`);
                if (orderResponse.ok) {
                    const result = await orderResponse.json();
                    orderData = result.order;
                    console.log('✅ Retrieved order data for auto-fulfillment');
                }
            } catch (error) {
                console.log('⚠️ Could not retrieve order data:', error.message);
            }
            
            // AUTO-FULFILL if we have bot credentials
            if (orderData && orderData.botToken && orderData.chatId) {
                console.log('🤖 Starting auto-fulfillment...');
                const fulfilled = await autoFulfillOrder(orderData);
                
                if (fulfilled) {
                    console.log('✅ Order auto-fulfilled successfully!');
                }
            } else {
                console.log('⚠️ Missing bot credentials - manual fulfillment needed');
            }
            
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

// Auto-fulfill order by activating customer's Telegram bot
async function autoFulfillOrder(orderData) {
    if (!orderData.botToken || !orderData.chatId) {
        return false;
    }

    try {
        // Create personalized welcome message based on personality
        const welcomeMessage = createPersonalizedWelcome(orderData);
        
        // Send welcome message to customer's bot
        const response = await fetch(`https://api.telegram.org/bot${orderData.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: orderData.chatId,
                text: welcomeMessage,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Welcome message sent to customer');
            
            // Send setup instructions
            await sendCustomerInstructions(orderData);
            
            // Notify admin of successful auto-fulfillment
            await notifyAdminSuccess(orderData);
            
            // Send customer welcome email
            await sendWelcomeEmail(orderData);
            
            return true;
        } else {
            console.error('❌ Telegram send failed:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Auto-fulfillment error:', error);
        return false;
    }
}

// Create personalized welcome based on chosen personality
function createPersonalizedWelcome(orderData) {
    const personality = (orderData.personality || 'professional').toLowerCase();
    const name = orderData.name;
    
    const welcomes = {
        professional: `Good day, ${name}! 👔\n\nI'm your professional AI assistant. I'm here to help you achieve your business goals efficiently and effectively.`,
        friendly: `Hey there, ${name}! 😊\n\nI'm your friendly AI companion! I'm so excited to help you with whatever you need. Let's make great things happen together!`,
        creative: `Hello, ${name}! 🎨\n\nI'm your creative AI assistant, ready to help you bring your imaginative ideas to life with innovative and artistic solutions!`,
        technical: `Greetings, ${name}! 💻\n\nI'm your technical AI assistant. I'm equipped to help you solve complex problems with precision and technical expertise.`,
        empathetic: `Hi ${name}! 💙\n\nI'm your empathetic AI assistant. I'm here to listen, understand, and support you with care, compassion, and genuine concern for your wellbeing.`,
        energetic: `What's up, ${name}! ⚡\n\nI'm your energetic AI assistant! I'm pumped up and ready to help you tackle any challenge with enthusiasm and positive energy!`
    };

    const greeting = welcomes[personality] || welcomes.professional;

    return `
🎉 <b>Welcome to Your Personal AI Assistant!</b>

${greeting}

<b>✨ Your AI is Now ACTIVE!</b>

<b>🎭 Personality:</b> ${personality.charAt(0).toUpperCase() + personality.slice(1)}
<b>💼 Optimized for:</b> ${orderData.useCase || 'General Use'}
<b>📅 Activated:</b> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

<b>🚀 Let's Get Started!</b>

Just send me any message and I'll respond in my ${personality} style. I'm here for you 24/7!

<b>💡 Try asking me:</b>
• "Help me plan my day"
• "Give me some advice"
• "Let's brainstorm ideas"
• "What can you help me with?"

<i>What would you like to talk about first?</i> 💬
    `.trim();
}

// Send detailed instructions to customer
async function sendCustomerInstructions(orderData) {
    const instructions = `
<b>📱 Quick Tips for Using Your AI</b>

<b>1️⃣ Pin This Chat</b>
Tap the top of this conversation → Pin so you can find me instantly!

<b>2️⃣ Natural Conversations</b>
No special commands needed - just chat naturally!

<b>3️⃣ Customize Anytime</b>
Tell me your preferences and I'll adapt to your needs.

<b>4️⃣ Ask for Anything:</b>
• Planning & scheduling
• Creative brainstorming
• Problem-solving
• Research help
• Writing assistance
• Daily motivation
• And much more!

<b>🆘 Need Help?</b>
Email: jdautotintsllc@icloud.com

<b>Ready? Send your first question now!</b> 🚀
    `.trim();

    try {
        await fetch(`https://api.telegram.org/bot${orderData.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: orderData.chatId,
                text: instructions,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error('Failed to send instructions:', error);
    }
}

// Notify admin of successful auto-fulfillment
async function notifyAdminSuccess(orderData) {
    const telegramToken = '8587161286:AAFNtrcQUlSn3nwMPqcB9JpSLACOVLM7YJU';
    const adminChatId = '6523159355';
    
    const message = `
✅ <b>ORDER AUTO-FULFILLED!</b>

<b>🤖 AI Activated Automatically</b>

<b>Order:</b> ${orderData.orderId}
<b>Customer:</b> ${orderData.name}
<b>Email:</b> ${orderData.email}
<b>Personality:</b> ${orderData.personality}

✅ Welcome message sent
✅ Setup instructions sent
✅ Customer email sent

<b>Status:</b> COMPLETE - No action needed! 🎉

<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();

    try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: adminChatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error('Failed to notify admin:', error);
    }
}

// Send welcome email to customer
async function sendWelcomeEmail(orderData) {
    const RESEND_API_KEY = 're_X8ABhucU_MFRJ7WYbPkFYjuPuKgJkm46Z';
    
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .content { padding: 20px; line-height: 1.8; color: #333; }
        .highlight { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🎉 Your AI is Active!</h1>
        </div>
        
        <div class="content">
            <p>Hi ${orderData.name}!</p>
            
            <p><strong>Great news!</strong> Your personal AI assistant has been activated automatically and is ready to help you right now! 🤖</p>
            
            <div class="highlight">
                <strong>Your AI is waiting in Telegram!</strong><br>
                Check your Telegram bot - you should see a welcome message.<br>
                Just reply to start chatting!
            </div>
            
            <p><strong>Your AI Details:</strong></p>
            <ul>
                <li><strong>Personality:</strong> ${orderData.personality}</li>
                <li><strong>Use Case:</strong> ${orderData.useCase}</li>
                <li><strong>Availability:</strong> 24/7</li>
            </ul>
            
            <p>Your AI learns and adapts to your needs over time, so the more you use it, the better it gets!</p>
            
            <div class="highlight">
                <strong>🆘 Need Help?</strong><br>
                Contact us at <a href="mailto:jdautotintsllc@icloud.com">jdautotintsllc@icloud.com</a>
            </div>
            
            <p style="text-align: center; color: #666; margin-top: 30px;">
                Thank you for choosing NUPI AI!<br>
                Order ID: ${orderData.orderId}
            </p>
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
                from: 'NUPI AI <welcome@nupiai.com>',
                to: orderData.email,
                subject: '🎉 Your AI Assistant is Ready!',
                html: emailHTML
            })
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}
