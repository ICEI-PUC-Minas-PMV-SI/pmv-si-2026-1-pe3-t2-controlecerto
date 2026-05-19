// Fechar menu mobile ao clicar em um link
document.querySelectorAll('#navMenu .nav-link, #navMenu .btn-start, #navMenu .btn-demo').forEach(el => {
    el.addEventListener('click', () => {
        const menu = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
        if (menu) menu.hide();
    });
});

// Sombra no navbar ao rolar
window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar-wrapper');
    header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(0,0,0,0.4)' : 'none';
});