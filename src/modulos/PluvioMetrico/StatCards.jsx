import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const StatCards = ({ registros }) => {
  const mesAtual = 2; // Março = 2 (JS: 0=Jan, 1=Fev, 2=Mar)
  const anoAtual = 2026;

  // FIX: Extrai MES/ANO direto da string sem new Date()
  const doMes = registros.filter((r) => {
    const [ano, mesStr] = r.data.split('-');
    const mes = parseInt(mesStr) - 1; // Converte "03" → 2
    return mes === mesAtual && parseInt(ano) === anoAtual;
  });

  const totalMes = doMes.reduce((sum, r) => sum + r.volume, 0).toFixed(1);
  
  console.log('📊 Cards - doMes:', doMes.length, 'Total:', totalMes);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">Total do Mês</Typography>
          <Typography variant="h3">{totalMes} mm</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
