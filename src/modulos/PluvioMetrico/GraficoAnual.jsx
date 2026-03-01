import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CORES = ['#5D4037','#8B6F47','#A0522D','#6D9B78','#4A7C59'];

export default function GraficoAnual({ registros }) {
  const anos = [...new Set(registros.map(r => new Date(r.data).getFullYear()))].sort();

  const dados = anos.map(ano => ({
    ano: String(ano),
    total: registros
      .filter(r => new Date(r.data).getFullYear() === ano)
      .reduce((acc, r) => acc + r.volume_mm, 0)
      .toFixed(1),
  }));

  return (
    <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
      <h2 className="text-xl font-bold text-marrom-escuro mb-6 flex items-center gap-2">
        📅 Total por Ano
      </h2>

      {registros.length === 0 ? (
        <p className="text-marrom-medio text-center py-12">
          Sem dados para exibir ainda. 🌱
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dados} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
            <XAxis
              dataKey="ano"
              tick={{ fontSize: 13, fontFamily: 'serif', fill: '#8B6F47' }}
            />
            <YAxis
              tick={{ fontSize: 12, fontFamily: 'serif', fill: '#8B6F47' }}
              unit="mm"
            />
            <Tooltip
              formatter={(value) => [`${value} mm`, 'Total']}
              contentStyle={{
                borderRadius: '12px',
                border: '2px solid #C4A882',
                fontFamily: 'serif',
              }}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} name="Total anual">
              {dados.map((_, i) => (
                <Cell key={i} fill={CORES[i % CORES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
