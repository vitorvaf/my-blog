---
title: "Multitenancy na Prática — Parte 3: TCO — Quando as Decisões Arquiteturais Cobram a Conta"
description: "Exercício de TCO real: a equipe saiu no meio da migração, cada cliente virou uma VM + um banco Azure SQL e 70% da regra de negócio segue presa em procedures."
date: 2026-08-14 09:05:00
image: /assets/img/multi-tenancy-architecture-system-design.webp
category: Architecture
background: "#637a91"
---

# Multitenancy na Prática — Parte 3: TCO — Quando as Decisões Arquiteturais Cobram a Conta

> Continuação de [Parte 1 — Entendendo Arquitetura Multi-Tenant](https://vitorabreu.netlify.app/entendendo-arquitetura-multi-tenant/) e [Parte 2 — Migrando um Sistema Legado On-premise para a Nuvem](https://vitorabreu.netlify.app/multitenancy-na-pr%C3%A1tica-migrando-um-sistema-legado-on-premise-para-a-nuvem/).

Nas partes anteriores, falamos das estratégias de multitenancy e das decisões tomadas para migrar um ERP legado — 70% das regras de negócio em procedures, arquitetura híbrida com Strangler Fig, catálogo de tenants e roteamento dinâmico de bancos no SQL Azure.

Nesta parte, o foco muda de **"como construir"** para **"quanto custa manter"**. Porque arquitetura não é só desenho de caixinhas: toda decisão estrutural vira uma linha de custo recorrente — e algumas viram risco concentrado.

Vamos fazer um exercício de TCO (Custo Total de Propriedade) sobre um cenário real: **a equipe que tomou todas as decisões saiu do projeto** antes de terminar a migração do legado. O que sobra? Quanto custa? E, principalmente: quais decisões geraram esses custos?

> **TL;DR:** Strangler Fig inacabado = a equipe original saiu, a API legada roda **em uma única VM compartilhada por N clientes** (um site/app pool por cliente), cada cliente tem **um banco Azure SQL dedicado**, 70% da regra de negócio segue presa em procedures e a nova equipe paga cinco curvas de aprendizado simultâneas. A conclusão do exercício: a VM compartilhada barateia a infraestrutura de aplicação, mas concentra **risco** e trava a escala horizontal; o custo que cresce linearmente é o **banco por cliente**; e só concluir a migração muda a curva.

---

## 1. O Cenário: O Produto pela Metade

O gerente, os analistas, o PO e os desenvolvedores que desenharam a migração saíram do projeto. O sistema ficou no pior estado possível de um Strangler Fig **inacabado**:

| Camada                               | Estado                                                    | Quem mantém         |
| ------------------------------------ | --------------------------------------------------------- | ------------------- |
| API Legada (WebForms)                | Em produção, **uma VM para N clientes**, sem substituição | Nova equipe         |
| Microsserviços novos (.NET Core)     | Parcialmente prontos                                      | Nova equipe         |
| Frontend React                       | Parcialmente pronto                                       | Nova equipe         |
| Banco SQL Azure (1 por cliente)      | Em produção                                               | Nova equipe         |
| Procedures (70% da regra de negócio) | Intactas                                                  | **Ninguém entende** |

> ⚠️ **O ponto crítico:** num Strangler Fig, conviver com os dois sistemas é um estado _temporário aceitável_ — desde que exista time, plano e conhecimento para completar a migração. Quando a equipe sai, esse estado deixa de ser estratégia e vira **dívida com juros**.

---

## 2. O Modelo de Hospedagem Real: Uma VM, N Clientes

Este é o ponto que mais gera confusão quando alguém olha a arquitetura de fora — e o que mais muda a conta.

A aplicação legada **não é multitenant**: sessão in-process, configuração por cliente no `web.config`, artefatos que assumem um único tenant por processo. Isso normalmente levaria a "uma VM por cliente". Mas não foi o que aconteceu: a solução adotada foi **densificar** — uma única VM Windows rodando IIS, com **um site (e um application pool) por cliente**, cada um com seu `web.config` e sua connection string.

![](/assets/img/multitenancy_tco_vm_compartilhada_bancos_dedicados.svg)

Em vocabulário de multitenancy: **isolamento no processo (silo), compartilhamento no host (pool)**. É um modelo _multi-instância_, não multitenant. A distinção importa porque as duas coisas têm curvas de custo completamente diferentes.

### 2.1 O que esse modelo resolve

- **Custo marginal de infraestrutura próximo de zero** por cliente novo — enquanto houver folga na VM.
- **Isolamento de falha no nível de processo**: um app pool que estoura memória e recicla derruba um cliente, não todos.
- **Isolamento de configuração**: cada `web.config` pode apontar para versões, flags e connection strings diferentes.

### 2.2 O que esse modelo esconde

| Dimensão                        | O que acontece na prática                                                                                                                                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Teto de densidade**           | Cada app pool é um processo `w3wp.exe` com seu próprio heap, cache, assemblies JIT-adas e sessões in-process. O recurso que satura primeiro quase nunca é CPU — é **memória**.                                                                                         |
| **Escala vertical, em degraus** | Quando a VM satura, você não adiciona "um pouquinho": sobe de tamanho (D4→D8→D16), **dobrando o custo** para ganhar folga. A curva não é linear, é uma **escada**.                                                                                                     |
| **Noisy neighbor dentro da VM** | Um cliente rodando fechamento mensal consome CPU e I/O de todos os outros. Sem limites configurados, o IIS não isola CPU por app pool por padrão.                                                                                                                      |
| **Blast radius**                | Reboot, patch de SO, atualização de .NET, disco cheio, esgotamento de portas efêmeras: **N clientes caem juntos**.                                                                                                                                                     |
| **Janela de manutenção única**  | Não existe rollout canário por cliente. Ou todo mundo atualiza, ou ninguém.                                                                                                                                                                                            |
| **Sem escala horizontal**       | Sessão in-process significa que adicionar uma segunda VM exige _sticky sessions_ ou estado externo. Sem isso, o único caminho de crescimento é para cima.                                                                                                              |
| **Deploy ainda é N**            | Um deploy por site (ou um deploy compartilhado + N reciclagens de app pool, o que derruba sessões de todos ao mesmo tempo).                                                                                                                                            |
| **SLA**                         | Uma VM de instância única com Premium SSD/Ultra Disk em todos os discos tem SLA de **99,9%**; duas ou mais instâncias em Availability Set sobem para **99,95%**, e em duas ou mais Availability Zones, **99,99%**. Uma VM única é uma decisão de SLA, não só de custo. |

> 💡 **Dica Técnica:** Se você está nesse modelo, três configurações de IIS pagam por si mesmas rapidamente: **limites de CPU por application pool** (`limit` + ação de _throttle_), **limites de memória privada com reciclagem controlada** e **reciclagem por horário fixo em vez de por intervalo** — reciclagem em intervalo regular acaba caindo, cedo ou tarde, em cima do fechamento de alguém.

### 2.3 A comparação honesta

| Característica                  | App multitenant (objetivo) | **1 VM / N clientes (realidade atual)** | 1 VM por cliente   |
| ------------------------------- | -------------------------- | --------------------------------------- | ------------------ |
| Custo de infra por cliente novo | \~zero                     | **\~zero, até saturar**                 | 1 VM inteira, 24/7 |
| Curva de custo de infra         | Sublinear                  | **Escada (degraus)**                    | Linear             |
| Utilização média de CPU         | Alta                       | **Média/alta**                          | Baixa (5–15%)      |
| Deploy de correção              | 1 deploy                   | **N sites**                             | N VMs              |
| Blast radius de um incidente    | Todos                      | **Todos**                               | 1 cliente          |
| Escala horizontal               | Nativa                     | **Bloqueada** (sessão in-process)       | Bloqueada          |
| Patch de SO                     | Gerenciado (PaaS)          | **1 VM, N clientes afetados**           | N VMs              |
| Isolamento de performance       | Por design (quotas)        | **Fraco** (mesmo host)                  | Forte              |

A conclusão muda em relação ao que se imagina: **a VM compartilhada não é o vilão econômico do cenário — ela é a decisão que segurou o custo de infraestrutura de aplicação**. O vilão econômico está no item 4 (um banco por cliente); o vilão _operacional_ é o teto de escala e a concentração de risco que essa VM cria.

---

## 3. O Custo de Pessoas: Curva de Aprendizado e Headcount

A nova equipe precisa dominar **simultaneamente**:

1. **Stack legada**: WebForms, .NET Framework full, sessões in-process, `web.config` por cliente, IIS, app pools
2. **Stack nova**: .NET Core, React, microsserviços, publicação em nuvem
3. **Domínio de negócio**: centenas de procedures que encapsulam regra fiscal, financeira e tributária — sem documentação viva
4. **Arquitetura híbrida**: catálogo de tenants, roteamento dinâmico, JWT, resolução de connection string
5. **Operação**: 1 VM densa + N bancos + monitoramento por tenant dentro de um host compartilhado

Não é uma curva de aprendizado — são **cinco**. Na prática, uma pessoa nova leva meses para produzir com confiança, porque não basta entender o código: é preciso entender **por que** a decisão foi tomada daquela forma — e quem sabia isso **saiu**.

O headcount também cresce, porque existem dois mundos:

- Pessoas para **manter o legado** (hotfix, suporte, deploy nos sites, operação da VM)
- Pessoas para **continuar a migração** (Core, React)
- Alguém que domine **os dois** para fazer a ponte

E há um custo raramente contabilizado: **o custo de oportunidade**. Cada sprint gasto operando a VM e reagindo a incidentes é um sprint que não estrangulou nenhuma procedure — ou seja, a dívida não só existe, ela **rende juros compostos**.

> 💡 **Dica Técnica:** ADRs (Architecture Decision Records) não são burocracia. Quando a equipe original saiu, o que faltou não foi código — foi **o porquê**. Um ADR de 10 linhas por decisão ("por que uma VM densa e não App Service?", "por que banco por cliente?", "o que precisa ser verdade para revermos isso?") teria encurtado a curva de aprendizado em semanas. Escreva o ADR mesmo _depois_: reconstruir a decisão hoje já vale mais do que não ter registro nenhum.

---

## 4. O Custo do Banco: Onde a Conta Realmente Cresce

Este é o custo mais silencioso e o mais ligado a uma decisão antiga: **centralizar a regra de negócio em procedures**, somada a **um banco por cliente**.

### 4.1 Como o Azure SQL cobra

Dois modelos de compra:

1. **DTU**: pacote que mistura CPU, memória e I/O. Mais processamento, pacote maior. Não suporta serverless nem Hyperscale.
2. **vCore**: você escolhe compute e paga **por hora**, no modelo provisionado — inclusive com o banco ocioso à noite. Permite Azure Hybrid Benefit e reservas.

No modelo provisionado, o compute é cobrado pela configuração, não pelo uso. Uma procedure que consome CPU demais no fechamento mensal força a provisionar um tier caro **que fica ocioso o resto do mês**.

Como cada cliente tem banco próprio, a conta multiplica:

```plain
Custo mensal de banco ≈ N clientes × tier dimensionado para o pior workload de cada um

```

Se UMA procedure de fechamento exige 8 vCores para não dar timeout, **todos** os clientes que rodam aquele módulo precisam desse tier, provisionado 24/7, mesmo que o workload normal seja de 1 vCore.

### 4.2 O detalhe que quase ninguém considera: memória também é cobrada

No serverless, o compute faturado por segundo é o **máximo entre CPU usada e memória usada** — a memória é normalizada em vCores na proporção de 3 GB por vCore. Ou seja: `max(vCores mínimos, vCores usados, memória mínima GB × 1/3, memória usada GB × 1/3)`.

Isso tem uma consequência direta para quem tem regra de negócio em procedure: **uma procedure pesada continua custando depois de terminar**. Ela inflou o buffer pool, e a memória é liberada gradualmente — então a fatura segue no patamar de memória mesmo com a CPU já em zero.

O próprio exemplo da documentação mostra isso: um banco General Purpose com 1 vCore mínimo e 4 máximos, ativo nas 2 primeiras horas de um dia e com auto-pause em 6 horas, acumula 50.400 vCore-segundos em 24h — a \~US$ 0,000145/vCore/s, cerca de **US$ 7,31/dia**. Vale dissecar esse número:

| Intervalo  | O que estava acontecendo             | vCore-segundos |
| ---------- | ------------------------------------ | -------------- |
| 0:00–1:00  | Carga real (CPU)                     | 14.400         |
| 1:00–2:00  | Carga real, **faturada por memória** | 14.400         |
| 2:00–8:00  | **Ocioso, esperando o auto-pause**   | 21.600         |
| 8:00–24:00 | Pausado (só storage)                 | 0              |

**43% da conta desse exemplo é o banco parado esperando a janela de auto-pause fechar.** Multiplique por 50 clientes e você tem \~US$ 11 mil/mês de compute para bancos que trabalham 2 horas por dia. O custo não está no uso — está na **janela e no mínimo provisionado**.

> ⚠️ **Correção importante para quem for otimizar:** Azure Hybrid Benefit e reservas **não se aplicam ao serverless**. Serverless e capacidade reservada são caminhos mutuamente exclusivos, não somáveis. Escolher um é abrir mão do outro.

### 4.3 Elastic Pool: economia por compartilhamento, não por uso

O Elastic Pool **não é pay-per-use**: você é cobrado por cada hora em que o pool existe, pelo maior eDTU/vCore configurado, independentemente do uso — e não há cobrança por banco. O mecanismo de economia é o _compartilhamento_: como nem todos os clientes processam ao mesmo tempo, quanto mais bancos no pool, maior a economia.

A documentação dá a fórmula de dimensionamento, e ela é o coração do argumento:

```plain
vCores do pool = MAX(
    total de bancos × utilização média por banco,
    bancos que picam simultaneamente × pico por banco
)

```

Repare no segundo termo. **Se os picos são correlacionados, o pool não economiza nada.** E num ERP eles são: fechamento mensal, apuração fiscal, prazos de SPED, folha — todos os clientes rodam o mesmo processo pesado nos mesmos dias do mês. O padrão que o Elastic Pool ama (picos raros e defasados) é justamente o que um ERP fiscal **não** tem.

A documentação é explícita, inclusive, que múltiplos bancos com utilização média-alta persistente **não deveriam** ficar no mesmo pool.

> 💡 **Dica Técnica:** Antes de mover para pool, meça a **correlação** dos picos, não só a média. Colete `sys.dm_db_resource_stats` (15 em 15 segundos, \~1 hora de histórico) ou `sys.resource_stats` no banco `master` (histórico de semanas) de todos os tenants, alinhe por timestamp e olhe o **agregado**. Se a soma dos picos bate no mesmo horário, o pool vai ser dimensionado pelo pico agregado e você não economiza — mas ganha um bom argumento para escalonar fechamentos por janelas diferentes.

### 4.4 Tabela de mitigações (sem terminar a migração)

| Mitigação                            | O que faz                                | Cuidado                                                                                                                                                                                |
| ------------------------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Serverless**                       | Cobra por vCore-segundo + auto-pause     | Auto-pause só em General Purpose; delay mínimo de 15 min (padrão 60); vários recursos impedem a pausa; **incompatível com AHB e reservas**; ERP em horário comercial pode nunca pausar |
| **Elastic Pool**                     | Compartilha vCores entre os N bancos     | Cobrado por hora fixa do pool; economia depende de **picos defasados** — raro em ERP fiscal                                                                                            |
| **Reserved capacity / Savings Plan** | Desconto por compromisso de 1–3 anos     | Exige previsibilidade; trava dimensionamento; não vale para serverless                                                                                                                 |
| **Azure Hybrid Benefit**             | Aproveita licenças SQL Server existentes | Só no modelo vCore provisionado                                                                                                                                                        |
| **Tuning (Query Store)**             | Reduz consumo das procedures pesadas     | Precisa ser contínuo; sozinho não reduz o provisionamento — reduz o _pretexto_ para ele                                                                                                |
| **Elastic Jobs**                     | Executa scripts/manutenção nos N bancos  | Não reduz custo de compute; reduz **custo de operação** de N deploys de schema                                                                                                         |

A resposta **arquitetural**, porém, é outra — e é ela que conecta com a Parte 2.

### 4.5 O argumento econômico da migração: compute de banco é o compute mais caro que existe

Um vCore de Azure SQL custa um múltiplo de um vCore de VM ou App Service — e vem com três agravantes:

1. **É stateful.** Não escala horizontalmente sem replicação ou sharding.
2. **É o gargalo de concorrência.** Locks, bloqueios e contenção de tempdb transformam CPU de banco em fila.
3. **É o mais difícil de migrar.** Justamente por isso, é onde a dívida se acumula.

Cada regra de negócio movida da procedure para o Core faz três coisas ao mesmo tempo: **libera o compute mais caro do sistema**, move a carga para uma camada que **escala horizontalmente e barato**, e reduz o tier necessário para o pior workload — que é o que dimensiona os N bancos.

A migração deixa de ser uma questão técnica e passa a ter **ROI mensurável por módulo**. Confira os preços na [calculadora](https://azure.microsoft.com/pricing/calculator/) para a sua região antes de levar o número para a diretoria — mas a direção do argumento não muda.

---

## 5. Os Custos que Não Aparecem no Desenho

O TCO de arquitetura quase sempre esquece as linhas abaixo. Nenhuma delas é grande sozinha; juntas costumam ser 20–30% da conta:

| Linha                        | Por que multiplica                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Backup (PITR + LTR)**      | Cada banco tem retenção própria. Retenção de longo prazo em N bancos vira storage redundante caro e silencioso             |
| **Ambientes não-produtivos** | Dev, QA e homologação tendem a replicar a estrutura de tenants "para testar direito"                                       |
| **Observabilidade**          | Log Analytics e Application Insights cobram por GB ingerido; logs de IIS de N sites + telemetria de N bancos escalam junto |
| **Segurança**                | Defender for SQL é cobrado por servidor lógico; auditoria gera storage                                                     |
| **Licenciamento Windows**    | Embutido no preço da VM, a menos que se use AHB                                                                            |
| **Rede**                     | Egress, VPN/ExpressRoute, Bastion, gateways                                                                                |
| **Matriz de teste**          | N bancos com procedures customizadas = N variantes do produto para regredir a cada release                                 |
| **Custo de incidente**       | Downtime da VM única = N clientes parados simultaneamente. Isso tem preço em crédito de SLA, suporte e churn               |

> ⚠️ **A linha mais cara costuma ser a última.** Quando a decisão é "uma VM para todos", o custo de indisponibilidade deixa de ser proporcional e passa a ser **total**. Vale calcular: quanto custa 1 hora com todos os clientes fora?

---

## 6. Como Medir Isso de Verdade

Não dá para discutir TCO sem atribuição de custo por tenant. Num modelo com VM compartilhada, isso não vem de graça do Azure Cost Management — recurso compartilhado não se separa por tag.

O caminho prático:

**Custo direto (rastreável por recurso):**

- Banco por cliente → tag `tenant` no recurso, custo sai direto do Cost Management
- Storage e backup por banco → idem

**Custo compartilhado (precisa de chave de rateio):**

- VM, microsserviços, observabilidade, rede
- Chave possível: requisições por site (logs do IIS), CPU por app pool (contadores `W3SVC_W3WP` por instância nomeada, `Process\% Processor Time` por `w3wp`), memória privada por processo, ou usuários ativos por tenant

**Fórmula base para o custo mensal por tenant:**

```plain
Custo(tenant) = custo_banco(tenant)
              + custo_backup(tenant)
              + (custo_VM + custo_serviços_compartilhados) × rateio(tenant)
              + custo_equipe / N

```

Com isso na mão, duas perguntas ficam respondíveis — e são as que a diretoria faz:

1. **Qual a margem por cliente?** (`receita(tenant) − Custo(tenant)`) — em SaaS, é normal descobrir que os menores clientes dão prejuízo, porque o custo fixo do banco dedicado não escala para baixo.
2. **Qual o custo marginal do próximo cliente?** No modelo atual: \~1 banco + rateio da VM — **até saturar a VM**, quando o próximo cliente custa um degrau inteiro de upgrade.

> 💡 **Dica Técnica:** Transforme isso em _fitness function_ de arquitetura: publique mensalmente três números — **custo por tenant**, **% de regras migradas para o Core** e **vCores médios de banco por tenant**. Se a migração está funcionando, os três se movem na direção certa juntos. Se só o terceiro melhora, você está fazendo tuning, não migração.

---

## 7. O Exercício: TCO de Três Caminhos

Comparando três estratégias (valores ilustrativos — use a [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) no seu cenário). Assumindo **50 clientes**:

| Componente de custo     | A) Congelar tudo              | B) Só otimizar infra                             | C) Terminar a migração                      |
| ----------------------- | ----------------------------- | ------------------------------------------------ | ------------------------------------------- |
| VM legada compartilhada | Médio, com degraus de upgrade | Médio (right-size + reserva/AHB, ou App Service) | **Zero** ao concluir                        |
| Teto de escala da VM    | Bate e vira incidente         | Adiado, não removido                             | **Removido** (stateless, escala horizontal) |
| 50 bancos provisionados | Alto                          | Médio (pool/serverless onde couber)              | Baixo (pool enxuto ou consolidação)         |
| Equipe p/ 2 stacks      | Alto                          | Alto                                             | **Uma stack**                               |
| Curva de aprendizado    | Repete a cada contratação     | Repete                                           | Uma vez                                     |
| Deploys                 | N sites por release           | N sites por release                              | 1 por release                               |
| Blast radius            | N clientes                    | N clientes                                       | Reduzido (múltiplas instâncias)             |
| Margem por cliente novo | Cai com a base                | Estável                                          | **Cresce com a base**                       |
| Risco de execução       | Baixo hoje, alto depois       | Baixo                                            | **Alto** — exige o conhecimento que saiu    |

