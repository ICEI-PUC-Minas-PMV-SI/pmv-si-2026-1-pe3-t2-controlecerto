document.addEventListener('DOMContentLoaded', () => {
    // Usuário padrão
    if (!localStorage.getItem('usuario')) {
        localStorage.setItem('usuario', JSON.stringify({
            email: 'admin@gmail.com',
            senha: '123'
        }));
    }

    // Receitas
    if (!localStorage.getItem('receitas')) {
        localStorage.setItem('receitas', JSON.stringify([
            { id: 1, tipo: 'receita', descricao: 'Consultoria em TI', valor: 3500.00, categoria: 'Serviços', data: '2025-05-02' },
            { id: 2, tipo: 'receita', descricao: 'Venda de produto', valor: 1200.00, categoria: 'Vendas', data: '2025-05-08' },
            { id: 3, tipo: 'receita', descricao: 'Mensalidade cliente A', valor: 800.00, categoria: 'Recorrente', data: '2025-05-10' },
            { id: 4, tipo: 'receita', descricao: 'Projeto freelance', valor: 2000.00, categoria: 'Serviços', data: '2025-05-15' },
            { id: 5, tipo: 'receita', descricao: 'Comissão de parceria', valor: 650.00, categoria: 'Outros', data: '2025-05-20' }
        ]));
    }

    // Despesas
    if (!localStorage.getItem('despesas')) {
        localStorage.setItem('despesas', JSON.stringify([
            { id: 6, tipo: 'despesa', descricao: 'Aluguel do escritório', valor: 1500.00, categoria: 'Fixo', data: '2025-05-01' },
            { id: 7, tipo: 'despesa', descricao: 'Internet e telefone', valor: 250.00, categoria: 'Fixo', data: '2025-05-03' },
            { id: 8, tipo: 'despesa', descricao: 'Material de escritório', valor: 180.00, categoria: 'Variável', data: '2025-05-07' },
            { id: 9, tipo: 'despesa', descricao: 'Assinatura de software', valor: 320.00, categoria: 'Variável', data: '2025-05-12' },
            { id: 10, tipo: 'despesa', descricao: 'Energia elétrica', valor: 210.00, categoria: 'Fixo', data: '2025-05-18' }
        ]));
    }
});