import React, { useEffect, useState } from 'react';
import { useCaderno } from './useCaderno';

const Dashboard = ({ user, onVerCulturas, onNovoCultura, onVerTimeline }) => {
  const { culturas, carregarCulturas, calcularDAP, tiposEvento, carregarEventos, loading } = useCaderno(user);
  const [ultimosEventos, setUltimosEventos] = useState([]);

  useEffect(() => {
    carregarCulturas();
  }, [carregarCulturas]);

  useEffect(() => {
    const carregarUltimos = async () => {
      if (culturas.length === 0) return;
      const ativas = culturas.filter(c => calcularDAP(c.dataPlantio) < 180);
      const promises = ativas.slice(0, 3).map(c => carregarEventos(c.id));
      const resultados = await Promise.all(promises);
      setUltimosEventos(resultados.flat().slice(0, 5));
    };
    carregarUltimos();
  }, [culturas]);

  const ativas = culturas.filter(c => calcularDAP(c.dataPlantio) < 180);
  const colhidas = culturas.filter(c => calcularDAP(c.dataPlantio) >= 180);

  const statCards = [
    { label: 'CULTURAS ATIVAS',   valor: `${ativas.length}`,   emoji: '🌱' },
    { label: 'JÁ COLHIDAS',       valor: `${colhidas.length}`, emoji: '📦' },
    { label: 'TOTAL CADASTRADAS', valor: `${culturas.length}`, emoji: '📋' },
    { label: 'EVENTOS RECENTES',  valor: `${ultimosEventos.length}`, emoji: '📝' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-marrom-medio font-serif">Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-marrom-medio tracking-wide">{card.label}</span>
              <span className="text-2xl">{card.emoji}</span>
            </div>
            <div className="text-4xl font-bold text-marrom-escuro">{card.valor}</div>
          </div>
        ))}
      </div>

      {/* Culturas Ativas */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif mb-6">
        <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
          🌾 Culturas Ativas
        </h2>
        {ativas.length === 0 ? (
          <p className="text-marrom-medio text-center py-6">Nenhuma cultura ativa. Cadastre a primeira!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {ativas.map((cultura) => {
              const dap = calcularDAP(cultura.dataPlantio);
              return (
                <button
                  key={cultura.id}
                  onClick={() => onVerTimeline(cultura.id)}
                  className="w-full flex items-center justify-between border-2 border-marrom-claro rounded-xl px-4 py-3 hover:border-marrom-escuro hover:bg-bege-claro transition-all text-left"
                >
                  <div>
                    <p className="font-bold text-marrom-escuro">{cultura.nome}</p>
                    <p className="text-sm text-marrom-medio">
                      Plantio: {cultura.dataPlantio.split('-').reverse().join('/')}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 border-2 border-green-300 px-3 py-1 rounded-xl font-bold text-sm">
                    DAP {dap}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={onNovoCultura}
          className="flex-1 bg-marrom-escuro hover:bg-marrom-escuro/90 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all font-serif"
        >
          🌱 Nova Cultura
        </button>
        <button
          onClick={onVerCulturas}
          className="flex-1 bg-white border-4 border-marrom-claro hover:border-marrom-escuro text-marrom-escuro py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all font-serif"
        >
          📋 Ver Histórico
        </button>
      </div>

      {/* Últimos Eventos */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
          📝 Registros Recentes
        </h2>
        {ultimosEventos.length === 0 ? (
          <p className="text-marrom-medio text-center py-6">Nenhum evento registrado ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {ultimosEventos.map((evento, i) => {
              const tipo = tiposEvento[evento.tipo];
              return (
                <div key={i} className="flex items-center justify-between border-2 border-marrom-claro rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tipo?.emoji}</span>
                    <div>
                      <p className="font-bold text-marrom-escuro">{tipo?.label}</p>
                      <p className="text-sm text-marrom-medio truncate max-w-[200px]">{evento.observacoes}</p>
                    </div>
                  </div>
                  <span className="text-sm text-marrom-medio font-semibold">
                    {evento.data.split('-').reverse().join('/')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
