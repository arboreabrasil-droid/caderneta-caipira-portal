import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCaderno } from './useCaderno';

const CulturasList = () => {
  const { culturas, carregarCulturas, calcularDAP, statusIcon, criarCultura, loading } = useCaderno();
  const [filtro, setFiltro] = useState('ativas');
  const [showModal, setShowModal] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaData, setNovaData] = useState('');

  useEffect(() => {
    carregarCulturas();
  }, [carregarCulturas]);

  useEffect(() => {
    // Data de plantio default: 30 dias atrás
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    setNovaData(trintaDiasAtras.toISOString().split('T')[0]);
  }, []);

  const filteredCulturas = filtro === 'ativas' 
    ? culturas.filter(c => calcularDAP(c.dataPlantio) < 180)
    : culturas;

  const handleCriarCultura = async () => {
    if (!novoNome.trim()) return;
    
    const novaCultura = await criarCultura(novoNome.trim(), novaData);
    if (novaCultura) {
      setNovoNome('');
      setShowModal(false);
    }
  };

  return (
    <div>
      {/* Filtro Toggle */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-8 shadow-sm">
        <button
          onClick={() => setFiltro('ativas')}
          className={`flex-1 py-4 px-6 rounded-xl font-serif font-bold text-sm transition-all ${
            filtro === 'ativas'
              ? 'bg-white shadow-lg border-2 border-green-600 text-green-700'
              : 'text-marrom-medio hover:bg-white'
          }`}
        >
          🌱 Ativas
        </button>
        <button
          onClick={() => setFiltro('todas')}
          className={`flex-1 py-4 px-6 rounded-xl font-serif font-bold text-sm transition-all ${
            filtro === 'todas'
              ? 'bg-white shadow-lg border-2 border-blue-600 text-blue-700'
              : 'text-marrom-medio hover:bg-white'
          }`}
        >
          📋 Histórico Completo
        </button>
      </div>

      {/* Lista de Culturas */}
      <div className="space-y-4 mb-20">
        {loading ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-12 shadow-lg text-center font-serif">
            Carregando culturas...
          </div>
        ) : filteredCulturas.length === 0 ? (
          <div className="bg-white border-4 border-marrom-claro rounded-2xl p-12 shadow-lg text-center font-serif">
            <p className="text-marrom-medio text-lg mb-6">
              {filtro === 'ativas' ? 'Nenhuma cultura ativa' : 'Nenhuma cultura cadastrada'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700"
            >
              + Nova Cultura
            </button>
          </div>
        ) : (
          filteredCulturas.map((cultura) => {
            const dap = calcularDAP(cultura.dataPlantio);
            const status = dap < 180 ? 'ativa' : 'colhida';
            const si = statusIcon(status);
            
            return (
              <Link
                key={cultura.id}
                to={`/${cultura.id}`}
                className="block bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all font-serif group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`text-4xl group-hover:scale-110 transition-transform ${si.cor || ''}`}>
                      {si.emoji}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-marrom-escuro mb-1 leading-tight">
                        {cultura.nome}
                      </h3>
                      <p className="text-marrom-medio mb-2">
                        Plantio: {cultura.dataPlantio.split('-').reverse().join('/')} 
                        <span className="ml-4 font-bold text-lg text-green-600">
                          DAP {dap}
                        </span>
                      </p>
                      <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                        status === 'ativa' 
                          ? 'bg-green-100 text-green-800 border-2 border-green-400'
                          : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-auto">
                    <span className="block w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-200 transition-all">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold hover:bg-green-700 active:scale-95 transition-all z-50"
        style={{ boxShadow: '0 10px 25px rgba(46, 125, 50, 0.4)' }}
      >
        +
      </button>

      {/* Modal Nova Cultura */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-marrom-claro rounded-3xl p-8 shadow-2xl max-w-md w-full font-serif max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-marrom-escuro mb-6 text-center">🌱 Nova Cultura</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-marrom-escuro font-bold mb-2">Nome da Safra</label>
                <input
                  type="text"
                  placeholder="Ex: Milho Safra 2026"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full p-4 border-2 border-marrom-claro rounded-xl font-serif text-lg focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              
              <div>
                <label className="block text-marrom-escuro font-bold mb-2">Data de Plantio</label>
                <input
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                  className="w-full p-4 border-2 border-marrom-claro rounded-xl font-serif text-lg focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8 pt-6 border-t-4 border-marrom-claro">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 px-6 bg-gray-200 text-marrom-escuro rounded-xl font-bold text-lg hover:bg-gray-300 transition-all font-serif"
              >
                Cancelar
              </button>
              <button
                onClick={handleCriarCultura}
                disabled={!novoNome.trim()}
                className="flex-1 py-4 px-6 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-serif flex items-center justify-center gap-2"
              >
                Criar Cultura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturasList;
