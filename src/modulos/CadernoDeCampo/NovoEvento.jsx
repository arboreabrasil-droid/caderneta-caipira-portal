import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCaderno } from './useCaderno';

const NovoEvento = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { culturas, criarCultura, adicionarEvento, tiposEvento, loading } = useCaderno();
  
  const [culturaId, setCulturaId] = useState('');
  const [isNovaCultura, setIsNovaCultura] = useState(false);
  const [novaCulturaNome, setNovaCulturaNome] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('adubo');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    // Data default: hoje
    const hoje = new Date().toISOString().split('T')[0];
    setData(hoje);
    
    // Pré-seleciona cultura da query string
    const culturaParam = searchParams.get('cultura');
    if (culturaParam && culturas.length > 0) {
      setCulturaId(culturaParam);
    } else if (culturas.length > 0) {
      setCulturaId(culturas[0].id);
    }
  }, [culturas, searchParams]);

  const handleSalvar = async () => {
    let targetCulturaId = culturaId;
    
    // Cria nova cultura se necessário
    if (isNovaCultura && novaCulturaNome.trim()) {
      const novaCultura = await criarCultura(novaCulturaNome.trim(), data);
      if (novaCultura) {
        targetCulturaId = novaCultura.id;
      } else {
        alert('Erro ao criar cultura');
        return;
      }
    }
    
    if (!targetCulturaId) {
      alert('Selecione uma cultura');
      return;
    }
    
    // Adiciona evento
    await adicionarEvento(targetCulturaId, data, tipo, observacoes.trim());
    
    // Redireciona para timeline da cultura
    navigate(`/${targetCulturaId}`);
  };

  const culturaSelecionada = culturas.find(c => c.id === culturaId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-marrom-escuro font-serif text-center mb-2">
        Novo Evento Agrícola
      </h1>
      
      {/* Cultura */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <label className="block text-lg font-bold text-marrom-escuro mb-4">🌾 Cultura</label>
        
        {!isNovaCultura ? (
          <div className="space-y-3">
            <select
              value={culturaId}
              onChange={(e) => setCulturaId(e.target.value)}
              className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
              disabled={loading}
            >
              <option value="">Selecione uma cultura...</option>
              {culturas.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.dataPlantio.split('-').reverse().join('/')})
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsNovaCultura(true)}
              className="w-full py-3 px-4 bg-green-100 text-green-800 border-2 border-green-300 rounded-xl font-bold hover:bg-green-200 transition-all font-serif"
            >
              + Criar nova cultura
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome da nova cultura (ex: Milho 2026)"
              value={novaCulturaNome}
              onChange={(e) => setNovaCulturaNome(e.target.value)}
              className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <button
              onClick={() => setIsNovaCultura(false)}
              className="w-full py-3 px-4 bg-gray-100 text-marrom-escuro border-2 border-marrom-claro rounded-xl font-bold hover:bg-gray-200 transition-all font-serif"
            >
              ← Usar cultura existente
            </button>
          </div>
        )}
        
        {culturaSelecionada && (
          <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-bold">
              ✅ {culturaSelecionada.nome} selecionada
            </p>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <label className="block text-lg font-bold text-marrom-escuro mb-4">📅 Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {/* Tipo de Evento */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <label className="block text-lg font-bold text-marrom-escuro mb-6">🎯 Tipo de Evento</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(tiposEvento).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setTipo(key)}
              className={`p-6 rounded-2xl border-4 font-serif font-bold text-lg transition-all flex flex-col items-center gap-2 hover:shadow-xl ${
                tipo === key
                  ? 'border-green-600 bg-green-50 shadow-lg text-green-800'
                  : 'border-marrom-claro hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <span className="text-4xl">{info.emoji}</span>
              <span className="text-sm">{info.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <label className="block text-lg font-bold text-marrom-escuro mb-4">📝 Observações</label>
        <textarea
          rows={5}
          placeholder="Ex: NPK 200kg/ha aplicado às 8h, bom pegamento, sem pragas visíveis..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif resize-vertical focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSalvar}
        disabled={!culturaId || !data || !observacoes.trim()}
        className="w-full bg-green-600 text-white py-6 px-8 rounded-2xl shadow-2xl font-serif font-bold text-xl flex items-center justify-center gap-3 hover:bg-green-700 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 10px 25px rgba(46, 125, 50, 0.4)' }}
      >
        💾 Salvar Evento
      </button>
    </div>
  );
};

export default NovoEvento;
