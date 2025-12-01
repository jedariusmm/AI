// Authentication check for NUPI AI
(function() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['chat.html', 'playground.html', 'ai-dashboard.html', 'custom-ai-order.html', 'my-ai-collection.html'];
    
    if (protectedPages.includes(currentPage)) {
        const userData = JSON.parse(localStorage.getItem('nupiUser') || '{}');
        
        if (!userData.subscriptionActive) {
            // User not subscribed, redirect to signup
            window.location.href = 'signup.html';
        }
    }
})();
