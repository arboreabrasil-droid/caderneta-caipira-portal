// src/components/Register.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CloudRain, CheckCircle, XCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Validar token de convite
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError('Link de convite inválido ou expirado.');
        setValidatingToken(false);
        return;
      }

      try {
        const tokenDoc = await getDoc(doc(db, 'inviteTokens', token));

        if (!tokenDoc.exists()) {
          setError('Link de convite inválido ou já utilizado.');
          setTokenValid(false);
        } else {
          const tokenData = tokenDoc.data();

          // Verificar se o token expirou (opcional - 7 dias)
          const createdAt = tokenData.createdAt?.toDate();
          const now = new Date();
          const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);

          if (daysDiff > 7) {
            setError('Link de convite expirado. Solicite um novo link.');
            setTokenValid(false);
          } else {
            setTokenValid(true);
          }
        }
      } catch (err) {
        setError('Erro ao validar convite.');
        console.error(err);
        setTokenValid(false);
      }
      setValidatingToken(false);
    }

    validateToken();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem');
    }

    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres');
    }

    try {
      setError('');
      setLoading(true);

      // Criar usuário
      await signup(email, password);

      // Remover token usado
      await deleteDoc(doc(db, 'inviteTokens', token));

      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado.');
      } else {
        setError('Falha ao criar conta. Tente novamente.');
      }
      console.error(err);
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    try {
      setError('');
      setLoading(true);

      // Login com Google
      await loginWithGoogle();

      // Remover token usado
      await deleteDoc(doc(db, 'inviteTokens', token));

      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao cadastrar com Google.');
      console.error(err);
    }
    setLoading(false);
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{background: 'var(--hero-gradient)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" 
           style={{background: 'var(--hero-gradient)'}}>
        <div className="max-w-md w-full text-center">
          <div className="bg-card rounded-2xl shadow-card p-8">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Convite Inválido</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link 
              to="/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
         style={{background: 'var(--hero-gradient)'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-4 rounded-2xl shadow-card">
              <CloudRain className="w-12 h-12 text-white animate-float" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Bem-vindo!</h2>
          <p className="mt-2 text-muted-foreground">
            Crie sua conta na Caderneta Caipira
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-medium">Convite válido</span>
          </div>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                placeholder="Digite a senha novamente"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Cadastro com Google */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-lg font-semibold border border-border hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Cadastrando...' : 'Cadastrar com Google'}
          </button>

          {/* Link para login */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Faça login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Desenvolvido com ❤️ para a comunidade Caipira da Cidade
        </p>
      </div>
    </div>
  );
}
