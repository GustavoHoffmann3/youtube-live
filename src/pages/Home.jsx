import { useEffect, useState } from "react";
import { ChevronRight, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LiveCard from "../components/LiveCard";
import Sidebar from "../components/Sidebar";
import { abreviar, categorias, destaque, iniciais, lives } from "../data/lives";
import { buscarDados, buscarLista, chaves, salvarDados } from "../services/storage";
import "../styles/Home.css";

const secoes = {
  explorar: ["Explorar transmissões", ""],
  seguindo: ["Canais que você segue", "Inscreva-se em um canal para encontrar suas lives aqui."],
  recompensas: ["Lives com recompensas", ""],
  historico: ["Histórico", "As transmissões que você abrir aparecerão aqui."],
  mapa: ["Mapa IRL", "O mapa interativo está indisponível neste protótipo."],
  multiview: ["Multiview", "A reprodução de várias lives está indisponível neste protótipo."],
  agenda: ["Próximas lives", "Nenhuma transmissão está agendada no protótipo."],
  canais: ["Seus canais", "A criação de canais está indisponível neste protótipo."]
};

const normalizar = (texto) => texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function Destaque() {
  return <section className="hero" aria-labelledby="festival-titulo" style={{ "--hero-image": `url("${destaque.imagem}")` }}>
    <div className="hero-content">
      <h1 id="festival-titulo">Festival<br />Aurora<br /> ao vivo de São Paulo</h1>
      <p>{destaque.descricao}</p>
      <div className="hero-channel">
        <span className="avatar" aria-hidden="true">{iniciais(destaque.canal)}</span>
        <div><strong>{destaque.canal}</strong><small>{abreviar(destaque.espectadores)} espectadores • Música</small></div>
      </div>
      <Link to={`/live/${destaque.id}`} className="pill primary"><Play size={16} fill="currentColor" /> Assistir agora</Link>
    </div>
    <span className="hero-count"><span className="live-dot" aria-hidden="true" /> {destaque.espectadores.toLocaleString("pt-BR")} assistindo agora</span>
  </section>;
}

export default function Home({ menuAberto, fecharMenu }) {
  const { search } = useLocation();
  const parametros = new URLSearchParams(search);
  const consulta = parametros.get("q")?.trim() ?? "";
  const secao = parametros.get("secao") ?? "";
  const [categoria, setCategoria] = useState(() => {
    const salva = buscarDados(chaves.categoria);
    return categorias.includes(salva) ? salva : "Tudo";
  });
  const inicio = !consulta && !secao;
  const usaFiltros = inicio || secao === "explorar";

  useEffect(() => {
    if (!menuAberto) return;
    function fechar(event) {
      if (event.key !== "Escape") return;
      fecharMenu();
      document.querySelector(".menu-toggle")?.focus();
    }
    document.addEventListener("keydown", fechar);
    return () => document.removeEventListener("keydown", fechar);
  }, [menuAberto, fecharMenu]);

  function selecionar(novaCategoria) {
    setCategoria(novaCategoria);
    salvarDados(chaves.categoria, novaCategoria);
  }

  let transmissões = lives;
  if (consulta) {
    transmissões = lives.filter((live) => [live.titulo, live.canal, live.categoria, live.jogo]
      .some((campo) => campo && normalizar(campo).includes(normalizar(consulta))));
  } else if (usaFiltros && categoria !== "Tudo") {
    transmissões = lives.filter((live) => live.categoria === categoria);
  } else if (secao === "seguindo") {
    const canais = buscarLista(chaves.inscricoes);
    transmissões = lives.filter((live) => canais.includes(live.canal));
  } else if (secao === "recompensas") {
    transmissões = lives.filter((live) => live.recompensa);
  } else if (secao === "historico") {
    transmissões = buscarLista(chaves.historico).map((id) => lives.find((live) => live.id === id)).filter(Boolean);
  } else if (secao && !usaFiltros) {
    transmissões = [];
  }

  const titulo = consulta ? `Resultados para “${consulta}”` : secoes[secao]?.[0] ?? "Ao vivo agora";
  return <div className="home-layout">
    <Sidebar aberto={menuAberto} fechar={() => {
      if (window.matchMedia("(max-width: 900px)").matches) fecharMenu();
    }} />
    <main className="home-main" id="conteudo" tabIndex={-1}>
      {inicio && <Destaque />}
        {usaFiltros && <div className="filters" role="group" aria-label="Filtrar por categoria">
        {categorias.map((item) => <button className="pill" key={item} aria-pressed={categoria === item}
          onClick={() => selecionar(item)}>{item}</button>)}
      </div>}
      <section className="live-section" aria-labelledby="lives-titulo">
        <div className="section-heading">
          <div>{inicio ? <h2 id="lives-titulo">{titulo}</h2> : <h1 id="lives-titulo">{titulo}</h1>}
            {inicio && <p>Transmissões em alta neste momento</p>}
            <span className="sr-only" role="status">{transmissões.length} transmissões encontradas</span>
          </div>
          {inicio && <Link to="/?secao=explorar" className="text-link">Ver tudo <ChevronRight size={17} /></Link>}
        </div>
        {transmissões.length ? <div className="lives-grid">{transmissões.map((live) => <LiveCard key={live.id} live={live} />)}</div> :
          <p className="empty-state">{consulta ? "Nenhuma transmissão corresponde à pesquisa." :
            secoes[secao]?.[1] || "Nenhuma transmissão nesta categoria."}</p>}
      </section>
    </main>
  </div>;
}
