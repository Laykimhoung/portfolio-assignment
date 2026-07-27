/**
 * ==========================================
 * LOGO LOOP MODULE
 * Vanilla JS recreation of ReactBits LogoLoop.
 * Features:
 * - Infinite seamless scrolling with DOM cloning
 * - Supports bidirectional scrolling (left & right)
 * - requestAnimationFrame continuous 60 FPS animation
 * - Smooth velocity interpolation (lerp) on hover/pause
 * - GPU-accelerated translate3d transforms
 * ==========================================
 */

export function initLogoLoop() {
    const containers = document.querySelectorAll(".logo-loop-container");
    if (!containers.length) return;

    containers.forEach((container) => {
        const tracks = container.querySelectorAll(".logo-loop-track");
        if (!tracks.length) return;

        tracks.forEach((track) => {
            const originalItems = Array.from(track.children);
            if (!originalItems.length) return;

            // Clone items 2 times (total 3 sets) to guarantee seamless infinite wrapping
            for (let i = 0; i < 2; i++) {
                originalItems.forEach((item) => {
                    const clone = item.cloneNode(true);
                    clone.setAttribute("aria-hidden", "true");
                    track.appendChild(clone);
                });
            }

            const direction = track.getAttribute("data-direction") || "left";
            const baseSpeed = 48; // Pixels per second constant speed
            const hoverSpeed = 0; // Pause smoothly on hover
            let targetSpeed = baseSpeed;
            let currentSpeed = baseSpeed;
            let lastTime = null;
            let isRunning = true;

            // Initialize scroll position: right-to-left starts at 0, left-to-right starts at singleSetWidth
            let scrollX = 0;
            const initScrollPosition = () => {
                const singleSetWidth = track.scrollWidth / 3;
                if (direction === "right") {
                    scrollX = singleSetWidth;
                }
            };
            initScrollPosition();

            // Event listeners for smooth hover slowdown/pause
            track.addEventListener("mouseenter", () => {
                targetSpeed = hoverSpeed;
            });

            track.addEventListener("mouseleave", () => {
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

                const totalWidth = track.scrollWidth;
                const singleSetWidth = totalWidth / 3;

                if (direction === "right") {
                    // Scroll from left to right (decrementing scrollX)
                    scrollX -= currentSpeed * dt;
                    if (singleSetWidth > 0 && scrollX <= 0) {
                        scrollX += singleSetWidth;
                    }
                } else {
                    // Scroll from right to left (incrementing scrollX)
                    scrollX += currentSpeed * dt;
                    if (singleSetWidth > 0 && scrollX >= singleSetWidth) {
                        scrollX -= singleSetWidth;
                    }
                }

                // GPU-accelerated translate3d
                track.style.transform = `translate3d(-${scrollX}px, 0, 0)`;

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);

            // Ensure proper calculation after font/image load
            window.addEventListener("resize", () => {
                if (direction === "right" && scrollX === 0) {
                    initScrollPosition();
                }
            });
        });
    });
}
