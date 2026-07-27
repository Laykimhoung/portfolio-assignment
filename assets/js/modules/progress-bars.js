/**
 * ==========================================
 * PROGRESS BARS MODULE
 * Animate progress bars and count-up numeric
 * percentage once when scrolled into view.
 * ==========================================
 */

export function initProgressBars() {
    const progressCards = document.querySelectorAll(".progress-card");
    if (!progressCards.length) return;

    // Cubic bezier easeOutCubic approximation for smooth counting
    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };

    const animateCountUp = (element, targetValue, duration = 1400) => {
        let startTime = null;

        const updateCounter = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentValue = Math.round(easedProgress * targetValue);

            element.textContent = `${currentValue}%`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = `${targetValue}%`;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add("in-view");

                const fillElement = card.querySelector(".progress-fill");
                const percentageElement = card.querySelector(".progress-percentage");

                if (fillElement) {
                    const targetPercent = parseInt(fillElement.getAttribute("data-progress"), 10) || 0;
                    
                    // Trigger smooth width transition
                    requestAnimationFrame(() => {
                        fillElement.style.width = `${targetPercent}%`;
                    });

                    // Trigger synchronized numeric count-up
                    if (percentageElement) {
                        animateCountUp(percentageElement, targetPercent, 1400);
                    }
                }

                // Ensure it only animates once
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    progressCards.forEach((card) => {
        progressObserver.observe(card);
    });
}
