import { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const FOLDER_NAME = 'Caderneta Caipira';
const FILE_NAME = 'pluvio.json';

async function getAccessToken() {
  const user = auth.currentUser;
  if (!user) return null;
  const token = await user.getIdToken();
  return token;
}

async function getGoogleAccessToken() {
  return new Promise((resolve) => {
    const user = auth.currentUser;
    user.getIdTokenResult().then((result) => {
      resolve(result.token);
    });
  });
}

export function usePluvio() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [fileId, setFileId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Pega o token OAuth do Google (não o Firebase)
        const credential = await user.getIdTokenResult();
        // O token OAuth fica no objeto do provider
        const oauthToken = user.stsTokenManager?.accessToken || 
                          sessionStorage.getItem('google_oauth_token');
        setAccessToken(oauthToken);
        if (oauthToken) await loadData(oauthToken);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function loadData(token) {
    try {
      // Busca ou cria arquivo no Drive
      const id = await findOrCreateFile(token);
      setFileId(id);
      const data = await readFile(token, id);
      setRegistros(data.registros || []);
    } catch (err) {
      console.error('Erro ao carregar pluvio:', err);
    }
  }

  async function findOrCreateFile(token) {
    const query = `name='${FILE_NAME}' and trashed=false`;
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.files?.length > 0) return data.files[0].id;
    return await createFile(token);
  }

  async function createFile(token) {
    const metadata = { name: FILE_NAME, mimeType: 'application/json' };
    const body = JSON.stringify({ registros: [] });
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([body], { type: 'application/json' }));
    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
    );
    const data = await res.json();
    return data.id;
  }

  async function readFile(token, id) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return await res.json();
  }

  async function salvarRegistro(novoRegistro) {
    const existente = registros.findIndex(r => r.data === novoRegistro.data);
    let novosRegistros;
    if (existente >= 0) {
      novosRegistros = registros.map((r, i) => i === existente ? novoRegistro : r);
    } else {
      novosRegistros = [...registros, { ...novoRegistro, id: crypto.randomUUID() }];
    }
    setRegistros(novosRegistros);
    await saveFile(accessToken, fileId, { registros: novosRegistros });
  }

  async function saveFile(token, id, data) {
    await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
  }

  return { registros, loading, salvarRegistro };
}
