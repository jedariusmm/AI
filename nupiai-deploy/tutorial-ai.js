// NUPI Tutorial AI - Creates interactive step-by-step tutorials
// Adapts to user's pace and provides hands-on learning experiences

class TutorialAI {
    constructor() {
        this.version = '1.0.0';
        this.currentTutorial = null;
        this.progress = 0;
        this.tutorials = this.createTutorials();
        
        this.init();
    }
    
    init() {
        console.log('📚 Tutorial AI Activated');
        this.startInteractiveLearning();
    }
    
    createTutorials() {
        return {
            html_basics: {
                title: 'HTML Basics',
                difficulty: 'beginner',
                steps: [
                    { task: 'Create a heading with <h1>', hint: 'Type: <h1>Hello World</h1>' },
                    { task: 'Add a paragraph with <p>', hint: 'Type: <p>This is my first paragraph</p>' },
                    { task: 'Create a button', hint: 'Type: <button>Click Me</button>' }
                ]
            },
            css_styling: {
                title: 'CSS Styling',
                difficulty: 'beginner',
                steps: [
                    { task: 'Change text color', hint: 'Use: color: blue;' },
                    { task: 'Add background color', hint: 'Use: background-color: lightgray;' },
                    { task: 'Center content', hint: 'Use: text-align: center;' }
                ]
            },
            javascript_intro: {
                title: 'JavaScript Introduction',
                difficulty: 'beginner',
                steps: [
                    { task: 'Show an alert', hint: 'Use: alert("Hello!");' },
                    { task: 'Change text on click', hint: 'Use: element.textContent = "Changed!";' },
                    { task: 'Create a variable', hint: 'Use: let name = "Your Name";' }
                ]
            }
        };
    }
    
    startInteractiveLearning() {
        console.log('🎯 Available tutorials:');
        Object.entries(this.tutorials).forEach(([id, tutorial]) => {
            console.log(`  • ${tutorial.title} (${tutorial.difficulty})`);
        });
        console.log('\nStart with: tutorialAI.start("html_basics")');
    }
    
    start(tutorialId) {
        const tutorial = this.tutorials[tutorialId];
        if (!tutorial) {
            console.log('❌ Tutorial not found');
            return;
        }
        
        this.currentTutorial = tutorialId;
        this.progress = 0;
        
        console.log(`\n📖 Starting: ${tutorial.title}`);
        console.log('━'.repeat(50));
        this.showNextStep();
    }
    
    showNextStep() {
        const tutorial = this.tutorials[this.currentTutorial];
        const step = tutorial.steps[this.progress];
        
        if (!step) {
            this.completeTutorial();
            return;
        }
        
        console.log(`\n✏️  Step ${this.progress + 1}/${tutorial.steps.length}`);
        console.log(`Task: ${step.task}`);
        console.log(`💡 Hint: ${step.hint}`);
        console.log('\nType tutorialAI.next() when done!');
    }
    
    next() {
        this.progress++;
        
        console.log('✅ Great job!');
        this.showNextStep();
    }
    
    completeTutorial() {
        const tutorial = this.tutorials[this.currentTutorial];
        console.log('\n🎉 Tutorial Complete!');
        console.log(`You finished: ${tutorial.title}`);
        console.log('🏆 Keep learning! Try another tutorial.');
    }
}

window.tutorialAI = new TutorialAI();
console.log('📚 Tutorial AI ready to teach!');
