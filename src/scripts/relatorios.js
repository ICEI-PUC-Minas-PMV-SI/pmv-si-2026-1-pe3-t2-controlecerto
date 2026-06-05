const MESES_CURTOS = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];
const MESES_LONGOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function fmt(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function anosDisponiveis(receitas, despesas) {
    const anos = new Set();
    [...receitas, ...despesas].forEach(item => {
        if (item.data) anos.add(item.data.split('-')[0]);
    });
    return [...anos].sort((a, b) => b - a);
}

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

// ---- Gráfico: Comparativo Mensal (duas linhas: receitas vs despesas) ----
function renderizarGraficoComparativo(receitasMes, despesasMes) {
    const svg = document.getElementById('chart-relatorio');
    const xs = [40, 115, 190, 265, 340, 415, 490, 565, 640, 715, 790, 865];
    const svgH = 160;
    const max = Math.max(...receitasMes, ...despesasMes, 1);
    const yP = v => Math.round(svgH - (v / max) * svgH * 0.9) + 10;

    const pathR = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yP(receitasMes[i])}`).join(' ');
    const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yP(despesasMes[i])}`).join(' ');
    const labels = xs.map((x, i) =>
        `<text class="chart-dual-line__label" x="${x}" y="188" text-anchor="middle">${MESES_CURTOS[i]}</text>`
    ).join('');

    svg.innerHTML = `
        <path class="chart-dual-line__path--revenue" d="${pathR}" />
        <path class="chart-dual-line__path--expense"  d="${pathD}" />
        ${labels}
    `;
}

