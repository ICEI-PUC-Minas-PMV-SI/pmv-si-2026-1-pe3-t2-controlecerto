const DB = {

    // --- Receitas ---

    getReceitas() {
        return JSON.parse(localStorage.getItem('receitas') || '[]');
    },

    salvarReceita(receita) {
        const lista = this.getReceitas();
        receita.id = Date.now();
        receita.tipo = 'receita';
        lista.push(receita);
        localStorage.setItem('receitas', JSON.stringify(lista));
    },

    editarReceita(id, dados) {
        const lista = this.getReceitas().map(r =>
            r.id === id ? { ...r, ...dados } : r
        );
        localStorage.setItem('receitas', JSON.stringify(lista));
    },

    removerReceita(id) {
        const lista = this.getReceitas().filter(r => r.id !== id);
        localStorage.setItem('receitas', JSON.stringify(lista));
    },

    // --- Despesas ---

    getDespesas() {
        return JSON.parse(localStorage.getItem('despesas') || '[]');
    },

    salvarDespesa(despesa) {
        const lista = this.getDespesas();
        despesa.id = Date.now();
        despesa.tipo = 'despesa';
        lista.push(despesa);
        localStorage.setItem('despesas', JSON.stringify(lista));
    },

    editarDespesa(id, dados) {
        const lista = this.getDespesas().map(d =>
            d.id === id ? { ...d, ...dados } : d
        );
        localStorage.setItem('despesas', JSON.stringify(lista));
    },

    removerDespesa(id) {
        const lista = this.getDespesas().filter(d => d.id !== id);
        localStorage.setItem('despesas', JSON.stringify(lista));
    },

    // --- Totais ---

    getTotalReceitas() {
        return this.getReceitas().reduce((acc, r) => acc + Number(r.valor), 0);
    },

    getTotalDespesas() {
        return this.getDespesas().reduce((acc, d) => acc + Number(d.valor), 0);
    },

    getSaldo() {
        return this.getTotalReceitas() - this.getTotalDespesas();
    }
};