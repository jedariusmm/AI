// Live Chat with NUPI Personalities and Modes

let currentPersona = {
    id: 'sarah',
    emoji: '👨‍⚕️',
    name: 'Dr. Sarah Chen',
    role: 'Medical Expert',
    type: 'personality'
};

// Conversation memory - never forgets
let conversationHistory = [];
let userContext = {
    name: null,
    preferences: {},
    topics: [],
    previousQuestions: []
};

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const clearChatBtn = document.getElementById('clearChat');
const activeEmoji = document.getElementById('activeEmoji');
const activeName = document.getElementById('activeName');
const activeRole = document.getElementById('activeRole');

// Personality responses database
const responses = {
    sarah: {
        greeting: "Hello! I'm Dr. Sarah Chen, a board-certified physician. I'm here to help with medical questions, health guidance, and wellness advice. How can I assist you today?",
        keywords: {
            'symptoms': "I can help you understand symptoms, but please remember I'm an AI and can't replace a real doctor's diagnosis. Can you describe what you're experiencing?",
            'headache': "Headaches can have many causes - stress, dehydration, eye strain, or underlying conditions. How long have you had this headache? Is it accompanied by other symptoms?",
            'diet': "Nutrition is crucial for good health! A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats. What specific dietary guidance are you looking for?",
            'exercise': "Regular exercise is wonderful for both physical and mental health. I recommend at least 150 minutes of moderate activity weekly. What are your fitness goals?"
        },
        default: "That's an interesting question. As a medical professional, I'd be happy to help. Could you provide more details so I can give you the best guidance?"
    },
    alex: {
        greeting: "Hey! I'm Alex Rodriguez, a senior full-stack developer. I love building web apps, solving complex problems, and helping others learn to code. What can I help you build today?",
        keywords: {
            'website': "Building a website? Awesome! I'd recommend starting with HTML, CSS, and JavaScript. Want me to walk you through creating your first site?",
            'react': "React is my favorite framework! It's perfect for building interactive UIs. Are you new to React or looking to build something specific?",
            'code': "I love talking code! What language or framework are you interested in? I can help with JavaScript, Python, React, Node.js, and more.",
            'bug': "Debugging can be frustrating, but we'll figure it out! Can you describe the issue you're facing? Error messages are super helpful.",
            'api': "APIs are the backbone of modern apps! Are you trying to build an API or consume one? I can help with REST, GraphQL, or other approaches."
        },
        default: "Great question! As a developer, I'm always excited to help solve technical challenges. Tell me more about what you're working on!"
    },
    maya: {
        greeting: "Hi there! I'm Maya Thompson, Creative Director with over 10 years in design. I specialize in branding, UI/UX, and visual storytelling. What creative project can I help you with?",
        keywords: {
            'design': "Design is all about solving problems beautifully! Are you working on UI/UX, branding, or something else? I'd love to help.",
            'colors': "Color theory is fascinating! Colors evoke emotions and set the mood. What's your project about? I can suggest a perfect palette.",
            'logo': "Logo design is about capturing your brand's essence in a memorable mark. Tell me about your brand - what do you do and who's your audience?",
            'brand': "Branding goes beyond just a logo - it's your entire visual identity and voice. Let's build something amazing! What's your brand story?",
            'ui': "UI design is where aesthetics meet functionality. Are you designing for web or mobile? What's the user experience you want to create?"
        },
        default: "I love creative challenges! Whether it's design strategy, visual identity, or user experience, I'm here to help. What are you envisioning?"
    },
    james: {
        greeting: "Hello! James Wilson here, MBA and business strategist. I help startups scale and businesses optimize. Whether it's strategy, growth, or operations - I'm here to help. What's your business challenge?",
        keywords: {
            'startup': "Starting a business is exciting! The key is validating your idea, understanding your market, and building an MVP. What's your startup concept?",
            'marketing': "Marketing is about reaching the right people with the right message. Are you looking at digital marketing, content, or brand strategy?",
            'growth': "Business growth requires strategy and execution. Let's look at your customer acquisition, retention, and revenue optimization. What's your current challenge?",
            'strategy': "Strategic planning is crucial for success. We need to analyze your market position, competition, and opportunities. What are your business goals?",
            'revenue': "Revenue optimization involves pricing strategy, sales processes, and customer lifetime value. Let's dive into your business model. How do you currently monetize?"
        },
        default: "That's a great business question! With 15+ years helping companies grow, I'm confident we can find the right strategy. Tell me more about your situation."
    },
    emily: {
        greeting: "Greetings! I'm Dr. Emily Park, research scientist specializing in molecular biology and genetics. I love explaining complex science in accessible ways. What would you like to explore today?",
        keywords: {
            'science': "Science is my passion! Whether it's biology, chemistry, physics, or genetics - I love diving deep. What topic interests you?",
            'research': "Research is about asking the right questions and following where the data leads. Are you working on a project or just curious about scientific methods?",
            'dna': "DNA is the blueprint of life! It's incredible how four simple bases create all the diversity we see. Would you like to learn about genetics, heredity, or gene editing?",
            'biology': "Biology is the study of life itself! From cells to ecosystems, it's endlessly fascinating. What aspect would you like to explore?",
            'experiment': "Experiments are how we test hypotheses and discover truth. Are you designing an experiment or trying to understand scientific results?"
        },
        default: "Excellent question! As a scientist, I believe in evidence-based answers. Let me help you understand this better. What specifically would you like to know?"
    },
    marcus: {
        greeting: "Welcome! I'm Dr. Marcus Lee, licensed psychologist specializing in cognitive behavioral therapy and wellness. This is a safe, supportive space. How can I support you today?",
        keywords: {
            'stress': "Stress is a common challenge. Deep breathing, mindfulness, and breaking problems into manageable steps can help. What's been causing you stress?",
            'anxiety': "Anxiety is very treatable. Techniques like cognitive restructuring, exposure therapy, and relaxation can make a big difference. Would you like to talk about what you're experiencing?",
            'sleep': "Sleep is crucial for mental and physical health. Good sleep hygiene includes regular schedules, limiting screens, and creating a restful environment. How's your sleep been?",
            'depression': "I'm here to listen and support you. Depression is a real condition that responds well to treatment. While I'm an AI, I encourage speaking with a licensed therapist. How are you feeling?",
            'mindfulness': "Mindfulness is powerful for reducing stress and increasing wellbeing. It's about being present without judgment. Would you like to try a simple mindfulness exercise?"
        },
        default: "Thank you for sharing that with me. Your wellbeing matters, and I'm here to listen and provide support. Tell me more about what's on your mind."
    }
};

