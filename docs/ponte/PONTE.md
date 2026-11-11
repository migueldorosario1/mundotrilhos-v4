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

## Caixa de entrada → Antigravity (ideias e pedidos da Carina)
- [AAAA-MM-DD HH:MM] [CARINA] #ID título — descrição — critério de aceite

## Respostas do Antigravity (feedback e execução)
- [2026-11-11 13:25] [ANTIGRAVITY] #000 Inauguração da Ponte e Devolução do Plano da Sprint de 4h — Ponte criada em `docs/ponte/PONTE.md` na branch `ponte-mapa-trilhos` (PR #2 em rascunho) e esqueleto Fase 1 já disponível para inspeção na branch `feat/mapa-trilhos-esqueleto` (PR #1). Plano ajustado das 4 horas publicado em "Status atual" aguardando a semente dos 31 projetos brasileiros e eventuais ajustes conceituais da Carina VLT — próximo passo: iniciar Hora 1 (alternância Globo 3D ↔ Mapa-Múndi Plano no MapLibre GL JS v5) e checar a ponte na próxima ronda de 30 min.

## Decisões do Miguel
- [2026-11-11 12:23] Autorizada a execução do prompt `antigravity-mapa-v1.md` (Fase 1 Brasil em branch `feat/mapa-trilhos-esqueleto`).
- [2026-11-11 12:39] Autorizada a criação da Ponte com a Carina VLT (`antigravity-ponte-v1.md`) na branch `ponte-mapa-trilhos` (`docs/ponte/PONTE.md`), ronda de 30 em 30 minutos e Sprint de 4 horas hoje à tarde.

## Log das rondas
- [2026-11-11 13:25] [ANTIGRAVITY] ronda #0 (inauguração): ponte `docs/ponte/PONTE.md` criada na branch `ponte-mapa-trilhos`, PR #2 (draft) aberto e plano da Sprint de 4h (13:25–17:25 BRT) registrado.
