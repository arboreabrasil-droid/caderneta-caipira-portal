export const MODULOS_POR_PLANO = {
  essencial: ['financeiro', 'chuva', 'caderno'],
  completo:  ['financeiro', 'chuva', 'caderno', 'animais', 'hortas'],
};

export const MODULOS_INFO = {
  financeiro: { label: 'Financeiro',        emoji: '💰', rota: '/financeiro' },
  chuva:      { label: 'Controle de Chuvas',emoji: '🌧️', rota: '/chuva' },
  caderno:    { label: 'Caderno de Campo',  emoji: '📓', rota: '/caderno' },
  animais:    { label: 'Criação de Animais',emoji: '🐔', rota: '/animais' },
  hortas:     { label: 'Hortas e Plantios', emoji: '🌿', rota: '/hortas' },
};
