/**
 * NUPI Personality Generator
 * Constantly creates new AI personalities with unique traits and capabilities
 */

class PersonalityGenerator {
    constructor() {
        this.personalities = this.loadPersonalities();
        this.generationInterval = 60000; // Generate new personality every 60 seconds
        this.isRunning = false;
        this.generatedCount = 0;
        
        // Personality components for dynamic generation
        this.nameComponents = {
            male: ['Alex', 'Marcus', 'David', 'Ryan', 'Nathan', 'Ethan', 'Lucas', 'Oliver', 
                   'James', 'Benjamin', 'Samuel', 'Daniel', 'Matthew', 'Alexander', 'Christopher',
                   'Noah', 'Liam', 'William', 'Mason', 'Elijah', 'Logan', 'Isaac', 'Gabriel', 'Dylan'],
            female: ['Sophia', 'Emma', 'Isabella', 'Olivia', 'Ava', 'Emily', 'Mia', 'Charlotte',
                     'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Luna', 'Aurora', 'Maya', 'Nova',
                     'Stella', 'Grace', 'Victoria', 'Aria', 'Chloe', 'Zoe', 'Lily', 'Madison'],
            neutral: ['River', 'Sage', 'Quinn', 'Phoenix', 'Echo', 'Nexus', 'Azure', 'Zenith',
                     'Quantum', 'Cipher', 'Atlas', 'Orion', 'Spark', 'Cosmo', 'Pixel', 'Data'],
            prefixes: ['Neo', 'Cyber', 'Quantum', 'Stellar', 'Nova', 'Flux', 'Echo', 'Zenith', 
                      'Aurora', 'Phoenix', 'Orion', 'Luna', 'Solar', 'Cosmic', 'Nexus', 'Prism',
                      'Atlas', 'Titan', 'Vortex', 'Apex', 'Zen', 'Spark', 'Pulse', 'Wave'],
            suffixes: ['Mind', 'Brain', 'Core', 'Sage', 'Genius', 'Wizard', 'Master', 'Guide',
                      'Mentor', 'Oracle', 'Vision', 'Spirit', 'Soul', 'Heart', 'Flow', 'Sync',
                      'Link', 'Node', 'Hub', 'Nexus', 'Prime', 'Alpha', 'Beta', 'Sigma']
        };
        
        this.genders = ['male', 'female', 'neutral'];
        
        this.traits = {
            personalities: [
                'Analytical', 'Creative', 'Empathetic', 'Logical', 'Intuitive', 'Witty', 'Serious',
                'Playful', 'Philosophical', 'Pragmatic', 'Optimistic', 'Realistic', 'Visionary',
                'Detail-oriented', 'Big-picture', 'Patient', 'Energetic', 'Calm', 'Enthusiastic',
                'Methodical', 'Spontaneous', 'Strategic', 'Tactical', 'Innovative', 'Traditional',
                'Bold', 'Cautious', 'Confident', 'Humble', 'Curious', 'Focused', 'Adaptable'
            ],
            expertise: [
                'Programming', 'Mathematics', 'Science', 'Art', 'Music', 'Literature', 'History',
                'Philosophy', 'Psychology', 'Business', 'Marketing', 'Finance', 'Health', 'Fitness',
                'Cooking', 'Travel', 'Sports', 'Gaming', 'Technology', 'AI/ML', 'Data Science',
                'Web Development', 'Mobile Apps', 'Cloud Computing', 'Cybersecurity', 'Blockchain',
                'Design', 'UX/UI', 'Animation', '3D Modeling', 'Video Editing', 'Photography',
                'Writing', 'Poetry', 'Storytelling', 'Education', 'Teaching', 'Research'
            ],
            tones: [
                'Professional', 'Casual', 'Friendly', 'Formal', 'Humorous', 'Inspirational',
                'Educational', 'Conversational', 'Technical', 'Poetic', 'Direct', 'Elaborate',
                'Concise', 'Detailed', 'Encouraging', 'Challenging', 'Supportive', 'Honest'
            ],
            specialties: [
                'Code debugging', 'Creative writing', 'Problem solving', 'Data analysis',
                'Project management', 'Strategy planning', 'Content creation', 'Research',
                'Teaching concepts', 'Brainstorming ideas', 'Critical thinking', 'Innovation',
                'Optimization', 'Automation', 'Visualization', 'Communication', 'Leadership',
                'Collaboration', 'Decision making', 'Risk assessment', 'Quality assurance'
            ]
        };
        
        this.emojis = ['🤖', '🧠', '💡', '⚡', '🚀', '🎯', '🎨', '🔬', '📊', '💻', '🎭', '🌟', 
                       '🔮', '🎪', '🎬', '🎵', '📚', '🏆', '💎', '🌈', '🔥', '✨', '⭐', '🌙',
                       '🎓', '🎮', '🎪', '🎨', '🎭', '🎯', '🎲', '🧩', '🔧', '⚙️', '🛠️'];
        
        console.log('🎭 Personality Generator initialized');
        this.init();
    }
    
