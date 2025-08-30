class BriggXLandingPage {
    constructor() {
        this.isSubmitting = false;
        this.headlineText = "Smarter roads are ahead. Let's get there together.";
        this.init();
    }

    init() {
        this.bindEvents();
        this.animateOnLoad();
        this.typeHeadline();
        this.setupTouchOptimizations();
    }

    setupTouchOptimizations() {
        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
            });
        });

        // Add haptic feedback for supported devices
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn && 'vibrate' in navigator) {
            submitBtn.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        }
    }

    typeHeadline() {
        const headlineElement = document.getElementById('main-headline');
        if (!headlineElement) return;

        let charIndex = 0;
        headlineElement.innerHTML = "";

        const type = () => {
            if (charIndex < this.headlineText.length) {
                headlineElement.innerHTML += this.headlineText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 60);
            } else {
                headlineElement.classList.remove('typing-text');
            }
        };
        setTimeout(type, 800);
    }

    bindEvents() {
        const form = document.getElementById('waitlist-form');
        const emailInput = document.getElementById('email-input');
        if (form) form.addEventListener('submit', this.handleFormSubmission.bind(this));
        if (emailInput) {
            emailInput.addEventListener('input', this.validateEmail.bind(this));
            emailInput.addEventListener('blur', this.validateEmail.bind(this));
        }
    }

    async handleFormSubmission(event) {
        event.preventDefault();
        if (this.isSubmitting) return;

        const email = document.getElementById('email-input').value.trim();
        if (!this.isValidEmail(email)) {
            this.showEmailError('Please enter a valid email address');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);

        try {
            await this.simulateApiCall(email);
            this.showSuccessMessage();
        } catch (error) {
            this.showEmailError('Something went wrong. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    async simulateApiCall(email) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() > 0.1) return { success: true };
        throw new Error('Simulated API error');
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateEmail(event) {
        const email = event.target.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showEmailError('Please enter a valid email address');
        } else {
            this.hideEmailError();
        }
    }

    showEmailError(message) {
        const errorElement = document.getElementById('email-error');
        const emailInput = document.getElementById('email-input');
        if (errorElement) errorElement.textContent = message;
        if (emailInput) {
            emailInput.classList.add('border-red-400', 'bg-red-50');
            emailInput.classList.remove('border-gray-200');
        }
    }

    hideEmailError() {
        const errorElement = document.getElementById('email-error');
        const emailInput = document.getElementById('email-input');
        if (errorElement) errorElement.textContent = '';
        if (emailInput) {
            emailInput.classList.remove('border-red-400', 'bg-red-50');
            emailInput.classList.add('border-gray-200');
        }
    }

    setSubmitButtonLoading(isLoading) {
        const btnText = document.getElementById('btn-text');
        const btnSpinner = document.getElementById('btn-spinner');
        const submitBtn = document.getElementById('submit-btn');
        if (isLoading) {
            btnText.textContent = 'Joining...';
            btnSpinner.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            btnText.textContent = 'Get Early Access';
            btnSpinner.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    showSuccessMessage() {
        const waitlistSection = document.getElementById('waitlist-section');
        const thankYouMessage = document.getElementById('thank-you-message');
        if (waitlistSection) waitlistSection.classList.add('hidden');
        if (thankYouMessage) {
            thankYouMessage.classList.remove('hidden');

            setTimeout(() => {
                const messageBox = thankYouMessage.firstElementChild;
                if (messageBox) {
                    messageBox.classList.remove('scale-95', 'opacity-0');
                }
                this.createMobileConfetti();
            }, 50);

            this.animateCounterUp();
        }
    }

    createMobileConfetti() {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        const successBox = document.getElementById('thank-you-message');
        if (!successBox) return;

        const rect = successBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const confettiCount = window.innerWidth < 640 ? 40 : 60;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 30 + Math.random() * 100;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;

            confetti.style.setProperty('--dx', `${dx}px`);
            confetti.style.setProperty('--dy', `${dy}px`);

            confetti.style.left = `${centerX}px`;
            confetti.style.top = `${centerY}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 1500);
        }
    }

    animateCounterUp() {
        const counterElement = document.getElementById('subscriber-count');
        if (!counterElement) return;

        const targetCount = parseInt(counterElement.textContent.replace(',', '')) + 1;
        let currentCount = targetCount - 10;

        const update = () => {
            if (currentCount < targetCount) {
                currentCount = Math.min(currentCount + 1, targetCount);
                counterElement.textContent = currentCount.toLocaleString();
                requestAnimationFrame(update);
            }
        };
        update();
    }

    animateOnLoad() {
        const subHeadline = document.getElementById('sub-headline');
        const waitlistSection = document.getElementById('waitlist-section');

        setTimeout(() => {
            if (subHeadline) {
                subHeadline.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                subHeadline.classList.remove('opacity-0', 'translate-y-4');
            }
        }, 500);

        setTimeout(() => {
            if (waitlistSection) {
                waitlistSection.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                waitlistSection.classList.remove('opacity-0', 'translate-y-8');
            }
        }, 800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BriggXLandingPage();
});