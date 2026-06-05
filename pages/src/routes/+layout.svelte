<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { site } from '$lib/config.js';

	let { children } = $props();

	const nav = [
		{ path: '/', label: 'Home' },
		{ path: '/spec/', label: 'Spec' },
		{ path: '/schema/', label: 'Schema' },
		{ path: '/contributing/', label: 'Contributing' }
	];

	let menuOpen = $state(false);

	const isActive = (path) => {
		const here = $page.url.pathname.replace(/\/$/, '');
		const target = `${base}${path}`.replace(/\/$/, '');
		return path === '/' ? here === base.replace(/\/$/, '') : here.startsWith(target);
	};
</script>

<header class="hdr">
	<div class="container hdr-inner">
		<a href="{base}/" class="brand" onclick={() => (menuOpen = false)}>
			<span class="brand-mark">{`{ }`}</span>
			<span class="brand-name">{site.name}</span>
			<span class="brand-ver">v{site.version}</span>
		</a>

		<nav class="nav" class:open={menuOpen}>
			{#each nav as item}
				<a
					href="{base}{item.path}"
					class="nav-link"
					class:active={isActive(item.path)}
					onclick={() => (menuOpen = false)}>{item.label}</a
				>
			{/each}
			<a class="nav-gh" href={site.links.repo} target="_blank" rel="noopener">GitHub ↗</a>
		</nav>

		<button class="burger" aria-label="Menu" onclick={() => (menuOpen = !menuOpen)}>
			<span></span><span></span><span></span>
		</button>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="ftr">
	<div class="container ftr-inner">
		<div>
			<div class="ftr-brand">{site.name} <span>v{site.version}</span></div>
			<p class="ftr-desc">{site.tagline} — a draft, open to contributions.</p>
		</div>
		<div class="ftr-links">
			<a href="{base}/spec/">Spec</a>
			<a href="{base}/schema/">Schema</a>
			<a href={site.links.repo} target="_blank" rel="noopener">GitHub repo</a>
			<a href={site.links.newIssue} target="_blank" rel="noopener">Propose a change</a>
		</div>
	</div>
	<div class="container ftr-fine">
		<span>Working document. The specification may change until v1.0 is frozen.</span>
		<a href={site.links.license} target="_blank" rel="noopener">MIT License</a>
	</div>
</footer>

<style>
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--bg) 86%, transparent);
		backdrop-filter: saturate(180%) blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		color: var(--text);
		font-weight: 650;
		font-size: 17px;
		letter-spacing: -0.01em;
	}
	.brand:hover {
		text-decoration: none;
	}
	.brand-mark {
		font-family: var(--mono);
		background: var(--accent);
		color: #fff;
		width: 28px;
		height: 28px;
		border-radius: 7px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 700;
	}
	.brand-ver {
		font-size: 12px;
		font-weight: 550;
		color: var(--text-faint);
		background: var(--bg-sunken);
		padding: 2px 7px;
		border-radius: 6px;
		border: 1px solid var(--border);
	}
	.nav {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.nav-link {
		color: var(--text-soft);
		font-size: 14.5px;
		font-weight: 500;
		padding: 7px 12px;
		border-radius: 7px;
	}
	.nav-link:hover {
		color: var(--text);
		background: var(--bg-soft);
		text-decoration: none;
	}
	.nav-link.active {
		color: var(--accent-text);
		background: var(--accent-soft);
	}
	.nav-gh {
		margin-left: 8px;
		font-size: 14px;
		font-weight: 550;
		color: var(--text);
		padding: 7px 12px;
		border: 1px solid var(--border-strong);
		border-radius: 7px;
	}
	.nav-gh:hover {
		background: var(--bg-soft);
		text-decoration: none;
	}
	.burger {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
	}
	.burger span {
		width: 22px;
		height: 2px;
		background: var(--text);
		border-radius: 2px;
	}

	.ftr {
		margin-top: 96px;
		border-top: 1px solid var(--border);
		background: var(--bg-soft);
		padding: 48px 0 36px;
	}
	.ftr-inner {
		display: flex;
		justify-content: space-between;
		gap: 32px;
		flex-wrap: wrap;
	}
	.ftr-brand {
		font-weight: 650;
		font-size: 16px;
	}
	.ftr-brand span {
		color: var(--text-faint);
		font-weight: 500;
		font-size: 13px;
	}
	.ftr-desc {
		color: var(--text-soft);
		font-size: 14px;
		margin: 6px 0 0;
		max-width: 380px;
	}
	.ftr-links {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 14px;
	}
	.ftr-links a {
		color: var(--text-soft);
	}
	.ftr-fine {
		margin-top: 32px;
		padding-top: 20px;
		border-top: 1px solid var(--border);
		color: var(--text-faint);
		font-size: 13px;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}
	.ftr-fine a {
		color: var(--text-soft);
	}

	@media (max-width: 760px) {
		.burger {
			display: flex;
		}
		.nav {
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 2px;
			padding: 12px 24px 20px;
			background: var(--bg);
			border-bottom: 1px solid var(--border);
			box-shadow: var(--shadow);
			display: none;
		}
		.nav.open {
			display: flex;
		}
		.nav-gh {
			margin-left: 0;
			text-align: center;
			margin-top: 6px;
		}
	}
</style>
