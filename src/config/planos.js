export const MODULOS_POR_PLANO = {
  essencial: ['financeiro', 'chuva', 'caderno'],
  completo:  ['financeiro', 'chuva', 'caderno', 'animais', 'hortas'],
};

// config/planos.js
export const MODULOS_INFO = {
  financeiro: { 
    label: 'Controle Financeiro', 
    emoji: '💰', 
    rota: '/financeiro',
    descricao: 'Receitas, despesas e fluxo de caixa da fazenda'
  },
  chuva: { 
    label: 'Registro Pluviométrico', 
    emoji: '🌧️', 
    rota: '/chuva',
    descricao: 'Acompanhe as chuvas de cada safra e estação'
  },
  caderno: { 
    label: 'Caderno de Campo', 
    emoji: '📓', 
    rota: '/caderno',
    descricao: 'Talhões, manejos e observações organizadas'
  },
  animais: { 
    label: 'Criação de Animais', 
    emoji: '🐔', 
    rota: '/animais',
    descricao: 'Loteamentos, vacinas e sanidade animal'
  },
  hortas: { 
    label: 'Hortas e Plantios', 
    emoji: '🌿', 
    rota: '/hortas',
    descricao: 'Plantio, colheita e produtividade por cultura'
  },
};

