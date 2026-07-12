export function initMobileMenu() {

    const button = document.getElementById("menu-toggle");

    if (!button) return;

    button.addEventListener("click", () => {

        button.classList.toggle("active");

    });

}