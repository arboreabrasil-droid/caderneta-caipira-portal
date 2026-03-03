import React, { useState } from 'react';
import Dashboard from './Dashboard';
import CulturasList from './CulturasList';
import NovoEvento from './NovoEvento';
import CulturaTimeline from './CulturaTimeline';

const CadernoDeCampo = ({ user, onVoltar }) => {
  const [tela, setTela] = useState('dashboard');
  const [culturaAtiva, setCulturaAtiva] = useState(null);

  const navegarPara = (novaTela, culturaId = null) => {
    setCulturaAtiva(culturaId);
    setTela(novaTela);
  };

  const renderHeader = (titulo = 'Caderno de Campo', showBack = false, backTela = 'dashboard') => (
    <div style={{
      background: '#2E7D32',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>
        📓 {titulo}
      </h1>
      {showBack ? (
        <button
          onClick={() => navegarPara(backTela)}
          style={{
            color: 'white',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          ← Voltar
        </button>
      ) : (
        <button
          onClick={onVoltar}
          style={{
            color: 'white',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          ← Portal
        </button>
      )}
    </div>
  );

  const renderTela = () => {
    switch (tela) {
      case 'dashboard':
        return (
          <>
            {renderHeader('Caderno de Campo', false)}
            <div className="max-w-2xl mx-auto p-6 pb-20">
              <Dashboard
                user={user}
                onVerCulturas={() => navegarPara('culturas')}
                onNovoCultura={() => navegarPara('novo')}
                onVerTimeline={(id) => navegarPara('timeline', id)}
              />
            </div>
          </>
        );
      case 'culturas':
        return (
          <>
            {renderHeader('Culturas', true, 'dashboard')}
            <div className="max-w-2xl mx-auto p-6 pb-20">
              <CulturasList
                user={user}
                onVerTimeline={(id) => navegarPara('timeline', id)}
                onNovoEvento={() => navegarPara('novo')}
              />
            </div>
          </>
        );
      case 'novo':
        return (
          <>
            {renderHeader('Novo Evento', true, 'dashboard')}
            <div className="max-w-2xl mx-auto p-6 pb-20">
              <NovoEvento
                user={user}
                culturaPreSelecionada={culturaAtiva}
                onSalvo={(id) => navegarPara('timeline', id)}
                onVoltar={() => navegarPara('dashboard')}
              />
            </div>
          </>
        );
      case 'timeline':
        return (
          <>
            {renderHeader('Timeline', true, 'culturas')}
            <div className="max-w-2xl mx-auto p-6 pb-20">
              <CulturaTimeline
                user={user}
                culturaId={culturaAtiva}
                onNovoEvento={(id) => navegarPara('novo', id)}
                onVoltar={() => navegarPara('culturas')}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderTela()}
    </div>
  );
};

export default CadernoDeCampo;
