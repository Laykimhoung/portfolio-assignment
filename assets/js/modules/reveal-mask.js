const wrapper = document.querySelector(".image-wrapper");

if (wrapper) {
    wrapper.addEventListener("mouseenter", () => {
        wrapper.classList.add("revealed");
    });

    wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("revealed");
    });
}