import React from 'react';

function StatCard({ titulo, valor, unidade, icone, cor }) {
  return (
    <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 font-serif">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-marrom-medio uppercase tracking-wide">
          {titulo}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cor}`}>
          {icone}
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-black text-marrom-escuro">{valor}</span>
        <span className="text-sm text-marrom-medio mb-1">{unidade}</span>
      </div>
    </div>
  );
}

export default function StatCards({ registros }) {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const doMes = registros.filter((r) => {
    const d = new Date(r.data);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  const doAno = registros.filter((r) => {
    const d = new Date(r.data);
    return d.getFullYear() === anoAtual;
  });

  const totalMes = doMes.reduce((acc, r) => acc + r.volume_mm, 0).toFixed(1);
  const totalAno = doAno.reduce((acc, r) => acc + r.volume_mm, 0).toFixed(1);
  const totalRegistros = registros.length;
  const mediaMensal = registros.length > 0
    ? (doAno.reduce((acc, r) => acc + r.volume_mm, 0) / (mesAtual + 1)).toFixed(1)
    : '0.0';

  const cards = [
    { titulo: 'Total do Mês',     valor: totalMes,      unidade: 'mm', icone: '🌧️', cor: 'bg-blue-100' },
    { titulo: 'Total do Ano',     valor: totalAno,      unidade: 'mm', icone: '📅', cor: 'bg-green-100' },
    { titulo: 'Registros',        valor: totalRegistros, unidade: 'dias', icone: '📋', cor: 'bg-amber-100' },
    { titulo: 'Média Mensal',     valor: mediaMensal,   unidade: 'mm', icone: '📊', cor: 'bg-purple-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <StatCard key={card.titulo} {...card} />
      ))}
    </div>
  );
}
