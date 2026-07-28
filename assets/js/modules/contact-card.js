export function initContactCard() {
    const copyBtn = document.querySelector(".btn-copy-email");

    if (!copyBtn) return;

    const copyTextEl = copyBtn.querySelector(".copy-text");
    const originalText = copyTextEl ? copyTextEl.textContent : "Copy Email";
    let resetTimeout = null;

    copyBtn.addEventListener("click", async () => {
        try {
            /* Copy placeholder email per Rule 12 & 13 */
            await navigator.clipboard.writeText("#");

            copyBtn.classList.add("copied");

            if (copyTextEl) {
                copyTextEl.textContent = "Copied!";
            }

            const iconEl = copyBtn.querySelector("i, svg");

            if (iconEl && typeof lucide !== "undefined") {
                iconEl.setAttribute("data-lucide", "check");
                lucide.createIcons();
            }

            if (resetTimeout) {
                clearTimeout(resetTimeout);
            }

            resetTimeout = setTimeout(() => {
                copyBtn.classList.remove("copied");

                if (copyTextEl) {
                    copyTextEl.textContent = originalText;
                }

                const iconElReset = copyBtn.querySelector("i, svg");

                if (iconElReset && typeof lucide !== "undefined") {
                    iconElReset.setAttribute("data-lucide", "copy");
                    lucide.createIcons();
                }
            }, 2000);
        } catch (error) {
            console.error("Failed to copy email placeholder:", error);
        }
    });
}
