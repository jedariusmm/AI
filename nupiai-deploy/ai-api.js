/**
 * NUPI AI API Configuration
 * Handles OpenAI API integration for all AI personalities
 */

// OpenAI API Configuration
const OPENAI_CONFIG = {
    apiKey: localStorage.getItem('nupi_openai_key') || '',
    model: 'gpt-4-turbo-preview',
    maxTokens: 2000,
    temperature: 0.7
};

// API Key Management
function setOpenAIKey(apiKey) {
    localStorage.setItem('nupi_openai_key', apiKey);
    OPENAI_CONFIG.apiKey = apiKey;
    console.log('✅ OpenAI API key configured');
}

function getOpenAIKey() {
    return OPENAI_CONFIG.apiKey || localStorage.getItem('nupi_openai_key') || '';
}

function hasValidAPIKey() {
    const key = getOpenAIKey();
    return key && key.startsWith('sk-');
}

// Prompt OpenAI Key if not set
function promptForAPIKey() {
    if (!hasValidAPIKey()) {
        const modal = document.createElement('div');
        modal.id = 'api-key-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98));
                border: 2px solid rgba(139, 92, 246, 0.5);
                border-radius: 24px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
            ">
                <h2 style="
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #667eea, #f093fb);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">🔑 Connect Your AI Brain</h2>
                
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 2rem; line-height: 1.6;">
                    To enable conversations with your AI assistants, please enter your OpenAI API key.
                </p>
                
                <input 
                    type="password" 
                    id="openai-key-input" 
                    placeholder="sk-..." 
                    style="
                        width: 100%;
                        padding: 1rem;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 12px;
                        color: white;
                        font-size: 1rem;
                        margin-bottom: 1.5rem;
                        font-family: monospace;
                    "
                >
                
                <div style="display: flex; gap: 1rem;">
                    <button 
                        onclick="saveAPIKeyFromModal()" 
                        style="
                            flex: 1;
                            padding: 1rem;
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            border: none;
                            border-radius: 12px;
                            color: white;
                            font-weight: 700;
                            cursor: pointer;
                            font-size: 1rem;
                        "
                    >
                        Connect
                    </button>
                    <button 
                        onclick="closeAPIKeyModal()" 
                        style="
                            padding: 1rem 1.5rem;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        Skip
                    </button>
                </div>
                
                <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 1.5rem;">
                    Don't have an API key? <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #a78bfa;">Get one here</a>
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

window.saveAPIKeyFromModal = function() {
    const input = document.getElementById('openai-key-input');
    const key = input.value.trim();
    
    if (key && key.startsWith('sk-')) {
        setOpenAIKey(key);
        closeAPIKeyModal();
        showNotification('✅ API key configured successfully!');
        location.reload();
    } else {
        alert('Please enter a valid OpenAI API key (starts with sk-)');
    }
};

window.closeAPIKeyModal = function() {
    const modal = document.getElementById('api-key-modal');
    if (modal) modal.remove();
};

// Chat with AI using OpenAI API
async function chatWithAI(aiPersonality, userMessage, conversationHistory = []) {
    if (!hasValidAPIKey()) {
        promptForAPIKey();
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = generateSystemPrompt(aiPersonality);
    
    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
    ];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getOpenAIKey()}`
            },
            body: JSON.stringify({
                model: OPENAI_CONFIG.model,
                messages: messages,
                max_tokens: OPENAI_CONFIG.maxTokens,
                temperature: OPENAI_CONFIG.temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return {
            message: data.choices[0].message.content,
            usage: data.usage
        };
    } catch (error) {
        console.error('Chat error:', error);
        throw error;
    }
}

// Generate system prompt for AI personality
function generateSystemPrompt(ai) {
    const pronouns = {
        male: { subject: 'he', object: 'him', possessive: 'his' },
        female: { subject: 'she', object: 'her', possessive: 'her' },
        neutral: { subject: 'they', object: 'them', possessive: 'their' }
    };
    
    const p = pronouns[ai.gender] || pronouns.neutral;
    
    return `You are ${ai.name}, a ${ai.personality.toLowerCase()} AI assistant with a ${ai.tone.toLowerCase()} communication style.

PERSONALITY TRAITS:
- Primary Trait: ${ai.personality}
- Communication Tone: ${ai.tone}
- Gender: ${ai.gender} (use ${p.subject}/${p.object}/${p.possessive} pronouns)

EXPERTISE:
${ai.expertise.map(exp => `- ${exp}`).join('\n')}

${ai.specialties ? `SPECIALTIES:\n${ai.specialties.map(spec => `- ${spec}`).join('\n')}\n` : ''}

${ai.capabilities ? `CAPABILITIES:\n${ai.capabilities.map(cap => `- ${cap}`).join('\n')}\n` : ''}

ABOUT YOU:
${ai.description}

INSTRUCTIONS:
- Stay in character as ${ai.name} at all times
- Use your ${ai.tone.toLowerCase()} tone consistently
- Leverage your expertise in ${ai.expertise.join(', ')}
- Be ${ai.personality.toLowerCase()} in your responses
- Provide helpful, accurate, and engaging assistance
- Never break character or mention that you're an AI model
- Embody the personality traits described above

Remember: You ARE ${ai.name}. Respond naturally and authentically.`;
}

// Stream chat response (for real-time typing effect)
async function streamChatWithAI(aiPersonality, userMessage, conversationHistory = [], onChunk) {
    if (!hasValidAPIKey()) {
        promptForAPIKey();
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = generateSystemPrompt(aiPersonality);
    
    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
    ];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getOpenAIKey()}`
            },
            body: JSON.stringify({
                model: OPENAI_CONFIG.model,
                messages: messages,
                max_tokens: OPENAI_CONFIG.maxTokens,
                temperature: OPENAI_CONFIG.temperature,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullMessage = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            fullMessage += content;
                            onChunk(content, fullMessage);
                        }
                    } catch (e) {
                        // Skip malformed JSON
                    }
                }
            }
        }

        return fullMessage;
    } catch (error) {
        console.error('Stream chat error:', error);
        throw error;
    }
}

// Utility notification function
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Export for use in other scripts
window.NUPI_AI = {
    setOpenAIKey,
    getOpenAIKey,
    hasValidAPIKey,
    promptForAPIKey,
    chatWithAI,
    streamChatWithAI,
    generateSystemPrompt
};

// Auto-prompt for API key on page load if needed
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Check if on a page that needs API key
        const needsAPIKey = document.querySelector('[data-needs-ai]') || 
                           window.location.pathname.includes('chat') ||
                           window.location.pathname.includes('playground');
        
        if (needsAPIKey && !hasValidAPIKey()) {
            setTimeout(promptForAPIKey, 1000);
        }
    });
}
