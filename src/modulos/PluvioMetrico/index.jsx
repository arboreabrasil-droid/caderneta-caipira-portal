// No topo do Portal.jsx
import PluvioMetrico from './modulos/PluvioMetrico';

// Dentro do componente, após useState existente
const [moduloAtivo, setModuloAtivo] = useState(null);

// Antes do return principal
if (moduloAtivo === 'chuva') {
  return <PluvioMetrico user={user} onVoltar={() => setModuloAtivo(null)} />;
}

// No botão "Abrir Módulo" do card chuva
onClick={() => setModuloAtivo(id)}
