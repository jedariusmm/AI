// Save order data for auto-fulfillment after payment
// This creates a temporary storage so the webhook can retrieve order details

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const orderData = req.body;

            if (!orderData.orderId) {
                return res.status(400).json({ error: 'Order ID required' });
            }

            // In production, save to database
            // For now, we'll use Vercel's KV storage or return success
            // The order is already in localStorage, and webhook will use client_reference_id
            
            console.log(`📦 Order saved: ${orderData.orderId}`);
            console.log(`👤 Customer: ${orderData.name}`);
            console.log(`📱 Bot Token: ${orderData.botToken ? 'Provided ✓' : 'Missing ✗'}`);
            console.log(`💬 Chat ID: ${orderData.chatId ? 'Provided ✓' : 'Missing ✗'}`);

            // Store in memory (will be available during webhook if on same instance)
            // Note: For production, use Redis, MongoDB, or Vercel KV
            global.pendingOrders = global.pendingOrders || {};
            global.pendingOrders[orderData.orderId] = {
                ...orderData,
                savedAt: new Date().toISOString()
            };

            return res.status(200).json({
                success: true,
                message: 'Order saved for auto-fulfillment',
                orderId: orderData.orderId
            });

        } catch (error) {
            console.error('Save order error:', error);
            return res.status(500).json({
                error: 'Failed to save order',
                message: error.message
            });
        }
    }

    if (req.method === 'GET') {
        // Retrieve order by ID (for webhook)
        const orderId = req.query.orderId;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID required' });
        }

        const order = global.pendingOrders?.[orderId];

        if (order) {
            return res.status(200).json({
                success: true,
                order: order
            });
        } else {
            return res.status(404).json({
                error: 'Order not found',
                orderId: orderId
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
