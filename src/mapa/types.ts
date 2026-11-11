export type SistemaTipo =
	| 'metro'
	| 'trem_urbano'
	| 'vlt'
	| 'monotrilho'
	| 'aeromovel'
	| 'trem_regional'
	| 'alta_velocidade'
	| 'ferrovia_carga'
	| 'projeto';

export type SistemaStatus = 'operacao' | 'obras' | 'projeto' | 'paralisado' | 'desativado';

export interface SistemaInvestimento {
	valor: string;
	moeda: string;
	fonte: string;
}

export interface SistemaFoto {
	url: string;
	credito: string;
	licenca: 'cc-by' | 'cc-by-sa' | 'public-domain' | 'press-kit' | 'own';
	source_url: string;
}

export interface SistemaProximasEntregas {
	pt: string;
	en: string;
}

export interface SistemaRegistro {
	id: string;
	slug: string;
	nome_pt: string;
	nome_en: string;
	tipo: SistemaTipo;
	pais: string;
	uf: string;
	cidade: string;
	regiao_metropolitana: string;
	operador: string;
	status: SistemaStatus;
	inauguracao: string | null;
	extensao_km: number | null;
	n_linhas: number | null;
	n_estacoes: number | null;
	passageiros_dia: number | null;
	ano_referencia: number | null;
	investimento: SistemaInvestimento | null;
	proximas_entregas: SistemaProximasEntregas | string | null;
	resumo_pt: string;
	resumo_en: string;
	foto: SistemaFoto | null;
	fontes: string[];
	atualizado_em: string;
	tags: string[];
	lat: number;
	lon: number;
	zoom_inicial: number;
	camada: 'passageiros' | 'carga_projetos';
	verificado_completo: boolean;
}

export interface FonteCitada {
	id: string;
	nome_pt: string;
	nome_en: string;
	orgao: string;
	url: string;
	data_consulta: string;
}

export interface RelatedBlogPost {
	slug: string;
	title: string;
	description: string;
	pubDate: string;
	tags: string[];
}
