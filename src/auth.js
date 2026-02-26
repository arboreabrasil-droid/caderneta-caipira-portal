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

// Verifica se o usuário logado tem acesso liberado
export async function verificarAcesso(email) {
  const usuarioRef = doc(db, 'usuarios', email);
  const usuarioSnap = await getDoc(usuarioRef);
  return usuarioSnap.exists() && usuarioSnap.data().ativo === true;
}

// Valida e ativa um convite
export async function ativarConvite(token, email) {
  // Busca o convite pelo token
  const convitesRef = collection(db, 'convites');
  const q = query(convitesRef, where('token', '==', token));
  const querySnap = await getDocs(q);

  if (querySnap.empty) {
    return { sucesso: false, erro: 'Convite não encontrado.' };
  }

  const conviteDoc = querySnap.docs[0];
  const convite = conviteDoc.data();

  // Verifica se já foi usado
  if (convite.status === 'aceito') {
    return { sucesso: false, erro: 'Este convite já foi utilizado.' };
  }

  // Verifica se expirou
  const agora = new Date();
  const expiracao = convite.expiracao.toDate();
  if (agora > expiracao) {
    return { sucesso: false, erro: 'Este convite expirou.' };
  }

  // Verifica se o e-mail bate com o convite
  if (convite.email !== email) {
    return { sucesso: false, erro: 'Este convite não pertence a este e-mail.' };
  }

  // Ativa o convite e cria o usuário
  await updateDoc(conviteDoc.ref, { status: 'aceito' });
  await setDoc(doc(db, 'usuarios', email), {
    email,
    ativo: true,
    cadastradoEm: new Date(),
    membroCanal: false
  });

  return { sucesso: true };
}

// Cria um novo convite (usado pelo painel admin)
export async function criarConvite(email) {
  const token = Math.random().toString(36).substring(2, 10) +
                Math.random().toString(36).substring(2, 10);

  const expiracao = new Date();
  expiracao.setDate(expiracao.getDate() + 7); // expira em 7 dias

  await setDoc(doc(db, 'convites', token), {
    token,
    email,
    status: 'pendente',
    criadoEm: new Date(),
    expiracao
  });

  return token;
}
