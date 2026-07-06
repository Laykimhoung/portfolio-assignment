const html = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("theme") || "dark";

html.setAttribute("data-theme", savedTheme);

updateThemeIcon(savedTheme);

themeButton?.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    html.setAttribute("data-theme", newTheme);

    localStorage.setItem("theme", newTheme);

    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {

    const icon = themeButton.querySelector("i");

    icon.setAttribute(
        "data-lucide",
        theme === "dark"
            ? "moon"
            : "sun"
    );

    lucide.createIcons();
}