/**
 * ==========================================
 * LOGO LOOP MODULE
 * Vanilla JS recreation of ReactBits LogoLoop.
 * Features:
 * - Infinite seamless scrolling with DOM cloning
 * - requestAnimationFrame continuous 60 FPS animation
 * - Smooth velocity interpolation (lerp) on hover/pause
 * - GPU-accelerated translate3d transforms
 * ==========================================
 */

export function initLogoLoop() {
    const containers = document.querySelectorAll(".logo-loop-container");
    if (!containers.length) return;

    containers.forEach((container) => {
        const track = container.querySelector(".logo-loop-track");
        if (!track) return;

        const originalItems = Array.from(track.children);
        if (!originalItems.length) return;

        // Clone items 2 times (total 3 sets) to guarantee seamless infinite wrapping on any screen size
        for (let i = 0; i < 2; i++) {
            originalItems.forEach((item) => {
                const clone = item.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
        }

        let scrollX = 0;
        const baseSpeed = 55; // Pixels per second constant speed
        const hoverSpeed = 0; // Pause smoothly on hover
        let targetSpeed = baseSpeed;
        let currentSpeed = baseSpeed;
        let lastTime = null;
        let isRunning = true;

        // Event listeners for smooth hover slowdown/pause
        container.addEventListener("mouseenter", () => {
            targetSpeed = hoverSpeed;
        });

        container.addEventListener("mouseleave", () => {
            targetSpeed = baseSpeed;
        });

        // Animation loop
        const animate = (timestamp) => {
            if (!isRunning) return;

            if (!lastTime) lastTime = timestamp;
            const dt = Math.min((timestamp - lastTime) / 1000, 0.1); // Cap delta time at 100ms
            lastTime = timestamp;

            // Smooth linear interpolation (lerp) towards target speed
            currentSpeed += (targetSpeed - currentSpeed) * 0.08;

            // Advance scroll position
            scrollX += currentSpeed * dt;

            // Seamless modulo wrap around a single original set width
            const totalWidth = track.scrollWidth;
            const singleSetWidth = totalWidth / 3;

            if (singleSetWidth > 0 && scrollX >= singleSetWidth) {
                scrollX -= singleSetWidth;
            }

            // GPU-accelerated translate3d
            track.style.transform = `translate3d(-${scrollX}px, 0, 0)`;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        // Clean up observer/resizing if needed
        window.addEventListener("resize", () => {
            // Recalculates automatically on next frame via track.scrollWidth
        });
    });
}
