# Mapa dos Trilhos — Documentação Técnica e Guia de Expansão (Mundo Trilhos & Rail Post)

## 1. Visão Geral e Arquitetura

O **Mapa dos Trilhos** é um atlas interativo, geodinâmico e bilíngue (`pt-br` / `en`) dos sistemas sobre trilhos (metrôs, trens urbanos/metropolitanos, VLTs, monotrilhos, aeromóvel, trens regionais de passageiros e grandes ferrovias de carga/projetos).

Toda a implementação foi isolada em módulos independentes para **não colidir** com o robô diário de publicação editorial no `main`:

```
├── docs/
│   └── MAPA.md                        # Esta documentação técnica
├── scripts/
│   └── mapa/
│       └── extract_osm_brasil.mjs     # Script de extração e simplificação de traçados/estações OSM (ODbL)
├── src/
│   ├── data/
│   │   └── mapa/
│   │       ├── sistemas.json          # Cadastro bilíngue (PT/EN) de todos os sistemas e projetos
│   │       ├── linhas.geojson         # Traçados das linhas (LineString) com cor e status
│   │       ├── estacoes.geojson       # Estações mapeadas (Point) com linha e integrações
│   │       └── fontes.json            # Fontes primárias oficiais com URL e data de consulta
│   ├── mapa/                          # Módulo neutro 100% compartilhável entre Mundo Trilhos e Rail Post
│   │   ├── i18n/
│   │   │   ├── pt-br.json             # Textos de interface em português (Mundo Trilhos)
│   │   │   └── en.json                # Textos de interface em inglês (Rail Post)
│   │   ├── types.ts                   # Tipagem TypeScript de sistemas, fontes e GeoJSON
│   │   ├── i18n.ts                    # Seletor de dicionário por idioma ('pt-br' | 'en')
│   │   ├── relatedPosts.ts            # Cruzamento somente-leitura com a coleção 'blog'
│   │   ├── ApoieSlot.astro            # Slot reservado vazio para "Apoie o Mapa dos Trilhos"
│   │   ├── MapaApp.astro              # Interface principal geodinâmica (MapLibre GL JS no cliente)
│   │   └── FichaSistema.astro         # Ficha estática completa por sistema com mini-mapa e fontes
│   └── pages/
│       └── mapa/
│           ├── index.astro            # Rota /mapa
│           └── [slug].astro           # Rotas estáticas /mapa/[slug] (geradas no build para SEO)
```

### Garantias de isolamento (Regras Invioláveis)
- **Zero alterações** em `src/content/blog/**`, `public/hero/**`, `src/assets/hero/**`, `src/data/destaques*.json`, `src/data/taxonomy.json` ou `src/content.config.ts`.
- **Zero alterações** em `Header.astro`, `Footer.astro`, `BaseHead.astro`, `BlogPost.astro`, `global.css` ou `src/pages/index.astro`.
- **Sem chaves de API pagas:** renderização no navegador via **MapLibre GL JS** usando tiles abertos gratuitos (CARTO Positron / OpenStreetMap) sob atribuição `© OpenStreetMap contributors (ODbL 1.0)`.

---

## 2. Como Atualizar os Dados e Extrair do OpenStreetMap

### 2.1. Atualização de traçados e estações (`linhas.geojson` e `estacoes.geojson`)
Para regenerar os arquivos estáticos GeoJSON a partir do script de extração e simplificação:

```bash
node scripts/mapa/extract_osm_brasil.mjs
```

- O script consulta a Overpass API (`route=subway|light_rail|train|tram|monorail` e `railway=station|halt`), aplica simplificação geométrica para manter o bundle leve e grava `src/data/mapa/linhas.geojson` e `src/data/mapa/estacoes.geojson`.
- Traçados esquemáticos de sistemas em projeto ou obras (como `ferrograo`, `fiol`, `fico`, `transnordestina`, `tic-eixo-norte`, `vlt-cuiaba`) trazem a propriedade `"geometria_aproximada": true` e são exibidos com linha tracejada e aviso explícito na ficha.

