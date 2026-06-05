<script>
	import { site } from '$lib/config.js';

	const ways = [
		{
			t: 'Open an issue',
			d: 'A missing field, an ambiguity, a case the format doesn\'t cover? Describe it. This is the entry point for any discussion.',
			cta: 'New issue ↗',
			href: site.links.newIssue
		},
		{
			t: 'Propose a spec change',
			d: 'Edit SPEC.md directly on GitHub: a pull request is created from your change. Ideal for typos and clarifications.',
			cta: 'Edit the spec ↗',
			href: site.links.editSpec
		},
		{
			t: 'Discuss a deeper change',
			d: 'A change that touches the shape of the format deserves a discussion before any code. Propose it, make the case for the use case.',
			cta: 'Start a discussion ↗',
			href: site.links.discussions
		}
	];

	const rules = [
		'<strong>v1.0 stays backward-compatible</strong>: an addition must be optional, otherwise it targets v1.1+.',
		'Any shape change must remain <strong>validatable by the JSON Schema</strong> — propose the schema update alongside it.',
		'<strong>Arrays are never <code>null</code></strong>: at worst <code>[]</code>. This rule is non-negotiable.',
		'<strong>Genres stay TMDB-only</strong>: no genre derived from provider labels.',
		'A concrete <code>jsonc</code> example beats a long description.'
	];
</script>

<svelte:head>
	<title>Contributing — pjson</title>
	<meta name="description" content="How to propose changes to the pjson format through GitHub." />
</svelte:head>

<div class="spec-hero">
	<div class="container">
		<span class="badge">Open to contributions</span>
		<h1>pjson is a draft. Help freeze it.</h1>
		<p>
			v{site.version} isn't set in stone. The format gets better when confronted with other
			providers, other players, other use cases. Everything goes through the public repo.
		</p>
	</div>
</div>

<section class="container">
	<div class="grid-3 ways">
		{#each ways as w}
			<article class="card">
				<h3>{w.t}</h3>
				<p>{w.d}</p>
				<a class="btn btn-ghost" href={w.href} target="_blank" rel="noopener">{w.cta}</a>
			</article>
		{/each}
	</div>
</section>

<section class="container rules-sec">
	<div class="section-head">
		<span class="eyebrow">Guardrails</span>
		<h2>Five rules to keep in mind.</h2>
	</div>
	<ul class="rules">
		{#each rules as r, i}
			<li><span class="rule-n">{i + 1}</span><span>{@html r}</span></li>
		{/each}
	</ul>
</section>

<section class="container">
	<div class="cta">
		<h2>Ready to propose something?</h2>
		<p>The repo, the issues and the spec are public. Help yourself.</p>
		<div class="cta-actions">
			<a class="btn btn-primary" href={site.links.repo} target="_blank" rel="noopener"
				>GitHub repo ↗</a
			>
			<a class="btn btn-ghost" href={site.links.issues} target="_blank" rel="noopener"
				>Browse issues ↗</a
			>
		</div>
	</div>
</section>

<style>
	.spec-hero {
		padding: 48px 0 40px;
		border-bottom: 1px solid var(--border);
		background: var(--bg-soft);
	}
	.spec-hero h1 {
		font-size: clamp(28px, 5vw, 42px);
		margin: 16px 0 12px;
		max-width: 720px;
	}
	.spec-hero p {
		color: var(--text-soft);
		margin: 0;
		max-width: 640px;
	}

	section {
		padding-top: 56px;
	}
	.grid-3 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}
	.card {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 24px;
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
	}
	.card h3 {
		font-size: 18px;
		margin: 0 0 10px;
	}
	.card p {
		color: var(--text-soft);
		font-size: 14.5px;
		margin: 0 0 18px;
		flex: 1;
	}
	.card .btn {
		align-self: flex-start;
	}

	.section-head {
		text-align: center;
		margin: 0 auto 36px;
		max-width: 600px;
	}
	.section-head h2 {
		font-size: clamp(24px, 4vw, 32px);
		margin: 10px 0 0;
	}
	.rules {
		list-style: none;
		padding: 0;
		margin: 0 auto;
		max-width: 760px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.rules li {
		display: flex;
		gap: 16px;
		align-items: flex-start;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 18px 20px;
		color: var(--text-soft);
		box-shadow: var(--shadow-sm);
	}
	.rule-n {
		flex: none;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: var(--accent-soft);
		color: var(--accent-text);
		font-weight: 650;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cta {
		text-align: center;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 52px 32px;
	}
	.cta h2 {
		font-size: clamp(22px, 4vw, 30px);
		margin: 0;
	}
	.cta p {
		color: var(--text-soft);
		margin: 12px 0 0;
	}
	.cta-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		margin-top: 26px;
		flex-wrap: wrap;
	}

	@media (max-width: 880px) {
		.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
