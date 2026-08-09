---
title: Upgrade Gatsby 2 → 5 — Migration Técnica
description: Passo a passo para atualizar e publicar um projeto após o upgrade
date: 2026-08-09 11:10:00
image: /assets/img/mcp_u518371115680858121_aigc_visible_image_tool_output_1786283951_a801090d.png_1786283951_b7a4fc5c.jpeg
category: Architecture
background: "#7AAB13"
---

# Upgrade Gatsby 2 → 5 — Migration Técnica

> **PR de referência:** [#44 — Upgrade Gatsby 2→5 + Node 20](https://github.com/vitorvaf/my-blog/pull/44) > **Stack antes:** Gatsby 2 · React 16 · Node 12 · `gatsby-image` · Webpack 4
> **Stack depois:** Gatsby 5.16 · React 18 · Node 20 · `gatsby-plugin-image` · Webpack 5 · Parallel Query Running

Este artigo documenta, de forma densa e técnica, a migration completa do blog de Gatsby 2 para Gatsby 5 — incluindo o diagnóstico real dos bugs de dependência encontrados no caminho, com root cause analysis de cada um.

---

## 1. Por que atualizar — Problemas de NÃO fazer o upgrade

Manter um projeto em Gatsby 2 (lançado em 2019) não é apenas uma questão estética de "versão antiga". É um **risco técnico e de segurança crescente**:

| Problema                                         | Impacto real                                                                                                                                                                           |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node 12 EOL**                                  | Node 12 perdeu suporte em abril de 2022. Sem patches de segurança, sem correções de V8, incompatível com ferramentas modernas de build e CI.                                           |
| **Webpack 4 congelado**                          | Gatsby 2 usa Webpack 4, que não recebe mais correções. Build lento, sem tree-shaking moderno, sem module federation, cache de build ineficiente.                                       |
| **Dependências com vulnerabilidades conhecidas** | `npm audit` no Gatsby 2 retorna dezenas de vulnerabilidades (alta e crítica) em cadeias transitivas (`lodash`, `glob`, `ajv`, `debug`, `core-js`). Sem upgrade, não há patch possível. |
| **React 16 sem new JSX transform**               | React 16 exige `import React from "react"` em todo arquivo. Sem o automatic runtime do React 17+, bundles maiores e código verboso.                                                    |
| **Ecossistema morto**                            | Plugins pararam de suportar Gatsby 2. Ao tentar adicionar qualquer plugin moderno, conflito de peer deps. `gatsby-image` foi deprecated em favor de `gatsby-plugin-image`.             |
| **CI/CD quebrando**                              | Imagens Docker baseadas em Node 12 somem dos registries. Netlify/Vercel forçam Node superior. Builds começam a falhar por causa do runtime, não do código.                             |
| **DX degradada**                                 | Sem Fast Refresh nativo, sem Parallel Query Running, HMR instável. Hot reload de páginas demora segundos; no Gatsby 5 é instantâneo.                                                   |
| **Onboarding caro**                              | Novo dev clona o projeto e precisa instalar Node 12 (nvm), lidar com warnings de deprecation e tooling que não conhece. Atrito desnecessário.                                          |

> **Resumo:** projeto parado no Gatsby 2 é um **imóvel com infiltração** — funciona no dia a dia, mas o custo de manutenção cresce e qualquer mudança vira retrabalho.

---

## 2. Visão Geral do Upgrade — O que mudou

A migration não foi só um `npm install gatsby@5`. Envolveu **4 eixos simultâneos**, todos interdependentes:

```plain
Node 12 ──────► Node 20              (runtime)
Gatsby 2 ─────► Gatsby 5.16          (framework major + 3)
React 16 ─────► React 18             (runtime + new features)
Webpack 4 ────► Webpack 5            (bundler, transitivo via Gatsby)

```

### Tabela de pacotes migrados

| Pacote                                             | Antes (Gatsby 2)  | Depois (Gatsby 5) | Motivo                                                 |
| -------------------------------------------------- | ----------------- | ----------------- | ------------------------------------------------------ |
| `gatsby`                                           | `^2.x`            | `^5.16.1`         | framework major                                        |
| `react` / `react-dom`                              | `^16.x`           | `^18.3.1`         | new JSX transform, hooks estáveis, concurrent features |
| `gatsby-image`                                     | `^2.x` (removido) | —                 | deprecated                                             |
| `gatsby-plugin-image`                              | —                 | `^3.16.0`         | substituto oficial                                     |
| `gatsby-plugin-sharp`                              | `^2.x`            | `^5.16.0`         | compatibilidade de major                               |
| `gatsby-transformer-remark`                        | `^2.x`            | `^6.16.0`         | compatibilidade                                        |
| `gatsby-source-filesystem`                         | `^2.x`            | `^5.16.0`         | compatibilidade                                        |
| `styled-components`                                | `^5.x`            | `^6.1.13`         | suporte a React 18                                     |
| `gatsby-plugin-styled-components`                  | `^3.x`            | `^6.16.0`         | compat Gatsby 5 + peer de babel-plugin                 |
| `algoliasearch` / `react-instantsearch-dom`        | antigo            | `^4.27` / `^6.40` | refresh                                                |
| Node (`engines`)                                   | `>=10`            | `>=18.0.0`        | alinhado ao suporte Gatsby 5                           |
| `gatsby-plugin-transition-link` / `sharp` (direto) | presentes         | **removidos**     | não usados / vindos via plugin                         |

---

## 3. Passo a Passo Denso — Todos os Pontos do Upgrade

Abaixo, cada ponto da migration com o **antes/depois** de código e o porquê.

### Passo 1 — Runtime Node 12 → 20

Três arquivos precisam apontar para a mesma versão para evitar divergência entre dev/CI/Docker:

**`.nvmrc`**

```plain
- 12
+ 20

```

**`Dockerfile.build`**

```plain
- FROM node:12 AS build
+ FROM node:20 AS build

```

**`netlify.toml`**

```plain
[build.environment]
  NODE_VERSION = "20"

```

**`package.json` → `engines`**

```plain
- "engines": { "node": ">=10.0.0" }
+ "engines": { "node": ">=18.0.0" }

```

> Gatsby 5 exige Node ≥18. Node 20 foi escolhido como LTS ativo no momento da migration.

---

### Passo 2 — Migration de Pacotes Gatsby (major 2→5)

Cada plugin Gatsby segue o número major do framework. Atualizar o core sem alinhar os plugins quebra o build. A regra: **todos os `gatsby-*` precisam da major 3, 5, ou 6 que corresponda ao Gatsby 5**.

Substituição em massa em `package.json`:

```plain
- "gatsby": "^2.x",
+ "gatsby": "^5.16.1",
- "gatsby-plugin-manifest": "^2.x",
+ "gatsby-plugin-manifest": "^5.16.0",
- "gatsby-transformer-remark": "^2.x",
+ "gatsby-transformer-remark": "^6.16.0",
  ... (todos os demais plugins alinhados)

```

Adicionar o novo plugin de imagem:

```plain
+ "gatsby-plugin-image": "^3.16.0",

```

---

### Passo 3 — `gatsby-image` → `gatsby-plugin-image` (Avatar)

A API mudou completamente. O componente `<Img fluid={...} />` virou `<GatsbyImage image={...} />`, e a query GraphQL retorna um formato diferente.

**Antes (React 16 + gatsby-image):**

```plain
import Img from "gatsby-image"

// query retornava: avatarImage { childImageSharp { fluid { ... } } }
<Img fluid={avatarImage.childImageSharp.fluid} alt={author} />

```

**Depois (gatsby-plugin-image):**

```plain
import { GatsbyImage, getImage } from "gatsby-plugin-image"

// query agora retorna formato ImageSharp (não mais "fluid")
const avatarImage = getImage(avatarImage?.childImageSharp?.gatsbyImageData)
<GatsbyImage image={avatarImage} alt={author} />

```

A função `getImage()` extrai o node do `File.childImageSharp.gatsbyImageData`, casando com o shape que o `gatsby-transformer-sharp@5` expõe. O styled component que envolvia `Img` passa a envolver `GatsbyImage` (mesma API de estilização).

---

### Passo 4 — Sintaxe GraphQL `sort` (breaking change Gatsby 3+)

O Gatsby 3 mudou a sintaxe do argumento `sort` em queries de `allMarkdownRemark`. Antes era um enum flat; agora é um **objeto aninhado** declarando o campo e a direção.

**Antes (Gatsby 2):**

```plain
allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {

```

**Depois (Gatsby 3+):**

```plain
allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {

```

Esse padrão aparece em **três arquivos** e todos precisam migrar juntos, senão o build quebra na extração de queries:

- `gatsby-node.js` — query `PostList` em `createPages`
- `src/templates/blog-list.js` — query de página com paginação
- `src/utils/algollia_queries.js` — query que alimenta o índice Algolia

> **Erro se não migrar:** `Cannot query field "fields" on sort argument` — Gatsby 5 valida o schema e rejeita a sintaxe antiga.

---

### Passo 5 — `gatsby-node.js`: `createPages` assíncrono + tratamento de erro

O Gatsby moderno espera `createPages` como **async** e recomenda usar `reporter.panicOnBuild` para propagar erros de GraphQL de forma controlada (sem crashar o processo inteiro).

**Depois:**

```plain
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`query PostList { ... }`)

  if (result.errors) {
    reporter.panicOnBuild(`Error loading markdown posts for page creation`, result.errors)
    return
  }

  const posts = result.data.allMarkdownRemark.edges
  posts.forEach(({ node, next, previous }) => {
    createPage({ /* ... */ context: { previousPost: next, nextPost: previous } })
  })
}

```

O `reporter` injetado substitui o `console.error` cru e integra-se ao pipeline de build do Gatsby (mostra erros estruturados no terminal e falha o build de forma limpa).

---

### Passo 6 — `gatsby-plugin-algolia` + Queries

A integração Algolia usa `gatsby-plugin-algolia` para indexar conteúdo no build. A query de indexação migra a sintaxe `sort` (Passo 4) e adiciona `internal.contentDigest` para o plugin detectar mudanças.

**`src/utils/algollia_queries.js`** (query de indexação):

```plain
const postQuery = `{
  allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
    nodes {
      objectID: id
      fields { slug }
      frontmatter { title background category description date title }
      excerpt(pruneLength: 5000, truncate: true)
      internal { contentDigest }   // novo: permite reindexação incremental
    }
  }
}`

```

