export function initScroll() {
    const backToTopBtn = document.getElementById("back-to-top");

    if (!backToTopBtn) return;

    // Show/hide button on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // Smooth scroll to top
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