A lição do exercício: **otimizar infraestrutura (B) reduz a dor, mas só terminar a migração (C) muda a curva.** E vale a honestidade: (C) é a opção mais cara no curto prazo e a de maior risco de execução, porque depende exatamente do conhecimento que foi embora. Por isso ela só funciona **fatiada** — módulo a módulo, cada um com sua própria justificativa de ROI.

### O caminho realista: B agora, C sempre

Na prática, B e C não competem — B financia C:

1. **Estabilizar** (semanas): right-sizing da VM, limites por app pool, reciclagem por horário, Query Store ligado em todos os bancos, tags e rateio de custo funcionando.
2. **Destravar a escala horizontal** (meses): tirar a sessão do processo (SQL Session State ou cache distribuído) e colocar as instâncias atrás de um balanceador. Esse único passo remove o teto de escala **e** o blast radius, sem migrar uma linha de regra de negócio. Se o app tolerar, avaliar App Service Windows — o .NET Framework 4.8 é suportado e é um upgrade in-place não-quebrante a partir do 4.6, o que elimina patch de SO, dá slots de deploy e escala por site (atenção a dependências de GAC, COM, impressão, escrita em disco local e serviços do Windows, que não sobrevivem à mudança).
3. **Estrangular por ROI** (contínuo): priorizar as procedures que **dimensionam o tier** dos bancos. A primeira a migrar não é a mais fácil nem a mais bonita — é a que obriga todo mundo a provisionar 8 vCores.

