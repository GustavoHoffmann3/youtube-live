import { useState } from "react";
import { Link } from "react-router-dom";
import { SeloAoVivo } from "../components/LiveCard";
import { lives } from "../data/lives";

const selecaoInicial = [1, 6];

export default function Multiview() {
  const [selecionadas, setSelecionadas] = useState(selecaoInicial);
  const [painelAtivo, setPainelAtivo] = useState(0);

  function trocar(painel, id) {
    setSelecionadas((atuais) => atuais.map((atual, indice) => indice === painel ? id : atual));
  }

  return <section className="feature-page" aria-labelledby="multiview-titulo">
    <header className="feature-heading">
      <h1 id="multiview-titulo">Multiview</h1>
      <p>Compare duas transmissões com imagens estáticas de demonstração.</p>
    </header>
    <div className="feature-pair">
      {selecionadas.map((id, painel) => {
        const live = lives.find((item) => item.id === id);
        return <article key={painel} className="feature-card" aria-labelledby={`painel-live-${painel}`}
          data-highlighted={painelAtivo === painel}>
          <label className="feature-select">
            Transmissão {painel + 1}
            <select value={id} onChange={(event) => trocar(painel, Number(event.target.value))}>
              {lives.filter((item) => item.id !== selecionadas[1 - painel]).map((item) =>
                <option key={item.id} value={item.id}>{item.canal} — {item.titulo}</option>)}
            </select>
          </label>
          <div className="live-card-image">
            <img src={live.imagem} alt="" />
            <div className="feature-live-badge"><SeloAoVivo /></div>
          </div>
          <h2 id={`painel-live-${painel}`}>{live.titulo}</h2>
          <p>{live.canal}{painelAtivo === painel && " · Em destaque"}</p>
          <div className="feature-actions">
            <button type="button" className="pill" aria-pressed={painelAtivo === painel}
              aria-label={`Destacar transmissão ${painel + 1}`} onClick={() => setPainelAtivo(painel)}>
              Destacar
            </button>
            <Link className="pill primary" to={`/live/${id}`}
              aria-label={`Assistir transmissão de ${live.canal}`}>Assistir transmissão</Link>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
