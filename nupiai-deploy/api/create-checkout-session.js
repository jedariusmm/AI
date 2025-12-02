// Vercel Serverless Function for Stripe Checkout
import Stripe from 'stripe';
const stripe = new Stripe('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');

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
        const { name, email, phone, personality, useCase, requirements } = req.body;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Personal AI Assistant - ${personality}`,
                            description: `Custom ${personality} AI personality for ${useCase}`,
                            images: ['https://nupiai.com/logo.png'], // Add your logo URL
                        },
                        unit_amount: 499, // $4.99 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://nupiai.com/order-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://nupiai.com/order.html?canceled=true`,
            customer_email: email,
            metadata: {
                customerName: name,
                customerPhone: phone || 'Not provided',
                personality: personality,
                useCase: useCase,
                requirements: requirements || 'None specified',
                orderDate: new Date().toISOString()
            },
            // Send receipt email
            payment_intent_data: {
                receipt_email: email,
                description: `Personal AI Assistant Order - ${personality}`,
                metadata: {
                    name: name,
                    personality: personality
                }
            }
        });

        return res.status(200).json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({
            error: 'Payment session creation failed',
            message: error.message
        });
    }
}
