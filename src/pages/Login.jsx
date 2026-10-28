
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { salvarDados } from "../services/storage";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function fazerLogin(event) {
    event.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert("Preencha todos os campos!");
      return;
    }

    const usuario = {
      email: email.trim(),
      nome: email.split("@")[0]
    };

    salvarDados("youtubeLive_user", usuario);

    navigate("/");
  }

  return (
    <div className="login-container">
      <form onSubmit={fazerLogin}>
        <h1>YouTube Live</h1>
        <h2>Entrar na plataforma</h2>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
