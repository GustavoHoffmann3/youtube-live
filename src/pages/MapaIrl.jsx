import { useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { abreviar, destaque } from "../data/lives";

export default function MapaIrl() {
  const [aberto, setAberto] = useState(false);

  return <section className="feature-page" aria-labelledby="mapa-titulo">
    <header className="feature-heading">
      <h1 id="mapa-titulo">Mapa IRL</h1>
      <p>Mapa ilustrativo com a localização de uma transmissão em São Paulo.</p>
    </header>
    <div className="feature-map-layout">
      <div className="feature-map">
        <svg viewBox="0 0 480 320" aria-hidden="true">
          {/* Contorno esquemático do Brasil para a demonstração. */}
          <path d="M55 94 71 69 102 70 108 47 139 54 152 36 174 47 190 19 206 54 231 62
            247 43 265 64 300 73 338 92 363 114 349 145 329 169 315 202 281 220
            262 247 228 269 211 301 193 284 204 258 194 235 192 207 169 185 156 154
            128 147 103 120 75 118Z" />
          <path className="feature-map-line" d="M64 162H405 M90 224H394 M102 99H400 M181 36V292 M273 49V287" />
        </svg>
        {destaque && <button type="button" className="pill primary feature-marker"
          aria-expanded={aberto} aria-controls="mapa-transmissao" onClick={() => setAberto(!aberto)}>
          <MapPin size={18} aria-hidden="true" /> São Paulo, Brasil
        </button>}
      </div>
      <div id="mapa-transmissao">
        {!destaque && <p className="empty-state">Nenhuma transmissão disponível no mapa.</p>}
        {destaque && !aberto && <p className="empty-state">Selecione São Paulo no mapa para ver a transmissão.</p>}
        {destaque && aberto && <article className="feature-card">
          <div className="live-card-image"><img src={destaque.imagem} alt="Público no Festival Aurora" /></div>
          <h2>{destaque.titulo}</h2>
          <p>{destaque.canal} · {abreviar(destaque.espectadores)} assistindo</p>
          <Link className="pill primary" to={`/live/${destaque.id}`}>Assistir agora</Link>
        </article>}
      </div>
    </div>
  </section>;
}
