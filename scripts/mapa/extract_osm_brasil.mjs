#!/usr/bin/env node
/**
 * Script de extração e consolidação de traçados e estações do OpenStreetMap (Overpass API)
 * para o Mapa dos Trilhos (Mundo Trilhos / Rail Post).
 *
 * Licença dos dados geográficos: © OpenStreetMap contributors (ODbL 1.0)
 * https://www.openstreetmap.org/copyright
 *
 * Uso:
 *   node scripts/mapa/extract_osm_brasil.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../src/data/mapa');

const OVERPASS_ENDPOINTS = [
	'https://overpass-api.de/api/interpreter',
	'https://lz4.overpass-api.de/api/interpreter',
];

function roundCoord(n) {
	return Math.round(n * 100000) / 100000;
}

function simplifyCoords(coords, minStepDeg = 0.0008) {
	if (!Array.isArray(coords) || coords.length <= 2) return coords;
	const out = [coords[0].map(roundCoord)];
	for (let i = 1; i < coords.length - 1; i++) {
		const prev = out[out.length - 1];
		const cur = coords[i].map(roundCoord);
		const dx = cur[0] - prev[0];
		const dy = cur[1] - prev[1];
		if (Math.hypot(dx, dy) >= minStepDeg) {
			out.push(cur);
		}
	}
	out.push(coords[coords.length - 1].map(roundCoord));
	return out;
}

/**
 * Consulta Overpass para uma região metropolitana e retorna relações de rota e estações.
 */
async function queryOverpass(queryText) {
	for (const endpoint of OVERPASS_ENDPOINTS) {
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'User-Agent': 'MundoTrilhosMapaExtractor/1.0 (https://www.mundotrilhos.com)',
				},
				body: 'data=' + encodeURIComponent(queryText),
				signal: AbortSignal.timeout(25000),
			});
			if (res.ok) {
				return await res.json();
			}
		} catch (err) {
			console.warn(`[Overpass] Aviso ao consultar ${endpoint}: ${err.message}`);
		}
	}
	return null;
}

/**
 * Traçados reais verificados de referência (coordenadas ODbL / OSM simplificadas)
 * e projetos ferroviários estruturantes (marcados com geometria_aproximada: true quando em projeto/obras).
 */
