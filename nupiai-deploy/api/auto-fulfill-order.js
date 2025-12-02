// Automatic AI Assistant Creation & Deployment
// This runs when Stripe payment completes via webhook

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

        // Handle Stripe checkout completion
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Extract customer info from Stripe session
            const customerEmail = session.customer_details?.email || session.customer_email;
            const orderId = session.client_reference_id;
            
            console.log(`🎉 Payment received for order: ${orderId}`);
            
            // Get order details from our database (localStorage backup)
            // In production, you'd query a real database here
            // For now, we'll need the order data passed via metadata
            
            const orderData = {
                orderId: orderId,
                email: customerEmail,
                name: session.customer_details?.name || 'Customer',
                botToken: session.metadata?.botToken || '',
                chatId: session.metadata?.chatId || '',
                personality: session.metadata?.personality || 'professional',
                useCase: session.metadata?.useCase || 'general',
                requirements: session.metadata?.requirements || ''
            };

            // AUTO-FULFILL: Activate customer's AI bot immediately
            const activated = await activateCustomerBot(orderData);
            
            if (activated) {
                console.log(`✅ AI Assistant auto-activated for ${orderData.name}`);
                
                // Send success notification to admin
                await notifyAdmin(orderData, 'AUTO-ACTIVATED');
                
                // Send welcome email to customer
                await sendCustomerWelcome(orderData);
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'AI Assistant activated automatically',
                    orderId: orderId
                });
            } else {
                console.log(`⚠️ Auto-activation failed, sending to manual queue`);
                
                // Notify admin for manual fulfillment
                await notifyAdmin(orderData, 'NEEDS MANUAL SETUP');
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Order queued for manual fulfillment',
                    orderId: orderId
                });
            }
        }

        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Auto-fulfillment error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Activate customer's Telegram bot automatically
async function activateCustomerBot(orderData) {
    if (!orderData.botToken || !orderData.chatId) {
        console.log('⚠️ Missing bot credentials, cannot auto-activate');
        return false;
    }

    try {
        const welcomeMessage = createWelcomeMessage(orderData);
        
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
            console.log('✅ Welcome message sent successfully');
            
            // Send setup instructions
            await sendSetupInstructions(orderData);
            
            return true;
        } else {
            console.error('❌ Telegram API error:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Bot activation failed:', error);
        return false;
    }
}

// Create personalized welcome message based on personality
function createWelcomeMessage(orderData) {
    const personality = orderData.personality.toLowerCase();
    const name = orderData.name;
    const useCase = orderData.useCase;
    
    let greeting = '';
    let style = '';
    
    switch(personality) {
        case 'professional':
            greeting = `Good day, ${name}! 👔`;
            style = 'I\'m your professional AI assistant, here to help you achieve your business goals efficiently and effectively.';
            break;
        case 'friendly':
            greeting = `Hey there, ${name}! 😊`;
            style = 'I\'m your friendly AI companion, excited to help you with whatever you need! Let\'s make great things happen together!';
            break;
        case 'creative':
            greeting = `Hello, ${name}! 🎨`;
            style = 'I\'m your creative AI assistant, ready to help you bring your imaginative ideas to life with innovative solutions!';
            break;
        case 'technical':
            greeting = `Greetings, ${name}! 💻`;
            style = 'I\'m your technical AI assistant, equipped to help you solve complex problems with precision and expertise.';
            break;
        case 'empathetic':
            greeting = `Hi ${name}! 💙`;
            style = 'I\'m your empathetic AI assistant. I\'m here to listen, understand, and support you with care and compassion.';
            break;
        case 'energetic':
            greeting = `What\'s up, ${name}! ⚡`;
            style = 'I\'m your energetic AI assistant, pumped up and ready to help you tackle any challenge with enthusiasm!';
            break;
        default:
            greeting = `Hello, ${name}! 🤖`;
            style = 'I\'m your personal AI assistant, ready to help you succeed!';
    }

    return `
🎉 <b>Welcome to Your Personal AI Assistant!</b>

${greeting}

${style}

<b>✨ Your AI is Now ACTIVE!</b>

<b>🎭 Personality:</b> ${orderData.personality.charAt(0).toUpperCase() + orderData.personality.slice(1)}
<b>💼 Optimized for:</b> ${useCase}
<b>📅 Activated:</b> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

<b>🚀 Let's Get Started!</b>

Just send me any message and I'll respond in my ${personality} style. Ask me anything - I'm here to help you 24/7!

<b>💡 Try These:</b>
• "Help me plan my day"
• "Give me some ${personality === 'professional' ? 'productivity tips' : personality === 'creative' ? 'creative ideas' : 'advice'}"
• "Let's chat about ${useCase.toLowerCase()}"
• "What can you help me with?"

<i>What would you like to talk about first?</i> 💬
    `.trim();
}

