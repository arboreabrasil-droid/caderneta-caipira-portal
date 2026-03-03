import React, { useState, useEffect } from 'react';
import { useCaderno } from './useCaderno';

const NovoEvento = ({ user, culturaPreSelecionada, onSalvo, onVoltar }) => {
  const { culturas, carregarCulturas, criarCultura, adicionarEvento, tiposEvento } = useCaderno(user);

  const [culturaId, setCulturaId] = useState('');
  const [isNovaCultura, setIsNovaCultura] = useState(false);
  const [novaCulturaNome, setNovaCulturaNome] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('plantio');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCulturas();
    setData(new Date().toISOString().split('T')[0]);
  }, [carregarCulturas]);

  useEffect(() => {
    if (culturaPreSelecionada) setCulturaId(culturaPreSelecionada);
    else if (culturas.length > 0) setCulturaId(culturas[0].id);
  }, [culturas, culturaPreSelecionada]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    let targetId = culturaId;

    if (isNovaCultura) {
      if (!novaCulturaNome.trim()) { setSalvando(false); return; }
      const nova = await criarCultura(novaCulturaNome.trim(), data);
      if (!nova) { setSalvando(false); return; }
      targetId = nova.id;
    }

    if (!targetId || !observacoes.trim()) { setSalvando(false); return; }

    await adicionarEvento(targetId, data, tipo, observacoes.trim());
    setSalvando(false);
    onSalvo(targetId);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSalvar} className="flex flex-col gap-6">

        {/* Cultura */}
        <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
          <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
            🌾 Cultura
          </h2>
          {!isNovaCultura ? (
            <div className="flex flex-col gap-3">
              <select
                value={culturaId}
                onChange={(e) => setCulturaId(e.target.value)}
                required
                className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif"
              >
                <option value="">Selecione uma cultura...</option>
                {culturas.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.dataPlantio.split('-').reverse().join('/')})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsNovaCultura(true)}
                className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-medio hover:border-marrom-escuro hover:text-marrom-escuro font-serif font-semibold transition-all"
              >
                + Cadastrar nova cultura
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome da cultura (ex: Milho Safra 2026)"
                value={novaCulturaNome}
                onChange={(e) => setNovaCulturaNome(e.target.value)}
                className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif"
              />
              <button
                type="button"
                onClick={() => setIsNovaCultura(false)}
                className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-medio hover:border-marrom-escuro font-serif font-semibold transition-all"
              >
                ← Usar cultura existente
              </button>
            </div>
          )}
        </div>

        {/* Data */}
        <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
          <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
            📅 Data
          </h2>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif"
          />
        </div>

        {/* Tipo */}
        <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
          <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
            🎯 Tipo de Evento
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(tiposEvento).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTipo(key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 font-serif font-semibold text-sm transition-all ${
                  tipo === key
                    ? 'border-marrom-escuro bg-marrom-claro text-marrom-escuro shadow-md'
                    : 'border-marrom-claro text-marrom-medio hover:border-marrom-escuro'
                }`}
              >
                <span className="text-2xl">{info.emoji}</span>
                <span>{info.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
          <h2 className="text-xl font-bold text-marrom-escuro mb-4 flex items-center gap-2">
            📝 Observações
          </h2>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: NPK 200kg/ha, sem pragas visíveis..."
            rows={4}
            required
            className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif resize-none"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onVoltar}
            className="flex-1 border-4 border-marrom-claro bg-white text-marrom-escuro py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:border-marrom-escuro transition-all font-serif"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !observacoes.trim()}
            className="flex-1 bg-marrom-escuro hover:bg-marrom-escuro/90 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all font-serif"
          >
            {salvando ? '💾 Salvando...' : '🌱 Salvar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoEvento;
