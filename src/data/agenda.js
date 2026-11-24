import arena from "../assets/live-arena.jpg";
import palco from "../assets/live-palco.jpg";
import valorant from "../assets/live-valorant.jpg";
import podcast from "../assets/live-podcast.jpg";

export const agenda = [
  { id: "arena-final", titulo: "Final da Arena Nacional", canal: "Arena BR", categoria: "Games", imagem: arena, dias: 1, hora: 20, minuto: 0 },
  { id: "sons-brasil", titulo: "Sessions especiais: novos sons do Brasil", canal: "Som Livre", categoria: "Música", imagem: palco, dias: 2, hora: 18, minuto: 30 },
  { id: "ranked-comunidade", titulo: "Ranked com a comunidade", canal: "Erick Gameplays", categoria: "Games", imagem: valorant, dias: 3, hora: 21, minuto: 0 },
  { id: "ia-cotidiano", titulo: "Papo de futuro: IA no cotidiano", canal: "Manual Tech", categoria: "Tecnologia", imagem: podcast, dias: 4, hora: 19, minuto: 30 }
];

export function agendarTransmissoes() {
  const hoje = new Date();
  return agenda.map((live) => ({
    ...live,
    data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + live.dias, live.hora, live.minuto)
  }));
}