// ---- Gráfico: Fluxo de Caixa (linha única do saldo acumulado) ----
function renderizarGraficoFluxo(receitasMes, despesasMes) {
    const svg = document.getElementById('chart-relatorio');
    const xs = [40, 115, 190, 265, 340, 415, 490, 565, 640, 715, 790, 865];
    const svgH = 150;

    // Calcula saldo acumulado mês a mês
    let acumulado = 0;
    const saldos = receitasMes.map((r, i) => {
        acumulado += r - despesasMes[i];
        return acumulado;
    });

    const min = Math.min(...saldos, 0);
    const max = Math.max(...saldos, 1);
    const range = max - min || 1;
    const yP = v => Math.round(svgH - ((v - min) / range) * svgH * 0.85) + 10;

    const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yP(saldos[i])}`).join(' ');

    // Linha zero de referência
    const yZero = yP(0);
    const labels = xs.map((x, i) =>
        `<text class="chart-dual-line__label" x="${x}" y="188" text-anchor="middle">${MESES_CURTOS[i]}</text>`
    ).join('');

    svg.innerHTML = `
        <line x1="40" y1="${yZero}" x2="865" y2="${yZero}"
              stroke="rgba(169,200,255,0.2)" stroke-width="1" stroke-dasharray="4 3" />
        <path class="chart-dual-line__path--revenue" d="${path}" />
        ${labels}
    `;
}

// ---- Tabela: Comparativo Mensal (receitas vs despesas por mês) ----
function renderizarTabelaComparativo(receitasMes, despesasMes, ano) {
    document.getElementById('cabecalho-relatorio').innerHTML = `
        <th scope="col">Período</th>
        <th scope="col">Receitas</th>
        <th scope="col">Despesas</th>
        <th scope="col">Saldo</th>
        <th scope="col">Status</th>
    `;

    const anoLabel = ano || new Date().getFullYear();
    const linhas = MESES_LONGOS.map((mes, i) => {
        const r = receitasMes[i], d = despesasMes[i];
        if (r === 0 && d === 0) return '';
        const saldo = r - d;
        const saldoClass = saldo >= 0 ? 'text-revenue' : 'text-expense';
        const statusClass = saldo >= 0 ? 'text-status' : 'text-expense';
        return `<tr>
            <td>${mes.substring(0, 3)} / ${anoLabel}</td>
            <td class="text-revenue">R$ ${fmt(r)}</td>
            <td class="text-expense">R$ ${fmt(d)}</td>
            <td class="${saldoClass}">R$ ${fmt(Math.abs(saldo))}</td>
            <td class="${statusClass}">${saldo >= 0 ? 'Positivo' : 'Negativo'}</td>
        </tr>`;
    }).join('');

    document.getElementById('tabela-relatorio').innerHTML = linhas || semDados();
}

// ---- Tabela: Fluxo de Caixa (entradas, saídas, saldo do mês, saldo acumulado) ----
function renderizarTabelaFluxo(receitasMes, despesasMes, ano) {
    document.getElementById('cabecalho-relatorio').innerHTML = `
        <th scope="col">Período</th>
        <th scope="col">Entradas</th>
        <th scope="col">Saídas</th>
        <th scope="col">Saldo do Mês</th>
        <th scope="col">Saldo Acumulado</th>
    `;

    const anoLabel = ano || new Date().getFullYear();
    let acumulado = 0;
    const linhas = MESES_LONGOS.map((mes, i) => {
        const r = receitasMes[i], d = despesasMes[i];
        const saldoMes = r - d;
        acumulado += saldoMes;
        if (r === 0 && d === 0) return '';

        const mesClass = saldoMes >= 0 ? 'text-revenue' : 'text-expense';
        const acumClass = acumulado >= 0 ? 'text-revenue' : 'text-expense';
        return `<tr>
            <td>${mes.substring(0, 3)} / ${anoLabel}</td>
            <td class="text-revenue">R$ ${fmt(r)}</td>
            <td class="text-expense">R$ ${fmt(d)}</td>
            <td class="${mesClass}">R$ ${fmt(Math.abs(saldoMes))}</td>
            <td class="${acumClass}">R$ ${fmt(Math.abs(acumulado))}</td>
        </tr>`;
    }).join('');

    document.getElementById('tabela-relatorio').innerHTML = linhas || semDados();
}

function semDados() {
    return `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px;">
        Nenhum dado encontrado para este período.</td></tr>`;
}

// ---- Cards de resumo (iguais nos dois tipos) ----
function renderizarCards(receitasMes, despesasMes, despesas, ano) {
    const totalR = receitasMes.reduce((a, v) => a + v, 0);
    const totalD = despesasMes.reduce((a, v) => a + v, 0);
    const saldo = totalR - totalD;

    document.getElementById('rel-receitas').textContent = `R$ ${fmt(totalR)}`;
    document.getElementById('rel-despesas').textContent = `R$ ${fmt(totalD)}`;
    document.getElementById('rel-saldo').textContent = `R$ ${fmt(Math.abs(saldo))}`;
    document.getElementById('rel-saldo').className = `finance-card__value ${saldo >= 0 ? 'finance-card__value--balance' : 'finance-card__value--expense'}`;
    document.getElementById('rel-maior-gasto').textContent = maiorCategoria(despesas, ano);
}

// ---- Renderização principal ----
function renderizarRelatorio(ano, tipo) {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();
    const receitasMes = agruparPorMes(receitas, ano);
    const despesasMes = agruparPorMes(despesas, ano);

    renderizarCards(receitasMes, despesasMes, despesas, ano);

    if (tipo === 'fluxo') {
        document.getElementById('chart-titulo').textContent = 'Saldo Acumulado';
        renderizarGraficoFluxo(receitasMes, despesasMes);
        renderizarTabelaFluxo(receitasMes, despesasMes, ano);
    } else {
        document.getElementById('chart-titulo').textContent = 'Receitas / Despesas';
        renderizarGraficoComparativo(receitasMes, despesasMes);
        renderizarTabelaComparativo(receitasMes, despesasMes, ano);
    }
}

// ---- Exportar CSV ----
function exportarCSV(ano, tipo) {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();
    const receitasMes = agruparPorMes(receitas, ano);
    const despesasMes = agruparPorMes(despesas, ano);
    const anoLabel = ano || new Date().getFullYear();

    let cabecalho, linhas;

    if (tipo === 'fluxo') {
        cabecalho = ['Período', 'Entradas', 'Saídas', 'Saldo do Mês', 'Saldo Acumulado'];
        let acumulado = 0;
        linhas = MESES_LONGOS.map((mes, i) => {
            const r = receitasMes[i], d = despesasMes[i];
            if (r === 0 && d === 0) return null;
            const saldoMes = r - d;
            acumulado += saldoMes;
            return [
                `${mes.substring(0, 3)} / ${anoLabel}`,
                r.toFixed(2).replace('.', ','),
                d.toFixed(2).replace('.', ','),
                saldoMes.toFixed(2).replace('.', ','),
                acumulado.toFixed(2).replace('.', ',')
            ];
        }).filter(Boolean);
    } else {
        cabecalho = ['Período', 'Receitas', 'Despesas', 'Saldo', 'Status'];
        linhas = MESES_LONGOS.map((mes, i) => {
            const r = receitasMes[i], d = despesasMes[i];
            if (r === 0 && d === 0) return null;
            const saldo = r - d;
            return [
                `${mes.substring(0, 3)} / ${anoLabel}`,
                r.toFixed(2).replace('.', ','),
                d.toFixed(2).replace('.', ','),
                Math.abs(saldo).toFixed(2).replace('.', ','),
                saldo >= 0 ? 'Positivo' : 'Negativo'
            ];
        }).filter(Boolean);
    }

    const csv = [cabecalho, ...linhas].map(l => l.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipo}_${anoLabel}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ---- Inicialização ----
document.addEventListener('DOMContentLoaded', () => {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();

    const selectAno = document.getElementById('periodo');
    const selectTipo = document.getElementById('tipo-relatorio');

    anosDisponiveis(receitas, despesas).forEach(ano => {
        const opt = document.createElement('option');
        opt.value = ano;
        opt.textContent = ano;
        selectAno.appendChild(opt);
    });

    const anoInicial = selectAno.options[1]?.value || '';
    if (anoInicial) selectAno.value = anoInicial;

    // Tipo padrão: comparativo
    selectTipo.value = 'comparativo';
    renderizarRelatorio(anoInicial, 'comparativo');

    const atualizar = () => renderizarRelatorio(selectAno.value, selectTipo.value);
    selectAno.addEventListener('change', atualizar);
    selectTipo.addEventListener('change', atualizar);

    document.querySelector('.reports-toolbar__export').addEventListener('click', () => {
        exportarCSV(selectAno.value, selectTipo.value);
    });
});