import React, { useEffect, useState } from 'react';
import { useCaderno } from './useCaderno';

const Dashboard = ({ onVerCulturas, onNovoCultura, onVerTimeline }) => {
  const { culturas, carregarCulturas, calcularDAP, statusIcon, tiposEvento, carregarEventos, loading } = useCaderno(user);
  const [ultimosEventos, setUltimosEventos] = useState([]);

  useEffect(() => {
    carregarCulturas();
  }, [carregarCulturas]);

  useEffect(() => {
    const carregarUltimos = async () => {
      if (culturas.length === 0) return;
      const ativas = culturas.filter(c => calcularDAP(c.dataPlantio) < 180);
      const promises = ativas.slice(0, 2).map(c => carregarEventos(c.id));
      const resultados = await Promise.all(promises);
      const todos = resultados.flat().slice(0, 3);
      setUltimosEventos(todos);
    };
    carregarUltimos();
  }, [culturas]);

  const ativas = culturas.filter(c => calcularDAP(c.dataPlantio) < 180);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500 font-serif">Carregando culturas...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Cards Culturas Ativas */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-marrom-escuro mb-4 font-serif tracking-wide uppercase">
          🌾 Culturas Ativas
        </h2>
        {ativas.length === 0 ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-8 shadow-lg text-center font-serif">
            <p className="text-marrom-medio text-lg mb-4">Nenhuma cultura ativa</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {ativas.map((cultura) => {
              const dap = calcularDAP(cultura.dataPlantio);
              const si = statusIcon('ativa');
              return (
                <button
                  key={cultura.id}
                  onClick={() => onVerTimeline(cultura.id)}
                  className="min-w-[260px] flex-shrink-0 snap-center bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all font-serif text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{si.emoji}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      DAP {dap}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-marrom-escuro mb-1">{cultura.nome}</h3>
                  <p className="text-marrom-medio text-sm">
                    Plantio: {cultura.dataPlantio.split('-').reverse().join('/')}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Botões de Ação */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={onNovoCultura}
          className="bg-green-600 text-white p-6 rounded-2xl shadow-lg font-serif font-bold text-lg text-center hover:bg-green-700 active:scale-[0.98] transition-all"
        >
          🌱 Nova Cultura
        </button>
        <button
          onClick={onVerCulturas}
          className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg font-serif font-bold text-lg text-center hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          📋 Ver Todas Culturas
        </button>
      </section>

      {/* Últimos Eventos */}
      <section>
        <h2 className="text-lg font-bold text-marrom-escuro mb-4 font-serif tracking-wide uppercase">
          Últimos Eventos
        </h2>
        {ultimosEventos.length === 0 ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-8 shadow-lg text-center font-serif">
            <p className="text-marrom-medio">Nenhum evento registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ultimosEventos.map((evento, i) => {
              const tipo = tiposEvento[evento.tipo];
              return (
                <div key={i} className="bg-white border-4 border-marrom-claro rounded-2xl p-5 shadow-lg font-serif">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tipo?.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-bold text-marrom-escuro">{tipo?.label}</span>
                        <span className="text-sm text-marrom-medio">
                          {evento.data.split('-').reverse().join('/')}
                        </span>
                      </div>
                      <p className="text-marrom-medio">{evento.observacoes}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