---

## 8. Lições: Decisão Arquitetural é Decisão de Negócio

1. **Concentração de conhecimento é risco financeiro.** A saída da equipe transformou um custo previsto (migração) em dois custos imprevisíveis: curva de aprendizado e lentidão de entrega.
2. **Densificar hospedagem economiza dinheiro e compra risco.** Uma VM para N clientes é a decisão certa em custo de infraestrutura e a errada em raio de impacto. Compensar isso é barato (multi-instância + estado externo); ignorar isso é caro uma vez só — e de uma vez só.
3. **Regra de negócio em procedure é compute preso no tier mais caro.** O banco vira o gargalo mais caro do sistema justamente porque é o mais difícil de migrar.
4. **Banco por cliente é o que escala linearmente com a base.** É ali, não na VM, que a economia de SaaS se perde.
5. **Nem toda mitigação é somável.** Serverless exclui reservas e AHB; Elastic Pool só economiza com picos defasados. Otimização de custo em nuvem é escolha entre caminhos, não acúmulo de descontos.
6. **Strangler Fig sem "critério de desligamento" é dívida.** Cada módulo migrado precisa de um marco explícito: _reduzir o tier do banco? desligar o site legado? remover a procedure?_ Sem isso, você paga os dois mundos para sempre.
7. **O TCO real inclui o custo de parar no meio.** Não existe "pausar" uma migração pela metade de graça — os dois mundos cobram aluguel, e um deles cobra juros.

