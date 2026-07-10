export function initLanguage() {

    const languageButton =
        document.querySelector(".language-toggle");

    if (!languageButton) return;

    const html = document.documentElement;

    const savedLanguage =
        localStorage.getItem("language") || "en";

    setLanguage(savedLanguage);

    languageButton.addEventListener("click", () => {

        const currentLanguage =
            html.getAttribute("lang") || "en";

        const newLanguage =
            currentLanguage === "en"
                ? "km"
                : "en";

        setLanguage(newLanguage);

    });

    function setLanguage(language) {

        html.setAttribute("lang", language);

        localStorage.setItem("language", language);

        languageButton.textContent =
            language.toUpperCase();

    }

}