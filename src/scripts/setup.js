// Cria uma conta demo se não existir nenhuma conta cadastrada
document.addEventListener('DOMContentLoaded', () => {
    const contas = JSON.parse(localStorage.getItem('contas') || '[]');
    if (contas.length > 0) return;

    const empresaId = 'emp_demo';
    const contaDemo = {
        id: 1,
        empresaId,
        empresa: 'Controle Certo',
        email: 'admin@gmail.com',
        senha: '123',
        nome: 'Admin',
        cpf: '000.000.000-00',
        cargo: 'Administrador'
    };
    localStorage.setItem('contas', JSON.stringify([contaDemo]));

    localStorage.setItem(`receitas_${empresaId}`, JSON.stringify([
        { id: 1, tipo: 'receita', descricao: 'Consultoria em TI', valor: 3500.00, categoria: 'Serviços', data: '2026-05-02' },
        { id: 2, tipo: 'receita', descricao: 'Venda de produto', valor: 1200.00, categoria: 'Vendas', data: '2026-05-08' },
        { id: 3, tipo: 'receita', descricao: 'Mensalidade cliente A', valor: 800.00, categoria: 'Recorrente', data: '2026-05-10' },
        { id: 4, tipo: 'receita', descricao: 'Projeto freelance', valor: 2000.00, categoria: 'Serviços', data: '2026-05-15' },
        { id: 5, tipo: 'receita', descricao: 'Comissão de parceria', valor: 650.00, categoria: 'Outros', data: '2026-05-20' },
        { id: 11, tipo: 'receita', descricao: 'Receita Janeiro', valor: 1000.00, categoria: 'Vendas', data: '2026-01-15' },
        { id: 12, tipo: 'receita', descricao: 'Receita Fevereiro', valor: 1100.00, categoria: 'Serviços', data: '2026-02-15' },
        { id: 13, tipo: 'receita', descricao: 'Receita Março', valor: 1200.00, categoria: 'Recorrente', data: '2026-03-15' },
        { id: 14, tipo: 'receita', descricao: 'Receita Abril', valor: 1300.00, categoria: 'Vendas', data: '2026-04-15' },
    ]));

    localStorage.setItem(`despesas_${empresaId}`, JSON.stringify([
        { id: 6, tipo: 'despesa', descricao: 'Aluguel do escritório', valor: 1500.00, categoria: 'Fixo', data: '2026-05-01' },
        { id: 7, tipo: 'despesa', descricao: 'Internet e telefone', valor: 250.00, categoria: 'Fixo', data: '2026-05-03' },
        { id: 8, tipo: 'despesa', descricao: 'Material de escritório', valor: 180.00, categoria: 'Variável', data: '2026-05-07' },
        { id: 9, tipo: 'despesa', descricao: 'Assinatura de software', valor: 320.00, categoria: 'Variável', data: '2026-05-12' },
        { id: 10, tipo: 'despesa', descricao: 'Energia elétrica', valor: 210.00, categoria: 'Fixo', data: '2026-05-18' },
        { id: 16, tipo: 'despesa', descricao: 'Despesa Janeiro', valor: 600.00, categoria: 'Fixo', data: '2026-01-20' },
        { id: 17, tipo: 'despesa', descricao: 'Despesa Fevereiro', valor: 650.00, categoria: 'Variável', data: '2026-02-20' },
        { id: 18, tipo: 'despesa', descricao: 'Despesa Março', valor: 700.00, categoria: 'Fixo', data: '2026-03-20' },
        { id: 19, tipo: 'despesa', descricao: 'Despesa Abril', valor: 750.00, categoria: 'Variável', data: '2026-04-20' },
    ]));
});