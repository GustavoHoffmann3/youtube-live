import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Marca } from "../components/Header";
import "../styles/Login.css";

export default function Login({ entrar }) {
  const [visivel, setVisivel] = useState(false);
  const [erros, setErros] = useState({});
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  function fazerLogin(event) {
    event.preventDefault();
    const email = emailRef.current.value.trim();
    const novosErros = {};
    if (!email) novosErros.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = "Informe um e-mail válido.";
    if (!senhaRef.current.value.trim()) novosErros.senha = "Informe uma senha.";
    setErros(novosErros);
    if (novosErros.email || novosErros.senha) {
      (novosErros.email ? emailRef : senhaRef).current.focus();
      return;
    }
    entrar({ nome: email.split("@")[0] });
  }

  return (
    <main className="login-container">
      <form className="login-panel" onSubmit={fazerLogin} noValidate>
        <Marca />
        <h1>Entrar na plataforma</h1>
        <p>Use um e-mail e uma senha fictícios para acessar o protótipo.</p>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" ref={emailRef} autoComplete="email" required
          aria-invalid={!!erros.email} aria-describedby={erros.email ? "erro-email" : undefined} />
        {erros.email && <span className="field-error" id="erro-email" role="alert">{erros.email}</span>}
        <label htmlFor="senha">Senha</label>
        <div className="password-field">
          <input id="senha" type={visivel ? "text" : "password"} ref={senhaRef} autoComplete="off" required
            aria-invalid={!!erros.senha} aria-describedby={erros.senha ? "erro-senha" : undefined} />
          <button className="icon-button" type="button" aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setVisivel(!visivel)}>{visivel ? <EyeOff /> : <Eye />}</button>
        </div>
        {erros.senha && <span className="field-error" id="erro-senha" role="alert">{erros.senha}</span>}
        <button className="pill primary login-submit" type="submit">Entrar</button>
      </form>
    </main>
  );
}
