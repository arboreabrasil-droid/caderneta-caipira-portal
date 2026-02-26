import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Admin from './Admin';

function Portal({ user }) {
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (mostrarAdmin) {
    return <Admin user={user} onVoltar={() => setMostrarAdmin(false)} />;
  }

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
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Olá, {user.displayName.split(' ')[0]}! 🌱
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          Bem-vindo ao seu portal de gestão rural.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 mb-1">Financeiro</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="font-bold text-gray-800 mb-1">Hortas e Plantios</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">🐔</div>
            <h3 className="font-bold text-gray-800 mb-1">Criação de Animais</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">🌧️</div>
            <h3 className="font-bold text-gray-800 mb-1">Controle de Chuvas</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">📓</div>
            <h3 className="font-bold text-gray-800 mb-1">Caderno de Campo</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-gray-800 mb-1">Configurações</h3>
            <p className="text-xs text-gray-500">Em breve</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Portal;
