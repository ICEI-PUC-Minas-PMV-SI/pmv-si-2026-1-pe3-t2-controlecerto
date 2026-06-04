const DB = {

    // Retorna o empresaId do usuário logado
    getEmpresaId() {
        const u = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        return u.empresaId || null;
    },

    // --- Contas (administradores) ---

    getContas() {
        return JSON.parse(localStorage.getItem('contas') || '[]');
    },

    salvarConta(conta) {
        const lista = this.getContas();
        if (lista.some(c => c.email === conta.email))
            return { erro: 'Este e-mail já está cadastrado.' };
        conta.id = Date.now();
        conta.empresaId = 'emp_' + conta.id;
        conta.cargo = 'Administrador';
        lista.push(conta);
        localStorage.setItem('contas', JSON.stringify(lista));
        return { ok: true };
    },

    // --- Receitas ---

    getReceitas() {
        const id = this.getEmpresaId();
        if (!id) return [];
        return JSON.parse(localStorage.getItem(`receitas_${id}`) || '[]');
    },

    salvarReceita(receita) {
        const id = this.getEmpresaId();
        if (!id) return;
        const lista = this.getReceitas();
        receita.id = Date.now();
        receita.tipo = 'receita';
        lista.push(receita);
        localStorage.setItem(`receitas_${id}`, JSON.stringify(lista));
    },

    editarReceita(id, dados) {
        const empId = this.getEmpresaId();
        if (!empId) return;
        const lista = this.getReceitas().map(r => r.id === id ? { ...r, ...dados } : r);
        localStorage.setItem(`receitas_${empId}`, JSON.stringify(lista));
    },

    removerReceita(id) {
        const empId = this.getEmpresaId();
        if (!empId) return;
        const lista = this.getReceitas().filter(r => r.id !== id);
        localStorage.setItem(`receitas_${empId}`, JSON.stringify(lista));
    },

    // --- Despesas ---

    getDespesas() {
        const id = this.getEmpresaId();
        if (!id) return [];
        return JSON.parse(localStorage.getItem(`despesas_${id}`) || '[]');
    },

    salvarDespesa(despesa) {
        const id = this.getEmpresaId();
        if (!id) return;
        const lista = this.getDespesas();
        despesa.id = Date.now();
        despesa.tipo = 'despesa';
        lista.push(despesa);
        localStorage.setItem(`despesas_${id}`, JSON.stringify(lista));
    },

    editarDespesa(id, dados) {
        const empId = this.getEmpresaId();
        if (!empId) return;
        const lista = this.getDespesas().map(d => d.id === id ? { ...d, ...dados } : d);
        localStorage.setItem(`despesas_${empId}`, JSON.stringify(lista));
    },

    removerDespesa(id) {
        const empId = this.getEmpresaId();
        if (!empId) return;
        const lista = this.getDespesas().filter(d => d.id !== id);
        localStorage.setItem(`despesas_${empId}`, JSON.stringify(lista));
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
    },

    // --- Usuários (funcionários da empresa) ---

    getUsuarios() {
        const id = this.getEmpresaId();
        if (!id) return [];
        return JSON.parse(localStorage.getItem(`usuarios_${id}`) || '[]');
    },

    salvarUsuario(usuario) {
        const empId = this.getEmpresaId();
        if (!empId) return { erro: 'Sessão inválida.' };
        const lista = this.getUsuarios();
        const contas = this.getContas();
        const emailEmUso = lista.some(u => u.email === usuario.email) ||
            contas.some(c => c.email === usuario.email);
        if (emailEmUso) return { erro: 'Este e-mail já está cadastrado.' };
        usuario.id = Date.now();
        usuario.empresaId = empId;
        lista.push(usuario);
        localStorage.setItem(`usuarios_${empId}`, JSON.stringify(lista));
        return { ok: true };
    },

    editarUsuario(id, dados) {
        const empId = this.getEmpresaId();
        if (!empId) return { erro: 'Sessão inválida.' };
        const lista = this.getUsuarios();
        const emailDuplicado = lista.some(u => u.email === dados.email && u.id !== id);
        if (emailDuplicado) return { erro: 'Este e-mail já está em uso.' };
        const atualizada = lista.map(u => u.id === id ? { ...u, ...dados } : u);
        localStorage.setItem(`usuarios_${empId}`, JSON.stringify(atualizada));
        return { ok: true };
    },

    removerUsuario(id) {
        const empId = this.getEmpresaId();
        if (!empId) return;
        const lista = this.getUsuarios().filter(u => u.id !== id);
        localStorage.setItem(`usuarios_${empId}`, JSON.stringify(lista));
    }

};