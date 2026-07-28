/**
 * ==========================================
 * SCREENSHOT STACK & LIGHTBOX MODULE
 * Apple / Linear / Raycast inspired interactive
 * stacked screenshot window cards with smooth
 * hover fan-out and full-screen lightbox modal.
 * ==========================================
 */

let activeLightboxModal = null;
let currentStackImages = [];
let currentStackTitles = [];
let currentImageIndex = 0;

/**
 * Initialize all screenshot stacks on the page
 */
export function initScreenshotStack() {
    const stacks = document.querySelectorAll(".screenshot-stack");
    if (!stacks.length) return;

    createLightboxModalIfNeeded();

    stacks.forEach((stack) => {
        const cards = Array.from(stack.querySelectorAll(".stack-window-card"));
        if (!cards.length) return;

        const total = cards.length;

        // Collect image sources and window titles for the lightbox
        const stackImages = [];
        const stackTitles = [];

        cards.forEach((card, index) => {
            const img = card.querySelector(".stack-screenshot-img");
            const titleEl = card.querySelector(".stack-window-title");
            const src = img ? (img.getAttribute("data-src") || img.getAttribute("src")) : "";
            const title = titleEl ? titleEl.textContent.trim() : `Screenshot ${index + 1}`;

            stackImages.push(src);
            stackTitles.push(title);
        });

        // Visual stack order: index 0 (1st image) sits in front by default
        const cardOrder = cards.map((_, i) => i);

        function applyStackDepths() {
            cards.forEach((card, domIndex) => {
                const stackPos = cardOrder.indexOf(domIndex);
                const centerOffset = stackPos - (total - 1) / 2;

                // Idle parameters (layered depth in Z-space, front is stackPos = 0)
                const idleX = `${stackPos * -12}px`;
                const idleY = `${stackPos * 9}px`;
                const idleScale = Math.max(0.88, 1 - stackPos * 0.035);
                const idleRot = `${stackPos * -1.8}deg`;

                // Hover parameters (Apple / Linear fan-out)
                const fanX = `${centerOffset * 32}px`;
                const fanY = `${Math.abs(centerOffset) * -8 - stackPos * 4}px`;
                const fanScale = Math.max(0.92, 1 - stackPos * 0.015);
                const fanRot = `${centerOffset * 3.5}deg`;

                card.style.setProperty("--idle-x", idleX);
                card.style.setProperty("--idle-y", idleY);
                card.style.setProperty("--idle-scale", idleScale);
                card.style.setProperty("--idle-rot", idleRot);

                card.style.setProperty("--fan-x", fanX);
                card.style.setProperty("--fan-y", fanY);
                card.style.setProperty("--fan-scale", fanScale);
                card.style.setProperty("--fan-rot", fanRot);
                card.style.setProperty("--card-z", total - stackPos);

                if (stackPos === 0) {
                    card.setAttribute("data-front", "true");
                } else {
                    card.removeAttribute("data-front");
                }
            });
        }

        applyStackDepths();

        // Add Drag-to-Cycle (swipe) and Click-to-Open-Lightbox interactions
        cards.forEach((card, domIndex) => {
            let startX = 0;
            let startY = 0;
            let isDragging = false;
            let isDown = false;

            const onStart = (clientX, clientY) => {
                isDown = true;
                isDragging = false;
                startX = clientX;
                startY = clientY;
            };

            const onMove = (clientX, clientY) => {
                if (!isDown) return;
                const dx = clientX - startX;
                const dy = clientY - startY;

                if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
                    isDragging = true;
                    card.style.transition = "none";
                    card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${dx * 0.04}deg)`;
                    card.style.zIndex = "100";
                }
            };

            const onEnd = (clientX, clientY) => {
                if (!isDown) return;
                isDown = false;

                const dx = clientX - startX;
                const dy = clientY - startY;

                if (isDragging) {
                    if (Math.abs(dx) > 60 || Math.abs(dy) > 60) {
                        // Dragged past threshold: fly away and cycle to back of stack
                        card.style.transition = "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.28s ease";
                        card.style.transform = `translate3d(${dx * 3.5}px, ${dy * 3.5}px, 0) rotate(${dx * 0.1}deg)`;
                        card.style.opacity = "0";

                        setTimeout(() => {
                            card.style.transition = "";
                            card.style.transform = "";
                            card.style.opacity = "";
                            card.style.zIndex = "";

                            // Rotate current front card to end of order
                            cardOrder.push(cardOrder.shift());
                            applyStackDepths();
                        }, 280);
                    } else {
                        // Dragged below threshold: snap back
                        card.style.transition = "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)";
                        card.style.transform = "";
                        card.style.zIndex = "";
                        setTimeout(() => {
                            card.style.transition = "";
                        }, 280);
                    }
                } else {
                    // Quick tap/click: open Lightbox at this image's index
                    openLightbox(stackImages, stackTitles, domIndex);
                }
            };

            // Mouse events
            card.addEventListener("mousedown", (e) => {
                e.preventDefault();
                onStart(e.clientX, e.clientY);
            });
            window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
            window.addEventListener("mouseup", (e) => onEnd(e.clientX, e.clientY));

            // Touch events
            card.addEventListener("touchstart", (e) => {
                const touch = e.touches[0];
                if (touch) onStart(touch.clientX, touch.clientY);
            }, { passive: true });
            window.addEventListener("touchmove", (e) => {
                const touch = e.touches[0];
                if (touch) onMove(touch.clientX, touch.clientY);
            }, { passive: true });
            window.addEventListener("touchend", (e) => {
                const touch = e.changedTouches ? e.changedTouches[0] : null;
                if (touch) onEnd(touch.clientX, touch.clientY);
            });
        });

        // Clicking the stack count pill ("X Screenshots") opens Lightbox at current front image
        const pill = stack.querySelector(".stack-count-pill");
        if (pill) {
            pill.addEventListener("click", (e) => {
                e.stopPropagation();
                openLightbox(stackImages, stackTitles, cardOrder[0]);
            });
        }
    });
}

/**
 * Creates the global Lightbox modal element in document.body
 */
function createLightboxModalIfNeeded() {
    if (document.querySelector(".lightbox-modal")) {
        activeLightboxModal = document.querySelector(".lightbox-modal");
        return;
    }

    const modal = document.createElement("div");
    modal.className = "lightbox-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Project Screenshot Lightbox");

    modal.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-container">
            <header class="lightbox-header">
                <div class="lightbox-title-group">
                    <span class="lightbox-title" id="lightbox-title-text">Screenshot</span>
                    <span class="lightbox-counter" id="lightbox-counter-text">1 / 1</span>
                </div>
                <button type="button" class="lightbox-close-btn" aria-label="Close Lightbox">
                    <i data-lucide="x"></i>
                </button>
            </header>
            <div class="lightbox-view-area">
                <button type="button" class="lightbox-nav-btn lightbox-prev-btn" aria-label="Previous Screenshot">
                    <i data-lucide="chevron-left"></i>
                </button>
                <img src="" alt="Project Screenshot" class="lightbox-img" id="lightbox-img-element" />
                <button type="button" class="lightbox-nav-btn lightbox-next-btn" aria-label="Next Screenshot">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    activeLightboxModal = modal;

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons({ root: modal });
    }

    // Event listeners
    const backdrop = modal.querySelector(".lightbox-backdrop");
    const closeBtn = modal.querySelector(".lightbox-close-btn");
    const prevBtn = modal.querySelector(".lightbox-prev-btn");
    const nextBtn = modal.querySelector(".lightbox-next-btn");
    const viewArea = modal.querySelector(".lightbox-view-area");

    const closeHandler = () => closeLightbox();
    backdrop.addEventListener("click", closeHandler);
    closeBtn.addEventListener("click", closeHandler);

    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showPreviousImage();
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showNextImage();
    });

    viewArea.addEventListener("click", (e) => {
        if (e.target === viewArea) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!activeLightboxModal || !activeLightboxModal.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            showPreviousImage();
        } else if (e.key === "ArrowRight") {
            showNextImage();
        }
    });

    // Mobile touch swipe gesture support
    let touchStartX = 0;
    let touchEndX = 0;

    viewArea.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewArea.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const threshold = 40;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                showPreviousImage();
            } else {
                showNextImage();
            }
        }
    }
}

/**
 * Open Lightbox with images array and start index
 */
function openLightbox(images, titles, startIndex) {
    if (!activeLightboxModal || !images.length) return;

    currentStackImages = images;
    currentStackTitles = titles;
    currentImageIndex = Math.max(0, Math.min(startIndex, images.length - 1));

    updateLightboxView();

    activeLightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

/**
 * Close Lightbox
 */
function closeLightbox() {
    if (!activeLightboxModal) return;

    activeLightboxModal.classList.remove("active");
    document.body.style.overflow = "";
}

/**
 * Show next image in stack
 */
function showNextImage() {
    if (!currentStackImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % currentStackImages.length;
    updateLightboxView();
}

/**
 * Show previous image in stack
 */
function showPreviousImage() {
    if (!currentStackImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + currentStackImages.length) % currentStackImages.length;
    updateLightboxView();
}

/**
 * Update lightbox image, title, and counter
 */
function updateLightboxView() {
    if (!activeLightboxModal || !currentStackImages.length) return;

    const imgEl = activeLightboxModal.querySelector("#lightbox-img-element");
    const titleEl = activeLightboxModal.querySelector("#lightbox-title-text");
    const counterEl = activeLightboxModal.querySelector("#lightbox-counter-text");
    const prevBtn = activeLightboxModal.querySelector(".lightbox-prev-btn");
    const nextBtn = activeLightboxModal.querySelector(".lightbox-next-btn");

    const src = currentStackImages[currentImageIndex];
    const title = currentStackTitles[currentImageIndex] || "Screenshot";
    const total = currentStackImages.length;

    if (imgEl) {
        imgEl.style.opacity = "0.3";
        imgEl.setAttribute("src", src);
        imgEl.setAttribute("alt", title);
        setTimeout(() => {
            imgEl.style.opacity = "1";
        }, 150);
    }

    if (titleEl) {
        titleEl.textContent = title;
    }

    if (counterEl) {
        counterEl.textContent = `${currentImageIndex + 1} / ${total}`;
    }

    if (prevBtn && nextBtn) {
        const showBtns = total > 1;
        prevBtn.style.display = showBtns ? "flex" : "none";
        nextBtn.style.display = showBtns ? "flex" : "none";
    }
}
