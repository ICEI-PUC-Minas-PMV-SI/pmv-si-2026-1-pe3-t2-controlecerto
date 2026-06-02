const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'));
const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

let idParaExcluir = null;

document.getElementById('usuario-cpf').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.value = v;
});

function renderizarTabela() {
    const tbody = document.getElementById('tabela-usuarios');
    const usuarios = DB.getUsuarios();

    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color: var(--muted); padding: 32px;">
                    Nenhum usuário cadastrado.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.nome}</td>
            <td>${u.cpf}</td>
            <td>${u.email}</td>
            <td>${u.cargo}</td>
            <td>
                <div class="row-actions">
                    <button type="button" class="btn-action btn-action--edit"
                        aria-label="Editar usuário" onclick="abrirEdicao(${u.id})">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn-action btn-action--delete"
                        aria-label="Excluir usuário" onclick="confirmarExclusao(${u.id})">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

document.getElementById('btn-adicionar').addEventListener('click', () => {
    document.getElementById('modalUsuarioTitulo').textContent = 'Novo Usuário';
    document.getElementById('usuario-id').value = '';
    document.getElementById('usuario-nome').value = '';
    document.getElementById('usuario-cpf').value = '';
    document.getElementById('usuario-email').value = '';
    document.getElementById('usuario-senha').value = '';
    document.getElementById('usuario-cargo').value = '';
    document.getElementById('usuario-senha').closest('.mb-3') || document.getElementById('usuario-senha').parentElement;
    document.getElementById('usuario-senha').placeholder = 'Senha';
    document.getElementById('erro-modal').textContent = '';
    document.getElementById('usuario-senha').style.display = 'block';
    modalUsuario.show();
});

function abrirEdicao(id) {
    const usuario = DB.getUsuarios().find(u => u.id === id);
    if (!usuario) return;

    document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuário';
    document.getElementById('usuario-id').value = usuario.id;
    document.getElementById('usuario-nome').value = usuario.nome;
    document.getElementById('usuario-cpf').value = usuario.cpf;
    document.getElementById('usuario-email').value = usuario.email;
    document.getElementById('usuario-senha').value = '';
    document.getElementById('usuario-senha').placeholder = 'Nova senha (deixe em branco para manter)';
    document.getElementById('usuario-cargo').value = usuario.cargo;
    document.getElementById('erro-modal').textContent = '';
    modalUsuario.show();
}

document.getElementById('btn-salvar').addEventListener('click', () => {
    const id = document.getElementById('usuario-id').value;
    const nome = document.getElementById('usuario-nome').value.trim();
    const cpf = document.getElementById('usuario-cpf').value.trim();
    const email = document.getElementById('usuario-email').value.trim();
    const senha = document.getElementById('usuario-senha').value;
    const cargo = document.getElementById('usuario-cargo').value;
    const erro = document.getElementById('erro-modal');

    if (!nome || !cpf || !email || !cargo || (!id && !senha)) {
        erro.textContent = 'Preencha todos os campos obrigatórios.';
        return;
    }

    if (id) {
        const dados = { nome, cpf, email, cargo };
        if (senha) dados.senha = senha;
        const result = DB.editarUsuario(Number(id), dados);
        if (result.erro) { erro.textContent = result.erro; return; }
    } else {
        const result = DB.salvarUsuario({ nome, cpf, email, senha, cargo });
        if (result.erro) { erro.textContent = result.erro; return; }
    }

    modalUsuario.hide();
    renderizarTabela();
});

function confirmarExclusao(id) {
    idParaExcluir = id;
    modalExcluir.show();
}

document.getElementById('btn-confirmar-exclusao').addEventListener('click', () => {
    if (idParaExcluir !== null) {
        DB.removerUsuario(idParaExcluir);
        idParaExcluir = null;
    }
    modalExcluir.hide();
    renderizarTabela();
});

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
const nomeEl = document.getElementById('sidebar-username');
if (nomeEl && usuario.email) {
    nomeEl.textContent = usuario.email.split('@')[0];
}

renderizarTabela();