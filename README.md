# REPORT — Decisões de criação e montagem dos componentes

Este documento descreve como o time decidiu **criar e montar os componentes** do front-end do projeto PI5, registrando as motivações por trás de cada decisão técnica e de organização, e o que cada componente faz.

---

## 1. Contexto

O front-end é uma Single Page Application (SPA) que funciona como uma **arena de batalhas entre jogadores de Inteligência Artificial**. Dois jogadores (bots) se enfrentam em partidas disputadas em um tabuleiro, organizados em dois times — internamente referenciados como **Turing** e **Lovelace** (com os professores **CLARO** e **REY** associados aos times). A aplicação permite **assistir às partidas**, acompanhar o turno atual e o resultado, **selecionar qual jogador de IA** será usado e visualizar o **vencedor** ao fim de cada partida.

Os dados das partidas e dos jogadores vêm de uma API externa, consumida via variáveis de ambiente. As decisões abaixo foram tomadas buscando equilibrar **produtividade de desenvolvimento**, **reaproveitamento de código** e **facilidade de manutenção**, considerando o prazo e o escopo de um projeto integrador.

---

## 2. Escolha do stack

A base do projeto foi montada com **React 19 + Vite**. As principais motivações foram:

- **React** por ser uma biblioteca consolidada e baseada em componentes, que favorece a divisão da interface em partes reutilizáveis e independentes — exatamente a forma como queríamos estruturar a arena, o tabuleiro e os cartões de partida.
- **Vite** como ferramenta de build e servidor de desenvolvimento, pela inicialização rápida e pelo *Hot Module Replacement*, que encurtou o ciclo de desenvolvimento ao testar visualmente cada componente.

Para necessidades específicas, foram adicionadas bibliotecas pontuais em vez de soluções genéricas:

- **React Router DOM** para o roteamento entre as telas e para a navegação até a tela de assistir partida (`/watch/:id`).
- **React Hook Form** para o gerenciamento de formulários.
- **clsx** e **tailwind-merge** disponíveis para composição de classes de estilo.

---

## 3. Estratégia de componentização

A interface foi quebrada em componentes pequenos e de **responsabilidade única**, priorizando o reaproveitamento. A divisão adotada foi:

- **Componentes de apresentação ("burros")** — recebem tudo por *props* e apenas renderizam, sem buscar dados nem guardar estado próprio (ex.: `BoardCell`, `FeatureCard`, `WinnerBanner`). A motivação foi manter esses blocos previsíveis e fáceis de reutilizar em qualquer tela.
- **Componentes com comportamento** — quando o componente precisa reagir a uma interação ou gerar um efeito, a lógica fica contida nele (ex.: `PlayerSelect`, que troca o token da API; `GameCard`, que decide o que exibir conforme o estado da partida).

Essa separação foi escolhida porque concentra a lógica em poucos pontos e mantém a maior parte dos componentes simples, o que reduz a chance de bugs e facilita ajustes visuais — uma mudança no cartão de partida, por exemplo, acontece em um único arquivo e reflete em todas as listagens.

---

## 4. Padrões adotados na montagem dos componentes

- **Componentes funcionais com *export* nomeado** e **props desestruturadas** já na assinatura da função, deixando explícito logo no início o que cada componente espera receber.
- **Estilos em arquivos CSS dedicados por componente**, importados no próprio arquivo (ex.: `import "../styles/BoardCell.css"`). As variações visuais são aplicadas por **classes condicionais montadas com template strings** (ex.: `board-cell level-${level}` ou `professor-badge ${teamClass}`). A motivação foi manter o estilo de cada componente isolado e fácil de localizar.
- **Programação defensiva** para lidar com dados vindos da API que podem faltar: nomes com *fallback* em cadeia (`ai_player_name` → `group_name` → `"Bot 1"`), avatar com *placeholder* (a inicial do nome) e tratamento de imagem quebrada via `onError`. Isso evita que a interface quebre quando a API não retorna todos os campos.
- **Navegação por `Link`** do React Router em vez de âncoras tradicionais, para manter a navegação no lado do cliente.

### 4.1. Comunicação com a API

