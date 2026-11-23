import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { iniciais } from "../data/lives";

const mensagensIniciais = [
  ["Clara F.", "Essa partida está incrível!"],
  ["Rafa Brito", "Essa partida vai ser clutch!"],
  ["Lucas U.", "Quem veio pelas recomendações?"],
  ["Ana Paula", "Hoje sai o Mestre, Erick!", "Membro"],
  ["Gui Martins", "Que mira absurda"],
  ["Bia", "Mandando energia de Recife"]
];

function Mensagem({ nome, texto, selo, classe = "" }) {
  return <div className={`chat-message ${classe}`}>
    <span className="avatar" aria-hidden="true">{iniciais(nome)}</span>
    <div><div className="chat-name">{nome} {selo && <span className="chat-tag">{selo}</span>}</div><p>{texto}</p></div>
  </div>;
}

function Enquete() {
  const [voto, setVoto] = useState("");
  return <div className="chat-poll" role="group" aria-labelledby="poll-title">
    <h3 id="poll-title">Qual agente o Erick joga agora?</h3>
    {[["Jett", 64], ["Omen", 36]].map(([agente, percentual]) => <button key={agente} aria-pressed={voto === agente}
      onClick={() => setVoto(voto === agente ? "" : agente)} className="poll-option">
      <span>{agente}{voto === agente && " ✓"}</span><span>{percentual}%</span>
      <span className="poll-track" aria-hidden="true"><span style={{ width: `${percentual}%` }} /></span>
    </button>)}
    <small>8.493 votos • Enquete do canal {voto && `• Seu voto: ${voto}`}</small>
  </div>;
}

export default function LiveChat({ live, usuario }) {
  const [mensagens, setMensagens] = useState([]);
  const [rascunho, setRascunho] = useState("");
  const [status, setStatus] = useState("");
  const historico = useRef(null);
  const campo = useRef(null);

  function enviar(event) {
    event.preventDefault();
    const texto = rascunho.trim();
    if (!texto) return;
    setMensagens([...mensagens, texto]);
    setStatus(`Mensagem ${mensagens.length + 1} enviada.`);
    setRascunho("");
    campo.current.focus();
    requestAnimationFrame(() => {
      if (historico.current) historico.current.scrollTop = historico.current.scrollHeight;
    });
  }

  return (
    <aside className="live-chat" aria-labelledby="chat-titulo">
      <header className="chat-header"><h2 id="chat-titulo">Chat ao vivo</h2><p>Principais mensagens</p></header>
      <div className="chat-history" ref={historico} role="region" aria-label="Histórico do chat" tabIndex={0}>
        <div className="pinned-message">
          <p>Mensagem fixada por {live.canal}</p>
          <Mensagem nome={live.canal} selo="Anfitrião" texto={live.id === 1 ?
            "Hoje a meta é Mestre! Respeitem o chat e bora jogar." : "Bem-vindos! Respeitem o chat e aproveitem a live."} />
        </div>
        <div className="chat-feed">
          {live.id === 1 && <>
            <Enquete />
            <Mensagem nome="João Pedro • R$ 20,00" texto="Salve, Erick! Hoje tem rank up." classe="chat-super" />
          </>}
          {(live.id === 1 ? mensagensIniciais : [["Clara F.", "Boa live!"], ["Bia", "Cheguei agora!"]])
            .map(([nome, texto, selo]) => <Mensagem key={nome} nome={nome} texto={texto} selo={selo} />)}
          {mensagens.map((texto, indice) => <Mensagem key={indice} nome={usuario.nome} texto={texto} />)}
        </div>
      </div>
      <form className="chat-form" onSubmit={enviar}>
        <span className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</span>
        <label htmlFor="chat-input" className="sr-only">Mensagem para o chat</label>
        <input id="chat-input" ref={campo} placeholder="Converse com a comunidade…" value={rascunho}
          maxLength={200} onChange={(event) => setRascunho(event.target.value)} />
        <button type="submit" className="icon-button" aria-label="Enviar mensagem" disabled={!rascunho.trim()}><Send size={20} /></button>
      </form>
      <span role="status" className="sr-only">{status}</span>
    </aside>
  );
}
