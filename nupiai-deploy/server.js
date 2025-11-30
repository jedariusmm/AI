require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const webhookHandler = require('./webhook-handler');

const app = express();

// Enable CORS for your frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// IMPORTANT: Raw body needed for webhook signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Parse JSON for all other routes
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'NUPI Stripe Payment Server',
        version: '1.0.0'
    });
});

// Webhook endpoint (uses raw body)
app.use('/api/stripe', webhookHandler);

// Create payment intent
app.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', customerId, metadata } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount required' });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            customer: customerId,
            metadata: metadata || {},
            automatic_payment_methods: { enabled: true },
        });
        
        res.json({ 
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create checkout session for subscriptions or one-time payments
app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
        const { 
            priceId, 
            mode = 'subscription',
            successUrl,
            cancelUrl,
            customerId,
            customerEmail,
            metadata
        } = req.body;
        
        if (!priceId) {
            return res.status(400).json({ error: 'Price ID required' });
        }
        
        const sessionConfig = {
            mode,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cancel`,
            metadata: metadata || {},
        };
        
        // Add customer info
        if (customerId) {
            sessionConfig.customer = customerId;
        } else if (customerEmail) {
            sessionConfig.customer_email = customerEmail;
        }
        
        // For subscriptions, enable trial if needed
        if (mode === 'subscription') {
            sessionConfig.subscription_data = {
                metadata: metadata || {}
            };
        }
        
        const session = await stripe.checkout.sessions.create(sessionConfig);
        
        res.json({ 
            id: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create customer portal session
app.post('/api/stripe/create-portal-session', async (req, res) => {
    try {
        const { customerId, returnUrl } = req.body;
        
        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID required' });
        }
        
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl || process.env.FRONTEND_URL,
        });
        
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get customer subscriptions
app.get('/api/stripe/customer/:customerId/subscriptions', async (req, res) => {
    try {
        const { customerId } = req.params;
        
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            expand: ['data.default_payment_method']
        });
        
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel subscription
app.post('/api/stripe/subscription/:subscriptionId/cancel', async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const { immediately = false } = req.body;
        
        const subscription = immediately 
            ? await stripe.subscriptions.cancel(subscriptionId)
            : await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });
        
        res.json(subscription);
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get payment intent details
app.get('/api/stripe/payment-intent/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        res.json(paymentIntent);
    } catch (error) {
        console.error('Error fetching payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a customer
app.post('/api/stripe/customers', async (req, res) => {
    try {
        const { email, name, metadata } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        
        const customer = await stripe.customers.create({
            email,
            name,
            metadata: metadata || {}
        });
        
        res.json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get products and prices
app.get('/api/stripe/prices', async (req, res) => {
    try {
        const prices = await stripe.prices.list({
            active: true,
            expand: ['data.product']
        });
        
        res.json(prices);
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║           NUPI Stripe Payment Server                        ║
    ╚══════════════════════════════════════════════════════════════╝
    
    🚀 Server running on port ${PORT}
    📍 Webhook endpoint: http://localhost:${PORT}/api/stripe/webhook
    🔑 Stripe mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST'}
    🌍 Environment: ${process.env.NODE_ENV || 'development'}
    
    Ready to process payments! 💳
    `);
});

module.exports = app;
