const modalDespesa = new bootstrap.Modal(document.getElementById('modalDespesa'));
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
    const tbody = document.getElementById('tabela-despesas');
    const despesas = DB.getDespesas();

    if (despesas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color: var(--muted); padding: 32px;">
                    Nenhuma despesa cadastrada.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = despesas.map(d => `
        <tr>
            <td>${d.descricao}</td>
            <td>${d.categoria}</td>
            <td>${formatarData(d.data)}</td>
            <td>R$ ${formatarValor(d.valor)}</td>
            <td>
                <div class="row-actions">
                    <button type="button" class="btn-action btn-action--edit"
                        aria-label="Editar despesa" onclick="abrirEdicao(${d.id})">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn-action btn-action--delete"
                        aria-label="Excluir despesa" onclick="confirmarExclusao(${d.id})">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

document.getElementById('btn-adicionar').addEventListener('click', () => {
    document.getElementById('modalDespesaTitulo').textContent = 'Nova Despesa';
    document.getElementById('despesa-id').value = '';
    document.getElementById('despesa-descricao').value = '';
    document.getElementById('despesa-categoria').value = '';
    document.getElementById('despesa-data').value = '';
    document.getElementById('despesa-valor').value = '';
    document.getElementById('erro-modal').textContent = '';
    modalDespesa.show();
});

function abrirEdicao(id) {
    const despesa = DB.getDespesas().find(d => d.id === id);
    if (!despesa) return;

    document.getElementById('modalDespesaTitulo').textContent = 'Editar Despesa';
    document.getElementById('despesa-id').value = despesa.id;
    document.getElementById('despesa-descricao').value = despesa.descricao;
    document.getElementById('despesa-categoria').value = despesa.categoria;
    document.getElementById('despesa-data').value = despesa.data;
    document.getElementById('despesa-valor').value = despesa.valor;
    document.getElementById('erro-modal').textContent = '';
    modalDespesa.show();
}

document.getElementById('btn-salvar').addEventListener('click', () => {
    const id = document.getElementById('despesa-id').value;
    const descricao = document.getElementById('despesa-descricao').value.trim();
    const categoria = document.getElementById('despesa-categoria').value.trim();
    const data = document.getElementById('despesa-data').value;
    const valor = parseFloat(document.getElementById('despesa-valor').value);
    const erro = document.getElementById('erro-modal');

    if (!descricao || !categoria || !data || isNaN(valor) || valor <= 0) {
        erro.textContent = 'Preencha todos os campos corretamente.';
        return;
    }

    if (id) {
        DB.editarDespesa(Number(id), { descricao, categoria, data, valor });
    } else {
        DB.salvarDespesa({ descricao, categoria, data, valor });
    }

    modalDespesa.hide();
    renderizarTabela();
});

function confirmarExclusao(id) {
    idParaExcluir = id;
    modalExcluir.show();
}

document.getElementById('btn-confirmar-exclusao').addEventListener('click', () => {
    if (idParaExcluir !== null) {
        DB.removerDespesa(idParaExcluir);
        idParaExcluir = null;
    }
    modalExcluir.hide();
    renderizarTabela();
});

// Sidebar preenchida pelo auth.js

renderizarTabela();