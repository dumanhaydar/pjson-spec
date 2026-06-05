# pjson — website

The presentation website for the [pjson](../SPEC.md) format.
Live at **https://dumanhaydar.github.io/pjson-spec/**.

Built with **SvelteKit** + [`@sveltejs/adapter-static`](https://kit.svelte.dev/docs/adapter-static),
fully prerendered, hosted on **GitHub Pages**.

## Pages

- `/` — overview of the format (pitch, principles, anatomy, collections, validation)
- `/spec` — the specification, rendered from [`../SPEC.md`](../SPEC.md)
- `/schema` — explorer of the JSON Schema, generated from [`../pjson.schema.json`](../pjson.schema.json)
- `/contributing` — how to propose changes

The spec and schema are **imported directly** from the repo root at build time
(`src/routes/spec/+page.js` and `src/routes/schema/+page.js`), so the rendered site
never diverges from the source files. This requires `server.fs.allow: ['..']` in
[`vite.config.js`](vite.config.js). There is no copy/sync step.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
```

## Build

```sh
npm run build    # static prerender → build/
npm run preview  # preview the build
```

## Deployment

Every push to `main` runs [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml),
which builds this project and publishes `build/` to GitHub Pages.

This is a **project page** served under `/pjson-spec`, so the workflow builds with
`BASE_PATH=/pjson-spec` and SvelteKit's `paths.base` is set from that env var
(see [`svelte.config.js`](svelte.config.js)). Internal links use `base` from
`$app/paths`, and `static/.nojekyll` is required so GitHub Pages serves the `_app/`
directory.

> **Custom domain / user page?** Set `BASE_PATH` to an empty string in the workflow;
> everything realigns to the site root automatically.
