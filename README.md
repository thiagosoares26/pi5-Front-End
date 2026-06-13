# PI5 — Front-End

> Aplicação web do Projeto Integrador 5, construída em **React + Vite**, que consome a API do projeto para entrega de suas funcionalidades.
---

## Sobre o projeto

Este repositório contém a interface (front-end) do projeto **PI5**. A aplicação é uma Single Page Application (SPA) que se comunica com uma API externa por meio de variáveis de ambiente, permitindo navegação entre páginas, formulários e exibição de dados retornados pelo back-end.


## Tecnologias

- **[React 19](https://react.dev/)** — biblioteca de interface
- **[Vite](https://vitejs.dev/)** — build tool e servidor de desenvolvimento
- **[React Router DOM 7](https://reactrouter.com/)** — roteamento entre páginas
- **[React Hook Form](https://react-hook-form.com/)** — gerenciamento de formulários
- **[clsx](https://github.com/lukeed/clsx)** + **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** — composição de classes de estilo

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) (já vem com o Node)

---

## 🚀 Como rodar o projeto

```bash
# 1. Clone o repositório
git clone https://github.com/thiagosoares26/pi5-Front-End.git

# 2. Acesse a pasta do projeto
cd pi5-Front-End

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente (veja a seção abaixo)
cp .env.example .env

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Depois disso, a aplicação ficará disponível no endereço indicado no terminal.

---

## Scripts disponíveis

| Comando           | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento (Vite)        |
| `npm run build`   | Gera a versão de produção na pasta `dist/`         |
| `npm run preview` | Faz o preview local do build de produção           |

---

## Estrutura do projeto

```
pi5-Front-End/
├── src/                 # Código-fonte da aplicação (componentes, páginas, etc.)
├── .env.example         # Modelo de variáveis de ambiente
├── global.css           # Estilos globais
├── index.html           # HTML base da aplicação
├── jsconfig.json        # Configuração do JavaScript
├── vite.config.js       # Configuração do Vite
└── package.json         # Dependências e scripts
```