A comunicação com o back-end foi parametrizada por **variáveis de ambiente** (`VITE_API_BASE_URL` e `VITE_API_TOKEN`) e centralizada em um serviço (`services/api`). O `PlayerSelect` usa esse serviço para **definir o token de autenticação** de acordo com o jogador escolhido (`api.setToken(...)`), de modo que as requisições seguintes passem a representar aquele jogador. A motivação foi permitir trocar de ambiente e de jogador sem alterar o restante do código.

---

## 5. Descrição dos componentes

### `BoardCell`
Representa **uma célula do tabuleiro**. Recebe as props `level` (o nível daquela casa) e `professor` (quem a ocupa, se houver). Exibe o texto "Lvl {level}" e, quando há um professor, mostra um *badge* com o nome dele. A cor do time do *badge* é decidida por uma regra simples: se o professor for `"CLARO"` ou `"REY"`, aplica a classe `team-1`; caso contrário, `team-2`. É um componente puramente visual.

### `FeatureCard`
Cartão de **destaque/funcionalidade**, reutilizável. Recebe `title`, `description`, `icon` e `typeClass`. Renderiza um cartão com o ícone e o título (em `h3`) e a descrição (em `p`), aplicando `typeClass` para variar o estilo. Tipicamente usado para apresentar recursos da aplicação (por exemplo, em uma página inicial). Também puramente apresentacional.

### `GameCard`
Cartão que representa **uma partida** entre dois jogadores de IA. Recebe o objeto `game` e dele extrai os dois jogadores (`turing_player` e `lovelace_player`). Para cada um, monta o nome com *fallback* (`ai_player_name` → `group_name` → "Bot 1"/"Bot 2") e o avatar — exibindo a imagem quando existe, ou um *placeholder* com a inicial do nome quando não há imagem ou ela falha ao carregar. Mostra o **status da partida**: se já terminou (`status === "FINISHED"`), exibe um troféu com o nome do vencedor (calculado comparando `winner_player_id` com o id do jogador Turing); caso contrário, mostra um indicador "ao vivo" com o número do turno atual. Por fim, traz um botão ("Assistir") que leva, via `Link`, para `/watch/{game.id}`. É o principal item de listagem de partidas.

### `PlayerSelect`
*Dropdown* para **selecionar o jogador de IA**. Mantém uma lista de jogadores disponíveis (`PLAYERS`) e recebe as props `value`, `onChange`, `label` e `variant`. Quando o usuário troca a seleção, o componente localiza o jogador escolhido, **define o token de autenticação da API** correspondente (`api.setToken(...)`) e dispara `onChange` com o id selecionado — ou seja, ele liga a escolha do usuário à autenticação das próximas requisições. Possui dois variantes visuais: `"watchlist"` (uma caixa horizontal, usada na tela de listagem) e o padrão `"arena"` (esticado, com o rótulo acima do campo).

### `WinnerBanner`
Faixa exibida ao **fim de uma partida**. Recebe `winnerName` e mostra o texto "Partida Finalizada" junto com o nome do vencedor em destaque. Componente puramente apresentacional.

---

## 6. Organização de pastas

A estrutura separa os componentes dos estilos e dos serviços. Pelo que se observa nos imports:

```
src/
├── components/      # Componentes de interface (BoardCell, FeatureCard, GameCard, PlayerSelect, WinnerBanner, ...)
├── styles/          # CSS dedicado por componente (BoardCell.css, GameCard.css, ...)
├── services/        # Comunicação com a API (api.js)
└── ...              # Páginas/telas (ex.: WatchListPage, Arena de Batalha)
```

A motivação dessa divisão foi tornar fácil localizar onde cada coisa vive: o visual de um componente fica junto dele (componente + CSS), enquanto o acesso à API fica isolado em uma única camada.

---

## 7. Decisões e trade-offs

- Optar por bibliotecas leves e específicas (router, form) em vez de frameworks mais pesados, priorizando simplicidade e curva de aprendizado dentro do prazo do projeto.
- Manter a maioria dos componentes como apresentacionais e concentrar a lógica (estado e efeitos) em poucos pontos, aceitando que componentes como `PlayerSelect` carreguem um efeito colateral (trocar o token) em troca de uma interface mais simples nas telas.
- Usar CSS dedicado por componente, o que mantém o estilo isolado, mas exige atenção para evitar duplicação de regras entre arquivos.

---
