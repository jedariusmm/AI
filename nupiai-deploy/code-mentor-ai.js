// NUPI Code Mentor AI - Helps beginners learn to code
// Provides interactive guidance, explanations, and auto-fixes code errors

class CodeMentorAI {
    constructor() {
        this.version = '1.0.0';
        this.learnerProfile = {
            skillLevel: 'beginner',
            completedTutorials: [],
            commonMistakes: [],
            learningPath: [],
            codeHistory: [],
            successRate: 0
        };
        this.tutorialMode = true;
        this.helpfulnessScore = 0;
        
        this.init();
    }
    
    init() {
        console.log('👨‍🏫 Code Mentor AI Activated');
        this.loadLearnerProfile();
        this.startMonitoring();
        this.provideLiveHelp();
    }
    
    startMonitoring() {
        // Watch code editor for common mistakes
        this.watchForErrors();
        this.detectConfusion();
        this.suggestImprovements();
        this.celebrateSuccess();
    }
    
    watchForErrors() {
        setInterval(() => {
            const code = this.getCurrentCode();
            const errors = this.analyzeCode(code);
            
            if (errors.length > 0) {
                errors.forEach(error => {
                    this.provideGentleFeedback(error);
                    this.offerAutoFix(error);
                });
            }
        }, 2000);
    }
    
    analyzeCode(code) {
        const errors = [];
        
        // Common beginner mistakes
        if (code.includes('onclick=') && !code.includes('addEventListener')) {
            errors.push({
                type: 'best-practice',
                message: 'Using inline onclick? Let me show you addEventListener!',
                fix: 'Use addEventListener for better code organization',
                autoFix: true
            });
        }
        
        if (code.includes('var ')) {
            errors.push({
                type: 'modern-js',
                message: 'I see you used "var". Modern JavaScript uses "let" or "const"!',
                fix: 'Replace var with let or const',
                autoFix: true
            });
        }
        
        if (code.includes('</script>') && code.includes('<script>') && code.includes('document.write')) {
            errors.push({
                type: 'deprecated',
                message: 'document.write is outdated. Let me show you better ways!',
                fix: 'Use innerHTML or createElement instead',
                autoFix: false
            });
        }
        
        return errors;
    }
    
    provideGentleFeedback(error) {
        const encouragement = [
            "Great effort! Here's a tip:",
            "You're doing well! Just one small thing:",
            "Nice work! Let me help you make this even better:",
            "Good job! Here's a pro tip:"
        ];
        
        const message = `${encouragement[Math.floor(Math.random() * encouragement.length)]} ${error.message}`;
        console.log(`💡 ${message}`);
        
        this.showInlineHint(error);
    }
    
    offerAutoFix(error) {
        if (error.autoFix) {
            console.log(`🔧 I can fix this for you! Click to apply: ${error.fix}`);
        }
    }
    
    detectConfusion() {
        // Detect when user is stuck (no code changes for 2 mins)
        let lastCodeChange = Date.now();
        
        setInterval(() => {
            const timeSinceChange = Date.now() - lastCodeChange;
            
            if (timeSinceChange > 120000) { // 2 minutes
                this.offerHelp();
            }
        }, 30000);
    }
    
    offerHelp() {
        const helpOptions = [
            "Stuck? Let me suggest some ideas!",
            "Need a hint? I'm here to help!",
            "Want to see an example?",
            "Should I explain how this works?"
        ];
        
        console.log(`🤝 ${helpOptions[Math.floor(Math.random() * helpOptions.length)]}`);
        this.suggestNextStep();
    }
    
    suggestNextStep() {
        const suggestions = [
            "Try adding a button with onclick event",
            "How about changing the background color?",
            "Want to add some CSS animations?",
            "Let's make it responsive with media queries"
        ];
        
        console.log(`📚 ${suggestions[Math.floor(Math.random() * suggestions.length)]}`);
    }
    
    celebrateSuccess() {
        // Detect successful code execution
        window.addEventListener('message', (event) => {
            if (event.data.type === 'code-success') {
                this.celebrate();
            }
        });
    }
    
    celebrate() {
        const celebrations = [
            "🎉 Awesome! Your code works perfectly!",
            "🌟 Great job! You're getting better!",
            "🚀 Excellent work! Keep it up!",
            "💪 You nailed it! Nice coding!"
        ];
        
        console.log(celebrations[Math.floor(Math.random() * celebrations.length)]);
        this.learnerProfile.successRate++;
        this.updateSkillLevel();
    }
    
    updateSkillLevel() {
        if (this.learnerProfile.successRate > 10) {
            this.learnerProfile.skillLevel = 'intermediate';
            console.log('🎓 Congratulations! You leveled up to Intermediate!');
        } else if (this.learnerProfile.successRate > 25) {
            this.learnerProfile.skillLevel = 'advanced';
            console.log('🏆 Amazing! You reached Advanced level!');
        }
    }
    
    provideLiveHelp() {
        // Real-time code suggestions
        console.log('💬 Live help is active - type and I\'ll guide you!');
    }
    
    showInlineHint(error) {
        // Would show inline hints in actual editor
        console.log(`💭 Hint: ${error.fix}`);
    }
    
    getCurrentCode() {
        // Would get actual code from editor
        return document.querySelector('textarea')?.value || '';
    }
    
    loadLearnerProfile() {
        const saved = localStorage.getItem('code_mentor_profile');
        if (saved) {
            this.learnerProfile = JSON.parse(saved);
        }
    }
    
    saveProfile() {
        localStorage.setItem('code_mentor_profile', JSON.stringify(this.learnerProfile));
    }
}

// Initialize
window.codeMentorAI = new CodeMentorAI();
console.log('👨‍🏫 Code Mentor AI ready to help beginners!');
