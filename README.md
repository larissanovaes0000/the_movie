# The Movie

Aplicação front-end em React + Vite para navegar filmes (integração básica com a API TMDB).

Este repositório contém a UI do projeto "the_movie" (Vite + React + TypeScript). O app tem busca com debounce, listagem com paginação infinita, visualização de detalhes e gerenciamento de favoritos (integração com TMDB quando credenciais estão disponíveis; fallback em localStorage quando não).

## Sumário
- Requisitos
- Variáveis de ambiente
- Instalação
- Scripts úteis
- Estrutura do projeto
- Como usar / fluxo TMDB
- Desenvolvimento e CI
- Testes
- Contribuição
- Observações

---

## Requisitos
- Node.js (LTS recomendado)
- npm
- Git
- Conta TMDB (opcional, apenas se quiser usar favoritos no servidor)

## Variáveis de ambiente
Coloque um arquivo `.env` (ou configure as variáveis de ambiente na sua máquina/CI) com os seguintes valores quando for usar a API TMDB:

- `VITE_TMDB_API_KEY` — chave pública da API TMDB (necessária para buscar filmes e detalhes)
- `VITE_TMDB_SESSION_ID` — (opcional) session_id TMDB para marcar favoritos via API
- `VITE_TMDB_ACCOUNT_ID` — (opcional) account_id TMDB para obter favoritos da conta

Exemplo `.env`:

```powershell
# arquivo .env (não commitá-lo)
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_SESSION_ID=your_session_id_if_you_have
VITE_TMDB_ACCOUNT_ID=your_account_id_if_you_have
```

> Observação: Valores sensíveis não devem ser comitados. No CI configure segredos (GitHub Actions Secrets, etc.).

## Instalação (local)

```powershell
# instalar dependências
npm install

# iniciar em modo dev
npm run dev

# build de produção
npm run build

# pré-visualizar build (após build)
npm run preview
```

O comando `build` executa `tsc -b` (constrói tipos) e em seguida `vite build`.

## Scripts disponíveis
- `npm run dev` — inicia o servidor de desenvolvimento (Vite)
- `npm run build` — compila o projeto para produção (executa TypeScript build + Vite build)
- `npm run preview` — serve a build de produção localmente
- `npm run lint` — executa ESLint configurado no projeto

> Nota: atualmente não existe um script `test` por padrão neste repositório. Se desejar, adicione o Vitest (ou outro runner) e um script `test`.

## Estrutura principal do projeto

- `src/`
  - `main.tsx` — bootstrap da aplicação
  - `App.tsx` — ponto de montagem e roteamento principal
  - `routes/index.tsx` — definição das rotas
  - `components/` — componentes reutilizáveis
    - `Menu/` — componente de menu (busca)
    - `MovieCard/` — componente que renderiza um card de filme
  - `views/` — telas/visualizações
    - `HomeView/` — listagem com busca e paginação infinita
    - `DetailsView/` — detalhes do filme
    - `FavoritesView/` — favoritos (usa TMDB se credenciais presentes, senão localStorage)
  - `services/tmdb.ts` — helpers para chamadas da API TMDB e favoritos
  - `hooks/useDebounce.ts` — hook de debounce usado pelo `Menu`
  - `assets/scss/` — variáveis e estilos SCSS

## Descrição das funcionalidades

- Busca com debounce no `Menu` — redireciona para `/search?query=...` ou chama callback `onSearch` se fornecido
- `HomeView` consome TMDB (discover/search) e implementa paginação infinita via `IntersectionObserver`
- `DetailsView` busca detalhes do filme e créditos (diretor)
- Favoritos: quando `VITE_TMDB_SESSION_ID` e `VITE_TMDB_ACCOUNT_ID` estão configurados, a aplicação chama os endpoints de conta do TMDB para marcar/desmarcar favoritos e listar favoritos do usuário; caso contrário, usa `localStorage` como fallback

## Como usar integração de favoritos TMDB (alto nível)
1. Obtenha `VITE_TMDB_API_KEY` (da sua conta TMDB).
2. Para favoritar via API (server-side flow TMDB):
   - Gere um `request_token` via `GET /authentication/token/new` (TMDB).
   - Direcione o usuário a aprovar o token em TMDB (URL de autorização).
   - Troque o `request_token` aprovado por um `session_id` via `POST /authentication/session/new`.
   - Obtenha `account_id` com `GET /account` usando o `session_id`.
   - Insira `VITE_TMDB_SESSION_ID` e `VITE_TMDB_ACCOUNT_ID` nas variáveis de ambiente do app/CI.

(A implementação front-end já usa `VITE_TMDB_SESSION_ID` e `VITE_TMDB_ACCOUNT_ID` quando presentes; a obtenção desses valores geralmente exige um passo manual ou um flow de backend/redirect.)

## Considerações sobre CI e case-sensitivity
- Repositórios podem falhar em runners Linux por diferenças de caixa de nomes (case-sensitive). Se o CI der erro `Cannot find module '../components/Menu/Menu'`, normalize o nome da pasta (`Menu`) e confirme que os imports usam o mesmo case.
- Já existe um commit neste repositório que normaliza a pasta `src/components/Menu` e adiciona um `index.ts` para facilitar imports.

## Testes
- Não há um runner de testes (script `test`) configurado por padrão. Recomendações:
  - Adicione `vitest` + `@testing-library/react` (verifique compatibilidade com a versão de React usada) ou use `vitest` + testes DOM diretos.
  - Configure `vitest.config.ts` com `environment: 'jsdom'` para testes que interagem com DOM.

Exemplo básico para instalar Vitest (opcional):

```powershell
npm i -D vitest jsdom @types/jsdom
# adicione em package.json:
# "test": "vitest"
```

## Como contribuir
- Abra uma issue para discutir a mudança
- Faça um branch com um nome descritivo (`feature/xxx` ou `fix/xxx`)
- Abra um pull request descrevendo a alteração

## Dicas de desenvolvimento
- Use `npm run dev` para desenvolvimento com HMR (Vite)
- Se alterar nomes de pastas (case), normalize via `git mv` para evitar problemas em CI
- Mantenha suas chaves TMDB fora do repositório (use `.env` + .gitignore)

## Problemas conhecidos / notas
- Dependendo da versão do React (ex.: React 19), algumas libs de teste (`@testing-library/react` antigas) podem ter peer-deps incompatíveis; caso tenha problemas, use versões compatíveis ou escreva testes que não dependam de libs que exigem React 18.

---

Se quiser, eu posso:
- Adicionar um script `test` + configuração mínima do `vitest` e um teste de exemplo.
- Adicionar um arquivo `.env.example` com variáveis que devem ser configuradas.
- Gerar um guia passo-a-passo para obter `session_id`/`account_id` com exemplos de requisições.

Diga qual próximo passo prefere e eu implemento.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
