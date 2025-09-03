class BriggXLandingPage {
    constructor() {
        this.headlineText = "Smarter roads are ahead. Let's get there together.";
        this.waitloApiKey = '7yShFe8mIXTGhGfg1LxzxDRBE803T5ybfKSpzoLup2ptQassJy4wQPp5VIudn0vj';
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
                
                // Get the CURRENT total count, then assign the NEXT position to new user
                const currentCount = this.getTotalSubscriberCount();
                const newPosition = currentCount + 1;
                
                // Add email to subscribed list with their position
                this.addEmailToSubscribed(email, newPosition);
                
                // Increment the total count
                this.setTotalSubscriberCount(newPosition);
                
                this.showSuccessMessage(email, newPosition);
                this.createConfetti();
            } catch (error) {
                console.error('Waitlist submission error:', error);
                
                if (error.message.includes('already exists') || error.message.includes('duplicate') || error.message.includes('400')) {
                    // Handle case where email already exists in Waitlo but not in our local tracking
                    this.handleExistingEmail(email);
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

    showSuccessMessage(email, position) {
        const waitlistSection = document.getElementById('waitlist-section');
        const thankYouMessage = document.getElementById('thank-you-message');
        
        if (waitlistSection && thankYouMessage) {
            waitlistSection.classList.add('hidden');
            thankYouMessage.classList.remove('hidden');

            // Update message with correct position
            thankYouMessage.querySelector('.text-center').innerHTML = `
                <div class="text-3xl">🎉</div>
                <h2 class="text-xl font-bold text-green-900">You're on the list!</h2>
                <p class="text-green-700">We'll email you as soon as the app is ready. Welcome to the community!</p>
                <div class="text-sm text-green-600 pt-2 border-t border-green-200">
                    You are subscriber <span class="font-bold">#${position}</span>
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
        // Initialize with known subscribers and their positions
        const knownSubscribers = {
            'mativongenzi97@gmail.com': 1,
            'muemaian253@gmail.com': 2, 
            'imativo95@gmail.com': 3
        };

        // Initialize the subscriber data if not already done
        if (!window.briggxInitialized) {
            window.briggxSubscribedEmails = new Map();
            window.briggxTotalCount = 0;
            
            // Add known subscribers
            Object.entries(knownSubscribers).forEach(([email, position]) => {
                window.briggxSubscribedEmails.set(email.toLowerCase(), position);
                if (position > window.briggxTotalCount) {
                    window.briggxTotalCount = position;
                }
            });
            
            window.briggxInitialized = true;
        }
    }

    getTotalSubscriberCount() {
        if (typeof window.briggxTotalCount === 'undefined') {
            window.briggxTotalCount = 0;
        }
        return window.briggxTotalCount;
    }

    setTotalSubscriberCount(count) {
        window.briggxTotalCount = count;
    }

    getSubscribedEmails() {
        if (!window.briggxSubscribedEmails) {
            window.briggxSubscribedEmails = new Map();
        }
        return window.briggxSubscribedEmails;
    }

    isEmailSubscribed(email) {
        return this.getSubscribedEmails().has(email.toLowerCase());
    }

    addEmailToSubscribed(email, position) {
        const subscribedEmails = this.getSubscribedEmails();
        subscribedEmails.set(email.toLowerCase(), position);
    }

    getUserPosition(email) {
        const subscribedEmails = this.getSubscribedEmails();
        return subscribedEmails.get(email.toLowerCase());
    }

    handleExistingEmail(email) {
        // If email exists in Waitlo but not in our tracking, add it with appropriate position
        const subscribedEmails = this.getSubscribedEmails();
        let position = subscribedEmails.get(email.toLowerCase());
        
        if (!position) {
            // Assign based on known positions or next available
            const knownPositions = {
                'mativongenzi97@gmail.com': 1,
                'muemaian253@gmail.com': 2, 
                'imativo95@gmail.com': 3
            };
            
            position = knownPositions[email.toLowerCase()];
            
            if (position) {
                subscribedEmails.set(email.toLowerCase(), position);
                // Update total count if this position is higher
                if (position > this.getTotalSubscriberCount()) {
                    this.setTotalSubscriberCount(position);
                }
            } else {
                // For unknown emails, assign next position
                position = this.getTotalSubscriberCount() + 1;
                subscribedEmails.set(email.toLowerCase(), position);
                this.setTotalSubscriberCount(position);
            }
        }
        
        this.showAlreadyRegisteredMessage(email);
    }

    showAlreadyRegisteredMessage(email) {
        const waitlistSection = document.getElementById('waitlist-section');
        const thankYouMessage = document.getElementById('thank-you-message');
        
        if (waitlistSection && thankYouMessage) {
            const userPosition = this.getUserPosition(email.toLowerCase());
            
            const messageContainer = thankYouMessage.querySelector('.text-center');
            messageContainer.innerHTML = `
                <div class="text-3xl">✅</div>
                <h2 class="text-xl font-bold text-blue-900">Already registered!</h2>
                <p class="text-blue-700">Good news - you're already secured a spot on our waitlist. No need to register again!</p>
                <div class="text-sm text-blue-600 pt-2 border-t border-blue-200">
                    Your position: <span class="font-bold">#${userPosition || 'N/A'}</span> in the queue
                </div>
            `;
            
            // Change the styling to blue theme for already registered
            const container = thankYouMessage.querySelector('.bg-green-50');
            container.className = 'bg-blue-50 border-2 border-blue-200 text-blue-800 p-6 rounded-xl max-w-sm mx-auto lg:mx-0 success-bounce';
            
            waitlistSection.classList.add('hidden');
            thankYouMessage.classList.remove('hidden');
        }
    }

    checkIfAlreadySubscribed() {
        // This method can be used to check subscription status on page load if needed
        const totalCount = this.getTotalSubscriberCount();
        console.log(`Total subscribers: ${totalCount}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BriggXLandingPage();
});