const modalReceita = new bootstrap.Modal(document.getElementById('modalReceita'));
const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

let idParaExcluir = null;

function formatarData(data) {
    if (!data) return '—';
    const [y, m, d] = data.split('-');
    return `${d}/${m}/${y}`;
}

function formatarValor(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-receitas');
    const receitas = DB.getReceitas();

    if (receitas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color: var(--muted); padding: 32px;">
                    Nenhuma receita cadastrada.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = receitas.map(r => `
        <tr>
            <td>${r.descricao}</td>
            <td>${r.categoria}</td>
            <td>${formatarData(r.data)}</td>
            <td>R$ ${formatarValor(r.valor)}</td>
            <td>
                <div class="row-actions">
                    <button type="button" class="btn-action btn-action--edit"
                        aria-label="Editar receita" onclick="abrirEdicao(${r.id})">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn-action btn-action--delete"
                        aria-label="Excluir receita" onclick="confirmarExclusao(${r.id})">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

document.getElementById('btn-adicionar').addEventListener('click', () => {
    document.getElementById('modalReceitaTitulo').textContent = 'Nova Receita';
    document.getElementById('receita-id').value = '';
    document.getElementById('receita-descricao').value = '';
    document.getElementById('receita-categoria').value = '';
    document.getElementById('receita-data').value = '';
    document.getElementById('receita-valor').value = '';
    document.getElementById('erro-modal').textContent = '';
    modalReceita.show();
});

function abrirEdicao(id) {
    const receita = DB.getReceitas().find(r => r.id === id);
    if (!receita) return;

    document.getElementById('modalReceitaTitulo').textContent = 'Editar Receita';
    document.getElementById('receita-id').value = receita.id;
    document.getElementById('receita-descricao').value = receita.descricao;
    document.getElementById('receita-categoria').value = receita.categoria;
    document.getElementById('receita-data').value = receita.data;
    document.getElementById('receita-valor').value = receita.valor;
    document.getElementById('erro-modal').textContent = '';
    modalReceita.show();
}

document.getElementById('btn-salvar').addEventListener('click', () => {
    const id = document.getElementById('receita-id').value;
    const descricao = document.getElementById('receita-descricao').value.trim();
    const categoria = document.getElementById('receita-categoria').value.trim();
    const data = document.getElementById('receita-data').value;
    const valor = parseFloat(document.getElementById('receita-valor').value);
    const erro = document.getElementById('erro-modal');

    if (!descricao || !categoria || !data || isNaN(valor) || valor <= 0) {
        erro.textContent = 'Preencha todos os campos corretamente.';
        return;
    }

    if (id) {
        DB.editarReceita(Number(id), { descricao, categoria, data, valor });
    } else {
        DB.salvarReceita({ descricao, categoria, data, valor });
    }

    modalReceita.hide();
    renderizarTabela();
});

function confirmarExclusao(id) {
    idParaExcluir = id;
    modalExcluir.show();
}

document.getElementById('btn-confirmar-exclusao').addEventListener('click', () => {
    if (idParaExcluir !== null) {
        DB.removerReceita(idParaExcluir);
        idParaExcluir = null;
    }
    modalExcluir.hide();
    renderizarTabela();
});

// Sidebar preenchida pelo auth.js

renderizarTabela();