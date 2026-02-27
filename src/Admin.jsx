import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { criarConvite } from './auth';

function Admin({ user, onVoltar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [convites, setConvites] = useState([]);
  const [emailConvite, setEmailConvite] = useState('');
  const [planoConvite, setPlanoConvite] = useState('essencial'); // ← NOVO
  const [linkGerado, setLinkGerado] = useState('');
  const [loading, setLoading] = useState(true);
  const [gerandoConvite, setGerandoConvite] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    const usuariosSnap = await getDocs(collection(db, 'usuarios'));
    const convitesSnap = await getDocs(collection(db, 'convites'));
    setUsuarios(usuariosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setConvites(convitesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const handleGerarConvite = async () => {
    if (!emailConvite) return;
    setGerandoConvite(true);
    const token = await criarConvite(emailConvite, planoConvite); // ← passa o plano
    const link = `${window.location.origin}/convite?token=${token}`;
    setLinkGerado(link);
    setEmailConvite('');
    setPlanoConvite('essencial');
    await carregarDados();
    setGerandoConvite(false);
  };

  const handleToggleAtivo = async (email, ativoAtual) => {
    await updateDoc(doc(db, 'usuarios', email), { ativo: !ativoAtual });
    await carregarDados();
  };

  // ← NOVO: altera o plano do usuário diretamente
  const handleAlterarPlano = async (email, planoAtual) => {
    const novoPlano = planoAtual === 'essencial' ? 'completo' : 'essencial';
    await updateDoc(doc(db, 'usuarios', email), { plano: novoPlano });
    await carregarDados();
  };

  const handleDeletarConvite = async (token) => {
    await deleteDoc(doc(db, 'convites', token));
    await carregarDados();
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkGerado);
    alert('Link copiado!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-caipira.png" alt="Caipira da Cidade" className="h-10 w-auto" />
          <span className="font-bold text-green-800 text-lg">Admin — Caderneta Caipira</span>
        </div>
        <button onClick={onVoltar} className="text-sm text-gray-600 hover:text-gray-800 underline">
          ← Voltar ao portal
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Gerar convite */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📧 Gerar convite</h2>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={emailConvite}
              onChange={e => setEmailConvite(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {/* ← NOVO: seletor de plano */}
            <select
              value={planoConvite}
              onChange={e => setPlanoConvite(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="essencial">Essencial</option>
              <option value="completo">Completo</option>
            </select>
            <button
              onClick={handleGerarConvite}
              disabled={gerandoConvite || !emailConvite}
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50"
            >
              {gerandoConvite ? 'Gerando...' : 'Gerar link'}
            </button>
          </div>
          {linkGerado && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-3">
              <span className="text-xs text-green-800 break-all">{linkGerado}</span>
              <button onClick={copiarLink} className="text-xs bg-green-700 text-white px-3 py-1 rounded-lg whitespace-nowrap">
                Copiar
              </button>
            </div>
          )}
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👥 Usuários ({usuarios.length})</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {usuarios.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.email}</p>
                    <p className="text-xs text-gray-500">
                      Cadastrado em: {u.cadastradoEm?.toDate?.()?.toLocaleDateString('pt-BR') ?? '—'}
                    </p>
                  </div>
                  {/* ← NOVO: botão de plano + botão ativo/inativo */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAlterarPlano(u.email, u.plano ?? 'essencial')}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        (u.plano ?? 'essencial') === 'completo'
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {(u.plano ?? 'essencial') === 'completo' ? '⭐ Completo' : '🔹 Essencial'}
                    </button>
                    <button
                      onClick={() => handleToggleAtivo(u.email, u.ativo)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        u.ativo
                          ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800'
                          : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      {u.ativo ? '✅ Ativo' : '❌ Inativo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de convites */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎟️ Convites ({convites.length})</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : convites.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum convite gerado.</p>
          ) : (
            <div className="space-y-2">
              {convites.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.email}</p>
                    <p className="text-xs text-gray-500">
                      Plano: <span className="font-medium text-gray-700 capitalize">{c.plano ?? 'essencial'}</span>
                      {' · '}Status: <span className={c.status === 'aceito' ? 'text-green-600' : 'text-amber-600'}>{c.status}</span>
                      {' · '}Expira: {c.expiracao?.toDate?.()?.toLocaleDateString('pt-BR') ?? '—'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletarConvite(c.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Admin;