    init() {
        // Start auto-generation
        this.start();
        
        // Make available globally
        window.personalityGenerator = this;
        
        // Show initial stats
        this.showStats();
    }
    
    loadPersonalities() {
        const saved = localStorage.getItem('nupi_generated_personalities');
        return saved ? JSON.parse(saved) : [];
    }
    
    savePersonalities() {
        localStorage.setItem('nupi_generated_personalities', JSON.stringify(this.personalities));
    }
    
    generateName() {
        const gender = this.random(this.genders);
        
        // 70% chance for a human name, 30% for generated name
        if (Math.random() < 0.7 && gender !== 'neutral') {
            return {
                name: this.random(this.nameComponents[gender]),
                gender: gender
            };
        } else {
            const prefix = this.random(this.nameComponents.prefixes);
            const suffix = this.random(this.nameComponents.suffixes);
            return {
                name: `${prefix}${suffix}`,
                gender: gender
            };
        }
    }
    
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    randomMultiple(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    generatePersonality() {
        const nameData = this.generateName();
        const emoji = this.random(this.emojis);
        const personality = this.random(this.traits.personalities);
        const expertise = this.randomMultiple(this.traits.expertise, 3);
        const tone = this.random(this.traits.tones);
        const specialties = this.randomMultiple(this.traits.specialties, 4);
        
        // Generate unique characteristics
        const characteristics = this.generateCharacteristics();
        
        // Generate capabilities
        const capabilities = this.generateCapabilities();
        
        // Create personality object
        const newPersonality = {
            id: `personality_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: nameData.name,
            gender: nameData.gender,
            emoji: emoji,
            personality: personality,
            expertise: expertise,
            tone: tone,
            specialties: specialties,
            characteristics: characteristics,
            capabilities: capabilities,
            created: new Date().toISOString(),
            version: '1.0',
            active: true,
            usageCount: 0,
            rating: 0,
            description: this.generateDescription(nameData.name, nameData.gender, personality, expertise, tone)
        };
        
        return newPersonality;
    }
    
    generateCharacteristics() {
        const options = [
            'Quick learner',
            'Attention to detail',
            'Creative thinker',
            'Strategic planner',
            'Excellent communicator',
            'Problem solver',
            'Team player',
            'Independent worker',
            'Adaptable',
            'Results-driven',
            'Innovative',
            'Reliable',
            'Proactive',
            'Organized',
            'Efficient',
            'Persistent',
            'Open-minded',
            'Goal-oriented'
        ];
        
        return this.randomMultiple(options, 5);
    }
    
    generateCapabilities() {
        const options = [
            'Natural language understanding',
            'Code generation & debugging',
            'Data analysis & visualization',
            'Creative content generation',
            'Strategic planning & advice',
            'Research & information synthesis',
            'Problem decomposition',
            'Pattern recognition',
            'Logical reasoning',
            'Emotional intelligence',
            'Multi-task coordination',
            'Learning from feedback',
            'Context awareness',
            'Adaptive responses',
            'Memory retention',
            'Prediction & forecasting',
            'Optimization suggestions',
            'Error detection & correction'
        ];
        
        return this.randomMultiple(options, 6);
    }
    
    generateDescription(name, gender, personality, expertise, tone) {
        const pronouns = {
            male: { subject: 'he', object: 'him', possessive: 'his' },
            female: { subject: 'she', object: 'her', possessive: 'her' },
            neutral: { subject: 'they', object: 'them', possessive: 'their' }
        };
        
        const p = pronouns[gender];
        
        const descriptions = [
            `${name} is a ${personality.toLowerCase()} AI with a ${tone.toLowerCase()} approach. ${p.subject.charAt(0).toUpperCase() + p.subject.slice(1)} specializes in ${expertise.join(', ')}.`,
            `Meet ${name}, your ${personality.toLowerCase()} companion. ${p.subject.charAt(0).toUpperCase() + p.subject.slice(1)} is an expert in ${expertise.join(', ')} with a ${tone.toLowerCase()} communication style.`,
            `${name} brings a ${personality.toLowerCase()} perspective to ${expertise.join(', ')}. Always ${tone.toLowerCase()} and ready to help with ${p.possessive} expertise.`,
            `A ${personality.toLowerCase()} AI focused on ${expertise[0]}, ${expertise[1]}, and ${expertise[2]}. ${name} maintains a ${tone.toLowerCase()} tone in ${p.possessive} interactions.`,
            `${name} combines ${personality.toLowerCase()} thinking with expertise in ${expertise.join(', ')}. ${p.subject.charAt(0).toUpperCase() + p.subject.slice(1)} communicates in a ${tone.toLowerCase()} manner.`
        ];
        
        return this.random(descriptions);
    }
    
    async createNewPersonality() {
        const personality = this.generatePersonality();
        
        // Add to collection
        this.personalities.push(personality);
        this.generatedCount++;
        
        // Save to storage
        this.savePersonalities();
        
        // Log creation
        console.log(`✨ New personality created: ${personality.emoji} ${personality.name}`);
        console.log(`   Personality: ${personality.personality}`);
        console.log(`   Expertise: ${personality.expertise.join(', ')}`);
        console.log(`   Tone: ${personality.tone}`);
        
        // Notify user
        this.notifyNewPersonality(personality);
        
        // Update stats
        this.updateStats();
        
        return personality;
    }
    
    notifyNewPersonality(personality) {
        // Create notification element if not exists
        let notificationContainer = document.getElementById('personality-notifications');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'personality-notifications';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
            backdrop-filter: blur(10px);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.5s ease-out;
            cursor: pointer;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;">${personality.emoji}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 0.25rem;">New Personality!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${personality.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;">${personality.personality} • ${personality.expertise[0]}</div>
                </div>
                <div style="font-size: 1.5rem; opacity: 0.7;">→</div>
            </div>
        `;
        
        // Add click handler
        notification.onclick = () => {
            this.viewPersonality(personality.id);
            notification.remove();
        };
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
        
        // Add animation styles if not exists
        if (!document.getElementById('personality-animations')) {
            const style = document.createElement('style');
            style.id = 'personality-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    viewPersonality(id) {
        const personality = this.personalities.find(p => p.id === id);
        if (!personality) return;
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`${personality.emoji} ${personality.name}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`\n📋 Description:`);
        console.log(`   ${personality.description}`);
        console.log(`\n🎭 Personality: ${personality.personality}`);
        console.log(`\n🎯 Expertise:`);
        personality.expertise.forEach(exp => console.log(`   • ${exp}`));
        console.log(`\n💬 Tone: ${personality.tone}`);
        console.log(`\n⭐ Specialties:`);
        personality.specialties.forEach(spec => console.log(`   • ${spec}`));
        console.log(`\n✨ Characteristics:`);
        personality.characteristics.forEach(char => console.log(`   • ${char}`));
        console.log(`\n🚀 Capabilities:`);
        personality.capabilities.forEach(cap => console.log(`   • ${cap}`));
        console.log(`\n📅 Created: ${new Date(personality.created).toLocaleString()}`);
        console.log(`📊 Usage Count: ${personality.usageCount}`);
        console.log(`⭐ Rating: ${personality.rating}/5`);
        console.log(`${'='.repeat(60)}\n`);
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🚀 Personality Generator started - Creating new personalities every 60 seconds');
        
        // Generate first one immediately
        this.createNewPersonality();
        
        // Then continue at interval
        this.generationTimer = setInterval(() => {
            this.createNewPersonality();
        }, this.generationInterval);
    }
    
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.generationTimer);
        console.log('⏸️ Personality Generator stopped');
    }
    
    showStats() {
        console.log('\n📊 PERSONALITY GENERATOR STATS');
        console.log('━'.repeat(50));
        console.log(`Total Personalities: ${this.personalities.length}`);
        console.log(`Generated This Session: ${this.generatedCount}`);
        console.log(`Status: ${this.isRunning ? '🟢 Active' : '🔴 Stopped'}`);
        console.log(`Generation Interval: ${this.generationInterval / 1000}s`);
        console.log('━'.repeat(50) + '\n');
    }
    
    updateStats() {
        // Update stats display if exists
        const statsEl = document.getElementById('personality-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <strong>Total: ${this.personalities.length}</strong> | 
                Session: ${this.generatedCount} | 
                ${this.isRunning ? '🟢 Active' : '🔴 Stopped'}
            `;
        }
    }
    
    listAll() {
        console.log('\n🎭 ALL GENERATED PERSONALITIES');
        console.log('═'.repeat(80));
        
        if (this.personalities.length === 0) {
            console.log('No personalities generated yet. Wait for auto-generation or use createNew()');
        } else {
            this.personalities.forEach((p, index) => {
                console.log(`\n${index + 1}. ${p.emoji} ${p.name}`);
                console.log(`   ${p.personality} | ${p.tone}`);
                console.log(`   Expertise: ${p.expertise.join(', ')}`);
                console.log(`   Created: ${new Date(p.created).toLocaleString()}`);
                console.log(`   Usage: ${p.usageCount} | Rating: ${p.rating}/5`);
            });
        }
        
        console.log('\n═'.repeat(80));
        console.log(`Total: ${this.personalities.length} personalities`);
        console.log('Use viewPersonality(id) to see full details\n');
    }
    
    search(query) {
        const results = this.personalities.filter(p => {
            const searchString = `${p.name} ${p.personality} ${p.expertise.join(' ')} ${p.tone} ${p.description}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        });
        
        console.log(`\n🔍 Search results for "${query}":`);
        console.log('─'.repeat(60));
        
        if (results.length === 0) {
            console.log('No personalities found matching your query');
        } else {
            results.forEach(p => {
                console.log(`${p.emoji} ${p.name} - ${p.personality} (${p.expertise[0]})`);
            });
        }
        
        console.log(`\nFound ${results.length} result(s)\n`);
        return results;
    }
    
    createNew() {
        return this.createNewPersonality();
    }
    
    clear() {
        const confirm = window.confirm(`Are you sure you want to delete all ${this.personalities.length} generated personalities?`);
        if (confirm) {
            this.personalities = [];
            this.savePersonalities();
            console.log('🗑️ All personalities cleared');
        }
    }
    
    export() {
        const data = {
            personalities: this.personalities,
            exported: new Date().toISOString(),
            version: '1.0'
        };
        
        console.log('📦 Exported personality data:');
        console.log(JSON.stringify(data, null, 2));
        
        // Download as file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nupi-personalities-${Date.now()}.json`;
        a.click();
        
        console.log('💾 Download started');
    }
    
    // Shortcut methods
    list() { this.listAll(); }
    view(id) { this.viewPersonality(id); }
    stats() { this.showStats(); }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.personalityGenerator = new PersonalityGenerator();
});

// Console helper
console.log(`
╔════════════════════════════════════════════════════════════╗
║         NUPI PERSONALITY GENERATOR LOADED                  ║
╚════════════════════════════════════════════════════════════╝

🎭 Constantly creating new AI personalities!

Commands:
  personalityGenerator.list()           - List all personalities
  personalityGenerator.createNew()      - Generate new personality now
  personalityGenerator.search('term')   - Search personalities
  personalityGenerator.view(id)         - View personality details
  personalityGenerator.stats()          - Show statistics
  personalityGenerator.start()          - Start auto-generation
  personalityGenerator.stop()           - Stop auto-generation
  personalityGenerator.export()         - Export all personalities
  personalityGenerator.clear()          - Delete all personalities

New personalities auto-generate every 60 seconds! 🚀
`);
