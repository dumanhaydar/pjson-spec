import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// On a GitHub Pages "project page" the site is served under /<repo>, so set
// BASE_PATH=/pjson-spec at build time (the deploy workflow does this). For local
// dev and for a custom domain / user page, leave it empty.
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Fully static output (everything is prerendered) → servable by GitHub Pages.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base
		},
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		}
	}
};

export default config;
