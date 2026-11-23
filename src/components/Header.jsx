import { useEffect, useRef, useState } from "react";
import { Bell, Cast, LogOut, Menu, Mic, Play, Search, Sun } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { iniciais } from "../data/lives";

export function Marca() {
  return <span className="brand"><span className="brand-play"><Play size={14} fill="currentColor" /></span>
    <strong>YouTube</strong><span className="brand-live">Live</span></span>;
}

export default function Header({ usuario, sair, menuAberto, alternarMenu, tema, alternarTema }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const consulta = new URLSearchParams(search).get("q") ?? "";
  const [painel, setPainel] = useState("");
  const painelRef = useRef(null);
  const acionador = useRef(null);
  const home = pathname === "/";

  useEffect(() => {
    function fecharAoClicar(event) {
      if (!painelRef.current?.contains(event.target)) setPainel("");
    }
    function fecharComEscape(event) {
      if (event.key === "Escape" && painel) {
        setPainel("");
        acionador.current?.focus();
      }
    }
    document.addEventListener("pointerdown", fecharAoClicar);
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      document.removeEventListener("pointerdown", fecharAoClicar);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [painel]);

  function pesquisar(event) {
    event.preventDefault();
    const termo = new FormData(event.currentTarget).get("q").trim();
    navigate(termo ? `/?${new URLSearchParams({ q: termo })}` : "/");
  }

  function abrirPainel(event, nome) {
    acionador.current = event.currentTarget;
    setPainel(painel === nome ? "" : nome);
  }

  return (
    <header className="site-header">
      <div className="header-brand">
        {home && <button className="icon-button menu-toggle" aria-label="Menu lateral" aria-controls="menu-lateral"
          aria-expanded={menuAberto} onClick={alternarMenu}><Menu size={22} /></button>}
        <Link to="/" aria-label="YouTube Live, início"><Marca /></Link>
      </div>
      <form className="search-bar" role="search" onSubmit={pesquisar}>
        <label className="sr-only" htmlFor="busca">Pesquisar transmissões ao vivo</label>
        <input key={consulta} id="busca" name="q" type="search" defaultValue={consulta}
          placeholder="Pesquisar transmissões ao vivo" />
        <button aria-label="Pesquisar" type="submit"><Search size={21} /></button>
      </form>
      <div className="header-actions" ref={painelRef}>
        <button className="icon-button voice-button" aria-label="Pesquisa por voz" aria-expanded={painel === "voz"}
          onClick={(event) => abrirPainel(event, "voz")}><Mic size={21} /></button>
        <button className="icon-button cast-button" aria-label="Transmitir para outro dispositivo" aria-expanded={painel === "cast"}
          onClick={(event) => abrirPainel(event, "cast")}><Cast size={21} /></button>
        <button className="icon-button" aria-label="Notificações" aria-expanded={painel === "notificacoes"}
          onClick={(event) => abrirPainel(event, "notificacoes")}><Bell size={21} /></button>
        <button className="icon-button" aria-label="Perfil" aria-expanded={painel === "perfil"}
          onClick={(event) => abrirPainel(event, "perfil")}><span className="avatar profile-avatar" aria-hidden="true">{iniciais(usuario.nome)}</span></button>
        {painel && <div className="header-panel">
          {painel === "perfil" ? <>
            <strong>{usuario.nome}</strong>
            <button className="pill" onClick={sair}><LogOut size={17} /> Sair</button>
            <button type="button" className="pill" onClick={alternarTema}
              aria-pressed={tema === "light"}>
              <Sun size={17} aria-hidden="true" /> Modo claro
            </button>
          </> : <p role="status">{
            { voz: "Pesquisa por voz indisponível. Use o campo de pesquisa.",
              cast: "A transmissão para outros dispositivos está indisponível neste protótipo.",
              notificacoes: "Você está em dia com as notificações." }[painel]
          }</p>}
        </div>}
      </div>
    </header>
  );
}

