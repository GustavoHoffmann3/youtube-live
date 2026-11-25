import { useLocation } from "react-router-dom";
import FormularioAuth from "../components/FormularioAuth";
import { autenticarUsuario } from "../services/auth";

export default function Login({ entrar }) {
  const { state } = useLocation();

  async function fazerLogin({ email, senha }) {
    const perfil = await autenticarUsuario(email, senha);
    if (!perfil) return { mensagem: "E-mail ou senha incorretos." };
    entrar(perfil);
  }

  return (
    <FormularioAuth enviar={fazerLogin}
      sucesso={state?.cadastroConcluido ? "Cadastro realizado com sucesso. Entre com sua nova conta." : undefined} />
  );
}
