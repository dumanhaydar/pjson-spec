# pjson

**Extended Playlist JSON** — a structured IPTV playlist format in strict JSON, the
successor to extended `m3u`/`m3u_plus`. Source-independent: any converter (an M3U
playlist, a provider API, …) produces the exact same format.

🌐 **Spec & docs: https://dumanhaydar.github.io/pjson-spec/**

## Why

Extended `m3u` carries no structure: a flat `#EXTINF` text that mixes channels,
movies and series, where the type must be guessed, quality variants are duplicated,
and categories and languages repeat line after line. pjson replaces it with **one
predictable JSON document**:

- **Explicit type** per entry — `live`, `movie` or `series`, frozen at conversion.
- **3 collections + shared dictionaries** — `channels` / `movies` / `series`, with
  `categories` and `languages` deduplicated and referenced by id.
- **Stable identity** — an application `id` (slug), distinct from the provider's
  volatile `stream_id`.
- **Grouped variants** — one entity holds every quality (4K/FHD/HD/SD/8K) in a
  `sources` array.
- **Validatable** — a frozen JSON Schema checks the whole file.

## The specification

| File | What it is |
|---|---|
| [`SPEC.md`](SPEC.md) | The full specification (v1.0) — the source of truth |
| [`pjson.schema.json`](pjson.schema.json) | JSON Schema (draft 2020-12) that validates a pjson file |

### Validate a file

Any JSON Schema (draft 2020-12) validator works, e.g. with
[`ajv`](https://ajv.js.org/):

```sh
npx ajv-cli validate --spec=draft2020 -s pjson.schema.json -d your-catalog.pjson
```

## Status

pjson is a **draft**. v1.0 is not frozen yet — it gets better when confronted with
other providers, other players, other use cases.

- **Propose a change**: edit [`SPEC.md`](SPEC.md) on GitHub, or open an
  [issue](https://github.com/dumanhaydar/pjson-spec/issues).
- **Guardrails**: backward-compatible additions stay optional; any shape change must
  remain validatable by the schema; arrays are never `null` (at worst `[]`); genres
  are TMDB-only.

## Repository layout

This repo holds the spec at its root. The presentation website
([dumanhaydar.github.io/pjson-spec](https://dumanhaydar.github.io/pjson-spec/)) lives
in [`pages/`](pages/) — see [`pages/README.md`](pages/README.md) if you want to run or
modify it.

## License

[MIT](LICENSE) © Haydar Duman
