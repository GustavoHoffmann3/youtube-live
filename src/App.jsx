import { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Live from "./pages/Live";
import { buscarDados, chaves, removerDados, salvarDados } from "./services/storage";

function Plataforma({ usuario, sair, tema, alternarTema }) {
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(() => window.matchMedia("(min-width: 901px)").matches);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    function adaptarMenu(event) {
      setMenuAberto(event.matches);
    }
    desktop.addEventListener("change", adaptarMenu);
    return () => desktop.removeEventListener("change", adaptarMenu);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <Header key={pathname} usuario={usuario} sair={sair} menuAberto={menuAberto}
        alternarMenu={() => setMenuAberto((aberto) => !aberto)}
        tema={tema} alternarTema={alternarTema} />
      <Routes>
        <Route path="/" element={<Home menuAberto={menuAberto} fecharMenu={() => setMenuAberto(false)} />} />
        <Route path="/live/:id" element={<Live key={pathname} usuario={usuario} />} />
        <Route path="*" element={<main id="conteudo" tabIndex={-1} className="empty-state">
          <h1>Página não encontrada</h1><Link to="/">Voltar ao início</Link>
        </main>} />
      </Routes>
    </>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(() => buscarDados(chaves.usuario));
  // Definido antes da montagem pelo script em index.html, evitando piscar o tema errado.
  const [tema, setTema] = useState(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", tema === "light" ? "#ffffff" : "#0f0f0f");
  }, [tema]);

  function alternarTema() {
    const proximoTema = tema === "dark" ? "light" : "dark";
    salvarDados(chaves.tema, proximoTema);
    setTema(proximoTema);
  }

  function entrar(perfil) {
    salvarDados(chaves.usuario, perfil);
    setUsuario(perfil);
  }

  function sair() {
    removerDados(chaves.usuario);
    setUsuario(null);
  }

  // Esta proteção serve apenas para demonstrar o fluxo. Não há autenticação real.
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={usuario?.nome ? <Navigate to="/" replace /> : <Login entrar={entrar} />} />
        <Route path="*" element={usuario?.nome ? <Plataforma usuario={usuario} sair={sair} tema={tema} alternarTema={alternarTema} /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
