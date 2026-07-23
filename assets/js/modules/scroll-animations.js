/**
 * ==========================================
 * SCROLL ANIMATIONS MODULE
 * Uses Intersection Observer for reveal animations based on data attributes.
 * ==========================================
 */

export function initScrollAnimations() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add staggered delay if attribute is present
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                    
                    // Clear the inline transitionDelay after animation finishes (duration 800ms + delay)
                    setTimeout(() => {
                        entry.target.style.transitionDelay = '';
                    }, parseInt(delay) + 1000);
                }
            }
        });
    }, options);

    // Observe elements with data-animation attribute
    const elementsToObserve = document.querySelectorAll('[data-animation]');

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}
