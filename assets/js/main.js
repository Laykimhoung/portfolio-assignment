import { loadComponent } from "./modules/component-loader.js";
import { initTheme } from "./modules/theme.js";
import { initLanguage } from "./modules/language.js";
import { initMobileMenu } from "./modules/mobile-menu.js";

// Load Components
await Promise.all([
    loadComponent("navbar", "assets/components/navbar.html"),
    loadComponent("footer", "assets/components/footer.html")
]);

// Initialize Lucide Icons
lucide.createIcons();

// Active Navigation
const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

document
    .querySelectorAll(".nav-link, .mobile-nav-link")
    .forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === currentPage) {

            link.classList.add("active");

        }

    });

// Navbar Scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    navbar?.classList.toggle(
        "scrolled",
        window.scrollY > 50
    );

});

// Initialize Modules
initTheme();
initLanguage();
initMobileMenu();