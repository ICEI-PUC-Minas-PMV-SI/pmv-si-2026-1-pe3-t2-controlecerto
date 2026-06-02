const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatarValor(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function agruparPorMes(lista) {
    const totais = new Array(12).fill(0);
    lista.forEach(item => {
        if (!item.data) return;
        const mes = parseInt(item.data.split('-')[1], 10) - 1;
        totais[mes] += Number(item.valor);
    });
    return totais;
}

function mesesComDados(totais) {
    const indices = totais
        .map((v, i) => ({ mes: i, valor: v }))
        .filter(x => x.valor > 0);

    if (indices.length < 2) {
        return [0, 1, 2, 3, 4, 5].map(i => ({ mes: i, valor: totais[i] }));
    }

    return indices.slice(-6);
}

function renderizarBarras(svgEl, dados) {
    const max = Math.max(...dados.map(d => d.valor), 1);
    const svgH = 160;
    const barW = 48;
    const gap = 80;
    const startX = 24;

    svgEl.innerHTML = dados.map((d, i) => {
        const barH = Math.max(Math.round((d.valor / max) * svgH * 0.85), 4);
        const x = startX + i * gap;
        const y = svgH - barH;
        const labelX = x + barW / 2;

        return `
            <rect class="chart-bars__bar" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="8" />
            <text class="chart-bars__label" x="${labelX}" y="178" text-anchor="middle">${MESES[d.mes]}</text>
        `;
    }).join('');
}

function renderizarLinha(svgEl, dados) {
    const max = Math.max(...dados.map(d => d.valor), 1);
    const svgH = 150;
    const gap = 80;
    const startX = 24 + 24;

    const pontos = dados.map((d, i) => {
        const x = startX + i * gap;
        const y = Math.round(svgH - (d.valor / max) * svgH * 0.85);
        return { x, y, mes: d.mes };
    });

    const pathD = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const labels = pontos.map(p =>
        `<text class="chart-line__label" x="${p.x}" y="178" text-anchor="middle">${MESES[p.mes]}</text>`
    ).join('');

    svgEl.innerHTML = `<path class="chart-line__path" d="${pathD}" />${labels}`;
}

function renderizarDashboard() {
    const receitas = DB.getReceitas();
    const despesas = DB.getDespesas();

    document.getElementById('total-receitas').textContent = `R$ ${formatarValor(DB.getTotalReceitas())}`;
    document.getElementById('total-despesas').textContent = `R$ ${formatarValor(DB.getTotalDespesas())}`;

    const totaisReceitas = agruparPorMes(receitas);
    const totaisDespesas = agruparPorMes(despesas);

    renderizarBarras(document.getElementById('chart-receitas'), mesesComDados(totaisReceitas));
    renderizarLinha(document.getElementById('chart-despesas'), mesesComDados(totaisDespesas));

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nomeEl = document.getElementById('sidebar-username');
    if (nomeEl && usuario.email) {
        nomeEl.textContent = usuario.email.split('@')[0];
    }
}

renderizarDashboard();