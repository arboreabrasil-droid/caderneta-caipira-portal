// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CloudRain, DollarSign, Egg, Sprout, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  }

  // Apps disponíveis
  const apps = [
    {
      id: 'chuvas',
      name: 'Controle de Chuvas',
      description: 'Monitore e registre a precipitação pluviométrica',
      icon: CloudRain,
      color: 'from-blue-500 to-cyan-500',
      available: true,
      route: '/chuvas'
    },
    {
      id: 'financeiro',
      name: 'Controle Financeiro',
      description: 'Gerencie receitas, despesas e fluxo de caixa',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      available: false,
      route: '/financeiro'
    },
    {
      id: 'avicultura',
      name: 'Avicultura',
      description: 'Controle de galinhas, ovos e produção',
      icon: Egg,
      color: 'from-amber-500 to-orange-500',
      available: false,
      route: '/avicultura'
    },
    {
      id: 'horta',
      name: 'Horta',
      description: 'Planeje plantios, colheitas e cultivos',
      icon: Sprout,
      color: 'from-lime-500 to-green-500',
      available: false,
      route: '/horta'
    }
  ];

  return (
    <div className="min-h-screen" style={{background: 'var(--hero-gradient)'}}>
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <CloudRain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Caderneta Caipira</h1>
                <p className="text-xs text-muted-foreground">Gestão Rural Digital</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground hidden sm:inline">
                  {currentUser?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-muted-foreground">
            Escolha um dos aplicativos abaixo para começar a gerenciar sua propriedade
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => app.available && navigate(app.route)}
                className={`bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all p-6 border border-border ${
                  app.available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${app.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {app.available ? (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      ATIVO
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                      EM BREVE
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {app.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {app.description}
                </p>

                {app.available && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-primary text-sm font-semibold flex items-center gap-2">
                      Acessar aplicativo
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-2">
            📱 Novos aplicativos em desenvolvimento
          </h3>
          <p className="text-muted-foreground text-sm">
            Estamos trabalhando para trazer mais ferramentas de gestão para sua propriedade. 
            Os aplicativos marcados como "EM BREVE" serão liberados nas próximas atualizações!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>Desenvolvido com ❤️ para a comunidade Caipira da Cidade</p>
      </footer>
    </div>
  );
}
