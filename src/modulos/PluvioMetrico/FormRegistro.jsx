import React, { useState } from 'react';

export default function FormRegistro({ onSalvar, loading }) {
  const [data, setData] = useState(() => {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${ano}-${mes}-${dia}`;
});
  const [volume, setVolume] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data || !volume) return;
    setSalvando(true);
    await onSalvar({
      data,
      volume_mm: parseFloat(volume),
      observacoes,
    });
    setVolume('');
    setObservacoes('');
    setSalvando(false);
  };

  return (
    <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
      <h2 className="text-xl font-bold text-marrom-escuro mb-6 flex items-center gap-2">
        🌧️ Registrar Chuva
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* DATA */}
        <div>
          <label className="block text-sm font-semibold text-marrom-escuro mb-1">
            Data
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif"
          />
        </div>

        {/* VOLUME */}
        <div>
          <label className="block text-sm font-semibold text-marrom-escuro mb-1">
            Volume (mm)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0.0"
              required
              className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 pr-14 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-marrom-medio font-semibold text-sm">
              mm
            </span>
          </div>
        </div>

        {/* OBSERVAÇÕES */}
        <div>
          <label className="block text-sm font-semibold text-marrom-escuro mb-1">
            Observações <span className="font-normal text-marrom-medio">(opcional)</span>
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: chuva forte à tarde..."
            rows={3}
            className="w-full border-2 border-marrom-claro rounded-xl px-4 py-2 text-marrom-escuro focus:outline-none focus:border-marrom-escuro font-serif resize-none"
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={salvando || !volume}
          className="w-full bg-marrom-escuro hover:bg-marrom-escuro/90 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 font-serif"
        >
          {salvando ? '💾 Salvando...' : '💧 Salvar Registro'}
        </button>
      </form>
    </div>
  );
}
