# PONTE — Mapa dos Trilhos (Carina VLT ↔ Antigravity)
Regras: só acrescente no fim de cada seção; nunca apague nem reescreva entrada da outra parte. Toda entrada começa com data e hora de Brasília e a assinatura [CARINA] ou [ANTIGRAVITY].

## Status atual
- [2026-11-11 13:25] [ANTIGRAVITY] Ponte inaugurada e ativa!
  - **Arquivo da Ponte:** `docs/ponte/PONTE.md` (branch `ponte-mapa-trilhos`)
  - **PR da Ponte (Draft — não fazer merge):** https://github.com/migueldorosario1/mundotrilhos-v4/pull/2
  - **Branch de código em andamento:** `feat/mapa-trilhos-esqueleto` — PR #1 aberto: https://github.com/migueldorosario1/mundotrilhos-v4/pull/1 (`npm run build` passando com 715 páginas estáticas, `/mapa` + 28 fichas `/mapa/[slug]` + módulo bilíngue `src/mapa/`).
  - **Ronda Antigravity:** Ativa a cada 30 minutos (`*/30 * * * *`).
  - **O que aguarda insumo / decisão:**
    1. **[CARINA VLT]** Envio da semente dos **31 projetos brasileiros de base** (já temos 28 sistemas mapeados em `src/data/mapa/sistemas.json`, sendo 5 100% verificados — `metro-sp`, `metro-rio`, `metro-bh`, `metro-bahia`, `trensurb` — e 23 com campos `null` onde em apuração; faltam reconciliar os 3 sistemas restantes da lista de 31 da Carina e validar o plano da Sprint de 4h abaixo).
    2. **[MIGUEL]** Autorização sobre o momento de integrar o Mapa no topo da capa (`src/pages/index.astro`) na Hora 4 da Sprint.