// Send detailed setup instructions
async function sendSetupInstructions(orderData) {
    const instructions = `
<b>📱 Quick Setup Guide</b>

Your AI is ready, but here are some tips to get the most out of it:

<b>1️⃣ Save This Chat</b>
Pin this conversation so you can quickly find me anytime!

<b>2️⃣ Customize Your Experience</b>
Tell me your preferences, schedule, or specific needs. I'll remember and adapt!

<b>3️⃣ Use Natural Language</b>
No need for special commands - just chat with me like you would with a friend or colleague!

<b>4️⃣ Ask for Anything</b>
• Schedule management
• Brainstorming sessions  
• Task breakdowns
• Research and information
• Writing assistance
• Daily motivation
• And much more!

<b>5️⃣ Give Feedback</b>
Let me know if I'm too formal, too casual, or if you want me to adjust my style. I'm here to match YOUR needs!

<b>🆘 Need Help?</b>
Email support: jdautotintsllc@icloud.com
Or just ask me - I'm your assistant! 😊

<b>Ready to begin? Send me your first question!</b> 🚀
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
        console.error('Failed to send setup instructions:', error);
    }
}

// Notify admin of successful auto-activation
async function notifyAdmin(orderData, status) {
    const telegramToken = '8587161286:AAFNtrcQUlSn3nwMPqcB9JpSLACOVLM7YJU';
    const adminChatId = '6523159355';
    
    const statusEmoji = status === 'AUTO-ACTIVATED' ? '✅' : '⚠️';
    
    const message = `
${statusEmoji} <b>${status}</b>

<b>Order:</b> ${orderData.orderId}
<b>Customer:</b> ${orderData.name}
<b>Email:</b> ${orderData.email}
<b>Personality:</b> ${orderData.personality}
<b>Use Case:</b> ${orderData.useCase}

${status === 'AUTO-ACTIVATED' ? 
    '🤖 AI Assistant activated automatically!\n👤 Customer received welcome message' : 
    '⚠️ Missing bot credentials - needs manual setup\n📋 Check admin dashboard for details'}

<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();

    try {
        // Send to admin Telegram
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: adminChatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        // Send admin email
        const RESEND_API_KEY = 're_X8ABhucU_MFRJ7WYbPkFYjuPuKgJkm46Z';
        
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { background: white; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; }
        .header { background: ${status === 'AUTO-ACTIVATED' ? '#48bb78' : '#f6ad55'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .field { margin: 15px 0; padding: 12px; background: #f9fafb; border-left: 4px solid #667eea; border-radius: 4px; }
        .label { font-weight: bold; color: #667eea; }
        .value { color: #333; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${statusEmoji} ${status}</h1>
        </div>
        
        <div class="field">
            <div class="label">Order ID</div>
            <div class="value">${orderData.orderId}</div>
        </div>
        
        <div class="field">
            <div class="label">Customer</div>
            <div class="value">${orderData.name} (${orderData.email})</div>
        </div>
        
        <div class="field">
            <div class="label">Configuration</div>
            <div class="value">Personality: ${orderData.personality}<br>Use Case: ${orderData.useCase}</div>
        </div>
        
        <div class="field">
            <div class="label">Status</div>
            <div class="value">${status === 'AUTO-ACTIVATED' ? 
                '✅ AI Assistant activated and customer notified' : 
                '⚠️ Needs manual setup - check admin dashboard'}</div>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
            <a href="https://nupiai.com/admin-login.html" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View in Dashboard</a>
        </p>
    </div>
</body>
</html>
        `;

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'NUPI AI <orders@nupiai.com>',
                to: 'jdautotintsllc@icloud.com',
                subject: `${statusEmoji} Order ${status} - ${orderData.name}`,
                html: emailHTML
            })
        });

    } catch (error) {
        console.error('Failed to notify admin:', error);
    }
}

// Send welcome email to customer
async function sendCustomerWelcome(orderData) {
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
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🎉 Your AI is Ready!</h1>
            <p style="margin: 10px 0 0 0;">Welcome to NUPI AI</p>
        </div>
        
        <div class="content">
            <p>Hi ${orderData.name}!</p>
            
            <p><strong>Great news!</strong> Your personal AI assistant has been activated and is ready to help you right now! 🤖</p>
            
            <div class="highlight">
                <strong>📱 Your AI Details:</strong><br>
                <strong>Personality:</strong> ${orderData.personality.charAt(0).toUpperCase() + orderData.personality.slice(1)}<br>
                <strong>Optimized for:</strong> ${orderData.useCase}<br>
                <strong>Platform:</strong> Telegram (your bot)
            </div>
            
            <h3>🚀 Getting Started:</h3>
            <ol>
                <li>Open Telegram and find your bot</li>
                <li>You should see a welcome message from your AI</li>
                <li>Just reply to start chatting!</li>
                <li>Your AI is available 24/7</li>
            </ol>
            
            <div class="highlight">
                <strong>💡 Tips for Best Results:</strong><br>
                • Be specific with your requests<br>
                • Give feedback if you want adjustments<br>
                • Use it daily - your AI learns your preferences!<br>
                • Pin the chat for easy access
            </div>
            
            <h3>🆘 Need Help?</h3>
            <p>If you have any questions or need assistance, just reply to this email or contact us at <a href="mailto:jdautotintsllc@icloud.com">jdautotintsllc@icloud.com</a></p>
            
            <p style="text-align: center; margin-top: 30px;">
                <a href="https://nupiai.com/setup-guide.html" class="button">View Setup Guide</a>
            </p>
            
            <p style="text-align: center; color: #666; margin-top: 30px;">
                Thank you for choosing NUPI AI!<br>
                Your Order ID: ${orderData.orderId}
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
                subject: '🎉 Your Personal AI Assistant is Ready!',
                html: emailHTML
            })
        });
        
        console.log('✅ Welcome email sent to customer');
    } catch (error) {
        console.error('Failed to send customer email:', error);
    }
}
