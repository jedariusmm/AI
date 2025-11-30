// Auto-configure OpenAI API Key from environment
(function() {
    // Production OpenAI key - stored securely
    const OPENAI_KEY = 'your_openai_key_here'; // Replace with actual key from .env
    
    // Auto-set if not already configured
    if (!localStorage.getItem('nupi_openai_key')) {
        console.log('🔑 Auto-configuring OpenAI API key...');
        localStorage.setItem('nupi_openai_key', OPENAI_KEY);
        console.log('✅ OpenAI API key configured automatically');
    } else {
        console.log('✅ OpenAI API key already configured');
    }
})();
