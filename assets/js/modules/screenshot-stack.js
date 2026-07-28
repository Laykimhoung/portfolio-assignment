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

            // Compute depth-layered idle and hover fan-out custom properties
            const reverseIdx = total - 1 - index;
            const centerOffset = index - (total - 1) / 2;

            // Idle parameters (layered depth in Z-space)
            const idleX = `${reverseIdx * -12}px`;
            const idleY = `${reverseIdx * 9}px`;
            const idleScale = Math.max(0.88, 1 - reverseIdx * 0.035);
            const idleRot = `${reverseIdx * -1.8}deg`;

            // Hover parameters (Apple / Linear fan-out)
            const fanX = `${centerOffset * 32}px`;
            const fanY = `${Math.abs(centerOffset) * -8 - reverseIdx * 4}px`;
            const fanScale = Math.max(0.92, 1 - reverseIdx * 0.015);
            const fanRot = `${centerOffset * 3.5}deg`;

            card.style.setProperty("--idle-x", idleX);
            card.style.setProperty("--idle-y", idleY);
            card.style.setProperty("--idle-scale", idleScale);
            card.style.setProperty("--idle-rot", idleRot);

            card.style.setProperty("--fan-x", fanX);
            card.style.setProperty("--fan-y", fanY);
            card.style.setProperty("--fan-scale", fanScale);
            card.style.setProperty("--fan-rot", fanRot);
            card.style.setProperty("--card-z", index + 1);

            if (index === total - 1) {
                card.setAttribute("data-front", "true");
            } else {
                card.removeAttribute("data-front");
            }

            // Clicking any card opens the lightbox modal at this image's index
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                openLightbox(stackImages, stackTitles, index);
            });
        });

        // Clicking the stack wrapper itself opens from the front image
        stack.addEventListener("click", () => {
            openLightbox(stackImages, stackTitles, total - 1);
        });
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
