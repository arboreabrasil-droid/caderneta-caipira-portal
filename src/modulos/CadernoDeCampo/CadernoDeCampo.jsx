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

  const renderHeader = (titulo, showBack = false, backTela = 'dashboard') => (
    <header className="bg-[#15803d] shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 font-serif">
      <div className="flex items-center gap-3">
        <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
        <span className="font-bold text-white text-lg">Caderno de Campo</span>
      </div>
      {showBack ? (
        <button
          onClick={() => navegarPara(backTela)}
          className="text-amarelo-claro hover:text-white underline font-medium text-sm"
        >
          ← Voltar
        </button>
      ) : (
        <button
          onClick={onVoltar}
          className="text-amarelo-claro hover:text-white underline font-medium text-sm"
        >
          ← Voltar ao Portal
        </button>
      )}
    </header>
  );

  const renderTela = () => {
    switch (tela) {
      case 'dashboard':
        return (
          <>
            {renderHeader('Caderno de Campo', false)}
            <div className="max-w-4xl mx-auto px-8 py-8">
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
            <div className="max-w-4xl mx-auto px-8 py-8">
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
            <div className="max-w-4xl mx-auto px-8 py-8">
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
            <div className="max-w-4xl mx-auto px-8 py-8">
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
    <div className="min-h-screen bg-bege-claro flex flex-col">
      <div className="flex-1">
        {renderTela()}
      </div>
      <footer className="bg-marrom-escuro mt-16 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Caderneta Caipira</h3>
          <p className="text-sm text-amarelo-claro">© 2026 Caipira da Cidade. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default CadernoDeCampo;
