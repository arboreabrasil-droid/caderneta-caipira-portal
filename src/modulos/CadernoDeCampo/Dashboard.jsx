import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCaderno } from './useCaderno';

const Dashboard = () => {
  const { culturas, carregarCulturas, calcularDAP, statusIcon, tiposEvento, loading } = useCaderno();
  const [ultimosEventos, setUltimosEventos] = useState([]);

  useEffect(() => {
    carregarCulturas();
  }, [carregarCulturas]);

  const ativas = culturas.filter(c => {
    // Simula eventos para determinar status (sem carregar todos)
    return calcularDAP(c.dataPlantio) < 180;
  }).slice(0, 4);

  useEffect(() => {
    // Simula últimos eventos para dashboard (otimização — carrega só 3)
    const simulados = ativas.slice(0, 3).flatMap(cultura => [
      { culturaId: cultura.id, tipo: 'adubo', data: '2026-02-25', observacoes: 'NPK 200kg/ha' },
      { culturaId: cultura.id, tipo: 'defensivo', data: '2026-02-28', observacoes: 'Inseticida aplicado' }
    ]).slice(0, 3);
    setUltimosEventos(simulados);
  }, [ativas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando culturas...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Cards Culturas Ativas - Horizontal Scroll */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-marrom-escuro mb-6 font-serif tracking-wide uppercase">
          🌾 Culturas Ativas
        </h2>
        
        {ativas.length === 0 ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-8 shadow-lg text-center font-serif">
            <p className="text-marrom-medio text-lg mb-4">Nenhuma cultura ativa</p>
            <Link 
              to="/novo" 
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all"
            >
              + Nova Cultura
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory">
            {ativas.map((cultura) => {
              const dap = calcularDAP(cultura.dataPlantio);
              const si = statusIcon('ativa');
              return (
                <Link
                  key={cultura.id}
                  to={`/${cultura.id}`}
                  className="min-w-[280px] flex-shrink-0 snap-center bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all font-serif group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{si.emoji}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      DAP {dap}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-marrom-escuro mb-2 leading-tight">
                    {cultura.nome}
                  </h3>
                  <p className="text-marrom-medio text-sm">
                    Plantio: {cultura.dataPlantio.split('-').reverse().join('/')}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Botões de Ação */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/novo"
          className="bg-green-600 text-white p-6 rounded-2xl shadow-lg font-serif font-bold text-lg text-center hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          🌱 Nova Cultura
        </Link>
        <Link
          to="/culturas"
          className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg font-serif font-bold text-lg text-center hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          📋 Ver Todas Culturas
        </Link>
      </section>

      {/* Últimos Eventos */}
      <section>
        <h2 className="text-lg font-bold text-marrom-escuro mb-6 font-serif tracking-wide uppercase">
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
                <div
                  key={i}
                  className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl mt-1 flex-shrink-0">{tipo.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-marrom-escuro">{tipo.label}</span>
                        <span className="text-sm text-marrom-medio font-mono">
                          {evento.data.split('-').reverse().join('/')}
                        </span>
                      </div>
                      <p className="text-marrom-medio leading-relaxed">{evento.observacoes}</p>
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
