export function initContactCard() {
    /* 1. Email Copy Buttons */
    const copyButtons = document.querySelectorAll(".btn-copy-email");

    copyButtons.forEach(copyBtn => {
        const copyTextEl = copyBtn.querySelector(".copy-text");
        const originalText = copyTextEl ? copyTextEl.textContent : "Copy";
        let resetTimeout = null;

        copyBtn.addEventListener("click", async () => {
            try {
                const emailToCopy = copyBtn.getAttribute("data-email") || "houngjk081@gmail.com";
                await navigator.clipboard.writeText(emailToCopy);

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
                console.error("Failed to copy email address:", error);
            }
        });
    });

    /* 2. Modern Contact Form Handler with Elegant Validation */
    const form = document.getElementById("contact-form");
    const feedbackEl = document.getElementById("form-feedback");

    if (form && feedbackEl) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = form.querySelector("#form-name");
            const emailInput = form.querySelector("#form-email");
            const subjectInput = form.querySelector("#form-subject");
            const messageInput = form.querySelector("#form-message");

            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                feedbackEl.textContent = "Please fill in all required fields.";
                feedbackEl.className = "form-feedback error";
                return;
            }

            /* Simple Email Regex Validation */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                feedbackEl.textContent = "Please enter a valid email address.";
                feedbackEl.className = "form-feedback error";
                return;
            }

            /* Elegant Success State */
            feedbackEl.textContent = "Message sent successfully! Thank you for connecting.";
            feedbackEl.className = "form-feedback";

            const submitBtn = form.querySelector(".btn-submit-message");
            const btnText = submitBtn ? submitBtn.querySelector("span") : null;
            const btnIcon = submitBtn ? submitBtn.querySelector("i, svg") : null;

            if (btnText) btnText.textContent = "Sent!";
            if (btnIcon && typeof lucide !== "undefined") {
                btnIcon.setAttribute("data-lucide", "check");
                lucide.createIcons();
            }

            setTimeout(() => {
                form.reset();
                if (btnText) btnText.textContent = "Send Message";
                if (btnIcon && typeof lucide !== "undefined") {
                    btnIcon.setAttribute("data-lucide", "send");
                    lucide.createIcons();
                }
                setTimeout(() => {
                    feedbackEl.textContent = "";
                }, 3000);
            }, 2500);
        });
    }
}
