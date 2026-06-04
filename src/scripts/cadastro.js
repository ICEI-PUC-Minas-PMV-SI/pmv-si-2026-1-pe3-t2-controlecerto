function fazerCadastro() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const conf = document.getElementById('confirmar-senha').value;
    const erro = document.getElementById('erro');

    if (!nome || !email || !senha || !conf) {
        erro.textContent = 'Preencha todos os campos.';
        return;
    }

    if (senha !== conf) {
        erro.textContent = 'As senhas não coincidem.';
        return;
    }

    if (senha.length < 4) {
        erro.textContent = 'A senha deve ter pelo menos 4 caracteres.';
        return;
    }

    const resultado = DB.salvarConta({ nome, email, senha });

    if (resultado.erro) {
        erro.textContent = resultado.erro;
        return;
    }

    window.location.href = 'login.html';
}