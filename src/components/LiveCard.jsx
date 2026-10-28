
import { Link } from "react-router-dom";

function LiveCard({ live }) {
  return (
    <Link to={`/live/${live.id}`} className="live-card">
      <div className="live-card-image">
        <img src={live.imagem} alt={live.titulo} />
        {live.aoVivo && <span>AO VIVO</span>}
      </div>

      <h3>{live.titulo}</h3>
      <p>{live.canal}</p>
      <p>{live.espectadores.toLocaleString("pt-BR")} assistindo</p>
    </Link>
  );
}

export default LiveCard;
