import { marked } from 'marked';
import { base } from '$app/paths';
// Source of truth: SPEC.md at the repo root, one level above this `pages/` project
// (imported raw, baked at build time; see vite.config.js server.fs.allow).
import specMd from '../../../../SPEC.md?raw';

const DIACRITICS = /[̀-ͯ]/g;

const slug = (s) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(DIACRITICS, '')
		.replace(/`/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

// Stable id: if the heading contains a `code` token, slugify that token
// (e.g. `channels` → #channels); otherwise the heading without its section number.
const headingId = (text) => {
	const m = text.match(/`([^`]+)`/);
	const base = m ? m[1] : text.replace(/^\d+\.\s*/, '');
	return slug(base);
};

export function load() {
	const toc = [];

	const renderer = new marked.Renderer();
	renderer.heading = function (token) {
		const text = token.text;
		const depth = token.depth;
		const id = headingId(text.replace(/<[^>]+>/g, ''));
		if (depth === 2 || depth === 3) {
			toc.push({ id, text: text.replace(/[*`]/g, ''), depth });
		}
		const inner = this.parser.parseInline(token.tokens);
		return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${depth}>\n`;
	};

	marked.setOptions({ renderer, gfm: true, breaks: false });
	let html = marked.parse(specMd);

	// Rewrite the spec's relative links to the site's own pages (base-aware).
	html = html
		.replace(/href="pjson\.schema\.json"/g, `href="${base}/schema/"`)
		.replace(/href="SPEC\.md"/g, `href="${base}/spec/"`);

	return { html, toc };
}