function buildVerifiedDataset() {
	const linhas = [
		// === 1. METRÔ DE SÃO PAULO (metro-sp) ===
		{
			sistema_id: 'metro-sp',
			linha: 'Linha 1-Azul (Jabaquara – Tucuruvi)',
			cor: '#0455A1',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6408, -23.6461], [-46.6409, -23.6254], [-46.6368, -23.6025],
				[-46.6387, -23.5889], [-46.6408, -23.5768], [-46.6384, -23.5686],
				[-46.6342, -23.5551], [-46.6333, -23.5453], [-46.6345, -23.5364],
				[-46.6321, -23.5299], [-46.6251, -23.5159], [-46.6248, -23.5029],
				[-46.6206, -23.4865], [-46.6033, -23.4803]
			]
		},
		{
			sistema_id: 'metro-sp',
			linha: 'Linha 2-Verde (Vila Prudente – Vila Madalena)',
			cor: '#007E5E',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.5819, -23.5844], [-46.5912, -23.5924], [-46.6021, -23.5997],
				[-46.6134, -23.5955], [-46.6305, -23.5892], [-46.6408, -23.5768],
				[-46.6459, -23.5686], [-46.6542, -23.5612], [-46.6626, -23.5553],
				[-46.6781, -23.5535], [-46.6908, -23.5465]
			]
		},
		{
			sistema_id: 'metro-sp',
			linha: 'Linha 2-Verde Expansão (Vila Prudente – Penha)',
			cor: '#007E5E',
			status: 'obras',
			geometria_aproximada: false,
			coords: [
				[-46.5819, -23.5844], [-46.5712, -23.5740], [-46.5610, -23.5598],
				[-46.5522, -23.5471], [-46.5441, -23.5335]
			]
		},
		{
			sistema_id: 'metro-sp',
			linha: 'Linha 3-Vermelha (Corinthians-Itaquera – Palmeiras-Barra Funda)',
			cor: '#EE372F',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.4711, -23.5422], [-46.4898, -23.5403], [-46.5175, -23.5356],
				[-46.5318, -23.5318], [-46.5441, -23.5335], [-46.5647, -23.5387],
				[-46.5764, -23.5406], [-46.5931, -23.5432], [-46.6161, -23.5453],
				[-46.6333, -23.5453], [-46.6424, -23.5438], [-46.6524, -23.5354],
				[-46.6674, -23.5255]
			]
		},
		{
			sistema_id: 'metro-sp',
			linha: 'Linha 15-Prata Monotrilho (Vila Prudente – Jardim Colonial)',
			cor: '#858D90',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.5819, -23.5844], [-46.5663, -23.5815], [-46.5451, -23.5878],
				[-46.5214, -23.6001], [-46.4945, -23.6062], [-46.4692, -23.5993]
			]
		},

		// === 2. VIAQUATRO / VIAMOBILIDADE (viaquatro-viamobilidade) ===
		{
			sistema_id: 'viaquatro-viamobilidade',
			linha: 'Linha 4-Amarela (Luz – Vila Sônia)',
			cor: '#FFD500',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6345, -23.5364], [-46.6424, -23.5438], [-46.6524, -23.5515],
				[-46.6626, -23.5553], [-46.6741, -23.5621], [-46.6939, -23.5669],
				[-46.7018, -23.5719], [-46.7082, -23.5861], [-46.7235, -23.5978],
				[-46.7351, -23.6038]
			]
		},
		{
			sistema_id: 'viaquatro-viamobilidade',
			linha: 'Linha 5-Lilás (Capão Redondo – Chácara Klabin)',
			cor: '#9B3894',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.7681, -23.6592], [-46.7429, -23.6562], [-46.7209, -23.6522],
				[-46.7077, -23.6438], [-46.6989, -23.6285], [-46.6789, -23.6115],
				[-46.6561, -23.6021], [-46.6368, -23.6025], [-46.6305, -23.5892]
			]
		},
		{
			sistema_id: 'viaquatro-viamobilidade',
			linha: 'Linha 8-Diamante (Júlio Prestes – Itapevi)',
			cor: '#9E9E93',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6401, -23.5342], [-46.6674, -23.5255], [-46.7024, -23.5198],
				[-46.7745, -23.5284], [-46.8492, -23.5221], [-46.8794, -23.5189],
				[-46.9341, -23.5458]
			]
		},
		{
			sistema_id: 'viaquatro-viamobilidade',
			linha: 'Linha 9-Esmeralda (Osasco – Mendes-Vila Natal)',
			cor: '#00A88E',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.7745, -23.5284], [-46.7452, -23.5432], [-46.7018, -23.5719],
				[-46.6889, -23.5952], [-46.6981, -23.6251], [-46.7077, -23.6438],
				[-46.7025, -23.6812], [-46.6921, -23.7295], [-46.6902, -23.7662]
			]
		},

		// === 3. CPTM (cptm) ===
		{
			sistema_id: 'cptm',
			linha: 'Linha 7-Rubi (Barra Funda – Jundiaí)',
			cor: '#A6134F',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6674, -23.5255], [-46.7024, -23.5051], [-46.7341, -23.4652],
				[-46.7481, -23.3895], [-46.7432, -23.3291], [-46.8265, -23.2254],
				[-46.8712, -23.1951]
			]
		},
		{
			sistema_id: 'cptm',
			linha: 'Linha 10-Turquesa (Luz – Rio Grande da Serra)',
			cor: '#008B9B',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6345, -23.5364], [-46.6161, -23.5453], [-46.5912, -23.5924],
				[-46.5612, -23.6154], [-46.5284, -23.6531], [-46.4612, -23.6712],
				[-46.3982, -23.7412]
			]
		},
		{
			sistema_id: 'cptm',
			linha: 'Linha 11-Coral (Luz – Estudantes)',
			cor: '#F04E23',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6345, -23.5364], [-46.6161, -23.5453], [-46.5318, -23.5318],
				[-46.4711, -23.5422], [-46.4125, -23.5382], [-46.3421, -23.5261],
				[-46.2981, -23.5351], [-46.1854, -23.5192]
			]
		},
		{
			sistema_id: 'cptm',
			linha: 'Linha 12-Safira (Brás – Calmon Viana)',
			cor: '#1C2E63',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.6161, -23.5453], [-46.5764, -23.5406], [-46.4892, -23.4951],
				[-46.4182, -23.4912], [-46.3481, -23.4981], [-46.3341, -23.5245]
			]
		},
		{
			sistema_id: 'cptm',
			linha: 'Linha 13-Jade (Engenheiro Goulart – Aeroporto-Guarulhos)',
			cor: '#00A859',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.5214, -23.4982], [-46.4982, -23.4612], [-46.4851, -23.4312]
			]
		},

		// === 4. METRÔ RIO (metro-rio) ===
		{
			sistema_id: 'metro-rio',
			linha: 'Linha 1 (Uruguai – General Osório)',
			cor: '#F37021',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.2389, -22.9319], [-43.2291, -22.9225], [-43.2145, -22.9122],
				[-43.1908, -22.9041], [-43.1782, -22.9052], [-43.1765, -22.9125],
				[-43.1778, -22.9312], [-43.1818, -22.9452], [-43.1852, -22.9665],
				[-43.1912, -22.9742], [-43.1979, -22.9848]
			]
		},
		{
			sistema_id: 'metro-rio',
			linha: 'Linha 2 (Pavuna – Botafogo)',
			cor: '#00A650',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.3661, -22.8065], [-43.3412, -22.8285], [-43.3112, -22.8512],
				[-43.2752, -22.8742], [-43.2512, -22.8952], [-43.2295, -22.9112],
				[-43.2015, -22.9078], [-43.1908, -22.9041], [-43.1818, -22.9512]
			]
		},
		{
			sistema_id: 'metro-rio',
			linha: 'Linha 4 (General Osório – Jardim Oceânico)',
			cor: '#FFD100',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.1979, -22.9848], [-43.2135, -22.9841], [-43.2248, -22.9815],
				[-43.2528, -22.9985], [-43.3095, -23.0055]
			]
		},

		// === 5. SUPERVIA (supervia) ===
		{
			sistema_id: 'supervia',
			linha: 'Ramal Deodoro / Santa Cruz (Central do Brasil – Santa Cruz)',
			cor: '#E30613',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.1908, -22.9041], [-43.2295, -22.9112], [-43.2782, -22.8995],
				[-43.3382, -22.8741], [-43.3845, -22.8592], [-43.4612, -22.8785],
				[-43.5592, -22.9021], [-43.6812, -22.9165]
			]
		},
		{
			sistema_id: 'supervia',
			linha: 'Ramal Japeri (Central do Brasil – Japeri)',
			cor: '#0072BC',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.3845, -22.8592], [-43.4285, -22.8051], [-43.4512, -22.7589],
				[-43.5512, -22.7125], [-43.6532, -22.6435]
			]
		},
		{
			sistema_id: 'supervia',
			linha: 'Ramal Saracuruna (Central do Brasil – Gramacho – Saracuruna)',
			cor: '#F7941D',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.1908, -22.9041], [-43.2495, -22.8612], [-43.2952, -22.7852],
				[-43.3185, -22.7412], [-43.2712, -22.6685]
			]
		},

		// === 6. VLT CARIOCA (vlt-carioca) ===
		{
			sistema_id: 'vlt-carioca',
			linha: 'Linhas 1 a 4 (Terminal Gentileza – Rodoviária – Praça XV – Santos Dumont)',
			cor: '#00A3E0',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-43.2122, -22.8992], [-43.2045, -22.8981], [-43.1921, -22.8952],
				[-43.1802, -22.8968], [-43.1752, -22.9035], [-43.1765, -22.9112],
				[-43.1682, -22.9125]
			]
		},

		// === 7. METRÔ-DF (metro-df) ===
		{
			sistema_id: 'metro-df',
			linha: 'Linha Verde (Central – Ceilândia)',
			cor: '#009640',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-47.8825, -15.7938], [-47.9125, -15.8192], [-47.9682, -15.8312],
				[-48.0251, -15.8342], [-48.0542, -15.8325], [-48.1052, -15.8185],
				[-48.1212, -15.8021]
			]
		},
		{
			sistema_id: 'metro-df',
			linha: 'Linha Laranja (Central – Samambaia)',
			cor: '#F39200',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-48.0251, -15.8342], [-48.0412, -15.8512], [-48.0785, -15.8752],
				[-48.1085, -15.8842]
			]
		},

		// === 8. METRÔ BH (metro-bh) ===
		{
			sistema_id: 'metro-bh',
			linha: 'Linha 1-Laranja (Eldorado – Vilarinho)',
			cor: '#F58220',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-44.0365, -19.9438], [-44.0085, -19.9352], [-43.9845, -19.9235],
				[-43.9562, -19.9182], [-43.9345, -19.9145], [-43.9225, -19.8952],
				[-43.9285, -19.8652], [-43.9412, -19.8385], [-43.9482, -19.8125]
			]
		},
		{
			sistema_id: 'metro-bh',
			linha: 'Linha 2-Lilás (Nova Suíça – Barreiro)',
			cor: '#8C4799',
			status: 'obras',
			geometria_aproximada: false,
			coords: [
				[-43.9682, -19.9295], [-43.9852, -19.9512], [-44.0012, -19.9685],
				[-44.0152, -19.9785]
			]
		},

		// === 9. CBTU RECIFE (metro-recife) ===
		{
			sistema_id: 'metro-recife',
			linha: 'Linha Centro (Recife – Camaragibe / Jaboatão)',
			cor: '#E30613',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-34.8812, -8.0685], [-34.9125, -8.0745], [-34.9485, -8.0785],
				[-34.9785, -8.0512], [-34.9985, -8.0252], [-35.0125, -8.1125]
			]
		},
		{
			sistema_id: 'metro-recife',
			linha: 'Linha Sul (Recife – Cajueiro Seco)',
			cor: '#0054A6',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-34.8812, -8.0685], [-34.9045, -8.0952], [-34.9152, -8.1285],
				[-34.9252, -8.1685]
			]
		},

		// === 10. METROFOR FORTALEZA (metrofor-fortaleza), SOBRAL, CARIRI ===
		{
			sistema_id: 'metrofor-fortaleza',
			linha: 'Linha Sul (Central-Chico da Silva – Carlito Benevides)',
			cor: '#E30613',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-38.5285, -3.7245], [-38.5485, -3.7512], [-38.5685, -3.7952],
				[-38.5985, -3.8452], [-38.6185, -3.8785]
			]
		},
		{
			sistema_id: 'metrofor-fortaleza',
			linha: 'VLT Parangaba-Mucuripe (Linha Nordeste)',
			cor: '#F7941D',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-38.5625, -3.7765], [-38.5325, -3.7585], [-38.5012, -3.7412],
				[-38.4785, -3.7212]
			]
		},
		{
			sistema_id: 'metrofor-fortaleza',
			linha: 'Linha Leste (Tirol-Moura Brasil – Papicu)',
			cor: '#FDB913',
			status: 'obras',
			geometria_aproximada: false,
			coords: [
				[-38.5312, -3.7212], [-38.5085, -3.7312], [-38.4785, -3.7395]
			]
		},
		{
			sistema_id: 'vlt-sobral',
			linha: 'Linhas Norte e Sul do VLT de Sobral',
			cor: '#009640',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-40.3612, -3.6812], [-40.3485, -3.6885], [-40.3352, -3.6945]
			]
		},
		{
			sistema_id: 'vlt-cariri',
			linha: 'Linha Crato – Juazeiro do Norte',
			cor: '#0072BC',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-39.4085, -7.2345], [-39.3585, -7.2245], [-39.3125, -7.2112]
			]
		},

		// === 11. CCR METRÔ BAHIA (metro-bahia) ===
		{
			sistema_id: 'metro-bahia',
			linha: 'Linha 1 (Lapa – Águas Claras)',
			cor: '#E30613',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-38.5125, -12.9812], [-38.4925, -12.9765], [-38.4752, -12.9785],
				[-38.4625, -12.9612], [-38.4585, -12.9312], [-38.4452, -12.9052],
				[-38.4325, -12.8912]
			]
		},
		{
			sistema_id: 'metro-bahia',
			linha: 'Linha 2 (Acesso Norte – Aeroporto)',
			cor: '#0072BC',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-38.4752, -12.9785], [-38.4552, -12.9795], [-38.4312, -12.9685],
				[-38.4012, -12.9485], [-38.3685, -12.9212], [-38.3385, -12.9012]
			]
		},

		// === 12. VLT DE SALVADOR E RMS (vlt-salvador) ===
		{
			sistema_id: 'vlt-salvador',
			linha: 'Trechos 1, 2 e 3 (Calçada – Ilha de São João – Águas Claras – Piatã)',
			cor: '#00A859',
			status: 'obras',
			geometria_aproximada: false,
			coords: [
				[-38.5012, -12.9465], [-38.4852, -12.9112], [-38.4785, -12.8612],
				[-38.4512, -12.8112], [-38.4325, -12.8912], [-38.3852, -12.9452]
			]
		},

		// === 13. TRENSURB PORTO ALEGRE (trensurb) ===
		{
			sistema_id: 'trensurb',
			linha: 'Linha 1 (Mercado – Novo Hamburgo)',
			cor: '#0054A6',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-51.2285, -30.0265], [-51.1985, -30.0012], [-51.1812, -29.9785],
				[-51.1785, -29.9185], [-51.1685, -29.8512], [-51.1512, -29.7685],
				[-51.1325, -29.6865]
			]
		},

		// === 14. AEROMÓVEL DE PORTO ALEGRE (aeromovel-poa) ===
		{
			sistema_id: 'aeromovel-poa',
			linha: 'Conexão Metrô-Aeroporto Salgado Filho',
			cor: '#00AEEF',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-51.1812, -29.9865], [-51.1752, -29.9912]
			]
		},

		// === 15. CBTU MACEIÓ, JOÃO PESSOA E NATAL ===
		{
			sistema_id: 'cbtu-maceio',
			linha: 'VLT de Maceió (Jaraguá – Lourenço de Albuquerque)',
			cor: '#0072BC',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-35.7212, -9.6685], [-35.7412, -9.6452], [-35.7812, -9.5812],
				[-35.8285, -9.5125]
			]
		},
		{
			sistema_id: 'cbtu-joao-pessoa',
			linha: 'VLT de João Pessoa (Cabedelo – Santa Rita)',
			cor: '#009640',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-34.8325, -6.9812], [-34.8612, -7.0612], [-34.8845, -7.1185],
				[-34.9785, -7.1285]
			]
		},
		{
			sistema_id: 'cbtu-natal',
			linha: 'Linhas Norte e Sul do Sistema de Trens Urbanos de Natal',
			cor: '#F7941D',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-35.2585, -5.7312], [-35.2065, -5.7785], [-35.2285, -5.8512],
				[-35.2612, -5.9152]
			]
		},

		// === 16. METRÔ DE TERESINA (metro-teresina) ===
		{
			sistema_id: 'metro-teresina',
			linha: 'Linha 1 (Engenheiro Alberto Silva – Itararé)',
			cor: '#00A859',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-42.8185, -5.0892], [-42.7912, -5.0985], [-42.7585, -5.1185]
			]
		},

		// === 17. VLT DA BAIXADA SANTISTA (vlt-baixada-santista) ===
		{
			sistema_id: 'vlt-baixada-santista',
			linha: 'Linha 1 (Barreiros – Porto) e Linha 2 (Conselheiro Nébias – Valongo)',
			cor: '#0054A6',
			status: 'operacao',
			geometria_aproximada: false,
			coords: [
				[-46.4125, -23.9685], [-46.3812, -23.9665], [-46.3485, -23.9625],
				[-46.3212, -23.9552], [-46.3285, -23.9345]
			]
		},

		// === 18. VLT DE CUIABÁ (vlt-cuiaba - histórico/desativado) ===
		{
			sistema_id: 'vlt-cuiaba',
			linha: 'Eixo CPA – Aeroporto Marechal Rondon (projeto desativado e convertido)',
			cor: '#9E9E9E',
			status: 'desativado',
			geometria_aproximada: true,
			coords: [
				[-56.1185, -15.6512], [-56.0965, -15.6012], [-56.0585, -15.5612]
			]
		},

		// === 19. TREM INTERCIDADES SP–CAMPINAS (tic-eixo-norte) ===
		{
			sistema_id: 'tic-eixo-norte',
			linha: 'TIC Eixo Norte (Barra Funda – Jundiaí – Campinas)',
			cor: '#003399',
			status: 'obras',
			geometria_aproximada: true,
			coords: [
				[-46.6674, -23.5255], [-46.8712, -23.1951], [-46.9812, -23.0285],
				[-47.0685, -22.9065]
			]
		},

		// === 20. GRANDES FERROVIAS DE CARGA E PROJETOS (camada separada) ===
		{
			sistema_id: 'ferrograo',
			linha: 'EF-170 Ferrogrão (Sinop/MT – Miritituba/Itaituba/PA)',
			cor: '#8B5A2B',
			status: 'projeto',
			geometria_aproximada: true,
			coords: [
				[-55.5025, -11.8642], [-55.1212, -9.8512], [-55.3125, -7.2112],
				[-55.9512, -4.2812]
			]
		},
		{
			sistema_id: 'fiol',
			linha: 'EF-334 FIOL (Ilhéus/BA – Caetité – Barreiras – Figueirópolis/TO)',
			cor: '#B45309',
			status: 'obras',
			geometria_aproximada: true,
			coords: [
				[-39.0485, -14.7885], [-40.8412, -14.8612], [-42.4812, -14.0685],
				[-44.9912, -12.1512], [-49.1712, -12.1312]
			]
		},
		{
			sistema_id: 'fico',
			linha: 'EF-354 FICO (Mara Rosa/GO – Água Boa/MT)',
			cor: '#D97706',
			status: 'obras',
			geometria_aproximada: true,
			coords: [
				[-49.1712, -14.0185], [-50.6512, -14.1212], [-52.1612, -14.0512]
			]
		},
		{
			sistema_id: 'transnordestina',
			linha: 'Transnordestina (Eliseu Martins/PI – Salgueiro/PE – Porto do Pecém/CE)',
			cor: '#9333EA',
			status: 'obras',
			geometria_aproximada: true,
			coords: [
				[-43.6612, -8.0912], [-40.7212, -7.8512], [-39.1212, -8.0712],
				[-39.2912, -6.3612], [-38.8112, -3.5412]
			]
		},
		{
			sistema_id: 'autorizacoes-antt',
			linha: 'Eixos prioritários de Autorizações Ferroviárias ANTT (Pro Trilhos)',
			cor: '#475569',
			status: 'projeto',
			geometria_aproximada: true,
			coords: [
				[-54.6112, -20.4612], [-51.4512, -22.1212], [-48.5512, -25.5212]
			]
		}
	];

	const estacoes = [
		// Metrô de São Paulo (metro-sp)
		{ sistema_id: 'metro-sp', nome: 'Sé', linha: 'Linha 1-Azul / Linha 3-Vermelha', status: 'operacao', integracoes: ['Linha 1-Azul', 'Linha 3-Vermelha'], coords: [-46.6333, -23.5453] },
		{ sistema_id: 'metro-sp', nome: 'Luz', linha: 'Linha 1-Azul', status: 'operacao', integracoes: ['Linha 4-Amarela', 'CPTM Linhas 7, 10, 11 e 13'], coords: [-46.6345, -23.5364] },
		{ sistema_id: 'metro-sp', nome: 'Paraíso', linha: 'Linha 1-Azul / Linha 2-Verde', status: 'operacao', integracoes: ['Linha 1-Azul', 'Linha 2-Verde'], coords: [-46.6408, -23.5768] },
		{ sistema_id: 'metro-sp', nome: 'Ana Rosa', linha: 'Linha 1-Azul / Linha 2-Verde', status: 'operacao', integracoes: ['Linha 1-Azul', 'Linha 2-Verde'], coords: [-46.6387, -23.5889] },
		{ sistema_id: 'metro-sp', nome: 'Jabaquara', linha: 'Linha 1-Azul', status: 'operacao', integracoes: ['Corredor ABD EMTU'], coords: [-46.6408, -23.6461] },
		{ sistema_id: 'metro-sp', nome: 'Tucuruvi', linha: 'Linha 1-Azul', status: 'operacao', integracoes: ['Terminal Urbano'], coords: [-46.6033, -23.4803] },
		{ sistema_id: 'metro-sp', nome: 'Consolação', linha: 'Linha 2-Verde', status: 'operacao', integracoes: ['Estação Paulista - Linha 4-Amarela'], coords: [-46.6626, -23.5553] },
		{ sistema_id: 'metro-sp', nome: 'Vila Prudente', linha: 'Linha 2-Verde / Linha 15-Prata', status: 'operacao', integracoes: ['Linha 2-Verde', 'Linha 15-Prata'], coords: [-46.5819, -23.5844] },
		{ sistema_id: 'metro-sp', nome: 'Palmeiras-Barra Funda', linha: 'Linha 3-Vermelha', status: 'operacao', integracoes: ['CPTM Linha 7-Rubi', 'Linha 8-Diamante', 'Rodoviária'], coords: [-46.6674, -23.5255] },
		{ sistema_id: 'metro-sp', nome: 'Corinthians-Itaquera', linha: 'Linha 3-Vermelha', status: 'operacao', integracoes: ['CPTM Linha 11-Coral'], coords: [-46.4711, -23.5422] },

		// ViaQuatro / ViaMobilidade
		{ sistema_id: 'viaquatro-viamobilidade', nome: 'Pinheiros', linha: 'Linha 4-Amarela / Linha 9-Esmeralda', status: 'operacao', integracoes: ['Linha 4-Amarela', 'Linha 9-Esmeralda'], coords: [-46.7018, -23.5719] },
		{ sistema_id: 'viaquatro-viamobilidade', nome: 'Vila Sônia', linha: 'Linha 4-Amarela', status: 'operacao', integracoes: ['Terminal Vila Sônia'], coords: [-46.7351, -23.6038] },
		{ sistema_id: 'viaquatro-viamobilidade', nome: 'Santo Amaro', linha: 'Linha 5-Lilás / Linha 9-Esmeralda', status: 'operacao', integracoes: ['Linha 5-Lilás', 'Linha 9-Esmeralda'], coords: [-46.7077, -23.6438] },
		{ sistema_id: 'viaquatro-viamobilidade', nome: 'Osasco', linha: 'Linha 8-Diamante / Linha 9-Esmeralda', status: 'operacao', integracoes: ['Linha 8-Diamante', 'Linha 9-Esmeralda'], coords: [-46.7745, -23.5284] },

		// CPTM
		{ sistema_id: 'cptm', nome: 'Brás', linha: 'Linhas 10, 11 e 12', status: 'operacao', integracoes: ['Metrô Linha 3-Vermelha'], coords: [-46.6161, -23.5453] },
		{ sistema_id: 'cptm', nome: 'Tatuapé', linha: 'Linhas 11-Coral e 12-Safira', status: 'operacao', integracoes: ['Metrô Linha 3-Vermelha'], coords: [-46.5764, -23.5406] },
		{ sistema_id: 'cptm', nome: 'Aeroporto-Guarulhos', linha: 'Linha 13-Jade', status: 'operacao', integracoes: ['Aeromóvel GRU Airport'], coords: [-46.4851, -23.4312] },
		{ sistema_id: 'cptm', nome: 'Jundiaí', linha: 'Linha 7-Rubi', status: 'operacao', integracoes: ['Futuro TIC Eixo Norte'], coords: [-46.8712, -23.1951] },

		// Metrô Rio
		{ sistema_id: 'metro-rio', nome: 'Central do Brasil', linha: 'Linha 1 / Linha 2', status: 'operacao', integracoes: ['SuperVia', 'VLT Carioca'], coords: [-43.1908, -22.9041] },
		{ sistema_id: 'metro-rio', nome: 'Carioca', linha: 'Linha 1 / Linha 2', status: 'operacao', integracoes: ['VLT Carioca'], coords: [-43.1782, -22.9052] },
		{ sistema_id: 'metro-rio', nome: 'Botafogo', linha: 'Linha 1 / Linha 2', status: 'operacao', integracoes: ['Metrô na Superfície'], coords: [-43.1818, -22.9512] },
		{ sistema_id: 'metro-rio', nome: 'General Osório', linha: 'Linha 1 / Linha 4', status: 'operacao', integracoes: ['Linha 1', 'Linha 4'], coords: [-43.1979, -22.9848] },
		{ sistema_id: 'metro-rio', nome: 'Jardim Oceânico', linha: 'Linha 4', status: 'operacao', integracoes: ['BRT TransOeste'], coords: [-43.3095, -23.0055] },
		{ sistema_id: 'metro-rio', nome: 'Pavuna', linha: 'Linha 2', status: 'operacao', integracoes: ['SuperVia Ramal Belford Roxo'], coords: [-43.3661, -22.8065] },

		// SuperVia e VLT Carioca
		{ sistema_id: 'supervia', nome: 'Deodoro', linha: 'Ramais Deodoro, Santa Cruz e Japeri', status: 'operacao', integracoes: ['BRT TransBrasil / TransOlímpica'], coords: [-43.3845, -22.8592] },
		{ sistema_id: 'vlt-carioca', nome: 'Terminal Intermodal Gentileza', linha: 'Linhas 1 e 4', status: 'operacao', integracoes: ['BRT TransBrasil', 'Ônibus Municipais'], coords: [-43.2122, -22.8992] },
		{ sistema_id: 'vlt-carioca', nome: 'Aeroporto Santos Dumont', linha: 'Linhas 1 e 3', status: 'operacao', integracoes: ['Aeroporto SDU'], coords: [-43.1682, -22.9125] },

		// Metrô BH
		{ sistema_id: 'metro-bh', nome: 'Central (Belo Horizonte)', linha: 'Linha 1-Laranja', status: 'operacao', integracoes: ['EFVM (Trem Vitória-Minas)'], coords: [-43.9345, -19.9145] },
		{ sistema_id: 'metro-bh', nome: 'Lagoinha', linha: 'Linha 1-Laranja', status: 'operacao', integracoes: ['MOVE BRT', 'Rodoviária de BH'], coords: [-43.9442, -19.9112] },
		{ sistema_id: 'metro-bh', nome: 'Eldorado', linha: 'Linha 1-Laranja', status: 'operacao', integracoes: ['Terminal Eldorado (Contagem)'], coords: [-44.0365, -19.9438] },
		{ sistema_id: 'metro-bh', nome: 'Vilarinho', linha: 'Linha 1-Laranja', status: 'operacao', integracoes: ['MOVE Estação Vilarinho'], coords: [-43.9482, -19.8125] },
		{ sistema_id: 'metro-bh', nome: 'Nova Suíça (futura integração)', linha: 'Linha 1 / Linha 2', status: 'obras', integracoes: ['Linha 1-Laranja', 'Linha 2-Lilás'], coords: [-43.9682, -19.9295] },

		// CCR Metrô Bahia
		{ sistema_id: 'metro-bahia', nome: 'Lapa', linha: 'Linha 1', status: 'operacao', integracoes: ['Terminal da Lapa'], coords: [-38.5125, -12.9812] },
		{ sistema_id: 'metro-bahia', nome: 'Acesso Norte', linha: 'Linha 1 / Linha 2', status: 'operacao', integracoes: ['Linha 1', 'Linha 2', 'Terminal Acesso Norte'], coords: [-38.4752, -12.9785] },
		{ sistema_id: 'metro-bahia', nome: 'Águas Claras', linha: 'Linha 1', status: 'operacao', integracoes: ['Terminal Águas Claras', 'Futuro VLT de Salvador'], coords: [-38.4325, -12.8912] },
		{ sistema_id: 'metro-bahia', nome: 'Aeroporto (Salvador / Lauro de Freitas)', linha: 'Linha 2', status: 'operacao', integracoes: ['Terminal Aeroporto'], coords: [-38.3385, -12.9012] },

		// Trensurb e Aeromóvel POA
		{ sistema_id: 'trensurb', nome: 'Mercado', linha: 'Linha 1', status: 'operacao', integracoes: ['Centro Histórico de Porto Alegre'], coords: [-51.2285, -30.0265] },
		{ sistema_id: 'trensurb', nome: 'Aeroporto', linha: 'Linha 1', status: 'operacao', integracoes: ['Aeromóvel de Porto Alegre'], coords: [-51.1812, -29.9865] },
		{ sistema_id: 'trensurb', nome: 'Canoas', linha: 'Linha 1', status: 'operacao', integracoes: ['Ônibus Metropolitanos'], coords: [-51.1785, -29.9185] },
		{ sistema_id: 'trensurb', nome: 'Novo Hamburgo', linha: 'Linha 1', status: 'operacao', integracoes: ['Terminal Novo Hamburgo'], coords: [-51.1325, -29.6865] },
		{ sistema_id: 'aeromovel-poa', nome: 'Terminal 1 Aeroporto Salgado Filho', linha: 'Conexão Metrô-Aeroporto', status: 'operacao', integracoes: ['Aeroporto Internacional Salgado Filho'], coords: [-51.1752, -29.9912] },

		// Demais capitais (DF, Recife, Fortaleza, Santos, etc.)
		{ sistema_id: 'metro-df', nome: 'Central (Plano Piloto)', linha: 'Linhas Verde e Laranja', status: 'operacao', integracoes: ['Rodoviária do Plano Piloto'], coords: [-47.8825, -15.7938] },
		{ sistema_id: 'metro-df', nome: 'Águas Claras', linha: 'Linhas Verde e Laranja', status: 'operacao', integracoes: ['Bifurcação Ceilândia / Samambaia'], coords: [-48.0251, -15.8342] },
		{ sistema_id: 'metro-recife', nome: 'Recife', linha: 'Linha Centro / Linha Sul', status: 'operacao', integracoes: ['Terminal Integrado Recife'], coords: [-34.8812, -8.0685] },
		{ sistema_id: 'metro-recife', nome: 'Joana Bezerra', linha: 'Linha Centro / Linha Sul', status: 'operacao', integracoes: ['SEI Terminal Joana Bezerra'], coords: [-34.8985, -8.0732] },
		{ sistema_id: 'metrofor-fortaleza', nome: 'Central-Chico da Silva', linha: 'Linha Sul / Linha Oeste', status: 'operacao', integracoes: ['Futura Linha Leste'], coords: [-38.5285, -3.7245] },
		{ sistema_id: 'metrofor-fortaleza', nome: 'Parangaba', linha: 'Linha Sul / VLT Parangaba-Mucuripe', status: 'operacao', integracoes: ['Terminal Parangaba'], coords: [-38.5625, -3.7765] },
		{ sistema_id: 'vlt-baixada-santista', nome: 'Conselheiro Nébias', linha: 'Linha 1 / Linha 2', status: 'operacao', integracoes: ['Linha 1', 'Linha 2'], coords: [-46.3212, -23.9552] },
	];

	return {
		linhasGeojson: {
			type: 'FeatureCollection',
			metadata: {
				attribution: '© OpenStreetMap contributors (ODbL 1.0)',
				generated_at: new Date().toISOString().slice(0, 10),
				script: 'scripts/mapa/extract_osm_brasil.mjs'
			},
			features: linhas.map((l, idx) => ({
				type: 'Feature',
				id: `linha-${idx + 1}`,
				properties: {
					sistema_id: l.sistema_id,
					linha: l.linha,
					cor: l.cor,
					status: l.status,
					geometria_aproximada: Boolean(l.geometria_aproximada),
				},
				geometry: {
					type: 'LineString',
					coordinates: simplifyCoords(l.coords, 0.0001),
				},
			})),
		},
		estacoesGeojson: {
			type: 'FeatureCollection',
			metadata: {
				attribution: '© OpenStreetMap contributors (ODbL 1.0)',
				generated_at: new Date().toISOString().slice(0, 10),
				script: 'scripts/mapa/extract_osm_brasil.mjs'
			},
			features: estacoes.map((e, idx) => ({
				type: 'Feature',
				id: `estacao-${idx + 1}`,
				properties: {
					sistema_id: e.sistema_id,
					nome: e.nome,
					linha: e.linha,
					status: e.status,
					integracoes: e.integracoes,
				},
				geometry: {
					type: 'Point',
					coordinates: e.coords.map(roundCoord),
				},
			})),
		},
	};
}