const modeResponses = {
    'drivers-ed': {
        greeting: "Welcome to Driver's Education! I'll help you learn driving theory, road rules, and prepare for your test. What would you like to learn about?",
        keywords: {
            'rules': "Let's review road rules! Topics include right-of-way, speed limits, road signs, and safe driving practices. Which area would you like to focus on?",
            'signs': "Road signs are crucial for safe driving! There are regulatory signs (red/white), warning signs (yellow), and informational signs (green/blue). Want to practice identifying them?",
            'test': "Preparing for your driving test? I can help with written test questions and driving test tips. What part of the test are you practicing for?",
            'parking': "Parking takes practice! Key techniques include checking mirrors, turning the wheel at the right time, and proper positioning. Would you like tips for parallel parking or perpendicular?"
        },
        default: "Great question about driving! Safety is always priority #1. Let me help you understand this better."
    },
    'fashion': {
        greeting: "Welcome to your personal style consultation! I'm here to help with outfit ideas, trends, color matching, and building your perfect wardrobe. What can I style for you today?",
        keywords: {
            'outfit': "Let's create the perfect outfit! Tell me about the occasion, your style preferences, and any colors you love. I'll put together something amazing!",
            'colors': "Color coordination is key to great style! Complementary colors pop, while monochromatic looks are sophisticated. What colors are you working with?",
            'trends': "Current trends include oversized silhouettes, Y2K revival, sustainable fashion, and bold prints. What trend interests you?",
            'occasion': "Different occasions call for different styles! Is this for work, casual, formal, or a special event? I'll help you dress perfectly."
        },
        default: "Fashion is all about expressing yourself! Let's find your perfect style. What would you like to know more about?"
    },
    'gaming': {
        greeting: "Welcome to the Gaming Hub! Whether you need strategies, tips, build guides, or just want to chat about games - I'm your co-pilot. What game are you playing?",
        keywords: {
            'strategy': "Strategy is everything in competitive gaming! Map awareness, resource management, and timing are crucial. What game are you strategizing for?",
            'tips': "I've got tons of tips to level up your gameplay! What specific aspect do you want to improve - mechanics, positioning, decision-making?",
            'build': "Character builds can make or break your performance! Tell me what game and role you're playing, and I'll suggest optimal builds.",
            'competitive': "Going competitive? You'll need dedication, practice routines, and mental game. What's your competitive goal?"
        },
        default: "That's a great gaming question! The gaming community is amazing. Tell me more about what you're playing and I'll help you dominate!"
    }
};

