// NUPI Template AI - Generates smart templates based on user needs
// Learns preferences and creates customized code scaffolding

class TemplateAI {
    constructor() {
        this.version = '1.0.0';
        this.userPreferences = {
            favoriteColors: [],
            preferredFrameworks: [],
            commonPatterns: []
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Template AI Activated');
        this.learnPreferences();
    }
    
    learnPreferences() {
        const saved = localStorage.getItem('template_preferences');
        if (saved) {
            this.userPreferences = JSON.parse(saved);
            console.log('📊 Loaded your preferences!');
        }
    }
    
    generate(type, customization = {}) {
        console.log(`🔨 Generating ${type} template...`);
        
        const templates = {
            'landing-page': this.landingPageTemplate(customization),
            'portfolio': this.portfolioTemplate(customization),
            'dashboard': this.dashboardTemplate(customization),
            'form': this.formTemplate(customization),
            'gallery': this.galleryTemplate(customization)
        };
        
        const template = templates[type] || this.genericTemplate();
        
        // Learn from this generation
        this.userPreferences.commonPatterns.push(type);
        this.savePreferences();
        
        return template;
    }
    
    landingPageTemplate(custom) {
        const color = custom.color || this.suggestColor();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${custom.title || 'My Landing Page'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, ${color} 0%, #667eea 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .hero {
            text-align: center;
            max-width: 800px;
            padding: 2rem;
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn {
            padding: 1rem 2rem;
            background: white;
            color: ${color};
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .btn:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="hero">
        <h1>${custom.heading || 'Welcome!'}</h1>
        <p>${custom.tagline || 'This is your awesome landing page'}</p>
        <button class="btn">${custom.cta || 'Get Started'}</button>
    </div>
</body>
</html>`;
    }
    
    portfolioTemplate(custom) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${custom.name || 'My'} Portfolio</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        header { text-align: center; margin-bottom: 3rem; }
        h1 { font-size: 3rem; color: #333; }
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        .project-card {
            background: #f5f5f5;
            padding: 2rem;
            border-radius: 10px;
            transition: transform 0.3s;
        }
        .project-card:hover { transform: translateY(-5px); }
    </style>
</head>
<body>
    <header>
        <h1>${custom.name || 'Your Name'}</h1>
        <p>Full Stack Developer</p>
    </header>
    <div class="projects">
        <div class="project-card">
            <h3>Project 1</h3>
            <p>Description of your amazing project</p>
        </div>
    </div>
</body>
</html>`;
    }
    
    formTemplate(custom) {
        return `<form style="max-width: 500px; margin: 2rem auto; padding: 2rem; background: #f9f9f9; border-radius: 10px;">
    <h2 style="margin-bottom: 1.5rem;">${custom.title || 'Contact Form'}</h2>
    
    <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">Name</label>
        <input type="text" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
    </div>
    
    <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">Email</label>
        <input type="email" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
    </div>
    
    <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">Message</label>
        <textarea style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; min-height: 100px;"></textarea>
    </div>
    
    <button type="submit" style="width: 100%; padding: 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Submit
    </button>
</form>`;
    }
    
    dashboardTemplate(custom) {
        return `<!-- Modern Dashboard Template -->
<div style="display: grid; grid-template-columns: 250px 1fr; min-height: 100vh;">
    <aside style="background: #2c3e50; color: white; padding: 2rem;">
        <h2>Dashboard</h2>
        <nav style="margin-top: 2rem;">
            <a href="#" style="display: block; padding: 1rem; color: white; text-decoration: none;">Home</a>
            <a href="#" style="display: block; padding: 1rem; color: white; text-decoration: none;">Analytics</a>
            <a href="#" style="display: block; padding: 1rem; color: white; text-decoration: none;">Settings</a>
        </nav>
    </aside>
    <main style="padding: 2rem; background: #ecf0f1;">
        <h1>Welcome Back!</h1>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem;">
            <div style="background: white; padding: 2rem; border-radius: 10px;">
                <h3>Stats 1</h3>
                <p style="font-size: 2rem; color: #667eea;">1,234</p>
            </div>
            <div style="background: white; padding: 2rem; border-radius: 10px;">
                <h3>Stats 2</h3>
                <p style="font-size: 2rem; color: #667eea;">567</p>
            </div>
            <div style="background: white; padding: 2rem; border-radius: 10px;">
                <h3>Stats 3</h3>
                <p style="font-size: 2rem; color: #667eea;">890</p>
            </div>
        </div>
    </main>
</div>`;
    }
    
    galleryTemplate(custom) {
        return `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
    <h1 style="text-align: center; margin-bottom: 3rem;">${custom.title || 'Photo Gallery'}</h1>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
        ${Array(6).fill(0).map((_, i) => `
        <div style="aspect-ratio: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
            ${i + 1}
        </div>
        `).join('')}
    </div>
</div>`;
    }
    
    genericTemplate() {
        return '<!-- Your template will appear here -->';
    }
    
    suggestColor() {
        const colors = ['#667eea', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    savePreferences() {
        localStorage.setItem('template_preferences', JSON.stringify(this.userPreferences));
    }
}

window.templateAI = new TemplateAI();
console.log('🎨 Template AI ready! Try: templateAI.generate("landing-page", {title: "My Site"})');
