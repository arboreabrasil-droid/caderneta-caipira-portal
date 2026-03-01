import React from 'react';

const StatCards = ({ registros }) => {
  const mesAtual = 2; // Março = 2
  const anoAtual = 2026;

  const doMes = registros.filter((r) => {
    const [ano, mesStr] = r.data.split('-');
    const mes = parseInt(mesStr) - 1;
    return mes === mesAtual && parseInt(ano) === anoAtual;
  });

  // FIX: parseFloat garante número
  const totalMes = doMes
    .reduce((sum, r) => sum + parseFloat(r.volume || 0), 0)
    .toFixed(1);
  
  console.log('📊 Cards OK:', {doMes: doMes.length, total: totalMes});

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '1rem', 
      marginBottom: '2rem' 
    }}>
      <div style={{
        border: '2px solid #1976d2',
        borderRadius: '12px',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Total do Mês</h3>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{totalMes} mm</h1>
      </div>
    </div>
  );
};

export default StatCards;
