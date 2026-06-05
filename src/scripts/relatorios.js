const MESES_CURTOS = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];
const MESES_LONGOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function fmt(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Retorna os anos presentes nos dados
function anosDisponiveis(receitas, despesas) {
    const anos = new Set();
    [...receitas, ...despesas].forEach(item => {
        if (item.data) anos.add(item.data.split('-')[0]);
    });
    return [...anos].sort((a, b) => b - a);
}

// Agrupa valores por mês para um ano específico (ou todos)
function agruparPorMes(lista, ano) {
    const totais = new Array(12).fill(0);
    lista.forEach(item => {
        if (!item.data) return;
        const [y, m] = item.data.split('-');
        if (ano && y !== ano) return;
        totais[parseInt(m, 10) - 1] += Number(item.valor);
    });
    return totais;
}

// Categoria com maior gasto
function maiorCategoria(despesas, ano) {
    const mapa = {};
    despesas.forEach(d => {
        if (!d.data) return;
        if (ano && d.data.split('-')[0] !== ano) return;
        mapa[d.categoria] = (mapa[d.categoria] || 0) + Number(d.valor);
    });
    if (!Object.keys(mapa).length) return '—';
    return Object.entries(mapa).sort((a, b) => b[1] - a[1])[0][0];
}

// Renderiza o gráfico SVG de duas linhas
function renderizarGrafico(receitasMes, despesasMes) {
    const svg = document.getElementById('chart-relatorio');
    const xs = [40, 115, 190, 265, 340, 415, 490, 565, 640, 715, 790, 865];
    const svgH = 160;
    const max = Math.max(...receitasMes, ...despesasMes, 1);

    const yPonto = (v) => Math.round(svgH - (v / max) * svgH * 0.9) + 10;

    const pathReceitas = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yPonto(receitasMes[i])}`).join(' ');
    const pathDespesas = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yPonto(despesasMes[i])}`).join(' ');

    const labels = xs.map((x, i) =>
        `<text class="chart-dual-line__label" x="${x}" y="188" text-anchor="middle">${MESES_CURTOS[i]}</text>`
    ).join('');

    svg.innerHTML = `
        <path class="chart-dual-line__path--revenue" d="${pathReceitas}" />
        <path class="chart-dual-line__path--expense"  d="${pathDespesas}" />
        ${labels}
    `;
}

// Renderiza a tabela mensal
function renderizarTabela(receitasMes, despesasMes, ano) {
    const tbody = document.getElementById('tabela-relatorio');
    const anoLabel = ano || new Date().getFullYear();

    const linhas = MESES_LONGOS.map((mes, i) => {
        const r = receitasMes[i];
        const d = despesasMes[i];
        const saldo = r - d;
        if (r === 0 && d === 0) return '';

        const saldoClass = saldo >= 0 ? 'text-revenue' : 'text-expense';
        const status = saldo >= 0 ? 'Positivo' : 'Negativo';
        const statusClass = saldo >= 0 ? 'text-status' : 'text-expense';

        return `
            <tr>
                <td>${mes.substring(0, 3)} / ${anoLabel}</td>
                <td class="text-revenue">R$ ${fmt(r)}</td>
                <td class="text-expense">R$ ${fmt(d)}</td>
                <td class="${saldoClass}">R$ ${fmt(Math.abs(saldo))}</td>
                <td class="${statusClass}">${status}</td>
            </tr>`;
    }).join('');

    tbody.innerHTML = linhas || `
        <tr>
            <td colspan="5" style="text-align:center; color: var(--muted); padding: 32px;">
                Nenhum dado encontrado para este período.
            </td>
        </tr>`;
}

// Atualiza todos os elementos da tela
function renderizarRelatorio(ano) {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();

    const receitasMes = agruparPorMes(receitas, ano);
    const despesasMes = agruparPorMes(despesas, ano);

    const totalR = receitasMes.reduce((a, v) => a + v, 0);
    const totalD = despesasMes.reduce((a, v) => a + v, 0);
    const saldo = totalR - totalD;

    document.getElementById('rel-receitas').textContent = `R$ ${fmt(totalR)}`;
    document.getElementById('rel-despesas').textContent = `R$ ${fmt(totalD)}`;
    document.getElementById('rel-saldo').textContent = `R$ ${fmt(Math.abs(saldo))}`;
    document.getElementById('rel-saldo').className = `finance-card__value ${saldo >= 0 ? 'finance-card__value--balance' : 'finance-card__value--expense'}`;
    document.getElementById('rel-maior-gasto').textContent = maiorCategoria(despesas, ano);

    renderizarGrafico(receitasMes, despesasMes);
    renderizarTabela(receitasMes, despesasMes, ano);
}

// Exporta os dados filtrados como CSV
function exportarCSV(ano) {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();
    const receitasMes = agruparPorMes(receitas, ano);
    const despesasMes = agruparPorMes(despesas, ano);
    const anoLabel = ano || new Date().getFullYear();

    const linhas = [['Período', 'Receitas', 'Despesas', 'Saldo', 'Status']];

    MESES_LONGOS.forEach((mes, i) => {
        const r = receitasMes[i];
        const d = despesasMes[i];
        if (r === 0 && d === 0) return;
        const saldo = r - d;
        linhas.push([
            `${mes.substring(0, 3)} / ${anoLabel}`,
            r.toFixed(2).replace('.', ','),
            d.toFixed(2).replace('.', ','),
            Math.abs(saldo).toFixed(2).replace('.', ','),
            saldo >= 0 ? 'Positivo' : 'Negativo'
        ]);
    });

    const csv = linhas.map(l => l.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${anoLabel}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();

    // Popula o select de anos com os anos disponíveis nos dados
    const select = document.getElementById('periodo');
    anosDisponiveis(receitas, despesas).forEach(ano => {
        const opt = document.createElement('option');
        opt.value = ano;
        opt.textContent = ano;
        select.appendChild(opt);
    });

    // Renderiza com o primeiro ano disponível como padrão
    const anoInicial = select.options[1]?.value || '';
    if (anoInicial) select.value = anoInicial;
    renderizarRelatorio(anoInicial);

    // Filtro por ano
    select.addEventListener('change', () => renderizarRelatorio(select.value));

    // Exportar
    document.querySelector('.reports-toolbar__export').addEventListener('click', () => {
        exportarCSV(select.value);
    });
});