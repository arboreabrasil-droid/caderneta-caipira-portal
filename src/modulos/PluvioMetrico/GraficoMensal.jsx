import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const CORES = ['#5D4037','#8B6F47','#A0522D','#6D9B78','#4A7C59'];

export default function GraficoMensal({ registros }) {
  // FIX: extrai ano da string, sem new Date()
  const anos = [...new Set(registros.map(r => parseInt(r.data.split('-')[0])))]
    .sort()
    .slice(-5);

  const dados = MESES.map((mes, i) => {
    const ponto = { mes };
    anos.forEach(ano => {
      ponto[ano] = registros
        .filter(r => {
          const [rAno, rMes] = r.data.split('-');
          // FIX: compara direto da string, sem timezone
          return parseInt(rAno) === ano && parseInt(rMes) - 1 === i;
        })
        .reduce((acc, r) => acc + parseFloat(r.volume_mm || r.volume || 0), 0)
        .toFixed(1);
    });
    return ponto;
  });

  return (
    <div className="bg-white border-4 border-marrom-claro rounded-2xl p-6 shadow-lg font-serif">
      <h2 className="text-xl font-bold text-marrom-escuro mb-6 flex items-center gap-2">
        📊 Comparativo Mensal
      </h2>

      {registros.length === 0 ? (
        <p className="text-marrom-medio text-center py-12">
          Sem dados para exibir ainda. 🌱
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dados} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fontFamily: 'serif', fill: '#8B6F47' }} />
            <YAxis tick={{ fontSize: 12, fontFamily: 'serif', fill: '#8B6F47' }} unit="mm" />
            <Tooltip
              formatter={(value) => [`${value} mm`]}
              contentStyle={{ borderRadius: '12px', border: '2px solid #C4A882', fontFamily: 'serif' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'serif', fontSize: 13 }} />
            {anos.map((ano, i) => (
              <Bar key={ano} dataKey={ano} fill={CORES[i % CORES.length]} radius={[6, 6, 0, 0]} name={String(ano)} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
