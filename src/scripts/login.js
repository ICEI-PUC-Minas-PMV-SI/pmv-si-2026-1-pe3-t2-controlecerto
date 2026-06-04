function fazerLogin() {
    const emailDigitado = document.getElementById('email').value.trim();
    const senhaDigitada = document.getElementById('password').value;
    const erro = document.getElementById('erro');

    // Busca entre os administradores cadastrados
    const contas = JSON.parse(localStorage.getItem('contas') || '[]');
    const admin = contas.find(c => c.email === emailDigitado && c.senha === senhaDigitada);

    // Busca entre os funcionários de todas as empresas
    let funcionario = null;
    if (!admin) {
        for (const conta of contas) {
            const usuarios = JSON.parse(localStorage.getItem(`usuarios_${conta.empresaId}`) || '[]');
            const encontrado = usuarios.find(u => u.email === emailDigitado && u.senha === senhaDigitada);
            if (encontrado) {
                funcionario = { ...encontrado, empresaId: conta.empresaId };
                break;
            }
        }
    }

    if (!admin && !funcionario) {
        erro.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    const logado = admin
        ? { empresa: admin.empresa, email: admin.email, nome: admin.nome || admin.email.split('@')[0], cargo: 'Administrador', empresaId: admin.empresaId }
        : { empresa: funcionario.empresa, email: funcionario.email, nome: funcionario.nome, cargo: funcionario.cargo, empresaId: funcionario.empresaId };

    localStorage.setItem('logado', 'true');
    localStorage.setItem('usuarioLogado', JSON.stringify(logado));

    window.location.href = 'dashboard/dashboard.html';
}

function fazerLogout() {
    localStorage.removeItem('logado');
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../pages/login.html';
}