import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Verifica se o usuário logado tem acesso liberado e retorna o plano
export async function verificarAcesso(email) {
  const usuarioRef = doc(db, 'usuarios', email);
  const usuarioSnap = await getDoc(usuarioRef);

  if (!usuarioSnap.exists() || usuarioSnap.data().ativo !== true) {
    return { acesso: false, plano: null };
  }

  const plano = usuarioSnap.data().plano ?? 'essencial';
  return { acesso: true, plano };
}

// Valida e ativa um convite
export async function ativarConvite(token, email) {
  const convitesRef = collection(db, 'convites');
  const q = query(convitesRef, where('token', '==', token));
  const querySnap = await getDocs(q);

  if (querySnap.empty) {
    return { sucesso: false, erro: 'Convite não encontrado.' };
  }

  const conviteDoc = querySnap.docs[0];
  const convite = conviteDoc.data();

  if (convite.status === 'aceito') {
    return { sucesso: false, erro: 'Este convite já foi utilizado.' };
  }

  const agora = new Date();
  const expiracao = convite.expiracao.toDate();
  if (agora > expiracao) {
    return { sucesso: false, erro: 'Este convite expirou.' };
  }

  if (convite.email !== email) {
    return { sucesso: false, erro: 'Este convite não pertence a este e-mail.' };
  }

  await updateDoc(conviteDoc.ref, { status: 'aceito' });
  await setDoc(doc(db, 'usuarios', email), {
    email,
    ativo: true,
    cadastradoEm: new Date(),
    membroCanal: false,
    plano: convite.plano ?? 'essencial'  // ← única linha que mudou
  });

  return { sucesso: true };
}

// Cria um novo convite (usado pelo painel admin)
export async function criarConvite(email, plano = 'essencial') {
  const token = Math.random().toString(36).substring(2, 10) +
                Math.random().toString(36).substring(2, 10);

  const expiracao = new Date();
  expiracao.setDate(expiracao.getDate() + 7);

  await setDoc(doc(db, 'convites', token), {
    token,
    email,
    plano,
    status: 'pendente',
    criadoEm: new Date(),
    expiracao
  });

  return token;
}