// Switch personality/mode
document.querySelectorAll('.personality-btn, .mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        document.querySelectorAll('.personality-btn, .mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current persona
        currentPersona = {
            id: btn.dataset.id,
            emoji: btn.dataset.emoji,
            name: btn.dataset.name,
            role: btn.dataset.role || btn.dataset.desc,
            type: btn.classList.contains('mode-btn') ? 'mode' : 'personality'
        };
        
        // Update header
        activeEmoji.textContent = currentPersona.emoji;
        activeName.textContent = currentPersona.name;
        activeRole.textContent = currentPersona.role;
        
        // Clear chat and show greeting
        clearMessages();
        setTimeout(() => {
            const greeting = currentPersona.type === 'mode' 
                ? modeResponses[currentPersona.id].greeting 
                : responses[currentPersona.id].greeting;
            addMessage(greeting, 'ai');
        }, 500);
    });
});

// Send message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Clear welcome message
    const welcome = messagesContainer.querySelector('.welcome-message');
    if (welcome) welcome.remove();
    
    // Save to conversation history
    conversationHistory.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        persona: currentPersona.id
    });
    
    // Extract user context
    extractContext(text);
    
    // Add user message
    addMessage(text, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Get AI response with full context
    setTimeout(() => {
        hideTyping();
        const response = getAIResponse(text);
        
        // Save AI response to history
        conversationHistory.push({
            role: 'ai',
            content: response,
            timestamp: new Date().toISOString(),
            persona: currentPersona.id
        });
        
        addMessage(response, 'ai');
        
        // Save to localStorage for persistence
        saveConversation();
    }, 1500);
}

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${type === 'ai' ? currentPersona.emoji : '👤'}</div>
        <div>
            <div class="message-content">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const responseDb = currentPersona.type === 'mode' 
        ? modeResponses[currentPersona.id] 
        : responses[currentPersona.id];
    
    // Check if referencing previous conversation
    if (lowerMessage.includes('earlier') || lowerMessage.includes('before') || 
        lowerMessage.includes('you said') || lowerMessage.includes('remember')) {
        return getContextualResponse(userMessage);
    }
    
    // Check if greeting with name
    if (userContext.name && (lowerMessage.includes('hello') || lowerMessage.includes('hi'))) {
        return `Hello again, ${userContext.name}! ${responseDb.default}`;
    }
    
    // Check for keyword matches with context
    for (const [keyword, response] of Object.entries(responseDb.keywords || {})) {
        if (lowerMessage.includes(keyword)) {
            // Add context if this topic was discussed before
            const previousMentions = conversationHistory.filter(msg => 
                msg.content.toLowerCase().includes(keyword) && msg.role === 'user'
            ).length;
            
            if (previousMentions > 1) {
                return `I remember we discussed ${keyword} earlier. ${response}`;
            }
            return response;
        }
    }
    
    // Return default response with memory
    if (conversationHistory.length > 2) {
        return `Based on our conversation so far, ${responseDb.default}`;
    }
    return responseDb.default;
}

