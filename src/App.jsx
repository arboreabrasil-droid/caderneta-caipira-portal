import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase';
import { verificarAcesso } from './auth';
import Portal from './Portal';

function App() {
  const [user, setUser] = useState(null);
  const [acesso, setAcesso] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setVerificando(true);
        const temAcesso = await verificarAcesso(currentUser.email);
        setAcesso(temAcesso);
        setVerificando(false);
      } else {
        setAcesso(false);
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAcesso(false);
  };

  if (loading || verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (user && acesso) {
    return <Portal user={user} />;
  }

  if (user && !acesso) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 p-6">
        <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-16 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Acesso não autorizado</h2>
        <p className="text-gray-600 text-sm text-center max-w-sm mb-6">
          O e-mail <strong>{user.email}</strong> não possui um convite ativo.
        </p>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 underline">
          Sair e tentar com outro e-mail
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative w-full lg:w-1/2 min-h-[200px] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80')" }}>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col justify-between text-white min-h-[200px] lg:min-h-screen">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 sm:h-12 lg:h-14 w-auto object-contain" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold">CAIPIRA DA CIDADE</span>
          </div>
          <div className="mt-4 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">Caderneta Caipira</h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-md">
              Seu portal de ferramentas e aplicativos para a vida no campo.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-sm sm:text-base text-gray-600">Entre com sua conta Google para acessar seus aplicativos</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">Continuar com Google</span>
          </button>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            Não tem acesso?{' '}
            <span className="text-green-700 font-semibold">Solicite um convite no canal</span>
          </p>
          <p className="mt-8 text-center text-[10px] sm:text-xs text-gray-500">
            © 2026 Caipira da Cidade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
