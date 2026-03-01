import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

export function usePluvio() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  async function loadData() {
    if (!userId) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, `usuarios/${userId}/pluvio`),
        orderBy('data', 'desc'),
        where('data', '>=', '2020-01-01') // otimização
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRegistros(data);
      console.log('✅ Firestore carregado:', data.length);
    } catch (err) {
      console.error('❌ Firestore erro:', err);
    } finally {
      setLoading(false);
    }
  }

  async function salvarRegistro(novoRegistro) {
    if (!userId) {
      alert('Faça login novamente');
      return;
    }

    try {
      const { data } = novoRegistro;
      const q = query(
        collection(db, `usuarios/${userId}/pluvio`),
        where('data', '==', data)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.docs.length > 0) {
        // UPDATE
        const docRef = doc(db, `usuarios/${userId}/pluvio`, snapshot.docs[0].id);
        await updateDoc(docRef, novoRegistro);
        console.log('📝 Atualizado:', data);
      } else {
        // CREATE
        await addDoc(collection(db, `usuarios/${userId}/pluvio`), novoRegistro);
        console.log('➕ Criado:', data);
      }
      
      await loadData(); // recarrega lista
    } catch (err) {
      console.error('❌ Save erro:', err);
      alert('Erro ao salvar');
    }
  }

  useEffect(() => {
    if (!userId) {
      setRegistros([]);
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(loadData);
    return unsubscribe;
  }, [userId]);

  return { registros, loading, salvarRegistro };
}