### 2.2. Atualização de indicadores (`sistemas.json` e `fontes.json`)
1. Cadastre ou atualize a fonte primária em `src/data/mapa/fontes.json` com `id`, `nome_pt`, `nome_en`, `orgao`, `url` e `data_consulta` (`YYYY-MM-DD`).
2. Atualize o registro correspondente em `src/data/mapa/sistemas.json` referenciando o `id` da fonte no array `fontes`.
3. **Regra de ouro:** nunca invente nem estime números. Caso um indicador (`passageiros_dia`, `investimento`, `n_estacoes`, `inauguracao`) ainda não tenha fonte oficial verificada, mantenha `null`. A interface exibe automaticamente `"dado em apuração"` (PT-BR) ou `"data being verified"` (EN).
4. Rode `npm run build` para validar todas as fichas estáticas antes de abrir Pull Request.

---

## 3. Fontes e Licenciamento

- **Geometrias e Estações:** `© OpenStreetMap contributors`, licenciadas sob **Open Database License (ODbL 1.0)** — https://www.openstreetmap.org/copyright.
- **Fotografias:** Exclusivamente fotografias reais do Wikimedia Commons e agências públicas oficiais, com atribuição de autor (`credito`), código de licença (`cc-by`, `cc-by-sa`, `public-domain`) e link direto para a página original (`source_url`). Imagens geradas por IA são estritamente proibidas.
- **Indicadores Operacionais:** Companhia do Metropolitano de São Paulo (Metrô SP), MetrôRio, Metrô BH / Seinfra-MG, CCR Metrô Bahia / SEDUR-BA, Trensurb, CPTM, ViaQuatro/ViaMobilidade, SuperVia, VLT Carioca, Metrô-DF, CBTU, Metrofor, CTB-BA, EMTU-SP, Secretaria de Parcerias em Investimentos de SP, ANTT / Ministério dos Transportes e ANPTrilhos.

---

## 4. Proposta Opcional de Link no Menu Global (`Header.astro`)

Conforme a Regra Inviolável nº 4, `src/components/Header.astro` **não foi modificado** neste PR. Quando o Miguel autorizar a inclusão do Mapa no menu superior do Mundo Trilhos, basta adicionar o item abaixo dentro de `<div class="nav-links">` em `src/components/Header.astro`:

```astro
<div class="nav-item">
  <a href="/mapa" class="dropbtn" style="text-decoration:none; color:#d35400;">Mapa dos Trilhos</a>
</div>
```

---

## 5. Passo a Passo da FASE 2 — Espelho no Rail Post (`en`) e Expansão Mundial

O módulo `src/mapa/` e a base `src/data/mapa/` já nasceram 100% bilíngues (`_pt` e `_en`).

### Etapa 2.1 — Espelhar no Rail Post (`railpost-v4`)
1. No repositório `migueldorosario1/railpost-v4`, crie uma branch `feat/rail-map-skeleton`.
2. Instale o MapLibre GL JS: `npm install maplibre-gl --save`.
3. Copie integralmente:
   - `src/data/mapa/*`
   - `src/mapa/*`
   - `scripts/mapa/*`
4. Crie `src/pages/mapa/index.astro` e `src/pages/mapa/[slug].astro` trocando apenas a constante de idioma:
   ```ts
   const lang: MapaLang = 'en';
   ```
5. Cada ficha de `mundotrilhos.com/mapa/[slug]` já aponta automaticamente via `<link rel="alternate" hreflang="en">` e botão visível para `railpost.news/mapa/[slug]`, e vice-versa.

### Etapa 2.2 — Expansão Mundial (Américas → Europa → Ásia/África/Oceania)
1. **Américas (Lote 1 Mundial):** Adicionar em `sistemas.json` e extrair via Overpass (`scripts/mapa/`) os sistemas de Cidade do México, Santiago, Buenos Aires, Medellín, Quito, Lima, Bogotá (em obras), Nova York (MTA), Washington, Chicago, Toronto, Montreal e Vancouver.
2. **Europa (Lote 2 Mundial):** Londres, Paris, Madri, Barcelona, Berlim, Munique, Moscou, Milão, Roma, Lisboa, Porto, Istambul e redes de alta velocidade (TGV, AVE, ICE, Frecciarossa).
3. **Ásia, África e Oceania (Lote 3 Mundial):** Pequim, Xangai, Shenzhen, Guangzhou, Tóquio, Osaka, Seul, Delhi, Singapura, Taipei, Hong Kong, Cairo, Casablanca (Al Boraq) e Sydney.
4. Para suportar centenas de sistemas mundiais sem pesar no carregamento inicial, particionar os traçados detalhados por continente (`linhas-americas.geojson`, `linhas-europa.geojson`, `linhas-asia.geojson`) carregados sob demanda conforme o `bounds` do mapa.
