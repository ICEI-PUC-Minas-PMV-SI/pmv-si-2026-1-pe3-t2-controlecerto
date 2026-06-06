// Máscara de CPF
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cpf').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = v;
    });
});

function fazerCadastro() {
    const empresa = document.getElementById('empresa').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const conf = document.getElementById('confirmar-senha').value;
    const erro = document.getElementById('erro');

    if (!empresa || !nome || !cpf || !email || !senha || !conf) {
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

    const resultado = DB.salvarConta({ empresa, nome, cpf, email, senha });

    if (resultado.erro) {
        erro.textContent = resultado.erro;
        return;
    }

    window.location.href = 'login.html';
}