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

  // Módulos liberados para o plano do usuário
  const modulosAtivos = MODULOS_POR_PLANO[plano] ?? MODULOS_POR_PLANO['essencial'];
  const todosModulos = Object.keys(MODULOS_INFO);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 sticky top-0 z-50 border-b border-green-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
            <span className="font-bold text-green-800 text-lg">Caderneta Caipira</span>
          </div>
          <div className="flex items-center gap-3">
            {user.email === 'arboreabrasil@gmail.com' && (
              <button
                onClick={() => setMostrarAdmin(true)}
                className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full hover:shadow-md font-medium transition-all"
              >
                ⚙️ Admin
              </button>
            )}
            <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full ring-2 ring-green-200" />
            <span className="text-sm text-gray-700 hidden md:block max-w-32 truncate">
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 underline font-medium ml-2 hover:no-underline"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 lg:p-8 pb-12">
        {/* Header personalizado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Seus Módulos
          </h1>
          <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
            Tudo que você precisa para organizar a fazenda em um só lugar
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-6">
            <span className="bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm text-green-800 font-semibold">
              Plano: <span className="capitalize">{plano}</span>
            </span>
            <span className="bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm text-gray-700 font-semibold">
              {modulosAtivos.length} módulos disponíveis
            </span>
          </div>
        </div>

        {/* Grid de módulos turbinado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {todosModulos.map((id) => {
            const modulo = MODULOS_INFO[id];
            const ativo = modulosAtivos.includes(id);

            return (
              <div
                key={id}
                className={`group bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl border-2 transition-all duration-500 overflow-hidden hover:scale-[1.02] hover:-translate-y-2 ${
                  ativo
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-300 cursor-pointer'
                    : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 cursor-not-allowed opacity-75'
                }`}
              >
                {/* Ícone GRANDE sem fundo */}
                <div className="p-8 pb-2">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <img 
                    src={ICONES_MAP[id]} 
                    alt={modulo.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

                {/* Conteúdo */}
                <div className="p-6 lg:p-8 pb-8">
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                    {modulo.label}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-6 line-clamp-2">
                    {modulo.descricao || 'Módulo para gestão da fazenda.'}
                  </p>
                  
                  {ativo ? (
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                      🚀 Abrir Módulo
                    </button>
                  ) : (
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-200 rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 bg-orange-300 rounded-xl flex items-center justify-center mx-auto mb-3">
                        🔒
                      </div>
                      <p className="text-sm font-semibold text-orange-800 mb-1">Plano Completo</p>
                      <p className="text-xs text-orange-700">Atualize para acessar</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Portal;
