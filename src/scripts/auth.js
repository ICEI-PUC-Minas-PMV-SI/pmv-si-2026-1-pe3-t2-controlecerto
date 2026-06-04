(function () {
    const logado = localStorage.getItem('logado') === 'true';
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    if (!logado || !usuarioLogado.empresaId) {
        window.location.href = '../../pages/login.html';
        return;
    }

    // Bloqueia Funcionário na tela de administração
    if (window.location.pathname.includes('administracao.html') && usuarioLogado.cargo !== 'Administrador') {
        window.location.href = 'dashboard.html';
        return;
    }

    // Preenche sidebar ao carregar o DOM
    document.addEventListener('DOMContentLoaded', () => {
        const nomeEl = document.getElementById('sidebar-username');
        const cargoEl = document.getElementById('sidebar-cargo');

        if (nomeEl) nomeEl.textContent = usuarioLogado.nome || '—';
        if (cargoEl) cargoEl.textContent = usuarioLogado.cargo || '—';

        // Esconde o item Administração para Funcionários
        if (usuarioLogado.cargo !== 'Administrador') {
            const linkAdmin = document.querySelector('a[href="administracao.html"]');
            if (linkAdmin) linkAdmin.closest('li').style.display = 'none';
        }
    });
})();