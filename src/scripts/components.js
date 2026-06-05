document.addEventListener("DOMContentLoaded", () => {
    carregarNavbar();
});

async function carregarNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    const response = await fetch("../components/navbar.html");
    const html = await response.text();

    navbar.innerHTML = html;

    definirPaginaAtiva();
}

function definirPaginaAtiva() {
    const paginaAtual = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === paginaAtual) {
            link.classList.add("active");
        }
    });
}