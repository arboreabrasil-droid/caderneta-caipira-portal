import React from 'react';
import { usePluvio } from './usePluvio';
import StatCards from './StatCards';
import FormRegistro from './FormRegistro';
import ListaRecentes from './ListaRecentes';
import GraficoMensal from './GraficoMensal';
import GraficoAnual from './GraficoAnual';

export default function PluvioMetrico({ user, onVoltar }) {
  const { registros, loading, salvarRegistro } = usePluvio();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bege-claro">
        <p className="text-marrom-medio font-serif text-lg animate-pulse">
          🌧️ Carregando dados...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bege-claro">
      <header className="bg-[#15803d] shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 font-serif">
        <div className="flex items-center gap-3">
          <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
          <span className="font-bold text-white text-lg">Registro Pluviométrico</span>
        </div>
        <button
          onClick={onVoltar}
          className="text-sm text-amarelo-claro hover:text-white underline font-medium font-serif"
        >
          ← Voltar ao Portal
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <StatCards registros={registros} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <FormRegistro onSalvar={salvarRegistro} />
            <ListaRecentes registros={registros} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <GraficoMensal registros={registros} />
            <GraficoAnual registros={registros} />
          </div>
        </div>
      </main>

      <footer className="bg-marrom-escuro mt-16 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Caderneta Caipira</h3>
          <p className="text-sm text-amarelo-claro">© 2026 Caipira da Cidade. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
