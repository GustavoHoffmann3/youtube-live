
export function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

export function buscarDados(chave) {
  const dados = localStorage.getItem(chave);

  if (!dados) {
    return null;
  }

  try {
    return JSON.parse(dados);
  } catch {
    return null;
  }
}

export function removerDados(chave) {
  localStorage.removeItem(chave);
}
