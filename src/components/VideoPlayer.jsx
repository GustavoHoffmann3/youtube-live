import { Gift, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { abreviar } from "../data/lives";
import { SeloAoVivo } from "./LiveCard";

export default function VideoPlayer({ live }) {
  const player = useRef(null);
  const [pausado, setPausado] = useState(false);
  const [volume, setVolume] = useState(70);
  const [mudo, setMudo] = useState(false);
  const [cheia, setCheia] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reacao, setReacao] = useState(0);

  useEffect(() => {
    function sincronizar() {
      setCheia(document.fullscreenElement === player.current);
    }
    document.addEventListener("fullscreenchange", sincronizar);
    return () => document.removeEventListener("fullscreenchange", sincronizar);
  }, []);

  async function telaCheia() {
    try {
      if (document.fullscreenElement === player.current) await document.exitFullscreen();
      else if (player.current.requestFullscreen) await player.current.requestFullscreen();
      else setFeedback("Tela cheia indisponível neste navegador.");
    } catch {
      setFeedback("Não foi possível abrir a tela cheia.");
    }
  }

  return (
    <section className="video-player" ref={player} aria-label="Player demonstrativo">
      <img className="player-poster" src={live.imagem} alt={`Imagem ilustrativa de ${live.canal}`} />
      <div className="player-top">
        <div className="player-live"><SeloAoVivo /> <span>{abreviar(live.espectadores)} assistindo</span></div>
        {live.recompensa && <details className="reward-panel">
          <summary><Gift size={18} /><span><strong>Minecraft — Capa exclusiva</strong>
            <small>46 / 60 min assistidos</small><progress aria-label="Progresso fictício da recompensa" value="46" max="60" />
          </span></summary>
          <p>Recompensa de demonstração.</p>
        </details>}
      </div>
      {live.id === 1 && <div className="donation-overlay">
        <span className="avatar donation-avatar" aria-hidden="true">$</span>
        <div><strong>Fajre enviou R$ 10,00 via Pix!</strong><small>Boa live, Erick! Hoje é dia de Mestre!</small></div>
      </div>}
      {pausado && <button className="resume-button icon-button" aria-label="Retomar demonstração"
        onClick={() => setPausado(false)}><Play fill="currentColor" /></button>}
      <span className="demo-label">{pausado ? "Demonstração pausada" : "Demonstração • imagem estática"}</span>
      <button className="pill react-button" onClick={() => setReacao(reacao + 1)}>
        <span aria-hidden="true">♡</span> Reagir {reacao > 0 && <span>{reacao}</span>}
      </button>
      <div className="player-controls">
        <button className="icon-button" aria-label={pausado ? "Retomar demonstração" : "Pausar demonstração"}
          onClick={() => setPausado(!pausado)}>{pausado ? <Play size={19} /> : <Pause size={19} />}</button>
        <button className="icon-button" aria-label={mudo || !volume ? "Ativar som simulado" : "Silenciar som simulado"}
          onClick={() => {
            if (!volume) setVolume(70);
            setMudo(Boolean(volume) && !mudo);
          }}>{mudo || !volume ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
        <input type="range" min="0" max="100" aria-label="Volume simulado" value={mudo ? 0 : volume}
          onChange={(event) => { setVolume(Number(event.target.value)); setMudo(false); }} />
        <span className="player-live-label"><span className="live-dot" /> AO VIVO</span>
        <button className="icon-button fullscreen-button" aria-label={cheia ? "Sair da tela cheia" : "Tela cheia"}
          onClick={telaCheia}>{cheia ? <Minimize size={20} /> : <Maximize size={20} />}</button>
      </div>
      {feedback && <p className="player-feedback" role="status">{feedback}</p>}
    </section>
  );
}
