---
title: "Multitenancy na Prática: Migrando um Sistema Legado On-Premise para a Nuvem"
description: "Continuando nossa jornada sobre arquitetura multi-tenant, agora vamos analisar um caso real: um sistema on-premise em .NET Framework 4.6 que precisou ser repensado para virar uma solução SaaS em nuvem. Decisões, desafios e a realidade de quem está no meio desse caminho."
date: 2026-08-09 11:40:00
image: /assets/img/multi-tenancy-architecture-system-design.webp
category: Architecture
background: "#7AAB13"
---

## 1. O Ponto de Partida: O Cenário Legado

No artigo anterior, abordamos a arquitetura multi-tenant de forma conceitual — as estratégias de armazenamento, o problema do _noisy neighbor_, a escalabilidade _stateless_. Mas como isso se traduz quando o projeto não nasce na nuvem, e sim precisa **ser migrado** para ela?

O sistema em questão é um produto ERP que rodava há anos **on-premise**, instalado diretamente nos servidores dos clientes. A stack era:

| Camada         | Tecnologia                         |
| -------------- | ---------------------------------- |
| Backend        | .NET Framework 4.6 / C# / WebForms |
| Frontend       | jQuery e JavaScript                |
| Banco de Dados | SQL Server (local, no cliente)     |

Até aí, nada fora do comum para sistemas dessa geração. Mas havia um detalhe que mudaria todo o jogo da migração.

## 2. A Peculiaridade que Muda Tudo: Regras de Negócio no Banco

Aqui está o ponto crítico deste projeto: **aproximadamente 70% das regras de negócio estavam no banco de dados.**

Não estamos falando apenas de _queries_ simples. O sistema dependia fortemente de:

- **Stored Procedures** complexas com lógica de negócio embarcada
- **Views** que orquestravam cálculos e validações
- **Scripts SQL embutidos em código** (dentro de arquivos _resources_ do .NET, concatenados dinamicamente em tempo de execução)

> **Dica Técnica:** Quando a maior parte da lógica de negócio vive no banco de dados, qualquer estratégia de migração precisa tratar o SQL não apenas como dado, mas como **código aplicacional**. Isso impacta diretamente a forma como você versiona, testa e faz deploy.

Em um sistema on-premise, isso funcionava — cada cliente tinha sua cópia isolada do banco, e a equipe podia customizar procedures e scripts individualmente, inclusive com acessos diretos ao servidor. Mas isso também significava que cada instalação era, na prática, **uma versão diferente do produto**.

## 3. A Decisão: Migrar para a Nuvem

A diretoria tomou a decisão: o produto precisava sair dos servidores dos clientes e ir para a nuvem. As motivações eram claras:

- **Eliminar a dependência de infraestrutura local** do cliente (instalação, suporte, atualizações)
- **Centralizar o controle** das versões e correções
- **Transformar o produto em SaaS**, permitindo cobrança por assinatura
- **Reduzir custos operacionais** de equipe de campo (implantação e suporte presencial)

Mas a migração para a nuvem trazia uma pergunta fundamental que conecta diretamente com o artigo anterior:

> **Qual estratégia de armazenamento adotar em um cenário multi-tenant?**

## 4. Banco de Dados por Cliente: A Escolha pelo Isolamento

Recordando o artigo anterior, abordamos três estratégias:

| Estratégia       | Isolamento | Custo/Complexidade |
| ---------------- | ---------- | ------------------ |
| Bancos Separados | Máximo     | Alto               |
| Shared Database  | Lógico     | Baixo              |
| Modelo Híbrido   | Variável   | Equilibrado        |

Para este projeto, a decisão foi: **SQL Azure com um banco de dados por cliente** (a abordagem de "Bancos Separados").

As justificativas foram:

- **Isolamento total de dados:** Cada cliente teria seu próprio banco no SQL Azure, sem risco de cruzamento de informações.
- **Customização por cliente:** Como o sistema anos de customizações específicas (procedures diferentes, views adaptadas), o banco dedicado preservava essa flexibilidade.
- **Migração gradual:** Era possível migrar cliente por cliente, copiando a estrutura existente sem precisar redesenhar tudo de uma vez.
- **Segurança percebida:** Para os clientes (especialmente os maiores), o argumento de "meu banco é só meu" pesava a favor comercialmente.

