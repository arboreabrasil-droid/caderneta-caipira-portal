import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../../firebase';  // ✅ Padrão do Pluviométrico

export const useCaderno = () => {
  const user = auth.currentUser;  // ✅ Direto do Firebase Auth
  const [culturas, setCulturas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calcular DAP (Dias Após Plantio)
  const calcularDAP = (dataPlantio) => {
    if (!dataPlantio) return 0;
    const [ano, mes, dia] = dataPlantio.split('-').map(Number);
    const plantio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const diffTime = hoje - plantio;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Status da cultura baseado em DAP
  const getStatus = (cultura) => {
    const dap = calcularDAP(cultura.dataPlantio);
    if (dap > 180) return 'colhida';
    return 'ativa';
  };

  // Carregar culturas do usuário
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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCulturas(data);
    } catch (error) {
      console.error('Erro carregando culturas:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Carregar eventos de uma cultura
  const carregarEventos = useCallback(async (culturaId) => {
    if (!user?.uid || !culturaId) return [];
    
    try {
      const q = query(
        collection(db, 'caderno_eventos'),
        where('userId', '==', user.uid),
        where('culturaId', '==', culturaId),
        orderBy('data', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro carregando eventos:', error);
      return [];
    }
  }, [user?.uid]);

  // Criar nova cultura
  const criarCultura = async (nome, dataPlantio) => {
    if (!user?.uid || !nome || !dataPlantio) return null;
    
    try {
      const docRef = await addDoc(collection(db, 'caderno_culturas'), {
        userId: user.uid,
        nome,
        dataPlantio,
        status: 'ativa',
        createdAt: serverTimestamp()
      });
      const novaCultura = { id: docRef.id, nome, dataPlantio, status: 'ativa' };
      setCulturas(prev => [novaCultura, ...prev]);
      return novaCultura;
    } catch (error) {
      console.error('Erro criando cultura:', error);
      return null;
    }
  };

  // Adicionar evento
  const adicionarEvento = async (culturaId, data, tipo, observacoes) => {
    if (!user?.uid || !culturaId) return;
    
    try {
      await addDoc(collection(db, 'caderno_eventos'), {
        userId: user.uid,
        culturaId,
        data,
        tipo,
        observacoes,
        fotos: [], // reservado para v2
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro adicionando evento:', error);
    }
  };

  // Status icon
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
    adubo: { emoji: '🌾', label: 'Adubo' },
    defensivo: { emoji: '🛡️', label: 'Defensivo' },
    capina: { emoji: '✂️', label: 'Capina' },
    colheita: { emoji: '📦', label: 'Colheita' }
  };

  return {
    culturas,
    eventos,
    loading,
    calcularDAP,
    getStatus,
    carregarCulturas,
    carregarEventos,
    criarCultura,
    adicionarEvento,
    statusIcon,
    tiposEvento,
    user  // exporta user para debug
  };
};
