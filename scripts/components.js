// COMPONENTE COMPARTIDO: MENÚ PRINCIPAL

document.addEventListener("DOMContentLoaded", () => {

    // Uso el nombre del archivo para saber en qué página se debe resaltar el enlace.
    const currentPage = window.location.pathname
        .split("/")
        .pop() || "index.html";

    // Las páginas dentro de /pages necesitan subir un nivel para llegar a la portada.
    const rootPath = currentPage === "index.html" ? "." : "..";

    // Relaciono cada archivo con su opción del menú; Inicio queda como alternativa.
    const activePage = {
        "index.html": "inicio",
        "convivencia.html": "convivencia",
        "instantes.html": "instantes"
    }[currentPage] || "inicio";

    // Mantengo la navegación en un solo componente para que sea igual en todas las páginas.
    const headerHTML = `
        <header class="topbar glass">

            <a href="${rootPath}/index.html" class="brand">
                <span class="brand-icon">⌂</span>
                <span>Nuestro <strong>Hogar</strong></span>
            </a>

            <nav class="main-navigation" aria-label="Navegación principal">

                <a href="${rootPath}/index.html"
                   class="nav-link ${activePage === "inicio" ? "active" : ""}">
                    Inicio
                </a>

                <a href="${rootPath}/pages/convivencia.html"
                   class="nav-link ${activePage === "convivencia" ? "active" : ""}">
                    Convivencia
                </a>

                <a href="${rootPath}/pages/instantes.html"
                   class="nav-link ${activePage === "instantes" ? "active" : ""}">
                    Instantes
                </a>

            </nav>

            <div class="profile">
                <div class="profile-avatar">S</div>
                <span>Stiven</span>
            </div>

        </header>
    `;

    // Cada HTML tiene este contenedor vacío, que se reemplaza por el encabezado compartido.
    const headerContainer = document.getElementById("site-header");

    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
    }

});