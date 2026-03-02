import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import CulturasList from './CulturasList';
import NovoEvento from './NovoEvento';
import CulturaTimeline from './CulturaTimeline';

const CadernoDeCampo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Header padrão do portal
  const renderHeader = () => (
    <div style={{ 
      background: '#2E7D32', 
      color: 'white', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
        📓 Caderno de Campo
      </h1>
      <a 
        href="/" 
        style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontWeight: 500,
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
      >
        ← Voltar ao Portal
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="max-w-2xl mx-auto p-6 pb-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/culturas" element={<CulturasList />} />
          <Route path="/novo" element={<NovoEvento />} />
          <Route path="/:culturaId" element={<CulturaTimeline />} />
        </Routes>
      </div>
    </div>
  );
};

export default CadernoDeCampo;
