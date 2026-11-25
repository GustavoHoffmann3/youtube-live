# YouTube Live

Protótipo front-end de uma plataforma de transmissões ao vivo, desenvolvido com **React**, **Vite** e **JavaScript**.

## Pré-requisitos

- [Node.js](https://nodejs.org/) compatível com o Vite 8 (**20.19+ ou 22.12+**; prefira a versão LTS atual).
- npm (instalado junto com o Node.js).
- Um editor de código, como o Visual Studio Code.

Confira a instalação no terminal:

```bash
node -v
npm -v
```

## Como executar

**1. Clone o repositório:**

```bash
git clone https://github.com/GustavoHoffmann3/youtube-live.git
```

**2. Entre na pasta do projeto:**

```bash
cd youtube-live
```

**3. Instale as dependências:**

```bash
npm install
```

**4. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

**5. Abra o endereço informado no terminal**, normalmente:

http://localhost:5173/

> **Windows / PowerShell:** se aparecer o erro de execução de scripts bloqueada (`npm.ps1`), substitua `npm` por `npm.cmd`, por exemplo `npm.cmd install` e `npm.cmd run dev`.

Para interromper o servidor, pressione **Ctrl + C** no terminal.

## Outros comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Gera a versão de produção na pasta `dist/`. |
| `npm run preview` | Visualiza localmente a versão gerada pelo build. |
| `npm run lint` | Executa a verificação estática do código com Oxlint. |

Para testar o build de produção:

```bash
npm run build
npm run preview
```

## Como acessar o protótipo

Crie uma conta em `/cadastro` e depois entre em `/login`. Use apenas credenciais fictícias. O cadastro e a sessão são simulados e ficam no `localStorage` do navegador, restritos ao perfil utilizado.

A senha original não é armazenada. O navegador guarda um verificador derivado com PBKDF2 e um salt individual. Como os dados e a lógica podem ser alterados no próprio navegador, o protótipo não oferece autenticação real nem segurança adequada para produção. Use localhost ou HTTPS para que os recursos de registro estejam disponíveis.

Após entrar, você poderá navegar pela página inicial e pelas transmissões. Inscrições, curtidas, histórico e preferência de categoria são armazenados no `localStorage` do navegador. O player e o chat são demonstrativos; não há transmissão real.

## Observações

- Não é necessário instalar ou configurar banco de dados.
- A pasta `node_modules/` é criada ao instalar as dependências e não deve ser enviada ao GitHub.
- Para atualizar uma cópia já clonada do repositório, utilize `git pull` na branch apropriada antes de instalar novas dependências, se necessário.
- Caso a aplicação seja publicada em hospedagem estática, configure o redirecionamento das rotas para `index.html`, permitindo abrir diretamente páginas como `/login` e `/live/1`.
