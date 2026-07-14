const cache = new Map();

export async function loadComponent(id, file) {
    const element = document.getElementById(id);

    if (!element) return;

    try {
        let html = cache.get(file);

        if (!html) {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${file}`);
            }

            html = await response.text();
            cache.set(file, html);
        }

        element.innerHTML = html;

    } catch (error) {
        console.error(`Component Error (${file}):`, error);
    }
}