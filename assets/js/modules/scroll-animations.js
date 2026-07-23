/**
 * ==========================================
 * SCROLL ANIMATIONS MODULE
 * Uses Intersection Observer for reveal animations.
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
                // Optional: Stop observing after it appears once
                // observer.unobserve(entry.target); 
            }
        });
    }, options);

    // Elements to observe
    const elementsToObserve = document.querySelectorAll(`
        .timeline-item, 
        .quote-block, 
        .value-card, 
        .about-hero-title, 
        .about-hero-subtitle, 
        .about-me-image-wrapper, 
        .about-me-content,
        .section-header,
        .identity-content,
        .goal-item,
        .cta-text,
        .cta-button-wrapper
    `);

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}
