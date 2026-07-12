export function initTheme() {

    const html = document.documentElement;

    const themeToggle =
        document.getElementById("theme-toggle");

    if (!themeToggle) return;

    const currentTheme =
        html.getAttribute("data-theme") || "dark";

    themeToggle.checked =
        currentTheme === "light";

    themeToggle.addEventListener("change", () => {

        const newTheme =
            themeToggle.checked
                ? "light"
                : "dark";

        html.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

    });

}