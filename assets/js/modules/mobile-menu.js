export function initMobileMenu() {

    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (!menuToggle || !mobileNav) return;

    // Toggle Menu

    menuToggle.addEventListener("click", () => {

        const isOpen = mobileNav.classList.toggle("show");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

    // Close Menu After Animation

    mobileNav.querySelectorAll(".mobile-nav-link").forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            mobileNav.classList.remove("show");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");

            setTimeout(() => {

                window.location.href = link.href;

            }, 350);

        });

    });

    // Click Outside

    document.addEventListener("click", e => {

        const clickedInsideMenu = mobileNav.contains(e.target);
        const clickedMenuButton = menuToggle.contains(e.target);
        const clickedTheme = e.target.closest(".theme-toggle-wrapper");
        const clickedLanguage = e.target.closest(".language-toggle");

        if (
            !clickedInsideMenu &&
            !clickedMenuButton &&
            !clickedTheme &&
            !clickedLanguage
        ) {

            mobileNav.classList.remove("show");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");

        }

    });

    // ESC Key

    document.addEventListener("keydown", e => {

        if (e.key !== "Escape") return;

        mobileNav.classList.remove("show");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");

    });

}