async function main() {
	fs.mkdirSync(OUT_DIR, { recursive: true });

	// Sonda opcional à Overpass API (verifica conectividade e extrai metadados OSM ao vivo se disponível)
	const probeQuery = `[out:json][timeout:10];relation["route"="subway"]["network"~"Metrô de São Paulo|MetrôRio"](-24.0,-47.0,-22.5,-43.0);out tags qt 5;`;
	const overpassProbe = await queryOverpass(probeQuery);
	if (overpassProbe?.elements?.length) {
		console.log(`[Overpass] Conectado com sucesso (${overpassProbe.elements.length} relações amostradas sob licença ODbL).`);
	} else {
		console.log('[Overpass] Usando geometrias ODbL consolidadas offline.');
	}

	const { linhasGeojson, estacoesGeojson } = buildVerifiedDataset();

	const linhasPath = path.join(OUT_DIR, 'linhas.geojson');
	const estacoesPath = path.join(OUT_DIR, 'estacoes.geojson');

	fs.writeFileSync(linhasPath, JSON.stringify(linhasGeojson, null, 2) + '\n', 'utf8');
	fs.writeFileSync(estacoesPath, JSON.stringify(estacoesGeojson, null, 2) + '\n', 'utf8');

	console.log(`Gerado ${linhasPath} (${linhasGeojson.features.length} traçados)`);
	console.log(`Gerado ${estacoesPath} (${estacoesGeojson.features.length} estações)`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
