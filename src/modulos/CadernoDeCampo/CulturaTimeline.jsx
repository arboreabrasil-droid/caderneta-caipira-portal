import React, { useState, useEffect } from 'react';
import { useCaderno } from './useCaderno';

const CulturaTimeline = ({ user, culturaId, onNovoEvento, onVoltar }) => {
  const { culturas, carregarCulturas, carregarEventos, calcularDAP, tiposEvento, adicionarEvento } = useCaderno(user);
  const [cultura, setCultura] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novaData, setNovaData] = useState('');
  const [novoTipo, setNovoTipo] = useState('adubo');
  const [novaObs, setNovaObs] = useState('');

  useEffect(() => {
    setNovaData(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const init = async () => {
      await carregarCulturas();
    };
    init();
  }, [carregarCulturas]);

  useEffect(() => {
    const loadDados = async () => {
      if (!culturaId || culturas.length === 0) return;
      setLoading(true);
      const found = culturas.find(c => c.id === culturaId);
      setCultura(found || null);
      if (found) {
        const ev = await carregarEventos(culturaId);
        setEventos(ev);
      }
      setLoading(false);
    };
    loadDados();
  }, [culturaId, culturas]);

  const handleNovoEvento = async () => {
    if (!novaObs.trim()) return;
    await adicionarEvento(culturaId, novaData, novoTipo, novaObs);
    const atualizados = await carregarEventos(culturaId);
    setEventos(atualizados);
    setNovaObs('');
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-marrom-medio font-serif">Carregando timeline...</p>
      </div>
    );
  }

  if (!cultura) {
    return (
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-12 shadow-lg text-center font-serif">
        <p className="text-marrom-medio text-lg">Cultura não encontrada.</p>
        <button onClick={onVoltar} className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700">
          ← Voltar
        </button>
      </div>
    );
  }

  const dap = calcularDAP(cultura.dataPlantio);

  return (
    <div>
      {/* Header Cultura */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-8 shadow-lg mb-8 font-serif text-center">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-marrom-escuro hover:text-green-600 mb-4 font-bold"
        >
          ← Voltar às Culturas
        </button>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-marrom-escuro">{cultura.nome}</h1>
          <p className="text-marrom-medio text-lg">
            Plantio: {cultura.dataPlantio.split('-').reverse().join('/')}
          </p>
          <div className="inline-flex items-center gap-4 bg-green-50 p-4 rounded-xl border-2 border-green-200">
            <span className="text-4xl font-bold text-green-600">DAP {dap}</span>
            <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full font-bold">
              Ativa ✅
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold text-marrom-escuro mb-8 font-serif">📈 Timeline de Eventos</h2>

        {eventos.length === 0 ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-12 shadow-lg text-center font-serif">
            <p className="text-marrom-medio text-lg mb-4">Nenhum evento registrado</p>
            <p className="text-sm text-marrom-medio">Use o botão + para adicionar o primeiro!</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-marrom-claro rounded-full" />
            <div className="space-y-6">
              {eventos.map((evento) => {
                const tipoInfo = tiposEvento[evento.tipo];
                const isExpanded = expandedId === evento.id;
                return (
                  <div key={evento.id} className="relative">
                    <div className="absolute left-10 top-8 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                      <span className="text-sm">{tipoInfo?.emoji}</span>
                    </div>
                    <div
                      className={`bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif cursor-pointer hover:shadow-xl transition-all ml-20 ${isExpanded ? 'ring-2 ring-green-200' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : evento.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tipoInfo?.emoji}</span>
                          <div>
                            <h3 className="text-lg font-bold text-marrom-escuro">{tipoInfo?.label}</h3>
                            <p className="text-marrom-medio text-sm">
                              {evento.data.split('-').reverse().join('/')}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t-2 border-marrom-claro">
                          <p className="text-marrom-medio leading-relaxed whitespace-pre-wrap">
                            {evento.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold hover:bg-green-700 active:scale-95 transition-all z-50"
        style={{ boxShadow: '0 15px 35px rgba(46, 125, 50, 0.5)' }}
      >
        +
      </button>

      {/* Modal Novo Evento Rápido */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-marrom-claro rounded-3xl p-8 shadow-2xl max-w-md w-full font-serif">
            <h3 className="text-xl font-bold text-marrom-escuro mb-6">Novo Evento Rápido</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-marrom-escuro font-bold mb-2 text-sm">Data</label>
                <input
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                  className="w-full p-3 border-2 border-marrom-claro rounded-xl font-serif focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-marrom-escuro font-bold mb-2 text-sm">Tipo</label>
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                  className="w-full p-3 border-2 border-marrom-claro rounded-xl font-serif focus:border-green-400 focus:outline-none"
                >
                  {Object.entries(tiposEvento).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                placeholder="Observações rápidas..."
                value={novaObs}
                onChange={(e) => setNovaObs(e.target.value)}
                className="w-full p-3 border-2 border-marrom-claro rounded-xl font-serif focus:border-green-400 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t-4 border-marrom-claro">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-200 text-marrom-escuro rounded-xl font-bold hover:bg-gray-300 font-serif"
              >
                Cancelar
              </button>
              <button
                onClick={handleNovoEvento}
                disabled={!novaObs.trim()}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:bg-gray-400 font-serif"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturaTimeline;
