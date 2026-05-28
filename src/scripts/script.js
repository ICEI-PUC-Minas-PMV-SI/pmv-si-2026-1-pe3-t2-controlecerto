document.querySelectorAll('#navMenu .nav-link, #navMenu .btn-start, #navMenu .btn-demo').forEach(el => {
    el.addEventListener('click', () => {
        const menu = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
        if (menu) menu.hide();
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar-wrapper');
    header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(0,0,0,0.4)' : 'none';
});

function fazerLogin() {
    const emailDigitado = document.getElementById('email').value.trim();
    const senhaDigitada = document.getElementById('password').value;
    const erro = document.getElementById('erro');

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || emailDigitado !== usuario.email || senhaDigitada !== usuario.senha) {
        erro.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    localStorage.setItem('logado', 'true');
    window.location.href = 'dashboard/dashboard.html';
}

function fazerLogout() {
    localStorage.removeItem('logado');
    window.location.href = 'login.html';
}