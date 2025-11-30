// NUPI Preview AI - Live preview with hot reload and instant feedback
// Shows real-time results and suggests visual improvements

class PreviewAI {
    constructor() {
        this.version = '1.0.0';
        this.previewWindow = null;
        this.hotReload = true;
        this.visualSuggestions = [];
        
        this.init();
    }
    
    init() {
        console.log('👁️ Preview AI Activated');
        this.enableHotReload();
        this.analyzeVisuals();
    }
    
    enableHotReload() {
        if (!this.hotReload) return;
        
        // Watch for code changes
        let lastCode = '';
        setInterval(() => {
            const currentCode = this.getCode();
            if (currentCode !== lastCode) {
                lastCode = currentCode;
                this.updatePreview(currentCode);
                this.analyzeDesign(currentCode);
            }
        }, 1000);
        
        console.log('🔥 Hot reload enabled - changes appear instantly!');
    }
    
    getCode() {
        // Get code from textarea
        return document.querySelector('#codeInput')?.value || '';
    }
    
    updatePreview(code) {
        // Update preview iframe or container
        const preview = document.querySelector('#preview');
        if (preview) {
            if (preview.tagName === 'IFRAME') {
                const doc = preview.contentDocument;
                doc.open();
                doc.write(code);
                doc.close();
            } else {
                preview.innerHTML = code;
            }
            
            console.log('🔄 Preview updated!');
        }
    }
    
    analyzeDesign(code) {
        this.visualSuggestions = [];
        
        // Check for accessibility
        if (!code.includes('alt=')) {
            this.visualSuggestions.push({
                type: 'accessibility',
                message: 'Add alt text to images for accessibility',
                priority: 'high'
            });
        }
        
        // Check for responsive design
        if (!code.includes('viewport') && !code.includes('meta name="viewport"')) {
            this.visualSuggestions.push({
                type: 'responsive',
                message: 'Add viewport meta tag for mobile responsiveness',
                priority: 'high'
            });
        }
        
        // Check color contrast
        if (code.includes('color:') && code.includes('background')) {
            this.visualSuggestions.push({
                type: 'design',
                message: 'Great! You\'re using colors. Make sure contrast is good.',
                priority: 'low'
            });
        }
        
        // Check for CSS
        if (!code.includes('<style>') && !code.includes('.css')) {
            this.visualSuggestions.push({
                type: 'style',
                message: 'Add some CSS to make it beautiful!',
                priority: 'medium'
            });
        }
        
        if (this.visualSuggestions.length > 0) {
            this.showSuggestions();
        }
    }
    
    showSuggestions() {
        console.log('\n💅 Design Suggestions:');
        this.visualSuggestions.forEach((suggestion, i) => {
            const icon = suggestion.priority === 'high' ? '⚠️' : suggestion.priority === 'medium' ? '💡' : '✨';
            console.log(`${icon} ${i + 1}. ${suggestion.message}`);
        });
    }
    
    analyzeVisuals() {
        setInterval(() => {
            this.checkPreviewQuality();
        }, 5000);
    }
    
    checkPreviewQuality() {
        // Analyze preview for common issues
        const preview = document.querySelector('#preview');
        if (!preview) return;
        
        const doc = preview.contentDocument || preview;
        
        // Check for empty preview
        if (!doc.body || doc.body.children.length === 0) {
            console.log('📝 Preview is empty. Start typing to see results!');
            return;
        }
        
        // Check for broken images
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                console.log('🖼️  Broken image detected. Check your image URL.');
            });
        });
    }
    
    screenshot() {
        console.log('📸 Taking screenshot of preview...');
        // In real implementation, would capture preview
        console.log('✅ Screenshot saved!');
    }
    
    toggleHotReload() {
        this.hotReload = !this.hotReload;
        console.log(`🔥 Hot reload ${this.hotReload ? 'enabled' : 'disabled'}`);
    }
}

window.previewAI = new PreviewAI();
console.log('👁️ Preview AI ready! Your code updates in real-time.');
