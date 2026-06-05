<script>
	import { base } from '$app/paths';
	import { site } from '$lib/config.js';

	const principles = [
		{
			n: '01',
			t: 'Explicit type',
			d: 'Every stream is <code>live</code>, <code>movie</code> or <code>series</code> — frozen at conversion, never guessed by the player.'
		},
		{
			n: '02',
			t: '3 collections + dictionaries',
			d: 'Separate <code>channels</code> / <code>movies</code> / <code>series</code>; <code>categories</code> and <code>languages</code> deduplicated and referenced by id.'
		},
		{
			n: '03',
			t: 'Stable identity',
			d: 'Each entity carries an application <code>id</code> (slug), distinct from the provider\'s volatile <code>stream_id</code>.'
		},
		{
			n: '04',
			t: 'Grouped variants',
			d: 'A channel (or movie) in several qualities 4K/FHD/HD/SD/8K is <strong>one</strong> entity with a <code>sources</code> array.'
		},
		{
			n: '05',
			t: 'Multi-valued by default',
			d: '<code>category_ids</code>, <code>languages</code>, <code>countries</code>, <code>genres</code> are always arrays — at worst <code>[]</code>, never <code>null</code>.'
		},
		{
			n: '06',
			t: 'One source for genres',
			d: 'Genres come <strong>only from TMDB</strong>, never from provider labels. Movie and TV vocabularies kept strictly apart.'
		}
	];

	const channelExample = `{
  "id": "ch:trt-1",
  "kind": "live",
  "name": "TRT 1",
  "logo": "http://.../trt1hd.png",
  "epg_id": "trt1.tr",
  "countries": ["tr"],
  "languages": ["tr"],
  "category_ids": ["tr-ulusal-4k"],
  "sources": [
    {
      "stream_id": 51705,
      "quality": "UHD_4K",
      "quality_label": "4K",
      "ext": null,
      "url": "http://example.com:80/user123/pass123/51705"
    }
  ]
}`;

	const collections = [
		{
			k: 'channels',
			label: 'Live',
			desc: 'Live channels. Hybrid grouping: by <code>epg_id</code> first, name slug as a fallback.',
			fields: ['epg_id', 'countries', 'tv_archive', 'sources[]']
		},
		{
			k: 'movies',
			label: 'Movies',
			desc: 'Multi-quality movies, grouped. <code>year</code>, <code>release_date</code>, <code>rating</code>, <code>external_ids.tmdb</code>.',
			fields: ['title', 'genres', 'poster', 'sources[]']
		},
		{
			k: 'series',
			label: 'Series',
			desc: 'One identity groups every season. <code>seasons[] → episodes[]</code> tree with a per-episode poster.',
			fields: ['seasons[]', 'episodes[]', 'air_date', 'backdrop']
		}
	];
</script>

<svelte:head>
	<title>pjson — A structured IPTV playlist format</title>
	<meta name="description" content={site.description} />
</svelte:head>

<!-- HERO -->
<section class="hero">
	<div class="container hero-inner">
		<span class="badge">Draft · v{site.version} · open to contributions</span>
		<h1>
			One playlist format<br />to replace <span class="grad">all of them</span>.
		</h1>
		<p class="lede">
			<strong>pjson</strong> retires extended <code>m3u</code>/<code>m3u_plus</code> and every
			provider-specific dump for a single structured, validatable JSON format. Any converter — an M3U
			playlist, a provider API — produces exactly the same output.
		</p>
		<div class="hero-cta">
			<a class="btn btn-primary" href="{base}/spec/">Read the spec →</a>
			<a class="btn btn-ghost" href={site.links.repo} target="_blank" rel="noopener"
				>View on GitHub ↗</a
			>
		</div>
		<div class="hero-meta">
			<span><strong>UTF-8</strong> · strict JSON</span>
			<span class="dot">·</span>
			<span><strong>JSON Schema</strong> draft 2020-12</span>
			<span class="dot">·</span>
			<span><strong>3</strong> collections</span>
		</div>
	</div>
</section>

<!-- PROBLEM / WHY -->
<section class="container why">
	<div class="why-col">
		<span class="eyebrow">The problem</span>
		<h2>Extended m3u carries no structure.</h2>
		<p>
			An <code>#EXTINF</code> line mixes channels, movies and series in flat text. The type has to be
			guessed, quality variants are duplicated, categories and languages repeat line after line.
			Impossible to validate, painful to parse.
		</p>
	</div>
	<div class="why-col">
		<span class="eyebrow">The answer</span>
		<h2>One predictable JSON document.</h2>
		<p>
			Explicit type per entity, stable identities, shared dictionaries, grouped variants. A frozen
			JSON Schema validates the file end to end. The consumer guesses nothing.
		</p>
	</div>
</section>

