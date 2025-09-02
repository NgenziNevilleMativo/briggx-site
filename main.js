class BriggXLandingPage {
    constructor() {
        this.headlineText = "Smarter roads are ahead. Let's get there together.";
        this.waitloApiKey = 'JVdlqKtFtXcwyr0FPstd0WCfPRwTQu3sApIwCSA0ZXfkyKKKSTk2dyFQFiVWu07q';
        this.waitloEndpoint = 'https://api.waitlo.com/api/waitlist/subscribe';
        this.subscriberCountKey = 'briggx_subscriber_count';
        this.subscribedEmailsKey = 'briggx_subscribed_emails';
        this.init();
    }

    init() {
        this.animateOnLoad();
        this.typeHeadline();
        this.setupWaitlistForm();
        this.initializeSubscriberCount();
        this.checkIfAlreadySubscribed();
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

    animateOnLoad() {
        const subHeadline = document.getElementById('sub-headline');
        const waitlistSection = document.getElementById('waitlist-section');
        const mobileIllustration = document.getElementById('mobile-illustration');
        const desktopIllustration = document.getElementById('desktop-illustration');

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
            if (mobileIllustration) {
                mobileIllustration.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                mobileIllustration.classList.remove('opacity-0', 'translate-y-8');
            }
            if (desktopIllustration) {
                desktopIllustration.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                desktopIllustration.classList.remove('opacity-0', 'translate-x-8');
            }
        }, 800);
    }

    setupWaitlistForm() {
        const form = document.getElementById('waitlist-form');
        const emailInput = document.getElementById('email-input');
        const submitButton = document.getElementById('submit-button');
        const buttonText = document.getElementById('button-text');
        const buttonSpinner = document.getElementById('button-spinner');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!email || !this.isValidEmail(email)) {
                this.showError('Please enter a valid email address');
                return;
            }

            // Check if email is already subscribed
            if (this.isEmailSubscribed(email)) {
                this.showAlreadyRegisteredMessage(email);
                return;
            }

            // Show loading state
            this.setLoadingState(true, submitButton, buttonText, buttonSpinner);

            try {
                await this.submitToWaitlo(email);
                this.addEmailToSubscribed(email);
                this.incrementSubscriberCount();
                this.showSuccessMessage(email); // Pass email to showSuccessMessage
                this.createConfetti();
            } catch (error) {
                console.error('Waitlist submission error:', error);
                
                if (error.message.includes('already exists') || error.message.includes('duplicate') || error.message.includes('400')) {
                    this.showAlreadyRegisteredMessage(email);
                } else {
                    this.showError('Something went wrong. Please try again.');
                }
                this.setLoadingState(false, submitButton, buttonText, buttonSpinner);
            }
        });
    }

    async submitToWaitlo(email) {
        const response = await fetch(`${this.waitloEndpoint}?api_key=${this.waitloApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(loading, button, buttonText, spinner) {
        if (loading) {
            button.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    showSuccessMessage(email) {
        const waitlistSection = document.getElementById('waitlist-section');
        const thankYouMessage = document.getElementById('thank-you-message');
        
        if (waitlistSection && thankYouMessage) {
            waitlistSection.classList.add('hidden');
            thankYouMessage.classList.remove('hidden');

            // Get the user's position
            const userPosition = this.getUserPosition(email.toLowerCase());

            // Update message with personalized number
            thankYouMessage.querySelector('.text-center').innerHTML = `
                <div class="text-3xl">🎉</div>
                <h2 class="text-xl font-bold text-green-900">You're on the list!</h2>
                <p class="text-green-700">We'll email you as soon as the app is ready. Welcome to the community!</p>
                <div class="text-sm text-green-600 pt-2 border-t border-green-200">
                    You are subscriber <span class="font-bold">#${userPosition || 'N/A'}</span>
                </div>
            `;
            
            // Add the bounce animation
            thankYouMessage.querySelector('.bg-green-50').classList.add('success-bounce');
        }
    }

    showError(message) {
        const form = document.getElementById('waitlist-form');
        const existingError = form.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-600 text-sm text-center mt-2';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    createConfetti() {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = '50%';
                confetti.style.top = '50%';
                confetti.style.setProperty('--dx', `${(Math.random() - 0.5) * 400}px`);
                confetti.style.setProperty('--dy', `${(Math.random() - 0.5) * 400}px`);
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 1500);
            }, i * 20);
        }
    }

    initializeSubscriberCount() {
        if (!this.getSubscriberCount()) {
            this.setSubscriberCount(1);
        }
        this.updateSubscriberCountDisplay();
    }

    getSubscriberCount() {
        if (!window.briggxSubscriberCount) {
            window.briggxSubscriberCount = 1;
        }
        return window.briggxSubscriberCount;
    }

    setSubscriberCount(count) {
        window.briggxSubscriberCount = count;
    }

    incrementSubscriberCount() {
        const currentCount = this.getSubscriberCount();
        this.setSubscriberCount(currentCount + 1);
    }

    updateSubscriberCountDisplay() {
        const subscriberCountElement = document.getElementById('subscriber-count');
        if (subscriberCountElement) {
            subscriberCountElement.textContent = this.getSubscriberCount().toLocaleString();
        }
    }

    getSubscribedEmails() {
        if (!window.briggxSubscribedEmails) {
            window.briggxSubscribedEmails = new Set();
        }
        return window.briggxSubscribedEmails;
    }

    isEmailSubscribed(email) {
        return this.getSubscribedEmails().has(email.toLowerCase());
    }

    addEmailToSubscribed(email) {
        const subscribedEmails = this.getSubscribedEmails();
        if (!subscribedEmails.has(email.toLowerCase())) {
            subscribedEmails.add(email.toLowerCase());
            this.setUserPosition(email.toLowerCase(), this.getSubscriberCount());
        }
    }

    getUserPosition(email) {
        if (!window.briggxUserPositions) {
            window.briggxUserPositions = new Map();
        }
        return window.briggxUserPositions.get(email.toLowerCase());
    }

    setUserPosition(email, position) {
        if (!window.briggxUserPositions) {
            window.briggxUserPositions = new Map();
        }
        window.briggxUserPositions.set(email.toLowerCase(), position);
    }

    showAlreadyRegisteredMessage(email) {
        const waitlistSection = document.getElementById('waitlist-section');
        const thankYouMessage = document.getElementById('thank-you-message');
        
        if (waitlistSection && thankYouMessage) {
            const messageContainer = thankYouMessage.querySelector('.text-center');
            const userPosition = this.getUserPosition(email.toLowerCase());
            
            messageContainer.innerHTML = `
                <div class="text-3xl">🎉</div>
                <h2 class="text-xl font-bold text-green-900">You're already on the list!</h2>
                <p class="text-green-700">We'll email you as soon as the app is ready. Welcome to the community!</p>
                <div class="text-sm text-green-600 pt-2 border-t border-green-200">
                    You are subscriber <span class="font-bold">#${userPosition || 'N/A'}</span>
                </div>
            `;
            
            waitlistSection.classList.add('hidden');
            thankYouMessage.classList.remove('hidden');
            thankYouMessage.querySelector('.bg-green-50').classList.add('success-bounce');
        }
    }

    checkIfAlreadySubscribed() {
        const form = document.getElementById('waitlist-form');
        const thankYouMessage = document.getElementById('thank-you-message');
        this.updateSubscriberCountDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BriggXLandingPage();
});