**`gatsby-config.js`** — config do plugin com `continueOnFailure`:

```plain
{
  resolve: `gatsby-plugin-algolia`,
  options: {
    appId: algoliaAppId,
    apiKey: algoliaAdminKey,
    indexName: algoliaIndexName,
    queries,
    chunkSize: 10000,
    continueOnFailure: true,  // não falha o build quando creds/indexação indisponíveis
  },
}

```

---

### Passo 7 — Variáveis de Ambiente com guardrails

Antes o build falhava silenciosamente ou explodia dentro do plugin quando faltavam as creds do Algolia. A migration adiciona um **warn explícito no `gatsby-config.js`**:

```plain
const algoliaAppId = process.env.GATSBY_ALGOLIA_APP_ID
const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY
const algoliaIndexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

if (!algoliaAppId || !algoliaAdminKey || !algoliaIndexName) {
  console.warn(
    "[gatsby-config] Algolia env vars (...) are missing. " +
    "Search indexing will be skipped for this build. " +
    "Copy .env.example to .env and fill in values from https://www.algolia.com/account/api-keys/"
  )
}

```

Combinado com `continueOnFailure: true`, o build **prosegue sem indexar** quando as creds faltam — ideal para PRs/CI sem secrets. Arquivo `.env.example` documenta as 4 vars (incluindo a regra: **admin key NÃO pode ter prefixo `GATSBY_`** senão vaza pro bundle do browser).

