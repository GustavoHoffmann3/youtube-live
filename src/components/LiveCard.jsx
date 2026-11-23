import { Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { abreviar, iniciais } from "../data/lives";

export function SeloAoVivo() {
  return <span className="live-badge"><span aria-hidden="true">▥</span> AO VIVO</span>;
}

export default function LiveCard({ live }) {
  return (
    <article className="live-card">
      <Link to={`/live/${live.id}`} aria-labelledby={`live-${live.id}`}>
        <div className="live-card-image">
          <img src={live.imagem} alt="" loading="lazy" />
          {live.recompensa && <span className="reward-badge"><Gift size={13} /> Recompensas disponíveis</span>}
          <div className="card-badges"><SeloAoVivo /><span>{abreviar(live.espectadores)} assistindo</span></div>
        </div>
        <div className="card-details">
          <span className="avatar" aria-hidden="true">{iniciais(live.canal)}</span>
          <div><h3 id={`live-${live.id}`}>{live.titulo}</h3><p>{live.canal}</p><p>{live.jogo ?? live.categoria}</p></div>
        </div>
      </Link>
    </article>
  );
}
