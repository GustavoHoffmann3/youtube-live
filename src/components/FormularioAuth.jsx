import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Marca } from "./Header";
import { normalizarEmail, validarEmail } from "../services/auth";
import "../styles/Login.css";

function Campo({ id, label, erro, children }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        name: id,
        required: true,
        "aria-invalid": !!erro,
        "aria-describedby": erro ? `erro-${id}` : undefined,
      })}
      {erro && <span className="field-error" id={`erro-${id}`} role="alert">{erro}</span>}
    </div>
  );
}

export default function FormularioAuth({ cadastro = false, enviar, sucesso }) {
  const [visivel, setVisivel] = useState(false);
  const [erros, setErros] = useState({});
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const formulario = useRef(null);
  const titulo = useRef(null);

  useEffect(() => {
    const primeiroCampo = Object.keys(erros)[0];
    if (primeiroCampo) formulario.current.elements.namedItem(primeiroCampo).focus();
  }, [erros]);

  useEffect(() => {
    titulo.current.focus();
  }, []);

  async function submeter(event) {
    event.preventDefault();
    if (enviando) return;

    const dados = new FormData(event.currentTarget);
    const nome = cadastro ? dados.get("nome").trim() : "";
    const email = normalizarEmail(dados.get("email"));
    const senha = dados.get("senha");
    const novosErros = {};

    if (cadastro && nome.length < 3) {
      novosErros.nome = nome ? "Use pelo menos três caracteres." : "Informe seu nome de usuário.";
    }
    const erroEmail = validarEmail(email);
    if (erroEmail) novosErros.email = erroEmail;
    if (!senha) novosErros.senha = "Informe uma senha.";
    else if (cadastro && senha.length < 8) novosErros.senha = "Use pelo menos oito caracteres.";

    setErros(novosErros);
    setErroEnvio("");
    if (Object.keys(novosErros).length) return;

    setEnviando(true);
    try {
      const resultado = await enviar({ nome, email, senha });
      if (resultado?.erros) setErros(resultado.erros);
      if (resultado?.mensagem) setErroEnvio(resultado.mensagem);
    } catch {
      setErroEnvio(cadastro
        ? "Não foi possível salvar o cadastro. Verifique se o navegador permite o armazenamento local e se a página está em HTTPS ou localhost."
        : "Não foi possível acessar os dados de login. Verifique o armazenamento local do navegador.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-container">
      <form className="login-panel" ref={formulario} onSubmit={submeter} noValidate>
        <Marca />
        <h1 ref={titulo} tabIndex={-1} aria-describedby={sucesso ? "cadastro-sucesso" : undefined}>
          {cadastro ? "Criar conta" : "Entrar na plataforma"}
        </h1>
        {sucesso && <p id="cadastro-sucesso" className="auth-status" role="status">{sucesso}</p>}
        <p>Use um e-mail e uma senha fictícios para {cadastro ? "criar sua conta" : "acessar o protótipo"}.</p>
        {cadastro && <Campo id="nome" label="Nome de usuário" erro={erros.nome}>
          {(atributos) => <input {...atributos} autoComplete="username" />}
        </Campo>}
        <Campo id="email" label="E-mail" erro={erros.email}>
          {(atributos) => <input {...atributos} type="email" autoComplete="email" />}
        </Campo>
        <Campo id="senha" label="Senha" erro={erros.senha}>
          {(atributos) => (
            <div className="password-field">
              <input {...atributos} type={visivel ? "text" : "password"}
                autoComplete={cadastro ? "new-password" : "current-password"} />
              <button className="icon-button" type="button" aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setVisivel(!visivel)}>{visivel ? <EyeOff /> : <Eye />}</button>
            </div>
          )}
        </Campo>
        {erroEnvio && <p className="field-error" role="alert">{erroEnvio}</p>}
        <button className="pill primary login-submit" type="submit" disabled={enviando}>
          {enviando ? (cadastro ? "Criando conta…" : "Entrando…") : (cadastro ? "Criar conta" : "Entrar")}
        </button>
        <p className="auth-alternativa">
          {cadastro ? "Já possui uma conta? " : "Não possui uma conta? "}
          <Link to={cadastro ? "/login" : "/cadastro"}>{cadastro ? "Entrar" : "Cadastre-se"}</Link>
        </p>
      </form>
    </main>
  );
}
