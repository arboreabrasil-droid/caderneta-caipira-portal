import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Admin from './Admin';
import { MODULOS_POR_PLANO, MODULOS_INFO } from './config/planos';

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

  // Todos os módulos existentes
  const todosModulos = Object.keys(MODULOS_INFO);

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
          <span className="font-bold text-green-800 text-lg">Caderneta Caipira</span>
        </div>
        <div className="flex items-center gap-3">
          {user.email === 'arboreabrasil@gmail.com' && (
            <button
              onClick={() => setMostrarAdmin(true)}
              className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 font-medium"
            >
              ⚙️ Admin
            </button>
          )}
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
          <span className="text-sm text-gray-700 hidden sm:block">{user.displayName}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 underline ml-2"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-1">
          Olá, {user.displayName.split(' ')[0]}! 🌱
        </h2>
        <p className="text-gray-500 text-xs mb-8 capitalize">
          Plano: <span className="font-semibold text-green-700">{plano}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todosModulos.map((id) => {
            const modulo = MODULOS_INFO[id];
            const ativo = modulosAtivos.includes(id);

            return (
              <div
                key={id}
                className={`bg-white rounded-xl shadow-sm p-6 border transition-all
                  ${ativo
                    ? 'border-green-100 hover:shadow-md hover:border-green-300 cursor-pointer'
                    : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="text-3xl mb-3">{modulo.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{modulo.label}</h3>
                <p className="text-xs text-gray-500">
                  {ativo ? '✅ Disponível' : '🔒 Plano Completo'}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Portal;
