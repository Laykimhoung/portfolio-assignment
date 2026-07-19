import { loadComponent } from "./modules/component-loader.js";
import { initTheme } from "./modules/theme.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import "./modules/reveal-mask.js";

/* Load Components */
await Promise.all([
    loadComponent("background", "assets/components/background.html"),
    loadComponent("navbar", "assets/components/navbar.html"),
    loadComponent("footer", "assets/components/footer.html")
]);

/* Initialize Icons */
lucide.createIcons();

/* Navigation */
const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

document
    .querySelectorAll(".nav-link, .mobile-nav-link")
    .forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === currentPage
        );
    });

/* Navbar Scroll */
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
});

/* Initialize Modules */
initTheme();
initMobileMenu();