---

## Considerações Finais

Arquiteturas não falham de uma vez — elas falham devagar, uma fatura de infraestrutura e um onboarding demorado por vez. O exercício desta parte mostra que as decisões da Parte 2 (procedures, banco por cliente, hospedagem densa, migração gradual) eram defensáveis tecnicamente. O que faltou não foi técnica: foi **plano de saída, critério de desligamento e registro do porquê** — e a conta chegou exatamente quando as pessoas saíram.

Na próxima parte: como a nova equipe retomou o Strangler Fig — priorização de módulos por ROI de custo, o desacoplamento da sessão e o primeiro tier de banco reduzido.

---

## Referências

- Microsoft — Azure SQL Database Purchasing Models — https://learn.microsoft.com/azure/azure-sql/database/purchasing-models
- Microsoft — Serverless Compute Tier — https://learn.microsoft.com/azure/azure-sql/database/serverless-tier-overview
- Microsoft — Serverless Compute Tier Billing — https://learn.microsoft.com/azure/azure-sql/database/serverless-tier-billing
- Microsoft — Auto-pause e Auto-resume no Serverless — https://learn.microsoft.com/azure/azure-sql/database/serverless-tier-auto-pause-resume
- Microsoft — Elastic Pools — https://learn.microsoft.com/azure/azure-sql/database/elastic-pool-overview
- Microsoft — Resource Management in Dense Elastic Pools — https://learn.microsoft.com/azure/azure-sql/database/elastic-pool-resource-management
- Microsoft — Multitenant SaaS Database Tenancy Patterns — https://learn.microsoft.com/azure/azure-sql/database/saas-tenancy-app-design-patterns
- Microsoft — Reserved Capacity — https://learn.microsoft.com/azure/azure-sql/database/reserved-capacity-overview
- Microsoft — Azure Hybrid Benefit para Azure SQL — https://learn.microsoft.com/azure/azure-sql/azure-hybrid-benefit
- Microsoft — Query Store — https://learn.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store
- Microsoft — Elastic Jobs — https://learn.microsoft.com/azure/azure-sql/database/elastic-jobs-overview
- Microsoft — SLA for Virtual Machines — https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services
- Microsoft — Azure Pricing Calculator — https://azure.microsoft.com/pricing/calculator/
- Microsoft — Azure TCO Calculator — https://azure.microsoft.com/pricing/tco/calculator/
- Fowler, Martin — StranglerFigApplication — https://martinfowler.com/bliki/StranglerFigApplication.html
- Ford, Neal et al. — Software Architecture: The Hard Parts — O'Reilly, 2021