---

### Passo 8 — SEO: URLs canônicas e props do Open Graph

Aproveitando a migration, corrigiu-se o joining de URLs no componente SEO (a `siteUrl` + path relativo) e um bug onde `og:type` era usado em vez de `og:image`:

```plain
// normalização: siteUrl sempre com barra, path sem barra duplicada
const siteUrl = seo.siteUrl?.replace(/\/$/, "") || ""
const image = seo.image ? new URL(seo.image, siteUrl).href : undefined

// meta tags
meta: [
  { property: "og:image", content: image },         // era og:type (bug)
  { name: "twitter:image:src", content: image },
]

```

E o template `blog-post.js` passou a enviar `description` (não `PostDescription`, que não existia nas propTypes do `SEO`).

---

### Passo 9 — `styled-components` v6 + `gatsby-plugin-styled-components`

`styled-components@5` não suporta React 18 totalmente (SSR). Subiu para v6. O plugin `gatsby-plugin-styled-components` (que injeta o babel plugin para SSR) também foi para v6 — e **exige** o `babel-plugin-styled-components` como peer dependency (ver Problema Técnico #2 abaixo).

---

## 4. Problemas Técnicos Encontrados — Root Cause Analysis

Aqui está o coração técnico da migration. **Três bugs de dependência** surgiram ao buildar/desenvolver — todos sintomas da mesma classe de problema: **tooling da era Gatsby 2 conflitando com a resolução de dependências do Gatsby 5**.

### Problema #1 — `Cannot find module 'ajv/dist/compile/codegen'`

**Sintoma:** `gatsby build` falhava em `Building production JavaScript and CSS bundles` (webpack).

```plain
ERROR #98123 WEBPACK.BUILD-JAVASCRIPT
Cannot find module 'ajv/dist/compile/codegen'
  at node_modules/ajv-keywords/dist/definitions/typeof.js
  at node_modules/schema-utils/dist/validate.js
  at node_modules/terser-webpack-plugin/dist/index.js

```

**Diagnóstico (via `npm ls ajv`):**

- `terser-webpack-plugin` (transitivo do Gatsby 5) → `schema-utils@4.3.3` → tem `ajv-keywords@5` como peer
- `ajv-keywords@5.1.0` foi **hoisted** para o topo (`node_modules/ajv-keywords`)
- Mas ao resolver `ajv`, ele sobe até o **`ajv@6.15.0` hoisted no topo** (vindo das cadeias `schema-utils@2/3` + `eslint`), e não até o `ajv@8.20.0` aninhado sob `schema-utils@4`
- `ajv-keywords@5` faz `require('ajv/dist/compile/codegen')` — path interno que **só existe no ajv@8** (removido na v6). Boom.

O `npm ls` inclusive sinalizava: `ajv@6.15.0 deduped invalid: "^8.8.2" from node_modules/ajv-keywords`.

**Solução:** adicionar `ajv@^8.12.0` em `devDependencies`. Isso força o **ajv@8 no topo** do `node_modules`, e o npm deduplica para todos os consumidores que precisam de v8 (`schema-utils@4`, `ajv-keywords@5`). O `ajv@6` fica aninhado sob `eslint` (que espera a API v6). **Coexistem sem conflito.**

> Lição: quando uma peer dependency transitive é hoisted para a versão errada, adicionar a versão correta como dependência direta na raiz resolve o hoisting via dedupe — sem precisar de `overrides` (que seria arriscado aqui por quebrar `eslint@7`).

---

### Problema #2 — `'babel-plugin-styled-components' is not installed`

**Sintoma:** `gatsby build` falhava em `load plugins`:

```plain
ERROR in ".../gatsby-plugin-styled-components/gatsby-node":
'babel-plugin-styled-components' is not installed
which is needed by plugin 'gatsby-plugin-styled-components'

```

**Diagnóstico:** o `gatsby-plugin-styled-components@6.16.0` tem como peer dependency:

```plain
"peerDependencies": { "babel-plugin-styled-components": ">1.5.0", ... }

```

E no `gatsby-node.js` (linha 8-12) do plugin há um check **incondicional** no load:

```plain
try {
  require.resolve("babel-plugin-styled-components")
} catch (e) {
  throw new Error("'babel-plugin-styled-components' is not installed...")
}

```

A migration para `styled-components@6` + `gatsby-plugin-styled-components@6` **esqueceu** de incluir o babel plugin no `package.json`. Sem ele, o plugin não consegue fazer a transformação Babel para SSR de styled-components (displayName, minify, etc.).

**Solução:** adicionar `babel-plugin-styled-components@^2.1.4` (versão compatível com styled-components v6) em `devDependencies`.

> Lição: peer dependencies que o Gatsby valida em runtime não são opcionais — `npm` as auto-instala de forma não-determinística entre installs, então o build pode passar localmente e falhar em CI. Pinhar explicitamente é a única forma garantida.

---

### Problema #3 — `ESLint is not a constructor` (no `gatsby develop`)

**Sintoma:** `gatsby develop` compilava o bootstrap mas falhava no bundle de desenvolvimento:

```plain
ERROR #98123 WEBPACK.DEVELOP
Generating development JavaScript bundle failed
ESLint is not a constructor

```

**Diagnóstico (via `npm ls eslint`):**

- O Gatsby 5 bundleia `eslint-webpack-plugin@2.7.0`, que tem peer **`eslint: "^7.0.0 || ^8.0.0"`**
- Esse plugin instancia o linter via `new ESLint(...)` — API introduzida no **eslint 7.8**
- Mas o projeto tinha **`eslint@6.8.0`** hoisted (vindo do stack de tooling adicionado em worktree separada)
- `eslint@6` **não exporta** a classe `ESLint` (só `CLIEngine`) → `new ESLint()` lança `TypeError: ESLint is not a constructor`

```plain
eslint top: 6.8.0
ESLint is constructor? undefined  | CLIEngine? function

```

**Solução:** bump de `eslint` de `^6.8.0` → `^7.32.0`. Essa versão:

- Exporta a classe `ESLint` (satisfaz o `eslint-webpack-plugin`)
- Mantém compatibilidade com o resto do stack existente (`eslint-config-react-app@5`, plugins de hooks/a11y/import)
- É a versão contra a qual o Gatsby 5 foi testado (peer dep aceita)

> Lição: o `eslint-webpack-plugin` bundled no Gatsby roda **durante `develop` e `build`** — então o eslint do projeto precisa satisfazer o peer dele, não apenas o do script `npm run lint`.

---

### Resumo dos 3 bugs

| #   | Erro                                           | Root cause                                                          | Fix                                            |
| --- | ---------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | `ajv/dist/compile/codegen` not found           | hoisting de `ajv@6` sobre `ajv-keywords@5` (que precisa v8)         | `ajv@^8.12.0` devDep                           |
| 2   | `babel-plugin-styled-components` not installed | peer dep do plugin styled-components não pinhada                    | `babel-plugin-styled-components@^2.1.4` devDep |
| 3   | `ESLint is not a constructor`                  | `eslint-webpack-plugin@2.7.0` precisa de eslint ≥7, projeto tinha 6 | `eslint` ^6 → ^7.32.0                          |

**Padrão comum:** todos são consequência de **tooling/peer deps da era Gatsby 2 colidindo com a árvore de dependências do Gatsby 5**. A migration do core não foi acompanhada da revisão das peer deps que o novo core exige.

---

## 5. Desafios do Processo

### 5.1 Diagnóstico de dependências é não-trivial

Nenhum dos 3 bugs acima tinha mensagem de erro óbvia. Todos exigiram `npm ls <pkg>`, inspeção da árvore, leitura do `gatsby-node.js` dos plugins para entender o `require.resolve`. A investigação do Problema #1 em particular confundiu num primeiro momento — `node_modules` parecia sincronizado, mas o **hoisting** estava errado.

### 5.2 Consolidação de 8 branches em paralelo

O upgrade não estava sozinho: 7 outros worktrees (ESLint, Jest, husky, 3 fixes, docs) precisaram ser mergeados na mesma branch. Isso gerou **6 conflitos de merge**, o mais complexo no `package.json` (tooling da era Gatsby 2 sobre a base Gatsby 5). Decisão arquitetural: **base = Gatsby 5, tooling layer por cima**, com bumps de compatibilidade:

- `babel-preset-gatsby` ^0.4 → ^3 (era Gatsby 2 → Gatsby 5)
- `react-test-renderer` ^16 → ^18 (React 18)
- `prettier` 2.0.5 → ^2.8.8

### 5.3 Build verde vs Develop verde

Curiosamente, `gatsby build` chegou a passar enquanto `gatsby develop` falhava (Problema #3). O `eslint-webpack-plugin` instancia o ESLint de formas ligeiramente diferentes entre modos — então **validar só o build não é suficiente**; é preciso testar `develop` também.

### 5.4 Resolução não-determinística entre installs

O Problema #2 (babel-plugin-styled-components) se manifestou de forma inconsistente: o `npm install` auto-instalou a peer em um checkout mas não em outro (peer auto-install é best-effort no npm 7+). Isso significa que um build "passou" localmente de forma enganosa e quebrou depois. **Pinhar peer deps explicitamente** é a única garantia.

---

## 6. Benefícios Concretos da Atualização

| Benefício                                      | Detalhe                                                                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Node 20 (LTS ativo)**                        | Suporte de segurança, V8 moderno, compatível com CI/CD atuais e imagens Docker mantidas.                          |
| **React 18**                                   | New JSX transform (sem `import React`), concurrent rendering, automatic batching, hooks estáveis e maduros.       |
| **Webpack 5**                                  | Tree-shaking aprimorado, module federation-ready, cache de build persistente, build mais rápido.                  |
| **Parallel Query Running**                     | Gatsby 5 executa queries GraphQL de páginas em paralelo — build de sites grandes orders of magnitude mais rápido. |
| **Fast Refresh nativo**                        | HMR instantâneo e estável em `develop`, preservando state de componentes.                                         |
| **`gatsby-plugin-image`**                      | API moderna, lazy-loading nativo, melhor LCP/CLS (Core Web Vitals), menor bundle de imagem.                       |
| **Dependências sem vulnerabilidades críticas** | `npm audit` dramaticamente mais limpo após o refresh da árvore.                                                   |
| **DX moderna**                                 | Mensagens de erro estruturadas, `reporter.panicOnBuild`, schema validation de queries no build.                   |
| **Ecossistema vivo**                           | Plugins voltam a receber updates; volta a ser possível adicionar tooling moderno sem conflito de peer deps.       |
| **Onboarding barato**                          | `nvm use` funciona, `npm install` roda limpo, sem deprecation warnings obscuros.                                  |

---

## 7. Lições Aprendidas & Follow-ups

### Lições

1. **Migration de framework major = revisar todas as peer deps**, não só o core. Os bugs não vieram do Gatsby em si, mas das cadeias transitivas que ele exige.
2. **`npm ls <pkg>` é a ferramenta #1** para diagnosticar conflitos de hoisting/peer deps.
3. **Pinhar peer deps críticas explicitamente** (`ajv`, `babel-plugin-styled-components`) — não confie no auto-install do npm.
4. **Validar `build` E `develop`** — eles exercitam caminhos diferentes do webpack.
5. **Uma branch de consolidação** com tooling de eras diferentes exige decisão arquitetural clara sobre qual é a "base".

### Follow-ups (não-bloqueantes, identificados no PR #44)

- **Modernizar o stack de lint/test** (ainda parcialmente era Gatsby 2): `babel-eslint@10` (deprecated) → `@babel/eslint-parser`; `eslint-plugin-react-hooks@1` → v4; considerar `eslint@8` + flat config; `jest@26` → `jest@29`.
- **Typo pré-existente** em `src/utils/algollia_queries.js`: `attributsToSnippet` → `attributesToSnippet` (setting do Algolia silenciosamente ignorada hoje).
- Avaliar migração de `netlify-cms-app` (deprecated) → `gatsby-plugin-decap-cms` (renomeado).
