import React from 'react';
import './styles/index.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Caderneta Caipira
          </h1>
          <p className="mt-2 text-gray-600">Portal de Gestão Rural</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Entrar
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem acesso? Solicite seu convite no canal!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