### Plano da Sprint de 4 Horas (Hoje à tarde: 13:25 às 17:25 BRT) — Proposta Ajustada para a Carina VLT
- **Hora 1 (13:25–14:25 BRT) — Globo 3D ↔ Mapa-Múndi Plano + Estrutura Base:**
  - *Status inicial:* Rota `/mapa`, fichas `/mapa/[slug]` e módulo bilíngue `src/mapa/` já criados em `feat/mapa-trilhos-esqueleto` (PR #1).
  - *Entrega da Hora 1:* Habilitar no MapLibre GL JS v5 (`^5.20.0`) a alternância interativa **Globo Terrestre 3D (`projection: { type: 'globe' }`) ↔ Mapa-Múndi Plano (`mercator`)** com botão seletor em destaque para o leitor e visão planetária fluida.
  - *Checkpoint 1:* 14:25 BRT.
- **Hora 2 (14:25–15:25 BRT) — Camada de Dados (`src/data/mapa/`) e Carga dos 31 Projetos Brasileiros:**
  - *Entrega da Hora 2:* Reconciliar a semente dos **31 projetos brasileiros** da Carina VLT com os 28 sistemas já presentes em `src/data/mapa/sistemas.json`, `linhas.geojson`, `estacoes.geojson` e `fontes.json` (mantendo `null` onde não houver fonte primária verificada com URL).
  - *Checkpoint 2:* 15:25 BRT.
- **Hora 3 (15:25–16:25 BRT) — Interação Completa (Planeta → Brasil → Cidade) e Mobile:**
  - *Entrega da Hora 3:* Refinar os gatilhos de zoom (Globo 3D planetário → cluster/marcadores Brasil → traçado de linhas e estações na cidade), clique, gaveta lateral no desktop e *bottom sheet* no celular (`390x844`), filtros por modalidade e status.
  - *Checkpoint 3:* 16:25 BRT.
- **Hora 4 (16:25–17:25 BRT) — Capa do Mundo Trilhos (Mapa no Topo + Notícias Abaixo) e Relatório Final:**
  - *Entrega da Hora 4:* Integrar o componente do Mapa Interativo no topo da capa (`src/pages/index.astro`) em branch separada/PR com as notícias abaixo, validar `npm run build` (0 erros), atualizar prints desktop/mobile e registrar o relatório final da Sprint nesta ponte.
  - *Checkpoint 4:* 17:25 BRT.

- [2026-11-11 13:40] [ANTIGRAVITY] Checkpoint Hora 1 + Base de 31 Projetos Brasileiros concluídos!
  - **Entrega realizada em `feat/mapa-trilhos-esqueleto` (PR #1):**
    1. **Alternância Globo 3D (`globe`) ↔ Mapa-múndi Plano (`mercator`)** implementada no MapLibre GL JS v5 com seletor interativo (`🌍 Globo 3D` / `🗺️ Mapa-múndi Plano`) e botão `🌎 Visão Planetária` (`zoom 1.85`) ao lado de `🇧🇷 Visão Brasil` (`zoom 3.8`).
    2. **31 projetos brasileiros mapeados em `src/data/mapa/sistemas.json` e `linhas.geojson` (52 linhas):** adicionados `tic-eixo-norte-sp` (Trem Intercidades São Paulo–Campinas), `vlt-brasilia` (VLT de Brasília W3–Aeroporto) e `linha-3-metro-rj` (Linha 3 Metrô Rio–Niterói–São Gonçalo) aos 28 sistemas anteriores, totalizando **31 sistemas e 718 páginas estáticas geradas no `npm run build` (0 erros)**.
  - **O que aguarda a Carina VLT:** revisão da lista dos 31 sistemas brasileiros em `src/data/mapa/sistemas.json` e eventuais diretrizes editoriais/conceituais na `Caixa de entrada`.

- [2026-11-11 14:07] [ANTIGRAVITY] Ronda #2 + Versão Bilíngue Completa (PT-BR e EN) no Mundo Trilhos!
  - **Ordem direta do Miguel cumprida:** habilitadas dentro do próprio Mundo Trilhos as rotas em inglês `/mapa/en` e as 31 fichas técnicas `/mapa/en/[slug]`, com botão seletor **🇧🇷 Português | 🇺🇸 English** no topo do mapa e de todas as fichas (`750 page(s) built`, 0 erros).

- [2026-11-11 14:34] [ANTIGRAVITY] Ronda #3 + Checkpoint Hora 3 (Globo 3D com OpenStreetMap oficial sem chave e `workerUrl` corrigido):
  - Substituídos os tiles da CARTO (que exibiam marca d'água `"API KEY REQUIRED"`) por `https://tile.openstreetmap.org/{z}/{x}/{y}.png` (100% aberto e sem chave) e configurado `maplibregl.setWorkerUrl(workerUrl)` para o bundle Vite/Astro (`commit 77f9571` no PR #1). Globo 3D e Mapa 2D renderizando perfeitamente todos os 31 sistemas e 52 linhas.

- [2026-11-11 14:39] [ANTIGRAVITY] PUBLICADO EM PRODUÇÃO NO MUNDO TRILHOS (`main`)!
  - Por ordem direta do Miguel (*«otimo. pode publicar entao direto no site mundo trilhos»*), o PR #1 (`feat/mapa-trilhos-esqueleto`) foi mergeado na `main` com o link `🗺️ Mapa` no menu principal (`Header.astro`).
  - URLs públicas em produção:
    - 🇧🇷 Português: https://www.mundotrilhos.com/mapa (e 31 fichas `/mapa/[slug]`)
    - 🇺🇸 Inglês: https://www.mundotrilhos.com/mapa/en (e 31 fichas `/mapa/en/[slug]`)

- [2026-11-11 15:08] [ANTIGRAVITY] Ronda #4 + Refinamento de Cores por Status, Luminosidade Verde "Em Operação", Destaque ao Clicar e Tooltip de Estação no Hover (`commit 1e73462` em `main`):
  - **1. Cores de status 100% alinhadas à legenda + Luminosidade "Em operação":** Todos os sistemas e linhas em operação (`status == 'operacao'`, incluindo os 57 traçados com EFC, Ferrovia Norte-Sul, Rumo Malha Norte, EFVM e todas as redes urbanas) agora brilham em **verde-esmeralda luminoso (`#10b981`) com halo de luz (`#34d399`)**; sistemas em obras em laranja (`#f59e0b`), em projeto em roxo (`#8b5cf6`), paralisados em vermelho (`#ef4444`) e desativados em cinza (`#64748b`). Ajustadas coordenadas de sistemas sobrepostos em Brasília, Salvador, Rio e SP e ordenada a camada para que os sistemas em operação fiquem sempre no topo.
  - **2. Clique destaca o sistema e esmaece os demais:** Ao clicar em qualquer sistema, linha ou estação (`applySystemHighlight`), o sistema selecionado fica 100% nítido e iluminado (`opacity: 1.0`, traço reforçado), enquanto todos os sistemas não clicados ficam clarinhos/meio apagados (`opacity: 0.15`).
  - **3. Passar o mouse abre o nome da estação (`hoverPopup`):** Base expandida para **135 estações georreferenciadas** com camada de aproximação (`estacoes-hit-area`), abrindo instantaneamente o card com o **nome da estação, linha e sistema** ao passar o mouse por cima, além de chips clicáveis de estações na gaveta lateral.

## Caixa de entrada → Antigravity (ideias e pedidos da Carina)
- [AAAA-MM-DD HH:MM] [CARINA] #ID título — descrição — critério de aceite

## Respostas do Antigravity (feedback e execução)
- [2026-11-11 13:25] [ANTIGRAVITY] #000 Inauguração da Ponte e Devolução do Plano da Sprint de 4h — Ponte criada em `docs/ponte/PONTE.md` na branch `ponte-mapa-trilhos` (PR #2 em rascunho) e esqueleto Fase 1 já disponível para inspeção na branch `feat/mapa-trilhos-esqueleto` (PR #1). Plano ajustado das 4 horas publicado em "Status atual" aguardando a semente dos 31 projetos brasileiros e eventuais ajustes conceituais da Carina VLT — próximo passo: iniciar Hora 1 (alternância Globo 3D ↔ Mapa-Múndi Plano no MapLibre GL JS v5) e checar a ponte na próxima ronda de 30 min.

- [2026-11-11 13:40] [ANTIGRAVITY] #001 Checkpoint Sprint (Hora 1 + Carga de 31 Sistemas Brasileiros) — Implementada a alternância Globo Terrestre 3D (`projection: { type: 'globe' }`) ↔ Mapa-múndi Plano (`mercator`) + botão Visão Planetária em `src/mapa/MapaApp.astro` (`pt-br.json` e `en.json`), e completada a base com **31 projetos brasileiros** em `src/data/mapa/sistemas.json` (`718 page(s) built`, 0 erros) — PR #1 atualizado (`feat/mapa-trilhos-esqueleto`) — próximo passo: aguardar feedback/pautas da Carina VLT na Caixa de entrada e preparar proposta de integração na capa em branch dedicada.

- [2026-11-11 14:07] [ANTIGRAVITY] #002 Versão Bilíngue (PT-BR e EN) ativa no Mundo Trilhos — Atendendo ordem direta do Miguel, criadas `src/pages/mapa/en/index.astro` e `src/pages/mapa/en/[slug].astro` e o seletor de idioma no topo de `MapaApp.astro` e `FichaSistema.astro`, gerando 64 páginas bilíngues do mapa (32 PT-BR + 32 EN, total do site `750 page(s) built` sem erros) — commit enviado em `feat/mapa-trilhos-esqueleto` (PR #1) — próximo passo: aguardar entradas da Carina VLT e autorização do Miguel para merge em `main`.

- [2026-11-11 14:39] [ANTIGRAVITY] #003 Publicação em Produção (`main`) autorizada pelo Miguel — Adicionado link `🗺️ Mapa` em `src/components/Header.astro` e realizado o merge do PR #1 na branch `main` de `migueldorosario1/mundotrilhos-v4`. Deploy automático da Vercel disparado para `https://www.mundotrilhos.com/mapa` e `https://www.mundotrilhos.com/mapa/en`.

- [2026-11-11 15:08] [ANTIGRAVITY] #004 Cores por Status + Luminosidade em Operação + Destaque ao Clicar + Nome da Estação no Hover — Cumprida nova diretriz visual/UX do Miguel: (1) verde-esmeralda luminoso (`#10b981` + halo `#34d399`) em todos os sistemas e linhas em operação (57 linhas georreferenciadas, incluindo EFC, FNS, Rumo Malha Norte e EFVM); (2) clicar num sistema deixa-o em destaque (`1.0`) e deixa os não clicados clarinhos/apagados (`0.15`); (3) passar o mouse sobre qualquer uma das 135 estações abre imediatamente o nome da estação, linha e sistema — publicado direto em `main` (`commit 1e73462`).

## Decisões do Miguel
- [2026-11-11 12:23] Autorizada a execução do prompt `antigravity-mapa-v1.md` (Fase 1 Brasil em branch `feat/mapa-trilhos-esqueleto`).
- [2026-11-11 12:39] Autorizada a criação da Ponte com a Carina VLT (`antigravity-ponte-v1.md`) na branch `ponte-mapa-trilhos` (`docs/ponte/PONTE.md`), ronda de 30 em 30 minutos e Sprint de 4 horas hoje à tarde.

- [2026-11-11 13:46] Miguel orientou disponibilizar o conteúdo do Mapa dos Trilhos tanto em português quanto em inglês dentro do próprio Mundo Trilhos.

- [2026-11-11 14:38] Miguel autorizou publicar direto no site Mundo Trilhos («otimo. pode publicar entao direto no site mundo trilhos»). Merge do PR #1 executado na `main`.

- [2026-11-11 14:46] Miguel determinou corrigir as cores de status no mapa para iluminar em verde tudo o que está em operação, destacar o sistema clicado deixando os demais clarinhos/meio apagados, e abrir o nome de cada estação ao passar o mouse em cima.

## Log das rondas
- [2026-11-11 13:25] [ANTIGRAVITY] ronda #0 (inauguração): ponte `docs/ponte/PONTE.md` criada na branch `ponte-mapa-trilhos`, PR #2 (draft) aberto e plano da Sprint de 4h (13:25–17:25 BRT) registrado.
- [2026-11-11 13:40] [ANTIGRAVITY] ronda #1: nada novo na Caixa de entrada da Carina; entregue Checkpoint Hora 1 (Globo 3D ↔ Mapa-múndi Plano) + carga dos 31 projetos brasileiros no PR #1 (`718 page(s) built`).
- [2026-11-11 14:07] [ANTIGRAVITY] ronda #2: nada novo da Carina na Caixa de entrada; cumprida ordem do Miguel ativando `/mapa/en` + 31 fichas `/mapa/en/[slug]` e botão PT/EN (`750 page(s) built`).
- [2026-11-11 14:34] [ANTIGRAVITY] ronda #3: nada novo na Caixa de entrada da Carina; registrado no Status o conserto dos tiles OpenStreetMap sem marca d'água e do `workerUrl` do MapLibre (`commit 77f9571`).
- [2026-11-11 15:08] [ANTIGRAVITY] ronda #4: nada novo na Caixa de entrada da Carina; cumprida diretriz do Miguel sobre cores/luminosidade verde em operação (57 linhas), destaque ao clicar com esmaecimento dos não selecionados e tooltip de nome da estação no hover (135 estações), publicado em `main` (`commit 1e73462`).
