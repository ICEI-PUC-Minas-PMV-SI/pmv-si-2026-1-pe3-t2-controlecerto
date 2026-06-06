const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

function getCpf() {
    if (usuarioLogado.cpf) return usuarioLogado.cpf;

    const usuarios = JSON.parse(localStorage.getItem(`usuarios_${usuarioLogado.empresaId}`) || '[]');
    const encontrado = usuarios.find(u => u.email === usuarioLogado.email);
    return encontrado?.cpf || '—';
}

document.getElementById('perfil-nome').textContent = usuarioLogado.nome || '—';
document.getElementById('perfil-email').textContent = usuarioLogado.email || '—';
document.getElementById('perfil-empresa').textContent = usuarioLogado.empresa || '—';
document.getElementById('perfil-cpf').textContent = getCpf();