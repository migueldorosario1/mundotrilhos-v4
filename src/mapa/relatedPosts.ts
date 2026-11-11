import type { CollectionEntry } from 'astro:content';
import type { RelatedBlogPost, SistemaRegistro } from './types';

function normalizeTerm(str: string): string {
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

const GENERIC_TAGS = new Set([
	'infraestrutura',
	'brasil',
	'ferrovia',
	'ferrovias',
	'trens',
	'mobilidade',
	'mobilidade urbana',
	'expansao',
	'modernizacao',
	'concessoes',
	'investimento',
]);

/**
 * Seleciona matérias relacionadas da coleção `blog` (somente leitura) para um sistema ferroviário.
 * Combina batimento de tags da coleção com termos geográficos/específicos do sistema no título e descrição.
 */
export function findRelatedPostsForSystem(
	sistema: SistemaRegistro,
	allPosts: CollectionEntry<'blog'>[],
	limit = 4
): RelatedBlogPost[] {
	const sysTagsNorm = (sistema.tags || []).map(normalizeTerm).filter(Boolean);
	const specificTags = sysTagsNorm.filter((t) => !GENERIC_TAGS.has(t));

	const cityTokens = normalizeTerm(sistema.cidade)
		.split(/\s+/)
		.filter((w) => w.length >= 4 && !['sao', 'para', 'pelo', 'entre'].includes(w));

	const nameTokens = [
		normalizeTerm(sistema.nome_pt.split('(')[0]),
		normalizeTerm(sistema.id.replace(/-/g, ' ')),
	].filter((t) => t.length >= 4);

	const scored: { post: CollectionEntry<'blog'>; score: number }[] = [];

	for (const post of allPosts) {
		if (post.data.draft) continue;
		const postTagsNorm = (post.data.tags || []).map(normalizeTerm);
		const titleNorm = normalizeTerm(post.data.title || '');
		const descNorm = normalizeTerm(post.data.description || '');
		const fullText = `${titleNorm} ${descNorm}`;

		let score = 0;

		// 1. Batimento direto de tags específicas (regra do prompt)
		for (const st of specificTags) {
			if (postTagsNorm.includes(st)) {
				score += 5;
			}
			if (st.length >= 3 && titleNorm.includes(st)) {
				score += 4;
			} else if (st.length >= 4 && descNorm.includes(st)) {
				score += 2;
			}
		}

		// 2. Batimento de nome do sistema ou cidade no título + tags do sistema
		for (const nt of nameTokens) {
			if (nt && fullText.includes(nt)) {
				score += 6;
			}
		}

		for (const ct of cityTokens) {
			if (ct && titleNorm.includes(ct)) {
				score += 3;
			}
		}

		// 3. Se o post compartilha ao menos uma tag do sistema e tem aderência temática
		const sharedAnyTag = sysTagsNorm.some((t) => postTagsNorm.includes(t));
		if (sharedAnyTag && score > 0) {
			score += 2;
		}

		if (score >= 4) {
			scored.push({ post, score });
		}
	}

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
	});

	return scored.slice(0, limit).map(({ post }) => ({
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		pubDate: post.data.pubDate.toISOString().slice(0, 10),
		tags: post.data.tags || [],
	}));
}
