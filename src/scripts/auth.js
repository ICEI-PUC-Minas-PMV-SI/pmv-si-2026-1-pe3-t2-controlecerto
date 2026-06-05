(function () {
    const logado = localStorage.getItem('logado') === 'true';
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    if (!logado || !usuarioLogado.empresaId) {
        window.location.href = '../../pages/login.html';
        return;
    }

    if (window.location.pathname.includes('administracao.html') && usuarioLogado.cargo !== 'Administrador') {
        window.location.href = 'dashboard.html';
    }
})();