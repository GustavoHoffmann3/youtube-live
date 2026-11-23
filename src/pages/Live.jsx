import { useEffect, useState } from "react";
import { ChevronRight, CircleDollarSign, Share2, ThumbsUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { abreviar, iniciais, lives } from "../data/lives";
import { buscarLista, chaves, salvarDados } from "../services/storage";
import LiveCard, { SeloAoVivo } from "../components/LiveCard";
import LiveChat from "../components/LiveChat";
import VideoPlayer from "../components/VideoPlayer";
import "../styles/Live.css";

function Detalhes({ live }) {
  const [curtido, setCurtido] = useState(() => buscarLista(chaves.curtidas).includes(live.id));
  const [inscrito, setInscrito] = useState(() => buscarLista(chaves.inscricoes).includes(live.canal));
  const [pix, setPix] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mostrarLink, setMostrarLink] = useState(false);

  function alternar(chave, valor, ativo, atualizar) {
    const lista = buscarLista(chave);
    salvarDados(chave, ativo ? lista.filter((item) => item !== valor) : [...lista, valor]);
    atualizar(!ativo);
  }

  async function compartilhar() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: live.titulo, url });
        setFeedback("Link compartilhado.");
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Link copiado.");
      }
      setMostrarLink(false);
    } catch (erro) {
      if (erro.name === "AbortError") return;
      setMostrarLink(true);
      setFeedback("Selecione e copie o link da transmissão.");
    }
  }

  return <div className="live-info">
    <div className="live-meta"><SeloAoVivo /><span>{[live.categoria, live.jogo].filter(Boolean).join(" • ")}</span></div>
    <h1>{live.titulo}{live.id === 1 && " — Valorant ao vivo"}</h1>
    <p className="watching">{live.espectadores.toLocaleString("pt-BR")} espectadores assistindo agora{live.duracao && ` • ${live.duracao}`}</p>
    <div className="live-action-row">
      <div className="channel-info">
        <span className="avatar" aria-hidden="true">{iniciais(live.canal)}</span>
        <div><strong>{live.canal}</strong>{live.inscritos && <small>{live.inscritos}</small>}</div>
        <button className={`pill ${inscrito ? "" : "primary"}`} aria-pressed={inscrito} aria-label={`Inscrição em ${live.canal}`}
          onClick={() => alternar(chaves.inscricoes, live.canal, inscrito, setInscrito)}>{inscrito ? "Inscrito" : "Inscrever-se"}</button>
      </div>
      <div className="live-actions">
        <button className="pill" aria-pressed={curtido} aria-label="Curtir transmissão"
          onClick={() => alternar(chaves.curtidas, live.id, curtido, setCurtido)}>
          <ThumbsUp size={17} fill={curtido ? "currentColor" : "none"} /> {abreviar((live.curtidas ?? 0) + Number(curtido))}
        </button>
        <button className="pill" onClick={compartilhar}><Share2 size={17} /> Compartilhar</button>
        <button className="pill pix-button" aria-expanded={pix} onClick={() => setPix(!pix)}>
          <CircleDollarSign size={19} /> Apoiar via Pix
        </button>
      </div>
    </div>
    <p className={feedback ? "live-feedback" : "sr-only"} role="status">{feedback}</p>
    {mostrarLink && <label className="share-link">Link da transmissão
      <input readOnly value={window.location.href} onFocus={(event) => event.currentTarget.select()} />
    </label>}
    {pix && <p className="live-feedback">Apoio via Pix demonstrativo. Nenhum pagamento será realizado.</p>}
    <div className="live-description">
      {live.subtitulo && <strong>{live.subtitulo}</strong>}
      <p>{live.descricao ?? `Acompanhe ${live.canal} ao vivo na categoria ${live.categoria}.`}</p>
      {live.tags && <div>{live.tags.map((tag) => <Link key={tag} to={`/?${new URLSearchParams({ q: live.jogo })}`}>#{tag} </Link>)}</div>}
    </div>
    <section className="live-section recommendations" aria-labelledby="recomendacoes">
      <div className="section-heading"><h2 id="recomendacoes">Continue assistindo ao vivo</h2>
        <Link className="text-link" to="/?secao=explorar">Ver tudo <ChevronRight size={16} /></Link></div>
      <div className="lives-grid">{[2, 1, 3, 4, 6, 5].filter((id) => id !== live.id).slice(0, 4)
        .map((id) => <LiveCard key={id} live={lives.find((item) => item.id === id)} />)}</div>
    </section>
  </div>;
}

export default function Live({ usuario }) {
  const { id } = useParams();
  const live = lives.find((item) => String(item.id) === id);

  useEffect(() => {
    if (!live) return;
    const historico = buscarLista(chaves.historico);
    salvarDados(chaves.historico, [live.id, ...historico.filter((item) => item !== live.id)]);
  }, [live]);

  if (!live) return <main id="conteudo" tabIndex={-1} className="empty-state missing-live">
    <h1>Transmissão não encontrada</h1><Link className="pill" to="/">Voltar ao início</Link>
  </main>;

  return <main className="live-layout" id="conteudo" tabIndex={-1}>
    <VideoPlayer live={live} />
    <LiveChat live={live} usuario={usuario} />
    <Detalhes live={live} />
  </main>;
}
