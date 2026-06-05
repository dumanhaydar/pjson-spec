import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Allow importing SPEC.md / pjson.schema.json from the repo root,
			// one level above this `pages/` project.
			allow: ['..']
		}
	}
});
