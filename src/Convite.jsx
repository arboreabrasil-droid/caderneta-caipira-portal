import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase';
import { ativarConvite, verificarAcesso } from './auth';

function Convite() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('aguardando'); // aguardando | processando | sucesso | erro
  const [mensagem, setMensagem] = useState('');

  const token = new URLSearchParams(window.location.search).get('token') ||
                window.location.pathname.split('/convite/')[1];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && token) {
        setStatus('processando');
        const jaTemAcesso = await verificarAcesso(currentUser.email);
        if (jaTemAcesso) {
          setStatus('sucesso');
          setMensagem('Você já tem acesso! Redirecionando...');
          setTimeout(() => window.location.href = '/', 2000);
          return;
        }
        const resultado = await ativarConvite(token, currentUser.email);
        if (resultado.sucesso) {
          setStatus('sucesso');
          setMensagem('Convite ativado com sucesso! Bem-vindo à Caderneta Caipira! 🌱');
          setTimeout(() => window.location.href = '/', 2000);
        } else {
          setStatus('erro');
          setMensagem(resultado.erro);
        }
      }
    });
    return () => unsubscribe();
  }, [token]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setStatus('aguardando');
    setMensagem('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-6">
      <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-16 w-auto mb-6" />
      <h1 className="text-2xl font-bold text-green-800 mb-2">Caderneta Caipira</h1>
      <p className="text-gray-600 text-sm mb-8">Ativação de convite</p>

      {!token && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm text-center">
          <p className="text-red-700 text-sm">Link de convite inválido ou incompleto.</p>
        </div>
      )}

      {token && status === 'aguardando' && !user && (
        <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full text-center">
          <p className="text-gray-700 text-sm mb-4">
            Você recebeu um convite! Faça login com Google para ativar seu acesso.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">Continuar com Google</span>
          </button>
        </div>
      )}

      {status === 'processando' && (
        <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full text-center">
          <p className="text-gray-600 text-sm">Verificando convite...</p>
        </div>
      )}

      {status === 'sucesso' && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-6 max-w-sm w-full text-center">
          <p className="text-green-800 font-medium">{mensagem}</p>
        </div>
      )}

      {status === 'erro' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-sm w-full text-center">
          <p className="text-red-700 text-sm mb-4">{mensagem}</p>
          {user && (
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Tentar com outro e-mail
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Convite;
