const imagens = import.meta.glob("../assets/live-*.webp", {
  eager: true,
  import: "default",
});

export const categorias = [
  "Tudo",
  "Música",
  "Games",
  "Notícias",
  "Esportes",
  "Tecnologia",
  "Conversas",
];

export const lives = [
  {
    id: 6,
    titulo: "Arena nacional de esports",
    canal: "Arena BR",
    categoria: "Games",
    jogo: "Counter-Strike 2",
    espectadores: 67400,
    foto: "arena",
    recompensa: true,
  },
  {
    id: 2,
    titulo: "Sessions ao vivo: novos sons do Brasil",
    canal: "Som Livre",
    categoria: "Música",
    espectadores: 42000,
    foto: "sessions",
  },
  {
    id: 1,
    titulo: "Rumo ao Mestre! Ranked com inscritos",
    canal: "Erick Gameplays",
    categoria: "Games",
    jogo: "Valorant",
    espectadores: 18432,
    foto: "valorant",
    recompensa: true,
    inscritos: "2,84 mi de inscritos",
    curtidas: 41000,
    duracao: "Começou há 1 hora e 28 minutos",
    subtitulo: "Ranked com a comunidade — ao vivo com Erick Gameplays",
    descricao:
      "Hoje a meta é chegar ao Mestre no Valorant. Partidas com inscritos, desafios do chat e análise das melhores jogadas. Apoios via Pix aparecem em tempo real na transmissão.",
    tags: ["ErickGameplays", "Valorant", "RankedAoVivo"],
  },
  {
    id: 3,
    titulo: "Papo de futuro: IA para todo mundo",
    canal: "Manual Tech",
    categoria: "Tecnologia",
    espectadores: 8700,
    foto: "podcast",
  },
  {
    id: 4,
    titulo: "Bastidores do festival, direto do palco",
    canal: "Live Sessions",
    categoria: "Música",
    espectadores: 31000,
    foto: "palco",
  },
  {
    id: 5,
    titulo: "Festival Aurora ao vivo de São Paulo",
    canal: "Festival Aurora",
    categoria: "Música",
    espectadores: 842391,
    foto: "festival",
    descricao:
      "A noite principal começa agora com shows inéditos e acesso aos bastidores.",
  },
  {
    id: 7,
    titulo: "Resumo Agora: as notícias do dia",
    canal: "Resumo Agora",
    categoria: "Notícias",
    espectadores: 12000,
    foto: "podcast",
  },
  {
    id: 8,
    titulo: "Depois do jogo: análise da rodada",
    canal: "Esporte em Pauta",
    categoria: "Esportes",
    espectadores: 5600,
    foto: "arena",
  },
  {
    id: 9,
    titulo: "Conversa de fim de noite",
    canal: "Mesa Aberta",
    categoria: "Conversas",
    espectadores: 2100,
    foto: "podcast",
  },
].map((live) => ({
  ...live,
  aoVivo: true,
  imagem: imagens[`../assets/live-${live.foto}.webp`],
}));

export const destaque = lives.find((live) => live.id === 5);

export function abreviar(numero) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numero);
}

export function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}
