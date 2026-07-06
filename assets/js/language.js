const languageButton = document.querySelector(".language-toggle");

let language =
    localStorage.getItem("language") || "en";

languageButton.textContent =
    language.toUpperCase();

languageButton.addEventListener("click", () => {

    language =
        language === "en"
            ? "km"
            : "en";

    localStorage.setItem(
        "language",
        language
    );

    languageButton.textContent =
        language.toUpperCase();

});