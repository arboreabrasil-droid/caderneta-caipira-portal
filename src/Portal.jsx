import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Admin from './Admin';
import { MODULOS_POR_PLANO, MODULOS_INFO } from './config/planos';

const ICONES_MAP = {
  financeiro: '/controle-financeiro.png',
  chuva: '/registro-pluviometrico.png',
  caderno: '/caderno-campo.png',
  animais: '/criacao-animais.png',
  hortas: '/hortas-plantios.png',
};

function Portal({ user, plano }) {
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (mostrarAdmin) {
    return <Admin user={user} onVoltar={() => setMostrarAdmin(false)} />;
  }

  const modulosAtivos = MODULOS_POR_PLANO[plano] ?? MODULOS_POR_PLANO['essencial'];
  const todosModulos = Object.keys(MODULOS_INFO);

  return (
    <div className="min-h-screen bg-bege-claro">
      {/* HEADER VERDE CHAPADO */}
      <header className="bg-[#15803d] shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 font-serif">
        <div className="flex items-center gap-3">
          <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
          <span className="font-bold text-white text-lg">Caderneta Caipira</span>
        </div>
        <div className="flex items-center gap-3">
          {user.email === 'arboreabrasil@gmail.com' && (
            <button
              onClick={() => setMostrarAdmin(true)}
              className="text-xs bg-orange-400 text-white px-3 py-1 rounded-md font-medium hover:bg-orange-500 font-serif"
            >
              ⚙️ Admin
            </button>
          )}
          <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full" />
          <span className="text-sm text-white hidden md:block max-w-32 truncate">
            {user.displayName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-amarelo-claro hover:text-white underline font-medium"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 pt-0 lg:px-16">
        {/* TÍTULO SERIFADA + TEXTO DA REFERÊNCIA */}
        <div className="bg-[#F2E8D8]/90 w-screen -ml-[calc(-50vw+1.5rem)] max-w-none mx-auto px-6 lg:px-8 py-8 shadow-lg font-serif border-t border-[#D4B994]">
          <h1 className="text-4xl lg:text-5xl font-black text-[#5D4037] mb-6 text-center">
            Seus Módulos
          </h1>
          <p className="text-lg text-[#8B6F47] text-center leading-relaxed max-w-4xl mx-auto">
            Escolha o aplicativo que deseja utilizar. Todos os módulos foram pensados para facilitar o dia a dia da sua propriedade.
          </p>
        </div>

        {/* GRID DE MÓDULOS MARROM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {todosModulos.map((id) => {
            const modulo = MODULOS_INFO[id];
            const ativo = modulosAtivos.includes(id);

            return (
              <div
                key={id}
                className={`group bg-white border-4 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  ativo
                    ? 'border-marrom-claro hover:border-marrom-medio hover:-translate-y-1'
                    : 'border-marrom-claro/50 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* ÍCONE GRANDE SEM FUNDO */}
                <div className="w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={ICONES_MAP[id]} 
                    alt={modulo.label}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* TÍTULO SERIFADA */}
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-marrom-escuro mb-4 text-center">
                  {modulo.label}
                </h3>

                {/* DESCRIÇÃO */}
                <p className="text-lg text-marrom-medio leading-relaxed text-center mb-8">
                  {modulo.descricao}
                </p>

                {ativo ? (
                  <button className="w-full bg-marrom-escuro hover:bg-marrom-escuro/90 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 font-serif">
                    Abrir Módulo
                  </button>
                ) : (
                  <div className="bg-marrom-claro/50 border-2 border-marrom-medio/50 rounded-xl p-6 text-center">
                    <p className="text-lg font-semibold text-marrom-escuro font-serif mb-2">Plano Completo</p>
                    <p className="text-sm text-marrom-medio">Atualize para acessar</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* RODAPÉ TARJA MARROM */}
      <footer className="bg-marrom-escuro mt-16 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Caderneta Caipira</h3>
          <p className="text-sm text-amarelo-claro">© 2026 Caipira da Cidade. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Portal;
