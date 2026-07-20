import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Schema v0 dos satélites (Sprint 0c Trindade 2026-05-16). Campos opcionais
// para suportar cross-portal (Mundo Trilhos ↔ Rail Post), atribuição
// editorial e licenciamento de imagem. Posts existentes não quebram.
const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		wp_id: z.number().optional(),
		tags: z.array(z.string()).optional(),

		// --- Schema v0 satélites ---
		lang: z.enum(['pt-br', 'en', 'es']).optional(),
		categoria_macro: z.string().optional(),
		hero_credit: z.string().optional(),
		hero_license: z.enum(['cc-by', 'cc-by-sa', 'public-domain', 'press-kit', 'own', 'ai-generated']).optional(),
		hero_source_url: z.string().url().optional(),
		alt: z.string().optional(),
		source_name: z.string().optional(),
		source_url: z.string().url().optional(),
		interlink_url: z.string().url().optional(),
		interlink_lang: z.enum(['pt-br', 'en', 'es']).optional(),
		author: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { blog };
