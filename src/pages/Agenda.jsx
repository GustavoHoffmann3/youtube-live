import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { agendarTransmissoes } from "../data/agenda";
import { iniciais } from "../data/lives";
import { buscarLista, chaves, salvarDados } from "../services/storage";

const formato = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

export default function Agenda() {
  const [transmissoes] = useState(agendarTransmissoes);
  const [lembretes, setLembretes] = useState(() => buscarLista(chaves.lembretes));
  const [feedback, setFeedback] = useState("");

  function alternar(live) {
    const ativo = lembretes.includes(live.id);
    const proximos = ativo ? lembretes.filter((id) => id !== live.id) : [...lembretes, live.id];
    setLembretes(proximos);
    salvarDados(chaves.lembretes, proximos);
    setFeedback(`Lembrete ${ativo ? "cancelado" : "ativado"} para ${live.titulo}.`);
  }

  return <section className="feature-page" aria-labelledby="agenda-titulo">
    <header className="feature-heading">
      <h1 id="agenda-titulo">Próximas lives</h1>
      <p>Confira a programação fictícia no seu horário local. Os lembretes ficam salvos neste navegador.</p>
    </header>
    <p className="sr-only" role="status">{feedback}</p>
    <div className="lives-grid">
      {transmissoes.map((live) => {
        const ativo = lembretes.includes(live.id);
        const Icon = ativo ? BellRing : Bell;
        return <article className="live-card feature-card" key={live.id}>
          <div className="live-card-image"><img src={live.imagem} alt="" loading="lazy" /></div>
          <time className="feature-date" dateTime={live.data.toISOString()}>{formato.format(live.data)}</time>
          <div className="card-details">
            <span className="avatar" aria-hidden="true">{iniciais(live.canal)}</span>
            <div><h2>{live.titulo}</h2><p>{live.canal} · {live.categoria}</p></div>
          </div>
          <button type="button" className="pill" aria-pressed={ativo} aria-describedby={live.id}
            onClick={() => alternar(live)}>
            <Icon size={16} aria-hidden="true" /> {ativo ? "Lembrete ativado" : "Lembrar-me"}
          </button>
          <span className="sr-only" id={live.id}>{live.titulo}{ativo && ". Pressione para cancelar."}</span>
        </article>;
      })}
    </div>
  </section>;
}
