class NeoCalculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.calculator = document.querySelector('.calculator-glass');
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.particlesContainer = document.getElementById('particles');
        
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.isDarkTheme = true;
        
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.setupAnimations();
    }
    
    init() {
        this.updateDisplay();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError("Cannot divide by zero");
                    return;
                }
                computation = prev / current;
                break;
            case 'percent':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // Format the result to avoid extremely long numbers
        this.currentOperand = computation.toString();
        if (this.currentOperand.length > 12) {
            this.currentOperand = parseFloat(this.currentOperand).toExponential(5);
        }
        
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        
        // Add visual feedback on calculation
        this.calculator.style.animation = 'none';
        setTimeout(() => {
            this.calculator.style.animation = 'glow 0.5s ease';
        }, 10);
    }
    
    getDisplayNumber(number) {
        if (number === '' || number === undefined) return '0';
        
        const stringNumber = number.toString();
        
        // Handle exponential notation
        if (stringNumber.includes('e')) {
            return stringNumber;
        }
        
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            let operator;
            switch (this.operation) {
                case 'add': operator = '+'; break;
                case 'subtract': operator = '−'; break;
                case 'multiply': operator = '×'; break;
                case 'divide': operator = '÷'; break;
                case 'percent': operator = '%'; break;
            }
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operator}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
        
        // Add animation to display change
        this.currentOperandElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.currentOperandElement.style.transform = 'scale(1)';
        }, 100);
    }
    
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 100;
            animation: fadeInOut 3s forwards;
        `;
        
        document.querySelector('.calculator-container').appendChild(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
    
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('light-theme', !this.isDarkTheme);
        
        if (this.isDarkTheme) {
            this.themeIcon.className = 'fas fa-moon';
        } else {
            this.themeIcon.className = 'fas fa-sun';
        }
        
        // Save theme preference to localStorage
        localStorage.setItem('calculator-theme', this.isDarkTheme ? 'dark' : 'light');
    }
    
    createParticles() {
        const particlesCount = 30;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: var(--accent-gradient);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
                animation-delay: -${Math.random() * 10}s;
            `;
            
            this.particlesContainer.appendChild(particle);
        }
    }
    
    setupAnimations() {
        // Add animation to calculator on load
        this.calculator.style.opacity = '0';
        this.calculator.style.transform = 'translateY(30px) rotateX(-15deg)';
        
        setTimeout(() => {
            this.calculator.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            this.calculator.style.opacity = '1';
            this.calculator.style.transform = 'translateY(0) rotateX(0)';
        }, 100);
        
        // Add hover effect to buttons
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
    
    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('.calc-btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-value'));
                this.updateDisplay();
            });
        });
        
        // Operation buttons
        document.querySelectorAll('.calc-btn.operation').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                if (action === 'calculate') {
                    this.compute();
                } else {
                    this.chooseOperation(action);
                }
                
                this.updateDisplay();
            });
        });
        
        // Function buttons
        document.querySelectorAll('.calc-btn.function').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'backspace':
                        this.delete();
                        break;
                    case 'percent':
                        this.chooseOperation('percent');
                        this.compute();
                        break;
                }
                
                this.updateDisplay();
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (/[0-9]/.test(event.key)) {
                this.appendNumber(event.key);
            } else if (event.key === '.') {
                this.appendNumber('.');
            } else if (event.key === '+' || event.key === '-') {
                this.chooseOperation(event.key === '+' ? 'add' : 'subtract');
            } else if (event.key === '*') {
                this.chooseOperation('multiply');
            } else if (event.key === '/') {
                event.preventDefault();
                this.chooseOperation('divide');
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.compute();
            } else if (event.key === 'Backspace') {
                this.delete();
            } else if (event.key === 'Escape') {
                this.clear();
            } else if (event.key === '%') {
                this.chooseOperation('percent');
                this.compute();
            }
            
            this.updateDisplay();
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('calculator-theme');
        if (savedTheme === 'light') {
            this.isDarkTheme = false;
            document.body.classList.add('light-theme');
            this.themeIcon.className = 'fas fa-sun';
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -10px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
        }
        
        .calc-btn span {
            position: relative;
            z-index: 2;
        }
        
        .error-message {
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Create the calculator
    new NeoCalculator();
});