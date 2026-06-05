<script>
	import { base } from '$app/paths';
	import { site } from '$lib/config.js';
	let { data } = $props();

	const allObjects = [data.root, ...data.defs];
	const anchor = (n) =>
		n
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
</script>

<svelte:head>
	<title>Schema — pjson v{site.version}</title>
	<meta
		name="description"
		content="Explorer of the JSON Schema (draft 2020-12) that validates pjson files."
	/>
</svelte:head>

<div class="spec-hero">
	<div class="container">
		<span class="badge">JSON Schema · draft 2020-12</span>
		<h1>The schema, field by field.</h1>
		<p>
			<code>pjson.schema.json</code> validates any pjson file: types, enums, required fields and
			nullable shapes. This view is generated directly from the schema.
		</p>
		<div class="hero-cta">
			<a class="btn btn-primary" href={site.links.schemaRaw} target="_blank" rel="noopener"
				>Raw schema ↗</a
			>
			<a class="btn btn-ghost" href="{base}/spec/#nullable-vs-required-summary">Nullable summary →</a>
		</div>
	</div>
</div>

<div class="container schema-layout">
	<aside class="toc">
		<div class="toc-inner">
			<span class="toc-title">Definitions</span>
			<nav>
				{#each allObjects as obj}
					<a href={`#${anchor(obj.name)}`} class="toc-link">{obj.name}</a>
				{/each}
				{#if data.simples.length}
					<span class="toc-title" style="margin-top:18px">Simple types</span>
					{#each data.simples as s}
						<a href={`#${anchor(s.name)}`} class="toc-link sub">{s.name}</a>
					{/each}
				{/if}
			</nav>
		</div>
	</aside>

	<div class="schema-main">
		{#each allObjects as obj}
			<section class="def" id={anchor(obj.name)}>
				<header class="def-head">
					<h2>{obj.name}</h2>
					{#if !obj.additionalProperties}
						<span class="tag-closed" title="additionalProperties: false"
							>closed properties</span
						>
					{/if}
				</header>
				<div class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>Field</th>
								<th>Type</th>
								<th>Required</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{#each obj.props as p}
								<tr>
									<td><code class="field">{p.key}</code></td>
									<td>
										{#if p.ref && allObjects.some((o) => o.name === p.ref)}
											<a href={`#${anchor(p.ref)}`}><code>{p.type}</code></a>
										{:else}
											<code class="type">{p.type}</code>
										{/if}
									</td>
									<td>
										{#if p.required}
											<span class="req req-yes">required</span>
										{:else}
											<span class="req req-no">optional</span>
										{/if}
									</td>
									<td class="notes">
										{#if p.format}<span class="meta">format: {p.format}</span>{/if}
										{#if p.description}{p.description}{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/each}

		{#if data.simples.length}
			<section class="def">
				<header class="def-head"><h2>Simple types</h2></header>
				<div class="simples">
					{#each data.simples as s}
						<div class="simple" id={anchor(s.name)}>
							<code class="field">{s.name}</code>
							<code class="type">{s.label}</code>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
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
		margin: 0 0 22px;
		max-width: 640px;
	}
	.hero-cta {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.schema-layout {
		display: grid;
		grid-template-columns: 220px 1fr;
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
		font-family: var(--mono);
		font-size: 12.5px;
		color: var(--text-soft);
		padding: 5px 0 5px 14px;
		margin-left: -1px;
		border-left: 2px solid transparent;
	}
	.toc-link:hover {
		color: var(--accent-text);
		text-decoration: none;
		border-left-color: var(--border-strong);
	}
	.toc-link.sub {
		color: var(--text-faint);
		padding-left: 22px;
	}

	.def {
		margin-bottom: 44px;
		scroll-margin-top: 88px;
	}
	.def-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
	}
	.def-head h2 {
		font-family: var(--mono);
		font-size: 19px;
		margin: 0;
		font-weight: 600;
	}
	.tag-closed {
		font-size: 11.5px;
		font-weight: 550;
		color: var(--amber);
		background: var(--amber-soft);
		border: 1px solid color-mix(in srgb, var(--amber) 25%, transparent);
		padding: 3px 9px;
		border-radius: 999px;
	}

	.table-wrap {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}
	thead th {
		text-align: left;
		font-weight: 600;
		font-size: 12.5px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-faint);
		padding: 11px 16px;
		background: var(--bg-soft);
		border-bottom: 1px solid var(--border);
	}
	td {
		padding: 11px 16px;
		border-bottom: 1px solid var(--border);
		vertical-align: top;
		color: var(--text-soft);
	}
	tbody tr:last-child td {
		border-bottom: none;
	}
	tbody tr:hover td {
		background: var(--bg-soft);
	}
	.field {
		color: var(--accent-text);
		background: var(--accent-soft);
		border-color: color-mix(in srgb, var(--accent) 16%, transparent);
		font-weight: 600;
	}
	.type {
		color: var(--text);
		background: var(--bg-sunken);
		border-color: var(--border);
	}
	.req {
		font-size: 12px;
		font-weight: 600;
		padding: 2px 9px;
		border-radius: 999px;
		white-space: nowrap;
	}
	.req-yes {
		color: var(--green);
		background: var(--green-soft);
	}
	.req-no {
		color: var(--text-faint);
		background: var(--bg-sunken);
	}
	.notes {
		font-size: 13px;
	}
	.meta {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text-faint);
	}

	.simples {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 12px;
	}
	.simple {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 14px;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg);
		scroll-margin-top: 88px;
	}

	@media (max-width: 920px) {
		.schema-layout {
			grid-template-columns: 1fr;
		}
		.toc {
			position: static;
			max-height: none;
			margin-bottom: 8px;
			border: 1px solid var(--border);
			border-radius: var(--radius);
			padding: 18px;
			background: var(--bg-soft);
		}
	}
</style>
