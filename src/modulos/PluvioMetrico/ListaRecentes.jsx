import React from 'react';

export default function ListaRecentes({ registros }) {
  const recentes = [...registros]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 10);

  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  if (recentes.length === 0) {
    return (
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
          📋 Registros Recentes
        </h2>
        <p className="text-marrom-medio text-center py-8">
          Nenhum registro ainda.<br />
          <span className="text-sm">Adicione sua primeira chuva! 🌧️</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
      <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
        📋 Registros Recentes
      </h2>

      <div className="flex flex-col gap-2">
        {recentes.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-3 rounded-xl bg-bege-claro border border-marrom-claro/50 hover:border-marrom-claro transition-all"
          >
            {/* DATA */}
            <span className="text-sm font-semibold text-marrom-escuro w-24">
              {formatarData(r.data)}
            </span>

            {/* VOLUME */}
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-[#5D4037]">{r.volume_mm}</span>
              <span className="text-xs text-marrom-medio">mm</span>
            </div>

            {/* OBSERVAÇÃO */}
            <span className="text-xs text-marrom-medio text-right max-w-[120px] truncate">
              {r.observacoes || '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