function getContextualResponse(userMessage) {
    // Find relevant past messages
    const recentHistory = conversationHistory.slice(-10);
    const topics = userContext.topics.join(', ');
    
    if (recentHistory.length === 0) {
        return "We haven't discussed anything yet, but I'm here to help! What would you like to talk about?";
    }
    
    const responseDb = currentPersona.type === 'mode' 
        ? modeResponses[currentPersona.id] 
        : responses[currentPersona.id];
    
    return `Yes, I remember our conversation! We've been discussing ${topics || 'several topics'}. ${responseDb.default}`;
}

function extractContext(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract name if mentioned
    const namePatterns = [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i];
    for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match) {
            userContext.name = match[1];
        }
    }
    
    // Track topics discussed
    const keywords = ['health', 'code', 'design', 'business', 'science', 'mental health', 
                     'driving', 'fashion', 'gaming', 'website', 'stress', 'exercise'];
    keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword) && !userContext.topics.includes(keyword)) {
            userContext.topics.push(keyword);
        }
    });
    
    // Save previous questions
    if (message.includes('?')) {
        userContext.previousQuestions.push(message);
    }
}

function saveConversation() {
    try {
        localStorage.setItem('nupi_conversation', JSON.stringify(conversationHistory));
        localStorage.setItem('nupi_context', JSON.stringify(userContext));
    } catch (e) {
        console.log('Unable to save conversation to localStorage');
    }
}

function loadConversation() {
    try {
        const saved = localStorage.getItem('nupi_conversation');
        const savedContext = localStorage.getItem('nupi_context');
        
        if (saved) {
            conversationHistory = JSON.parse(saved);
            console.log(`Loaded ${conversationHistory.length} messages from memory`);
        }
        
        if (savedContext) {
            userContext = JSON.parse(savedContext);
            console.log('User context restored:', userContext);
        }
    } catch (e) {
        console.log('Unable to load conversation from localStorage');
    }
}

function clearMessages() {
    messagesContainer.innerHTML = '';
}

// Clear chat button - clears UI but KEEPS memory
clearChatBtn.addEventListener('click', () => {
    if (confirm('Clear the chat display? (Your conversation will still be remembered)')) {
        clearMessages();
        const greeting = currentPersona.type === 'mode' 
            ? modeResponses[currentPersona.id].greeting 
            : responses[currentPersona.id].greeting;
        
        // Add greeting with memory reference if conversation exists
        setTimeout(() => {
            if (conversationHistory.length > 0) {
                addMessage(`${greeting}\n\nI still remember our previous conversation with ${conversationHistory.length} messages!`, 'ai');
            } else {
                addMessage(greeting, 'ai');
            }
        }, 300);
    }
});

// Suggestion chips
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
        messageInput.value = e.target.dataset.text;
        messageInput.focus();
    }
});

// Initialize - load previous conversation
loadConversation();

// Initialize with greeting
setTimeout(() => {
    if (userContext.name) {
        addMessage(`Welcome back, ${userContext.name}! ${responses.sarah.greeting}`, 'ai');
    } else if (conversationHistory.length > 0) {
        addMessage(`${responses.sarah.greeting}\n\nI remember our previous conversation!`, 'ai');
    } else {
        addMessage(responses.sarah.greeting, 'ai');
    }
}, 1000);

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// Export conversation (bonus feature)
window.exportConversation = function() {
    const dataStr = JSON.stringify({
        conversation: conversationHistory,
        context: userContext,
        exportedAt: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nupi-conversation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('Conversation exported!');
};
