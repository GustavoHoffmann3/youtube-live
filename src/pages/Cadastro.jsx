import { useNavigate } from "react-router-dom";
import FormularioAuth from "../components/FormularioAuth";
import { cadastrarUsuario } from "../services/auth";

export default function Cadastro() {
  const navegar = useNavigate();

  async function fazerCadastro(dados) {
    const cadastrado = await cadastrarUsuario(dados);
    if (!cadastrado) return { erros: { email: "Já existe uma conta com esse e-mail." } };
    navegar("/login", { replace: true, state: { cadastroConcluido: true } });
  }

  return <FormularioAuth cadastro enviar={fazerCadastro} />;
}
