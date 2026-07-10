export async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${file}`);
        }

        element.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

    }

}