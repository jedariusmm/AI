// AI Playground Interactive Features

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputSection = document.getElementById('outputSection');
const emptyState = document.getElementById('emptyState');
const outputContent = document.getElementById('outputContent');
const codeOutput = document.getElementById('codeOutput');

// Template items
const templateItems = document.querySelectorAll('.template-item');
const exampleCards = document.querySelectorAll('.example-card');

// Load template on click
templateItems.forEach(item => {
    item.addEventListener('click', () => {
        const prompt = item.dataset.prompt;
        promptInput.value = prompt;
        
        // Visual feedback
        templateItems.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        
        // Auto-scroll to input
        promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        promptInput.focus();
    });
});

// Load example on click
exampleCards.forEach(card => {
    card.addEventListener('click', () => {
        const prompt = card.dataset.prompt;
        promptInput.value = prompt;
        
        // Auto-scroll to input
        promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        promptInput.focus();
        
        // Auto-generate
        setTimeout(() => generateBtn.click(), 500);
    });
});

// Generate code
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt or select a template');
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="loading-spinner"></div> Generating...';
    
    emptyState.style.display = 'none';
    outputContent.style.display = 'block';
    codeOutput.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>AI is creating your code...</div></div>';
    
    // Simulate AI generation (replace with actual API call)
    await simulateGeneration(prompt);
    
    // Reset button
    generateBtn.disabled = false;
    generateBtn.innerHTML = `
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-width="2" d="M10 2v16m8-8H2"/>
        </svg>
        Generate Code
    `;
});

// Simulate AI code generation
async function simulateGeneration(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const generatedCode = generateCodeFromPrompt(prompt);
            codeOutput.textContent = generatedCode;
            resolve();
        }, 2000);
    });
}

// Generate code based on prompt
function generateCodeFromPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Landing page
    if (lowerPrompt.includes('landing page')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            padding: 2rem;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            font-weight: 800;
        }
        
        .hero p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .cta-button {
            padding: 1rem 3rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
        }
        
        .features {
            padding: 6rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 15px;
            text-align: center;
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .feature-card h3 {
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>Welcome to the Future</h1>
            <p>The best solution for your business needs</p>
            <button class="cta-button">Get Started Now</button>
        </div>
    </section>
    
    <section class="features">
        <h2>Amazing Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance for the best user experience</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>Secure</h3>
                <p>Enterprise-grade security to protect your data</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💎</div>
                <h3>Premium Quality</h3>
                <p>Built with the latest technologies and best practices</p>
            </div>
        </div>
    </section>
</body>
</html>`;
    }
    
    // Navbar
    if (lowerPrompt.includes('navbar') || lowerPrompt.includes('navigation')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Navbar</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        nav {
            background: #2c3e50;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        .logo {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #3498db;
        }
        
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
        }
        
        .hamburger span {
            width: 25px;
            height: 3px;
            background: white;
            margin: 3px 0;
            transition: 0.3s;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #2c3e50;
                flex-direction: column;
                padding: 2rem;
                display: none;
            }
            
            .nav-links.active {
                display: flex;
            }
            
            .hamburger {
                display: flex;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="logo">YourLogo</div>
        <ul class="nav-links" id="navLinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <div class="hamburger" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>
    
    <script>
        function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('active');
        }
    </script>
</body>
</html>`;
    }
    
    // Pricing table
    if (lowerPrompt.includes('pricing')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pricing Table</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 4rem 2rem;
            background: #f5f7fa;
        }
        
        .pricing-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 3rem;
        }
        
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .pricing-card {
            background: white;
            border-radius: 20px;
            padding: 3rem 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .pricing-card:hover {
            transform: translateY(-10px);
        }
        
        .pricing-card.featured {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: scale(1.05);
        }
        
        .plan-name {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .price {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 2rem;
        }
        
        .price span {
            font-size: 1.5rem;
            font-weight: 400;
        }
        
        .features {
            list-style: none;
            margin-bottom: 2rem;
        }
        
        .features li {
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .pricing-card.featured .features li {
            border-bottom-color: rgba(255,255,255,0.2);
        }
        
        .cta-button {
            padding: 1rem 3rem;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .pricing-card:not(.featured) .cta-button {
            background: #667eea;
            color: white;
        }
        
        .pricing-card.featured .cta-button {
            background: white;
            color: #667eea;
        }
        
        .cta-button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="pricing-container">
        <h1>Choose Your Plan</h1>
        <div class="pricing-grid">
            <div class="pricing-card">
                <div class="plan-name">Starter</div>
                <div class="price">$9<span>/mo</span></div>
                <ul class="features">
                    <li>✓ 10 Projects</li>
                    <li>✓ 5GB Storage</li>
                    <li>✓ Email Support</li>
                    <li>✓ Basic Analytics</li>
                </ul>
                <button class="cta-button">Get Started</button>
            </div>
            
            <div class="pricing-card featured">
                <div class="plan-name">Pro</div>
                <div class="price">$29<span>/mo</span></div>
                <ul class="features">
                    <li>✓ Unlimited Projects</li>
                    <li>✓ 50GB Storage</li>
                    <li>✓ Priority Support</li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ Team Collaboration</li>
                </ul>
                <button class="cta-button">Get Started</button>
            </div>
            
            <div class="pricing-card">
                <div class="plan-name">Enterprise</div>
                <div class="price">$99<span>/mo</span></div>
                <ul class="features">
                    <li>✓ Everything in Pro</li>
                    <li>✓ 500GB Storage</li>
                    <li>✓ 24/7 Phone Support</li>
                    <li>✓ Custom Integrations</li>
                    <li>✓ Dedicated Manager</li>
                </ul>
                <button class="cta-button">Contact Sales</button>
            </div>
        </div>
    </div>
</body>
</html>`;
    }
    
    // Default generic response
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .container {
            max-width: 800px;
            text-align: center;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 2rem;
        }
        
        p {
            font-size: 1.3rem;
            line-height: 1.8;
            opacity: 0.9;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Custom Creation</h1>
        <p>Based on your prompt: "${prompt}"</p>
        <div class="card">
            <p>This is a starter template. Download NUPI to get AI-powered code generation with complete HTML, CSS, and JavaScript!</p>
        </div>
    </div>
</body>
</html>`;
}

// Copy code to clipboard
copyBtn.addEventListener('click', () => {
    const code = codeOutput.textContent;
    navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Code';
        }, 2000);
    });
});

// Download code as HTML file
downloadBtn.addEventListener('click', () => {
    const code = codeOutput.textContent;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.html';
    a.click();
    URL.revokeObjectURL(url);
});

// Clear input
clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    emptyState.style.display = 'block';
    outputContent.style.display = 'none';
    templateItems.forEach(t => t.classList.remove('active'));
});
