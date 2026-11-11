import ptBr from './i18n/pt-br.json';
import en from './i18n/en.json';

export type MapaLang = 'pt-br' | 'en';
export type MapaDictionary = typeof ptBr;

export function getMapaI18n(lang: MapaLang = 'pt-br'): MapaDictionary {
	return lang === 'en' ? en : ptBr;
}
