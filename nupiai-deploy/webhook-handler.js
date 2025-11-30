/**
 * NUPI Stripe Webhook Handler
 * 
 * This file handles incoming webhook events from Stripe.
 * Deploy this to your server and use the URL as your webhook endpoint.
 * 
 * Webhook URL Format: https://yourdomain.com/api/stripe/webhook
 */

const express = require('express');
const router = express.Router();

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        // Verify webhook signature
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Log the event
    console.log(`✅ Webhook received: ${event.type}`);
    
    // Handle the event
    switch (event.type) {
        // Payment Events
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
            await handlePaymentSuccess(paymentIntent);
            break;
            
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log(`❌ Payment failed: ${failedPayment.id}`);
            await handlePaymentFailure(failedPayment);
            break;
            
        case 'payment_intent.created':
            console.log(`📝 Payment intent created: ${event.data.object.id}`);
            break;
            
        // Subscription Events
        case 'customer.subscription.created':
            const newSubscription = event.data.object;
            console.log(`🎉 New subscription: ${newSubscription.id}`);
            await handleSubscriptionCreated(newSubscription);
            break;
            
        case 'customer.subscription.updated':
            const updatedSubscription = event.data.object;
            console.log(`🔄 Subscription updated: ${updatedSubscription.id}`);
            await handleSubscriptionUpdated(updatedSubscription);
            break;
            
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            console.log(`🗑️ Subscription cancelled: ${deletedSubscription.id}`);
            await handleSubscriptionCancelled(deletedSubscription);
            break;
            
        // Invoice Events
        case 'invoice.payment_succeeded':
            const successfulInvoice = event.data.object;
            console.log(`💵 Invoice paid: ${successfulInvoice.id}`);
            await handleInvoicePaid(successfulInvoice);
            break;
            
        case 'invoice.payment_failed':
            const failedInvoice = event.data.object;
            console.log(`⚠️ Invoice payment failed: ${failedInvoice.id}`);
            await handleInvoiceFailed(failedInvoice);
            break;
            
        // Customer Events
        case 'customer.created':
            console.log(`👤 New customer: ${event.data.object.id}`);
            await handleCustomerCreated(event.data.object);
            break;
            
        case 'customer.updated':
            console.log(`👤 Customer updated: ${event.data.object.id}`);
            break;
            
        case 'customer.deleted':
            console.log(`👤 Customer deleted: ${event.data.object.id}`);
            await handleCustomerDeleted(event.data.object);
            break;
            
        // Charge Events
        case 'charge.succeeded':
            console.log(`✅ Charge succeeded: ${event.data.object.id}`);
            break;
            
        case 'charge.failed':
            console.log(`❌ Charge failed: ${event.data.object.id}`);
            break;
            
        case 'charge.refunded':
            console.log(`↩️ Charge refunded: ${event.data.object.id}`);
            await handleRefund(event.data.object);
            break;
            
        // Checkout Events
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`🛒 Checkout completed: ${session.id}`);
            await handleCheckoutCompleted(session);
            break;
            
        case 'checkout.session.expired':
            console.log(`⏱️ Checkout session expired: ${event.data.object.id}`);
            break;
            
        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

// Event Handler Functions

async function handlePaymentSuccess(paymentIntent) {
    // Update database with successful payment
    // Grant access to paid features
    // Send confirmation email
    
    const customerId = paymentIntent.customer;
    const amount = paymentIntent.amount / 100; // Convert from cents
    
    console.log(`Processing successful payment of $${amount} for customer ${customerId}`);
    
    // TODO: Implement your business logic here
    // Example: Update user's account status, send receipt email, etc.
}

async function handlePaymentFailure(paymentIntent) {
    // Log failed payment
    // Send notification to customer
    // Update payment status in database
    
    console.log(`Payment failed for customer ${paymentIntent.customer}`);
    
    // TODO: Implement retry logic or customer notification
}

async function handleSubscriptionCreated(subscription) {
    // Grant access to subscription features
    // Send welcome email
    // Update user status in database
    
    const customerId = subscription.customer;
    const planId = subscription.items.data[0].price.id;
    
    console.log(`Activating subscription ${planId} for customer ${customerId}`);
    
    // TODO: Activate user's subscription in your database
}

async function handleSubscriptionUpdated(subscription) {
    // Update subscription details in database
    // Handle plan changes
    
    console.log(`Updating subscription ${subscription.id}`);
    
    // TODO: Update subscription details in your database
}

async function handleSubscriptionCancelled(subscription) {
    // Revoke access to premium features
    // Send cancellation confirmation
    // Update user status
    
    const customerId = subscription.customer;
    
    console.log(`Deactivating subscription for customer ${customerId}`);
    
    // TODO: Revoke access and update database
}

async function handleInvoicePaid(invoice) {
    // Mark invoice as paid in database
    // Send receipt to customer
    
    console.log(`Invoice ${invoice.id} paid successfully`);
    
    // TODO: Update invoice status in database
}

async function handleInvoiceFailed(invoice) {
    // Alert customer about failed payment
    // Implement retry logic
    
    console.log(`Invoice ${invoice.id} payment failed`);
    
    // TODO: Send payment failure notification
}

async function handleCheckoutCompleted(session) {
    // Fulfill the purchase
    // Send confirmation email
    // Update order status
    
    const customerId = session.customer;
    const mode = session.mode; // 'payment' or 'subscription'
    
    console.log(`Checkout completed for customer ${customerId} in ${mode} mode`);
    
    // TODO: Fulfill the order/subscription
}

async function handleCustomerCreated(customer) {
    // Add customer to your database
    // Send welcome email
    
    console.log(`New customer created: ${customer.email}`);
    
    // TODO: Create customer record in your database
}

async function handleCustomerDeleted(customer) {
    // Remove customer from database
    // Clean up related data
    
    console.log(`Customer deleted: ${customer.id}`);
    
    // TODO: Clean up customer data
}

async function handleRefund(charge) {
    // Process refund in your system
    // Update order status
    // Send refund confirmation
    
    console.log(`Refund processed for charge ${charge.id}`);
    
    // TODO: Update order status and notify customer
}

module.exports = router;
