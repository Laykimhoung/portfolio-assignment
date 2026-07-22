export function initRevealMask() {
    const wrapper = document.querySelector(".image-wrapper");

    if (!wrapper) return;

    let mouseX = 0;
    let mouseY = 0;

    wrapper.style.setProperty("--mouse-x", "50%");
    wrapper.style.setProperty("--mouse-y", "50%");
    wrapper.style.setProperty("--reveal-size", "0px");

    function updateReveal() {
        wrapper.style.setProperty("--mouse-x", `${mouseX}px`);
        wrapper.style.setProperty("--mouse-y", `${mouseY}px`);

        requestAnimationFrame(updateReveal);
    }

    updateReveal();

    wrapper.addEventListener("mouseenter", () => {
        wrapper.style.setProperty("--reveal-size", "230px");
    });

    wrapper.addEventListener("mousemove", (e) => {
        const rect = wrapper.getBoundingClientRect();

        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    wrapper.addEventListener("mouseleave", () => {
        wrapper.style.setProperty("--reveal-size", "0px");
    });
}