// Lucide
lucide.createIcons();

// Active Navigation

const currentPage =
    window.location.pathname.split("/").pop() ||
    "index.html";

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        if (
            link.getAttribute("href") === currentPage
        ) {

            link.classList.add("active");

        }

    });

// Navbar Scroll

const navbar =
    document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 50
    );

});