import React, { useState } from 'react';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const TERMS_VERSION = '2026-02-27';

function AceiteTermos({ user, onAceitou }) {
  const [checked, setChecked] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const aceitar = async () => {
    setErro('');
    if (!checked) {
      setErro('Marque a caixa para aceitar e continuar.');
      return;
    }

    try {
      setSalvando(true);

      // Estado atual no perfil do usuário
      await updateDoc(doc(db, 'usuarios', user.email), {
        aceitouTermos: true,
        aceitouTermosEm: serverTimestamp(),
        versaoTermos: TERMS_VERSION,
      });

      // Log histórico (auditoria)
      await addDoc(collection(db, 'logs_aceites'), {
        email: user.email,
        uid: user.uid ?? null,
        versaoTermos: TERMS_VERSION,
        aceitouEm: serverTimestamp(),
        userAgent: navigator.userAgent,
      });

      onAceitou?.();
    } catch (e) {
      console.error(e);
      setErro('Não foi possível registrar seu aceite. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow p-6 border border-gray-100">
        <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-12 w-auto mb-4" />
        <h1 className="text-xl font-bold text-green-800 mb-2">Termos e Privacidade</h1>
        <p className="text-sm text-gray-600 mb-4">
          Para continuar usando o portal, você precisa ler e aceitar os termos.
        </p>

        <a
          className="text-sm text-green-700 underline"
          href="/termos"
          target="_blank"
          rel="noreferrer"
        >
          Abrir termos (nova aba)
        </a>

        <label className="flex items-start gap-3 text-sm text-gray-700 mt-4">
          <input
            type="checkbox"
            className="mt-1"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>Li e aceito os Termos e Política de Privacidade (versão {TERMS_VERSION}).</span>
        </label>

        {erro && <p className="text-sm text-red-600 mt-3">{erro}</p>}

        <button
          onClick={aceitar}
          disabled={salvando}
          className="w-full mt-5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 rounded-xl"
        >
          {salvando ? 'Salvando...' : 'Aceitar e continuar'}
        </button>

        <p className="text-[11px] text-gray-500 mt-3">
          O aceite é registrado com sua conta Google e data/hora do servidor.
        </p>
      </div>
    </div>
  );
}

export default AceiteTermos;
