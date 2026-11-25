import { buscarDadosPersistentes, chaves, salvarDadosPersistentes } from "./storage";

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const iteracoes = 600_000;
const codificador = new TextEncoder();

export function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

export function validarEmail(email) {
  if (!email) return "Informe seu e-mail.";
  if (!formatoEmail.test(email)) return "Informe um e-mail válido.";
}

export function perfilValido(perfil) {
  return typeof perfil?.id === "string" && !!perfil.id
    && typeof perfil.nome === "string" && perfil.nome.trim().length >= 3
    && typeof perfil.email === "string" && formatoEmail.test(perfil.email);
}

function buscarUsuarios() {
  const usuarios = buscarDadosPersistentes(chaves.usuarios);
  if (usuarios === null) return [];
  if (!Array.isArray(usuarios)) throw new Error("Lista de usuários inválida");
  return usuarios;
}

function encontrarUsuario(usuarios, email) {
  return usuarios.find((usuario) => typeof usuario?.email === "string"
    && normalizarEmail(usuario.email) === email);
}

async function derivarVerificador(senha, salt) {
  const chave = await crypto.subtle.importKey(
    "raw", codificador.encode(senha), "PBKDF2", false, ["deriveBits"],
  );
  const resultado = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: iteracoes }, chave, 256,
  );
  return Array.from(new Uint8Array(resultado), (byte) => byte.toString(16).padStart(2, "0")).join("");
}


export async function cadastrarUsuario({ nome, email, senha }) {
  if (encontrarUsuario(buscarUsuarios(), email)) {
    return false;
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const verificador = await derivarVerificador(senha, salt);

  const usuario = {
    id: crypto.randomUUID(),
    nome,
    email,
    salt: Array.from(salt),
    verificador
  };

  const salvarCadastro = () => {
    const usuarios = buscarUsuarios();

    if (encontrarUsuario(usuarios, email)) {
      return false;
    }

    salvarDadosPersistentes(chaves.usuarios, [
      ...usuarios,
      usuario
    ]);

    return true;
  };

  if (globalThis.navigator?.locks?.request) {
    return navigator.locks.request(
      chaves.usuarios,
      salvarCadastro
    );
  }

  return salvarCadastro();
}


export async function autenticarUsuario(email, senha) {
  const usuario = encontrarUsuario(buscarUsuarios(), email);
  if (!perfilValido(usuario) || !Array.isArray(usuario.salt) || usuario.salt.length !== 16
    || !usuario.salt.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255)
    || typeof usuario.verificador !== "string" || !/^[a-f0-9]{64}$/.test(usuario.verificador)) {
    return null;
  }

  const verificador = await derivarVerificador(senha, Uint8Array.from(usuario.salt));
  if (verificador !== usuario.verificador) return null;

  const { id, nome } = usuario;
  return { id, nome, email };
}
