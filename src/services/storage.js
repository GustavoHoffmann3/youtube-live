export const chaves = {
  usuario: "youtubeLive_user",
  tema: "youtubeLive_theme",
  categoria: "youtubeLive_category",
  curtidas: "youtubeLive_likes",
  inscricoes: "youtubeLive_subscriptions",
  historico: "youtubeLive_history",
  lembretes: "youtubeLive_reminders",
  recompensas: "youtubeLive_rewards"
};

const memoria = new Map();

export function salvarDados(chave, dados) {
  memoria.set(chave, dados);
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
  }
}

export function buscarDados(chave) {
  if (memoria.has(chave)) return memoria.get(chave);
  try {
    return JSON.parse(localStorage.getItem(chave));
  } catch {
    return null;
  }
}

export function removerDados(chave) {
  memoria.set(chave, null);
  try {
    localStorage.removeItem(chave);
  } catch {
  }
}

export function buscarLista(chave) {
  const dados = buscarDados(chave);
  return Array.isArray(dados) ? dados : [];
}
