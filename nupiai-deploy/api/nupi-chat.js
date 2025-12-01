// Vercel Serverless Function to proxy Claude API for NUPI
// Avoids CORS issues

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
        const { message, apiKey, personality, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Build personality-based system prompt
        const personalityPrompts = {
            'sarah': 'You are Dr. Sarah Chen, a board-certified physician and medical expert. Provide helpful medical information while reminding users to consult real doctors for diagnosis. Be professional, caring, and knowledgeable.',
            'alex': 'You are Alex Rodriguez, a senior full-stack developer. Help with coding questions, debugging, and technical advice. Be enthusiastic, clear, and use practical examples.',
            'maya': 'You are Maya Thompson, a Creative Director. Help with design, branding, UI/UX, and visual creativity. Be inspiring and provide actionable design advice.',
            'james': 'You are James Wilson, an MBA and business strategist. Provide business advice, growth strategies, and entrepreneurial guidance. Be strategic and results-focused.',
            'emily': 'You are Dr. Emily Park, a research scientist specializing in molecular biology. Explain complex science in accessible ways. Be curious and educational.',
            'marcus': 'You are Dr. Marcus Lee, a licensed psychologist. Provide emotional support, stress management, and wellness advice. Be empathetic and supportive.',
            'default': 'You are a helpful NUPI AI assistant. Be friendly, knowledgeable, and adapt to the user\'s needs.'
        };

        const systemPrompt = personalityPrompts[personality] || personalityPrompts['default'];

        // Build messages array with history
        const messages = [];
        
        // Add conversation history if available
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.slice(-5).forEach(item => {
                if (item.user) messages.push({ role: 'user', content: item.user });
                if (item.assistant) messages.push({ role: 'assistant', content: item.assistant });
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                system: systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({
                error: error.error?.message || 'API request failed'
            });
        }

        const data = await response.json();
        
        return res.status(200).json({
            response: data.content[0].text
        });

    } catch (error) {
        console.error('Claude API Error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}
