import { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const FILE_NAME = 'pluvio.json';

export function usePluvio() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Usa Firebase ID Token (mais estável)
  async function getToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  async function findOrCreateFile(token) {
    const query = `name='${FILE_NAME}' and trashed=false`;
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET'
      }
    );

    if (!res.ok) {
      throw new Error(`Erro Drive API: ${res.status}`);
    }

    const data = await res.json();
    if (data.files?.length > 0) return data.files[0].id;
    
    return await createFile(token);
  }

  async function createFile(token) {
    const metadata = { 
      name: FILE_NAME, 
      parents: ['root'],
      mimeType: 'application/json' 
    };
    
    const body = JSON.stringify({ registros: [] });
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', new Blob([body], {type: 'application/json'}));

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      { 
        method: 'POST', 
        headers: { Authorization: `Bearer ${token}` },
        body: form 
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro criar arquivo: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return data.id;
  }

  async function readFile(token, id) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      throw new Error(`Erro ler arquivo: ${res.status}`);
    }

    return await res.json();
  }

  async function saveFile(token, id, data) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro salvar: ${res.status} ${errorText}`);
    }
  }

  async function loadData(token) {
    try {
      const id = await findOrCreateFile(token);
      const data = await readFile(token, id);
      setRegistros(data.registros || []);
      console.log('✅ Dados carregados:', data.registros?.length || 0);
    } catch (err) {
      console.error('❌ Erro ao carregar:', err);
      setRegistros([]);
    }
  }

  async function salvarRegistro(novoRegistro) {
    const token = await getToken();
    if (!token) {
      alert('Faça login novamente');
      return;
    }

    try {
      const id = await findOrCreateFile(token);
      const existente = registros.findIndex(r => r.data === novoRegistro.data);
      let novosRegistros;

      if (existente >= 0) {
        novosRegistros = registros.map((r, i) => i === existente ? novoRegistro : r);
      } else {
        novosRegistros = [...registros, { ...novoRegistro, id: crypto.randomUUID() }];
      }

      setRegistros(novosRegistros);
      await saveFile(token, id, { registros: novosRegistros });
      console.log('💾 Salvo no Drive:', novosRegistros.length);
    } catch (err) {
      console.error('❌ Erro salvar:', err);
      alert('Erro ao salvar. Tente novamente.');
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRegistros([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = await getToken();
      if (token) {
        await loadData(token);
      } else {
        console.error('❌ Sem token Firebase');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { registros, loading, salvarRegistro };
}
