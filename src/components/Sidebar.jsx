import { CalendarDays, Compass, Gift, Globe, History, House, LayoutGrid, MonitorPlay, Video } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { abreviar, iniciais, lives } from "../data/lives";

const menu = [
  ["Início", "", House], ["Explorar", "explorar", Compass], ["Mapa IRL", "mapa", Globe],
  ["Multiview", "multiview", LayoutGrid], ["Seguindo", "seguindo", MonitorPlay],
  ["Próximas lives", "agenda", CalendarDays], ["Recompensas", "recompensas", Gift],
  ["Histórico", "historico", History], ["Seus canais", "canais", Video]
];

export default function Sidebar({ aberto, fechar }) {
  const { search } = useLocation();
  const secao = new URLSearchParams(search).get("secao") ?? "";

  return (
    <aside id="menu-lateral" className={`sidebar ${aberto ? "sidebar-open" : ""}`}>
      <nav aria-label="Menu principal">
        {menu.map(([rotulo, valor, Icon]) => (
          <Link key={rotulo} to={valor ? `/?secao=${valor}` : "/"} aria-current={secao === valor ? "page" : undefined}
            onClick={fechar}><Icon size={20} /> {rotulo}</Link>
        ))}
      </nav>
      <section>
        <h2>Ao vivo</h2>
        {[1, 4, 7].map((id) => {
          const live = lives.find((item) => item.id === id);
          return <Link className="sidebar-channel" key={id} to={`/live/${id}`} onClick={fechar}>
            <span className={`avatar avatar-${id}`} aria-hidden="true">{iniciais(live.canal)}</span>
            <span>{live.canal}<small>{abreviar(live.espectadores)} assistindo</small></span>
            <span className="live-dot" aria-hidden="true" />
          </Link>;
        })}
      </section>
      <section>
        <h2>Categorias recomendadas</h2>
        {["Minecraft", "Counter-Strike 2", "Valorant"].map((jogo, indice) => <Link
          className="sidebar-channel" key={jogo} to={`/?${new URLSearchParams({ q: jogo })}`} onClick={fechar}>
          <span className={`category-icon category-icon-${indice}`} aria-hidden="true">{["MC", "CS", "V"][indice]}</span>{jogo}
        </Link>)}
      </section>
    </aside>
  );
}