> **Dica Técnica:** O SQL Azure oferece o recurso de _Elastic Pools_, que permite compartilhar recursos (DTUs/eDTUs) entre múltiplos bancos de dados. Isso ajuda a mitigar o custo elevado da estratégia de banco por cliente, distribuindo capacidade de forma inteligente entre tenants com picos de uso em horários diferentes.

## 5. A Promessa dos Microsserviços

> _"Vamos migrar todas as regras de negócio que estão no banco de dados para um novo projeto, com uma arquitetura moderna baseada em microsserviços."_

Foi então que nasceram os seguintes serviços:

| Microsserviço | Responsabilidade                                                        | Stack                |
| ------------- | ----------------------------------------------------------------------- | -------------------- |
| **Frontend**  | Nova interface para o usuário, trazendo inovação visual e UX ao produto | ReactJS + DevExtreme |
| **Core**      | Migração gradual das regras de negócio que viviam no banco              | Novo backend         |
| **Empresas**  | Gestão dos dados cadastrais das empresas (tenants)                      | Novo backend         |
| **Usuários**  | Gestão de usuários e autenticação                                       | Novo backend         |
| **Files**     | Geração dedicada de arquivos, planilhas e relatórios                    | Novo backend         |

### Por que essa divisão faz sentido?

A separação reflete uma decomposição por **domínio de responsabilidade**:

- **Core** é o coração do produto — onde a migração das procedures e views seria, teoricamente, mais densa e crítica.
- **Empresas** e **Usuários** lidam com dados transversais e compartilhados entre todos os tenants, o que facilita padronizar autenticação, onboarding e gestão de configurações.
- **Files** isola uma operação tipicamente pesada (geração de relatórios e planilhas), evitando que processamento de I/O afete a experiência dos usuários no sistema.

## 6. A Realidade: O Desafio de Migrar 70% da Lógica que Está no Banco

Aqui é onde a teoria encontra a realidade. A promessa de _"migrar todas as regras de negócio para o novo projeto"_ esbarra em uma verdade incômoda:

> **Quando 70% da lógica está em procedures, views e scripts SQL embutidos, "migrar para microsserviços" não é uma simples reescrita de código — é uma engenharia reversa do próprio sistema.**

### Os principais desafios que surgem:

**1. Conhecimento tácito das procedures**

Muitas procedures foram escritas há anos, por pessoas que já saíram do projeto. A lógica está documentada no comportamento, não em especificações. Migrar significa, antes de tudo, **entender** o que cada procedure faz — e muitas vezes descobrir que ninguém sabe exatamente por que aquele `IF` está ali.

**2. Scripts SQL embutidos em código (Resources)**

Os scripts SQL que vivem dentro de arquivos _resources_ do .NET são especialmente traiçoeiros. Eles são construídos por concatenação de strings, com parâmetros montados dinamicamente. Migrar isso para um microsserviço significa:

