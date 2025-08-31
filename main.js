class BriggXLandingPage {
    constructor() {
        this.headlineText = "Smarter roads are ahead. Let's get there together.";
        this.init();
    }

    init() {
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
                setTimeout(type, 60);
            } else {
                headlineElement.classList.remove('typing-text');
            }
        };
        setTimeout(type, 800);
    }

    animateOnLoad() {
        // Get all the elements we want to animate
        const subHeadline = document.getElementById('sub-headline');
        const waitlistSection = document.getElementById('waitlist-section');
        const mobileIllustration = document.getElementById('mobile-illustration');
        const desktopIllustration = document.getElementById('desktop-illustration');

        // Animate the sub-headline first
        setTimeout(() => {
            if (subHeadline) {
                subHeadline.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                subHeadline.classList.remove('opacity-0', 'translate-y-4');
            }
        }, 500);

        // Animate the form and illustrations together
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
}

document.addEventListener('DOMContentLoaded', () => {
    new BriggXLandingPage();
});