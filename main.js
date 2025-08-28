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
                setTimeout(type, 50);
            } else {
                headlineElement.classList.remove('typing-text');
            }
        };
        setTimeout(type, 500);
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
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() > 0.1) return { success: true }; // Simulate a successful response
        throw new Error('Simulated API error'); // Simulate a failure
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
        if (emailInput) emailInput.classList.add('border-red-500');
    }

    hideEmailError() {
        const errorElement = document.getElementById('email-error');
        const emailInput = document.getElementById('email-input');
        if (errorElement) errorElement.textContent = '';
        if (emailInput) emailInput.classList.remove('border-red-500');
    }

    setSubmitButtonLoading(isLoading) {
        const btnText = document.getElementById('btn-text');
        const btnSpinner = document.getElementById('btn-spinner');
        const submitBtn = document.getElementById('submit-btn');
        if (isLoading) {
            btnText.textContent = 'Joining...';
            btnSpinner.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            btnText.textContent = 'Get Early Access';
            btnSpinner.classList.add('hidden');
            submitBtn.disabled = false;
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
                this.createConfetti();
            }, 50);

            this.animateCounterUp();
        }
    }

    createConfetti() {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];
        const successBox = document.getElementById('thank-you-message');
        if (!successBox) return;

        const rect = successBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 200;
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
            }, 2000);
        }
    }

    animateCounterUp() {
        const counterElement = document.getElementById('subscriber-count');
        if (!counterElement) return;

        const targetCount = parseInt(counterElement.textContent.replace(',', '')) + 1;
        let currentCount = targetCount - 20;

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
                subHeadline.style.transition = 'opacity 0.5s, transform 0.5s';
                subHeadline.classList.remove('opacity-0', 'translate-y-4');
            }
        }, 300);
        setTimeout(() => {
            if (waitlistSection) {
                waitlistSection.style.transition = 'opacity 0.5s, transform 0.5s';
                waitlistSection.classList.remove('opacity-0', 'translate-y-8');
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BriggXLandingPage();
});