<script>
	import { site } from '$lib/config.js';
	let { data } = $props();
</script>

<svelte:head>
	<title>Spec — pjson v{site.version}</title>
	<meta name="description" content="The full specification of the pjson v{site.version} format." />
</svelte:head>

<div class="spec-hero">
	<div class="container">
		<span class="badge">Specification · v{site.version}</span>
		<h1>The spec, rendered here.</h1>
		<p>
			Source of truth: <a href={site.links.spec} target="_blank" rel="noopener"
				><code>SPEC.md</code></a
			>
			in the repo. Spotted a typo or a missing field?
			<a href={site.links.editSpec} target="_blank" rel="noopener">propose a change</a>.
		</p>
	</div>
</div>

<div class="container spec-layout">
	<aside class="toc">
		<div class="toc-inner">
			<span class="toc-title">Contents</span>
			<nav>
				{#each data.toc as item}
					<a href={`#${item.id}`} class="toc-link" class:sub={item.depth === 3}>{item.text}</a>
				{/each}
			</nav>
		</div>
	</aside>

	<article class="prose">
		{@html data.html}
	</article>
</div>

<style>
	.spec-hero {
		padding: 48px 0 36px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-soft);
	}
	.spec-hero h1 {
		font-size: clamp(30px, 5vw, 42px);
		margin: 16px 0 10px;
	}
	.spec-hero p {
		color: var(--text-soft);
		margin: 0;
		max-width: 640px;
	}

	.spec-layout {
		display: grid;
		grid-template-columns: 240px 1fr;
		gap: 48px;
		padding-top: 40px;
		align-items: start;
	}

	.toc {
		position: sticky;
		top: 88px;
		max-height: calc(100vh - 110px);
		overflow-y: auto;
	}
	.toc-title {
		display: block;
		font-size: 12px;
		font-weight: 650;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-faint);
		margin-bottom: 12px;
	}
	.toc nav {
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-left: 1px solid var(--border);
	}
	.toc-link {
		font-size: 13.5px;
		color: var(--text-soft);
		padding: 5px 0 5px 14px;
		margin-left: -1px;
		border-left: 2px solid transparent;
		line-height: 1.35;
	}
	.toc-link:hover {
		color: var(--accent-text);
		text-decoration: none;
		border-left-color: var(--border-strong);
	}
	.toc-link.sub {
		padding-left: 26px;
		font-size: 13px;
		color: var(--text-faint);
	}

	/* Prose styling for the rendered markdown */
	.prose {
		min-width: 0;
		font-size: 16px;
		color: var(--text);
	}
	.prose :global(h1) {
		font-size: 32px;
		margin: 0 0 8px;
	}
	.prose :global(h2) {
		font-size: 25px;
		margin: 52px 0 16px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border);
		scroll-margin-top: 88px;
	}
	.prose :global(h3) {
		font-size: 19px;
		margin: 32px 0 12px;
		scroll-margin-top: 88px;
	}
	.prose :global(p) {
		color: var(--text-soft);
		margin: 14px 0;
	}
	.prose :global(ul),
	.prose :global(ol) {
		color: var(--text-soft);
		padding-left: 22px;
	}
	.prose :global(li) {
		margin: 6px 0;
	}
	.prose :global(li::marker) {
		color: var(--text-faint);
	}
	.prose :global(strong) {
		color: var(--text);
		font-weight: 620;
	}
	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 40px 0;
	}
	.prose :global(blockquote) {
		margin: 20px 0;
		padding: 4px 18px;
		border-left: 3px solid var(--accent);
		background: var(--accent-soft);
		border-radius: 0 8px 8px 0;
		color: var(--text-soft);
	}
	.prose :global(blockquote p) {
		margin: 10px 0;
	}
	.prose :global(a) {
		color: var(--accent-text);
		font-weight: 500;
	}
	.prose :global(.anchor) {
		color: var(--text-faint);
		opacity: 0;
		margin-left: -22px;
		padding-right: 8px;
		font-weight: 400;
		text-decoration: none;
	}
	.prose :global(h2:hover .anchor),
	.prose :global(h3:hover .anchor) {
		opacity: 1;
	}

	/* Tables */
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 20px 0;
		font-size: 14.5px;
		display: block;
		overflow-x: auto;
	}
	.prose :global(th) {
		text-align: left;
		font-weight: 600;
		padding: 10px 14px;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		color: var(--text);
		white-space: nowrap;
	}
	.prose :global(td) {
		padding: 10px 14px;
		border: 1px solid var(--border);
		color: var(--text-soft);
		vertical-align: top;
	}
	.prose :global(tr:nth-child(even) td) {
		background: var(--bg-soft);
	}

	/* Code blocks (jsonc examples) */
	.prose :global(pre) {
		margin: 18px 0;
	}
	.prose :global(:not(pre) > code) {
		color: #b5326b;
	}

	@media (max-width: 920px) {
		.spec-layout {
			grid-template-columns: 1fr;
		}
		.toc {
			position: static;
			max-height: none;
			margin-bottom: 24px;
			border: 1px solid var(--border);
			border-radius: var(--radius);
			padding: 18px;
			background: var(--bg-soft);
		}
	}
</style>
