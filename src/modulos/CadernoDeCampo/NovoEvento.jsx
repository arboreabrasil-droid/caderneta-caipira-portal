import React, { useState, useEffect } from 'react';
import { useCaderno } from './useCaderno';

const NovoEvento = ({ user, culturaPreSelecionada, onSalvo, onVoltar }) => {
  const { culturas, carregarCulturas, criarCultura, adicionarEvento, tiposEvento } = useCaderno(user);

  const [culturaId, setCulturaId] = useState('');
  const [isNovaCultura, setIsNovaCultura] = useState(false);
  const [novaCulturaNome, setNovaCulturaNome] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('adubo');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCulturas();
    setData(new Date().toISOString().split('T')[0]);
  }, [carregarCulturas]);

  useEffect(() => {
    if (culturaPreSelecionada) {
      setCulturaId(culturaPreSelecionada);
    } else if (culturas.length > 0) {
      setCulturaId(culturas[0].id);
    }
  }, [culturas, culturaPreSelecionada]);

  const handleSalvar = async () => {
    console.log('handleSalvar chamado!');
    console.log('culturaId:', culturaId);
    console.log('observacoes:', observacoes);
    console.log('data:', data);
    console.log('tipo:', tipo);
    setSalvando(true);
    let targetId = culturaId;

    if (isNovaCultura) {
      if (!novaCulturaNome.trim()) {
        alert('Informe o nome da nova cultura.');
        setSalvando(false);
        return;
      }
      const nova = await criarCultura(novaCulturaNome.trim(), data);
      if (!nova) {
        alert('Erro ao criar cultura.');
        setSalvando(false);
        return;
      }
      targetId = nova.id;
    }

    if (!targetId) {
      alert('Selecione uma cultura.');
      setSalvando(false);
      return;
    }

    await adicionarEvento(targetId, data, tipo, observacoes.trim());
    setSalvando(false);
    onSalvo(targetId);
  };

  const culturaSelecionada = culturas.find(c => c.id === culturaId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-marrom-escuro font-serif text-center">
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
              className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none"
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
              className="w-full py-3 bg-green-100 text-green-800 border-2 border-green-300 rounded-xl font-bold hover:bg-green-200 transition-all font-serif"
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
              className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none"
            />
            <button
              onClick={() => setIsNovaCultura(false)}
              className="w-full py-3 bg-gray-100 text-marrom-escuro border-2 border-marrom-claro rounded-xl font-bold hover:bg-gray-200 font-serif"
            >
              ← Usar cultura existente
            </button>
          </div>
        )}
        {culturaSelecionada && (
          <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-bold">✅ {culturaSelecionada.nome} selecionada</p>
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
          className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif focus:border-green-400 focus:outline-none"
        />
      </div>

      {/* Tipo de Evento */}
      <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
        <label className="block text-lg font-bold text-marrom-escuro mb-4">🎯 Tipo de Evento</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(tiposEvento).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setTipo(key)}
              className={`p-5 rounded-2xl border-4 font-serif font-bold transition-all flex flex-col items-center gap-2 hover:shadow-lg ${
                tipo === key
                  ? 'border-green-600 bg-green-50 shadow-lg text-green-800'
                  : 'border-marrom-claro hover:border-green-300 bg-white text-marrom-medio'
              }`}
            >
              <span className="text-3xl">{info.emoji}</span>
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
          placeholder="Ex: NPK 200kg/ha, bom pegamento, sem pragas visíveis..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-4 border-2 border-marrom-claro rounded-xl text-lg font-serif resize-vertical focus:border-green-400 focus:outline-none"
        />
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={onVoltar}
          className="flex-1 py-5 bg-gray-200 text-marrom-escuro rounded-2xl font-serif font-bold text-lg hover:bg-gray-300 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="flex-1 py-5 bg-green-600 text-white rounded-2xl font-serif font-bold text-lg shadow-xl hover:bg-green-700 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 10px 25px rgba(46, 125, 50, 0.4)' }}
        >
          {salvando ? '⏳ Salvando...' : '💾 Salvar Evento'}
        </button>
      </div>
    </div>
  );
};

export default NovoEvento;
