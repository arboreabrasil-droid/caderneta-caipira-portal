import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';

export const useCaderno = (user) => {  // ← recebe user como parâmetro
  const [culturas, setCulturas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  const calcularDAP = (dataPlantio) => {
    if (!dataPlantio) return 0;
    const [ano, mes, dia] = dataPlantio.split('-').map(Number);
    const plantio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    return Math.floor((hoje - plantio) / (1000 * 60 * 60 * 24));
  };

  const statusIcon = (status) => {
    const icons = {
      ativa: { emoji: '✅', cor: 'text-green-600' },
      colhida: { emoji: '⏳', cor: 'text-yellow-600' },
      arquivada: { emoji: '📦', cor: 'text-gray-500' }
    };
    return icons[status] || icons.ativa;
  };

  const tiposEvento = {
    plantio: { emoji: '🌱', label: 'Plantio' },
    adubo:   { emoji: '🌾', label: 'Adubo' },
    defensivo: { emoji: '🛡️', label: 'Defensivo' },
    capina:  { emoji: '✂️', label: 'Capina' },
    colheita: { emoji: '📦', label: 'Colheita' }
  };

  const carregarCulturas = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'caderno_culturas'),
        where('userId', '==', user.uid),
        orderBy('dataPlantio', 'desc')
      );
      const snapshot = await getDocs(q);
      setCulturas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Erro carregando culturas:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const carregarEventos = useCallback(async (culturaId) => {
    if (!user?.uid || !culturaId) return [];
    try {
      const q = query(
        collection(db, 'caderno_eventos'),
        where('culturaId', '==', culturaId),  // culturaId primeiro
        where('userId', '==', user.uid),      // userId segundo
        orderBy('data', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro carregando eventos:', error);
      return [];
    }
  }, [user?.uid]);

  const criarCultura = async (nome, dataPlantio) => {
    if (!user?.uid) return null;
    try {
      const docRef = await addDoc(collection(db, 'caderno_culturas'), {
        userId: user.uid,
        nome,
        dataPlantio,
        status: 'ativa',
        createdAt: serverTimestamp()
      });
      const nova = { id: docRef.id, nome, dataPlantio, status: 'ativa' };
      setCulturas(prev => [nova, ...prev]);
      return nova;
    } catch (error) {
      console.error('Erro criando cultura:', error);
      return null;
    }
  };

  const adicionarEvento = async (culturaId, data, tipo, observacoes) => {
  console.log('adicionarEvento chamado:', { culturaId, data, tipo, observacoes });
  console.log('user:', user?.uid);
  
  if (!user?.uid) {
    console.log('BLOQUEADO: user.uid ausente');
    return;
  }
  
  try {
    await addDoc(collection(db, 'caderno_eventos'), {
      userId: user.uid,
      culturaId,
      data,
      tipo,
      observacoes,
      fotos: [],
      createdAt: serverTimestamp()
    });
    console.log('Evento salvo com sucesso!');
  } catch (error) {
    console.error('Erro adicionando evento:', error);
  }
};

  return {
    culturas,
    eventos,
    loading,
    calcularDAP,
    statusIcon,
    tiposEvento,
    carregarCulturas,
    carregarEventos,
    criarCultura,
    adicionarEvento
  };
};
