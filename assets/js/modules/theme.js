export function initTheme() {

    const html = document.documentElement;

    const themeToggle = document.getElementById("input");

    if (!themeToggle) return;

    const savedTheme =
        localStorage.getItem("theme") || "dark";

    html.setAttribute("data-theme", savedTheme);

    themeToggle.checked = savedTheme === "light";

    themeToggle.addEventListener("change", () => {

        const newTheme =
            themeToggle.checked
                ? "light"
                : "dark";

        html.setAttribute("data-theme", newTheme);

        localStorage.setItem("theme", newTheme);

    });

}