<!-- PRINCIPLES -->
<section class="container">
	<div class="section-head">
		<span class="eyebrow">Principles</span>
		<h2>Six rules that hold the format together.</h2>
	</div>
	<div class="grid-3">
		{#each principles as p}
			<article class="card">
				<span class="card-n">{p.n}</span>
				<h3>{p.t}</h3>
				<p>{@html p.d}</p>
			</article>
		{/each}
	</div>
</section>

<!-- EXAMPLE -->
<section class="container example">
	<div class="example-text">
		<span class="eyebrow">Anatomy</span>
		<h2>A live channel, grouped.</h2>
		<p>
			Every quality of one channel fits in a <code>sources</code> array. The application
			<code>id</code>
			(<code>ch:&lt;slug&gt;</code>) outlives the <code>stream_id</code>s that churn on the provider
			side.
		</p>
		<ul class="ticks">
			<li>Grouped by <code>epg_id</code>, falling back to the name slug</li>
			<li>Quality normalized through the <code>quality</code> enum</li>
			<li>Clean name: no country prefix, no quality suffix</li>
		</ul>
		<a class="btn btn-ghost" href="{base}/spec/#channels">Live type details →</a>
	</div>
	<div class="example-code">
		<div class="code-chrome">
			<span class="code-dot"></span><span class="code-dot"></span><span class="code-dot"></span>
			<span class="code-name">catalog.pjson</span>
		</div>
		<pre>{channelExample}</pre>
	</div>
</section>

<!-- COLLECTIONS -->
<section class="container">
	<div class="section-head">
		<span class="eyebrow">Three collections</span>
		<h2>Live, movies and series — separate and typed.</h2>
	</div>
	<div class="grid-3">
		{#each collections as c}
			<article class="card coll">
				<header class="coll-head">
					<code class="coll-key">{c.k}</code>
					<span class="coll-label">{c.label}</span>
				</header>
				<p>{@html c.desc}</p>
				<div class="chips">
					{#each c.fields as f}<code class="chip">{f}</code>{/each}
				</div>
			</article>
		{/each}
	</div>
</section>

<!-- VALIDATION BANNER -->
<section class="container">
	<div class="banner">
		<div>
			<span class="eyebrow" style="color:#fff;opacity:.85">Validation</span>
			<h2>Every file passes the JSON Schema.</h2>
			<p>
				Conformance isn't a convention, it's a checkable constraint: <code>pjson.schema.json</code>
				(draft 2020-12) validates types, enums, required fields and nullable shapes. The reference
				converter produces 0 errors on real catalogs of tens of thousands of entries.
			</p>
			<div class="banner-cta">
				<a class="btn btn-primary inv" href="{base}/schema/">Explore the schema →</a>
				<a class="btn btn-ghost inv" href={site.links.schemaRaw} target="_blank" rel="noopener"
					>raw schema ↗</a
				>
			</div>
		</div>
		<div class="banner-stats">
			<div><strong>0</strong><span>schema errors</span></div>
		</div>
	</div>
</section>

<!-- CONTEXT -->
<section class="container onde">
	<div>
		<span class="eyebrow">Context</span>
		<h2>Born for the Onde app.</h2>
		<p>
			pjson is the sole ingestion format of <strong>Onde</strong>, a native IPTV app (iOS, tvOS,
			macOS). The format is built to be decoded directly on the client and stays independent of the
			app: any player can consume it.
		</p>
	</div>
	<div class="onde-flow">
		<span class="flow-box">M3U playlist / API</span>
		<span class="flow-arrow">→</span>
		<span class="flow-box accent">Converter</span>
		<span class="flow-arrow">→</span>
		<span class="flow-box">catalog.pjson</span>
		<span class="flow-arrow">→</span>
		<span class="flow-box">Player</span>
	</div>
</section>

<!-- CONTRIBUTE CTA -->
<section class="container">
	<div class="cta">
		<h2>It's a draft. Your proposals are welcome.</h2>
		<p>
			v1.0 isn't frozen yet. Open an issue, propose a change to the spec, raise a missing field —
			everything goes through GitHub.
		</p>
		<div class="hero-cta">
			<a class="btn btn-primary" href={site.links.newIssue} target="_blank" rel="noopener"
				>Open an issue ↗</a
			>
			<a class="btn btn-ghost" href="{base}/contributing/">How to contribute →</a>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 72px 0 56px;
		background:
			radial-gradient(900px 360px at 50% -10%, var(--accent-soft), transparent 70%),
			var(--bg);
		border-bottom: 1px solid var(--border);
	}
	.hero-inner {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hero h1 {
		font-size: clamp(36px, 6vw, 60px);
		margin: 22px 0 0;
		font-weight: 700;
	}
	.grad {
		background: linear-gradient(120deg, var(--accent) 0%, #7c6cf0 60%, #a855f7 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.lede {
		font-size: clamp(16px, 2.2vw, 19px);
		color: var(--text-soft);
		max-width: 640px;
		margin: 22px 0 0;
	}
	.hero-cta {
		display: flex;
		gap: 12px;
		margin-top: 30px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.hero-meta {
		margin-top: 34px;
		display: flex;
		gap: 12px;
		align-items: center;
		color: var(--text-faint);
		font-size: 14px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.hero-meta strong {
		color: var(--text-soft);
	}
	.dot {
		opacity: 0.4;
	}

	.why {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		padding: 72px 24px;
	}
	.why h2 {
		font-size: 26px;
		margin: 12px 0 14px;
	}
	.why p {
		color: var(--text-soft);
		margin: 0;
	}

	.section-head {
		text-align: center;
		margin: 0 auto 40px;
		max-width: 640px;
	}
	.section-head h2 {
		font-size: clamp(26px, 4vw, 36px);
		margin: 10px 0 0;
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
		transition:
			transform 0.16s ease,
			box-shadow 0.16s ease,
			border-color 0.16s ease;
	}
	.card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow);
		border-color: var(--border-strong);
	}
	.card-n {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--accent-text);
		font-weight: 600;
	}
	.card h3 {
		font-size: 17px;
		margin: 8px 0 8px;
	}
	.card p {
		color: var(--text-soft);
		font-size: 14.5px;
		margin: 0;
	}

	.example {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: 48px;
		align-items: center;
		padding: 80px 24px;
	}
	.example-text h2 {
		font-size: 30px;
		margin: 12px 0 14px;
	}
	.example-text > p {
		color: var(--text-soft);
		margin: 0 0 18px;
	}
	.ticks {
		list-style: none;
		padding: 0;
		margin: 0 0 22px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.ticks li {
		position: relative;
		padding-left: 28px;
		color: var(--text-soft);
		font-size: 14.5px;
	}
	.ticks li::before {
		content: '✓';
		position: absolute;
		left: 0;
		top: 0;
		color: var(--green);
		font-weight: 700;
		background: var(--green-soft);
		width: 20px;
		height: 20px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
	}
	.example-code {
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow);
		border: 1px solid #1c1f29;
	}
	.code-chrome {
		background: #161922;
		padding: 11px 16px;
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.code-dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #3a3f4d;
	}
	.code-name {
		margin-left: 8px;
		font-family: var(--mono);
		font-size: 12.5px;
		color: #8b91a0;
	}
	.example-code pre {
		margin: 0;
		border: none;
		border-radius: 0;
	}

	.coll-head {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
	}
	.coll-key {
		background: var(--accent-soft);
		color: var(--accent-text);
		border-color: color-mix(in srgb, var(--accent) 18%, transparent);
		font-weight: 600;
	}
	.coll-label {
		font-weight: 600;
		font-size: 14px;
		color: var(--text-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 14px;
	}
	.chip {
		font-size: 12px;
		background: var(--bg-sunken);
		color: var(--text-soft);
		border-color: var(--border);
	}

	.banner {
		background: linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4f46e5 120%);
		border-radius: 20px;
		padding: 44px;
		color: #fff;
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 40px;
		align-items: center;
	}
	.banner h2 {
		color: #fff;
		font-size: 28px;
		margin: 10px 0 12px;
	}
	.banner p {
		color: #c7c9f0;
		margin: 0 0 22px;
		font-size: 15px;
	}
	.banner code {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.18);
		color: #e9eafc;
	}
	.banner-cta {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.btn-primary.inv {
		background: #fff;
		color: var(--accent-text);
	}
	.btn-primary.inv:hover {
		background: #f0f0fb;
	}
	.btn-ghost.inv {
		background: transparent;
		color: #fff;
		border-color: rgba(255, 255, 255, 0.35);
	}
	.btn-ghost.inv:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	.banner-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}
	.banner-stats div {
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		padding: 16px;
		text-align: center;
	}
	.banner-stats strong {
		display: block;
		font-size: 24px;
		font-weight: 700;
	}
	.banner-stats span {
		font-size: 12.5px;
		color: #b9bbe8;
	}

	.onde {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		align-items: center;
		padding: 80px 24px;
	}
	.onde h2 {
		font-size: 30px;
		margin: 12px 0 14px;
	}
	.onde p {
		color: var(--text-soft);
		margin: 0;
	}
	.onde-flow {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.flow-box {
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: 10px;
		padding: 12px 14px;
		font-size: 13.5px;
		font-weight: 550;
		font-family: var(--mono);
		box-shadow: var(--shadow-sm);
	}
	.flow-box.accent {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}
	.flow-arrow {
		color: var(--text-faint);
		font-size: 18px;
	}

	.cta {
		text-align: center;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 56px 32px;
	}
	.cta h2 {
		font-size: clamp(24px, 4vw, 32px);
		max-width: 620px;
		margin: 0 auto;
	}
	.cta p {
		color: var(--text-soft);
		max-width: 520px;
		margin: 14px auto 0;
	}
	.cta .hero-cta {
		justify-content: center;
	}

	@media (max-width: 880px) {
		.why,
		.example,
		.onde {
			grid-template-columns: 1fr;
			gap: 32px;
			padding: 56px 24px;
		}
		.grid-3 {
			grid-template-columns: 1fr;
		}
		.banner {
			grid-template-columns: 1fr;
			padding: 32px;
		}
	}
</style>
