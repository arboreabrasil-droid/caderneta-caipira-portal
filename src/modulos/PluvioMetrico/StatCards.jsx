import React from 'react';

const StatCards = ({ registros }) => {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const doMes = registros.filter((r) => {
    const [ano, mesStr] = r.data.split('-');
    return parseInt(mesStr) - 1 === mesAtual && parseInt(ano) === anoAtual;
  });

  const doAno = registros.filter((r) => {
    const [ano] = r.data.split('-');
    return parseInt(ano) === anoAtual;
  });

  const totalMes = doMes.reduce((sum, r) => sum + parseFloat(r.volume_mm || r.volume || 0), 0).toFixed(1);
  const totalAno = doAno.reduce((sum, r) => sum + parseFloat(r.volume_mm || r.volume || 0), 0).toFixed(1);
  const totalRegistros = registros.length;
  const mediaMensal = totalRegistros > 0
    ? (parseFloat(totalAno) / 3).toFixed(1)
    : '0.0';

  const cards = [
    { label: 'TOTAL DO MÊS', valor: `${totalMes} mm`, emoji: '🌧️' },
    { label: 'TOTAL DO ANO', valor: `${totalAno} mm`, emoji: '📅' },
    { label: 'REGISTROS',    valor: `${totalRegistros} dias`, emoji: '📋' },
    { label: 'MÉDIA MENSAL', valor: `${mediaMensal} mm`, emoji: '📊' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', letterSpacing: '0.05em' }}>
              {card.label}
            </span>
            <span style={{ fontSize: '1.4rem' }}>{card.emoji}</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#222' }}>
            {card.valor}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
