/**
 * NUPI Stripe Configuration
 * 
 * This file contains Stripe API keys for payment processing across the NUPI platform.
 * 
 * SECURITY WARNING: These are LIVE keys that handle real transactions!
 * - Never commit this file to a public repository
 * - Rotate keys if they are ever exposed
 * - Use test keys (pk_test_..., sk_test_...) for development
 */

const STRIPE_CONFIG = {
    // Live Stripe Keys - PRODUCTION ONLY
    publishableKey: 'pk_live_51SNpUfBnC0bWNfLeoBetqB1bHztXPZPRqBxTaocOxnZPxUp9N1ZSXRck09ADXoAZS4AN6XnyKSozVbFcbkOFAhp700mCruHk8q',
    secretKey: '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',
    
    // Environment settings
    mode: 'live', // 'test' or 'live'
    
    // Pricing tiers for NUPI services
    pricing: {
        basic: {
            monthly: 'price_basic_monthly',
            yearly: 'price_basic_yearly',
            price: 9.99
        },
        pro: {
            monthly: 'price_pro_monthly',
            yearly: 'price_pro_yearly',
            price: 29.99
        },
        enterprise: {
            monthly: 'price_enterprise_monthly',
            yearly: 'price_enterprise_yearly',
            price: 99.99
        }
    },
    
    // Payment options
    currency: 'usd',
    supportedPaymentMethods: [
        'card',
        'apple_pay',
        'google_pay'
    ],
    
    // Webhook configuration (for server-side)
    webhookEndpoint: '/api/stripe/webhook',
    webhookSecret: '', // Set this in your server environment
    
    // Feature flags
    features: {
        subscriptions: true,
        oneTimePayments: true,
        invoicing: true,
        customerPortal: true
    }
};

// Client-side initialization function
function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js is not loaded. Include it in your HTML: <script src="https://js.stripe.com/v3/"></script>');
        return null;
    }
    
    const stripe = Stripe(STRIPE_CONFIG.publishableKey);
    console.log('Stripe initialized in', STRIPE_CONFIG.mode, 'mode');
    return stripe;
}

// Create a payment intent
async function createPaymentIntent(amount, currency = STRIPE_CONFIG.currency) {
    try {
        const response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to cents
                currency: currency
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
}

// Create a checkout session
async function createCheckoutSession(priceId, mode = 'subscription') {
    try {
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: priceId,
                mode: mode
            })
        });
        
        const session = await response.json();
        const stripe = initializeStripe();
        
        if (stripe && session.id) {
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (error) {
                console.error('Error redirecting to checkout:', error);
            }
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

// Handle payment form submission
async function handlePayment(cardElement, amount) {
    const stripe = initializeStripe();
    if (!stripe) return;
    
    try {
        // Create payment intent on your server
        const { clientSecret } = await createPaymentIntent(amount);
        
        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    // Add customer billing details here
                }
            }
        });
        
        if (error) {
            console.error('Payment failed:', error);
            throw error;
        }
        
        if (paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded!');
            return paymentIntent;
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}

// Customer portal redirect
async function redirectToCustomerPortal() {
    try {
        const response = await fetch('/api/stripe/create-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        }
    } catch (error) {
        console.error('Error accessing customer portal:', error);
        throw error;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STRIPE_CONFIG;
}

// Make available globally
window.STRIPE_CONFIG = STRIPE_CONFIG;
window.initializeStripe = initializeStripe;
window.createPaymentIntent = createPaymentIntent;
window.createCheckoutSession = createCheckoutSession;
window.handlePayment = handlePayment;
window.redirectToCustomerPortal = redirectToCustomerPortal;