- Extrair o SQL do resource
- Compreender a lógica
- Reescrever em código (C# moderno, LINQ, etc.)
- Testar contra o resultado original

**3. Banco por cliente × microsserviços compartilhados**

Há uma tensão arquitetural interessante aqui. Se cada cliente tem seu próprio banco, mas os microsserviços são compartilhados, os serviços precisam saber **em tempo de execução** para qual banco conectar. Isso exige:

- Um catálogo de tenants (quem é quem, e onde está o banco de cada um)
- _Connection strings_ dinâmicas, resolvidas a partir do tenant identificado no token (JWT)
- Lógica de roteamento no Core, que precisa apontar para o banco correto do cliente que está fazendo a requisição

> **Dica Técnica:** Para resolver o roteamento dinâmico de banco por tenant, uma abordagem eficaz é manter um **serviço de catálogo** (que pode ser o microsserviço _Empresas_) responsável por mapear o Tenant ID (presente no JWT) para a _connection string_ correspondente no SQL Azure. O serviço _Core_ consulta esse catálogo e abre a conexão correta a cada requisição.

**4. Migração gradual, e não Big Bang**

Não é viável reescrever 70% das regras de uma vez. O sistema precisa continuar funcionando enquanto a migração acontece. Isso significa que, por um longo período, **o novo e o velho coexistem**:

- As regras ainda não migradas continuam sendo executadas pelas procedures no banco
- As regras já migradas rodam no novo Core
- O frontend novo (React) precisa consumir tanto o backend antigo quanto o novo

## 7. O Caminho Adotado: Estratégia Estranguladora (Strangler Fig Pattern)

Uma abordagem clássica para esse tipo de migração é o **Strangler Fig Pattern**, popularizado por Martin Fowler. A ideia é simples na teoria, mas exige disciplina na execução:

![](/assets/img/mermaid-diagram.png)

A regra é: **a cada sprint, o microsserviço Core "estrangula" um pouco mais o sistema legado**, assumindo gradualmente as responsabilidades que antes estavam nas procedures. O objetivo é que, eventualmente, o sistema legado seja completamente substituído — mas sem interromper o produto.

### Como funciona na prática:

1. **Identificar** uma regra de negócio que está em uma procedure ou script SQL
2. **Reescrever** essa lógica no microsserviço Core
3. **Roteirizar** as requisições daquela funcionalidade para o Core (e não mais para a procedure)
4. **Validar** que o resultado é idêntico ao comportamento anterior
5. **Desativar** a procedure correspondente (quando seguro)

E repetir. Dezenas, centenas de vezes.

## 8. Considerações Finais

A decisão de migrar um sistema legado on-premise para uma arquitetura multi-tenant em nuvem com banco por cliente é, no papel, uma escolha sólida para quem busca isolamento máximo e flexibilidade por cliente. Mas a realidade do dia a dia traz desafios que vão muito além da infraestrutura:

- **Regras de negócio no banco** são o maior gargalo de migração — não pela tecnologia, mas pelo **conhecimento embutido** que precisa ser redescoberto.
- **Microsserviços** são a direção correta para a modernização, mas exigem paciência: a migração é gradual, e a coexistência entre o velho e o novo é inevitável.
- **Banco por cliente** resolve o isolamento, mas adiciona complexidade no roteamento dinâmico de conexões — algo que precisa ser projetado com cuidado desde o início.

No próximo artigo, vamos nos aprofundar em como o microsserviço **Core** foi estruturado para lidar com a migração dessas regras de negócio: desde o roteamento dinâmico de bancos até os padrões de código utilizados para traduzir procedures SQL em serviços modernos.

---

## Referências

### Estratégia de Migração & Modernização

1. **Microsoft — Cloud Adoption Framework (CAF)**
   Microsoft Learn, 2024.
   https://learn.microsoft.com/azure/cloud-adoption-framework/
2. **Microsoft — Azure Migration and Modernization Center**
   _Guia sobre Rehost, Refactor, Replatform, Re-architect (6Rs)._
   https://learn.microsoft.com/azure/migrate/
3. **Richardson, Chris — Microservices Patterns**
   Manning Publications, 2019.

### Padrões de Migração Gradual (Strangler Fig)

4. **Fowler, Martin — "StranglerFigApplication"**
   Martin Fowler's Blog, 2004.
   https://martinfowler.com/bliki/StranglerFigApplication.html
5. **Newman, Sam — Building Microservices, 2nd Edition**
   O'Reilly Media, 2021.

### Migração .NET (WebForms → Core)

6. **Microsoft — "Migrate from ASP.NET to ASP.NET Core"**
   Microsoft Learn, 2024.
   https://learn.microsoft.com/aspnet/core/migration/proper-to-2x/
7. **Microsoft — ".NET Portability Analyzer"**
   https://learn.microsoft.com/dotnet/standard/analyzers/portability-analyzer

### Banco de Dados & SQL Azure

8. **Microsoft — "SQL Database — Database Migration Guide"**
   Microsoft Learn, 2024.
   https://learn.microsoft.com/azure/azure-sql/database/migration-guidance
9. **Microsoft — "Azure SQL Database: Multi-tenant SaaS patterns"**
   https://learn.microsoft.com/azure/architecture/guide/multitenant/considerations/sql-database

### Arquitetura & Decisões de Design

10. **Richards, Mark & Ford, Neal — Fundamentals of Software Architecture**
    O'Reilly Media, 2020.
11. **Ford, Neal et al. — Software Architecture: The Hard Parts**
    O'Reilly Media, 2021.
12. **Evans, Eric — Domain-Driven Design**
    Addison-Wesley, 2003.

---

**Quer compartilhar sua experiência com migração de sistemas legados?** Deixe seu comentário ou me chame no [LinkedIn](https://www.linkedin.com/). E se você perdeu o artigo anterior que introduz o conceito de multi-tenant, [comece por aqui](https://vitorabreu.netlify.app/entendendo-arquitetura-multi-tenant/).
