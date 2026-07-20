// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://mundotrilhos.com',
	redirects: {
		'/blog/20260712-china-rompe-a-barria-dos-450-kmh-e-reescreve-a-geografia-do-desenvolvimento-sobr/': '/blog/20260712-china-rompe-a-barreira-dos-450-kmh-e-reescreve-a-geografia-do-desenvolvimento-sobr/',
		'/blog/20260712-china-rompe-a-barria-dos-450-kmh-e-reescreve-a-geografia-do-desenvolvimento-sobr': '/blog/20260712-china-rompe-a-barreira-dos-450-kmh-e-reescreve-a-geografia-do-desenvolvimento-sobr',
	},
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
