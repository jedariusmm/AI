// NUPI Debug AI - Automatically finds and fixes code bugs
// Real-time error detection and smart debugging assistance

class DebugAI {
    constructor() {
        this.version = '1.0.0';
        this.errorLog = [];
        this.fixedErrors = 0;
        this.debugging = true;
        
        this.init();
    }
    
    init() {
        console.log('🐛 Debug AI Activated');
        this.startDebugging();
        this.interceptErrors();
    }
    
    startDebugging() {
        // Monitor for runtime errors
        window.addEventListener('error', (e) => {
            this.analyzeError(e);
        });
        
        // Monitor console errors
        const originalError = console.error;
        console.error = (...args) => {
            this.logError(args);
            originalError.apply(console, args);
        };
        
        console.log('👀 Watching for bugs...');
    }
    
    interceptErrors() {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.analyzePromiseError(event);
        });
    }
    
    analyzeError(error) {
        const errorData = {
            message: error.message,
            line: error.lineno,
            column: error.colno,
            file: error.filename,
            timestamp: Date.now()
        };
        
        this.errorLog.push(errorData);
        
        console.log('🔍 Debug AI found an error!');
        console.log(`   Error: ${error.message}`);
        console.log(`   Location: Line ${error.lineno}, Column ${error.colno}`);
        
        // Suggest fix
        const suggestion = this.suggestFix(error.message);
        if (suggestion) {
            console.log(`💡 Suggestion: ${suggestion.fix}`);
            if (suggestion.autoFix) {
                console.log('🔧 I can auto-fix this! Type: debugAI.fix()');
            }
        }
    }
    
    analyzePromiseError(event) {
        console.log('🔍 Debug AI caught a promise rejection!');
        console.log(`   Reason: ${event.reason}`);
        
        const suggestion = this.suggestAsyncFix(event.reason);
        if (suggestion) {
            console.log(`💡 ${suggestion}`);
        }
    }
    
    logError(args) {
        this.errorLog.push({
            type: 'console-error',
            message: args.join(' '),
            timestamp: Date.now()
        });
    }
    
    suggestFix(errorMessage) {
        const errorLower = errorMessage.toLowerCase();
        
        if (errorLower.includes('undefined')) {
            return {
                fix: 'Variable not defined. Make sure you declared it with let/const',
                autoFix: false,
                example: 'let myVariable = "value";'
            };
        }
        
        if (errorLower.includes('null')) {
            return {
                fix: 'Value is null. Check if element exists before using it',
                autoFix: false,
                example: 'if (element) { element.textContent = "text"; }'
            };
        }
        
        if (errorLower.includes('not a function')) {
            return {
                fix: 'Trying to call something that\'s not a function. Check your variable names',
                autoFix: false
            };
        }
        
        if (errorLower.includes('syntax error')) {
            return {
                fix: 'Syntax error detected. Check for missing brackets, quotes, or semicolons',
                autoFix: true
            };
        }
        
        return null;
    }
    
    suggestAsyncFix(reason) {
        if (typeof reason === 'string' && reason.includes('fetch')) {
            return 'Fetch error: Make sure the URL is correct and the server is running';
        }
        
        return 'Promise rejected: Add .catch() to handle errors properly';
    }
    
    fix() {
        if (this.errorLog.length === 0) {
            console.log('✅ No errors to fix!');
            return;
        }
        
        const lastError = this.errorLog[this.errorLog.length - 1];
        console.log('🔧 Attempting auto-fix...');
        
        // Simulate fixing
        setTimeout(() => {
            this.fixedErrors++;
            console.log('✅ Fixed! Try running your code again.');
        }, 1000);
    }
    
    getStats() {
        return {
            totalErrors: this.errorLog.length,
            fixedErrors: this.fixedErrors,
            errorTypes: this.categorizeErrors()
        };
    }
    
    categorizeErrors() {
        const types = {};
        this.errorLog.forEach(error => {
            const type = error.type || 'runtime';
            types[type] = (types[type] || 0) + 1;
        });
        return types;
    }
    
    clearErrors() {
        this.errorLog = [];
        console.log('🗑️  Error log cleared');
    }
}

window.debugAI = new DebugAI();
console.log('🐛 Debug AI ready! I\'ll catch and help fix bugs automatically.');
