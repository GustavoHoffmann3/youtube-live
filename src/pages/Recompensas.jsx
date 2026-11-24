import { useRef, useState } from "react";
import { recompensas } from "../data/recompensas";
import { buscarDados, chaves, salvarDados } from "../services/storage";

const filtros = ["Todas", "Em progresso", "Disponível", "Concluída"];

function obterEstado(recompensa, progressoSalvo) {
  const salvo = progressoSalvo?.[recompensa.id];
  const progresso = Number.isFinite(salvo?.progresso)
    ? Math.max(0, Math.min(100, salvo.progresso))
    : recompensa.inicial;
  const resgatada = progresso === 100 && salvo?.resgatada === true;
  const estado = resgatada ? "Concluída" : progresso === 100 ? "Disponível" : "Em progresso";
  return { ...recompensa, progresso, resgatada, estado };
}

export default function Recompensas() {
  const [dados, setDados] = useState(() => buscarDados(chaves.recompensas));
  const [filtro, setFiltro] = useState("Todas");
  const [feedback, setFeedback] = useState("");
  const filtrosRef = useRef(null);
  const visiveis = recompensas.map((item) => obterEstado(item, dados))
    .filter((item) => filtro === "Todas" || item.estado === filtro);

  function atualizar(item, resgatar) {
    const progresso = resgatar ? 100 : Math.min(100, item.progresso + 15);
    const proximos = { ...dados, [item.id]: { progresso, resgatada: resgatar } };
    if (resgatar || progresso === 100) {
      const destino = filtro === "Todas" && !resgatar
        ? document.getElementById(`recompensa-${item.id}`)
        : filtrosRef.current?.querySelector('[aria-pressed="true"]');
      destino?.focus();
    }
    setDados(proximos);
    salvarDados(chaves.recompensas, proximos);
    if (resgatar) setFeedback(`${item.nome} foi resgatada na demonstração.`);
    else if (progresso === 100) setFeedback(`${item.nome} está disponível para resgate.`);
    else setFeedback(`${item.nome} avançou para ${progresso}%.`);
  }

  return <section className="feature-page" aria-labelledby="recompensas-titulo">
    <header className="feature-heading">
      <h1 id="recompensas-titulo">Recompensas</h1>
      <p>Simule o progresso de uma missão e resgate recompensas fictícias.</p>
    </header>
    <div className="feature-actions" role="group" aria-label="Filtrar recompensas por estado" ref={filtrosRef}>
      {filtros.map((estado) => <button type="button" key={estado} className="pill"
        aria-pressed={estado === filtro} onClick={() => setFiltro(estado)}>{estado}</button>)}
    </div>
    <p className="sr-only" role="status">{feedback}</p>
    {visiveis.length === 0 && <p className="empty-state">Nenhuma recompensa neste estado.</p>}
    <div className="feature-pair">
      {visiveis.map((item) => <article className="feature-card" key={item.id}>
        <p className="feature-state">{item.estado} · {item.categoria}</p>
        <h2 id={`recompensa-${item.id}`} tabIndex={-1}>{item.nome}</h2>
        <p>{item.descricao}</p>
        <div className="feature-progress">
          <progress value={item.progresso} max="100" aria-labelledby={`recompensa-${item.id}`} />
          <span>{item.progresso}%</span>
        </div>
        {!item.resgatada && <button type="button" className="pill" aria-describedby={`recompensa-${item.id}`}
          onClick={() => atualizar(item, item.progresso === 100)}>
          {item.progresso === 100 ? "Resgatar" : "Simular progresso"}
        </button>}
      </article>)}
    </div>
  </section>;
}
