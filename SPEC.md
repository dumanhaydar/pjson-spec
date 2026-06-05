# pjson — Extended Playlist JSON (v1.0)

A structured IPTV playlist format, the successor to extended `m3u`/`m3u_plus`.
Source-independent: any converter (an M3U playlist, a provider API, etc.) produces the exact same format.

- **Encoding**: UTF-8, strict JSON (`//` comments are forbidden in the real file — they appear here for documentation only).
- **Version**: root field `pjson_version` (semver). This document describes `1.0`.
- **Validation**: see [`pjson.schema.json`](pjson.schema.json) (JSON Schema draft 2020-12).

---

## 1. Principles

1. **Explicit type** — every stream is `live`, `movie` or `series`. The type is never guessed on the consumer side: it is frozen at conversion time.
2. **3 collections + shared dictionaries** — `channels` / `movies` / `series` are kept separate; `categories` and `languages` are deduplicated and referenced by `id`.
3. **Stable identity** — every entity carries an application-level `id` (a slug), distinct from the provider's volatile `stream_id`.
4. **Grouped variants** — a live channel (or a movie) available in several qualities (4K/FHD/HD/SD/8K) is **one** entity with a `sources` array.
5. **Multi-valued by default** — `category_ids`, `languages`, `countries`, `genres` are always arrays.

---

## 2. Root structure

```jsonc
{
  "pjson_version": "1.0",
  "generated_at": "2026-06-05T17:10:00Z",   // ISO 8601 UTC
  "source": { ... },        // §3
  "categories": [ ... ],    // §4  (dictionary)
  "languages":  [ ... ],    // §5  (dictionary)
  "channels":   [ ... ],    // §6  (live)
  "movies":     [ ... ],    // §7
  "series":     [ ... ]     // §8
}
```

Every root field is **required** unless stated otherwise. An empty collection is `[]`, never `null`.

---

## 3. `source` — provenance

```jsonc
{
  "kind": "api",                    // source family: "api" | "m3u" | "m3u_plus"
  "server": "http://example.com:80",// scheme + host + port, no trailing slash
  "username": "user123",            // optional — present when auth_in_url
  "auth_in_url": true,              // stream URLs embed user/pass
  "imported_from": "get.php?...&type=m3u_plus"  // optional, traceability (raw source URL)
}
```

`source` describes where the file comes from, without mandating any provider technology. `server` + `username` make it possible to rebuild/refresh URLs without re-downloading.

---

## 4. `categories` — dictionary

```jsonc
{
  "id": "tr-ulusal-4k",         // stable slug, unique within the file
  "name": "TR | ULUSAL 4K",     // original category label
  "kind": "live",               // "live" | "movie" | "series"
  "provider_id": "142"          // optional — native category id from the source
}
```

- A single channel can reference several categories through `category_ids`.
- The `name` label keeps the grouping provided by the source verbatim.

---

## 5. `languages` — dictionary

An array of **ISO 639-1** codes (2 letters), plus the special value `mul` (multi-language).

```json
["tr", "de", "nl", "en", "mul"]
```

Referenced by the `languages[]` fields of entities. A stream **always has at least one** language (failing that, a heuristic on country/prefix; otherwise `["und"]` = undetermined).

---

## 6. `channels` — live streams

```jsonc
{
  "id": "ch:trt-1",                 // "ch:" + normalized slug (name without quality/country)
  "kind": "live",
  "name": "TRT 1",                  // cleaned name (no country prefix, no quality suffix)
  "logo": "http://.../trt1hd.png",  // channel logo — nullable
  "epg_id": "trt1.tr",              // EPG identifier — nullable
  "countries": ["tr"],              // ISO 3166-1 alpha-2 (broadcast/target country)
  "languages": ["tr"],
  "category_ids": ["tr-ulusal-4k"], // 1..N
  "tv_archive": false,              // optional — catch-up available
  "added": "2024-11-02T00:00:00Z",  // optional
  "sources": [                      // 1..N grouped variants
    {
      "stream_id": 51705,           // stream id on the source side (used in the URL)
      "quality": "UHD_4K",          // enum §10 — nullable if undetermined
      "quality_label": "4K",        // raw label extracted from the name — nullable
      "ext": null,                  // null | "ts" | "m3u8"
      "url": "http://example.com:80/user123/pass123/51705"
    }
  ]
}
```

**Grouping (hybrid)** — two streams merge into the same `channel` according to, in order:
1. **Identical `epg_id`** (and non-empty) → same channel, merge. This is the priority key because it is reliable.
2. **Otherwise, identical normalized slug** (name stripped of quality, country and punctuation) → fallback merge.

Each original stream becomes a `sources` entry. The effective grouping key is not stored, but the channel `id` remains a stable `ch:<slug>`.

---

## 7. `movies` — films

```jsonc
{
  "id": "movie:136913",
  "kind": "movie",
  "title": "Mysteries of the Terracotta Warriors",
  "genres": ["documentary"],        // "movie genres" — 0..N
  "languages": ["mul"],
  "countries": [],                  // optional
  "poster": "http://image.tmdb.org/t/p/w154/lzrZ...jpg",  // poster — nullable
  "year": 2024,                     // optional
  "release_date": "2024-08-01",     // optional — ISO release date (YYYY-MM-DD)
  "rating": 7.4,                    // optional (0–10)
  "duration_secs": 5400,            // optional
  "plot": "...",                    // optional
  "external_ids": { "tmdb": "123", "imdb": "tt..." }, // optional
  "category_ids": ["netflix-movies-multi"],
  "added": "2026-01-10T00:00:00Z",  // optional
  "sources": [                      // movies are multi-quality too
    {
      "stream_id": 136913,
      "quality": "UHD_4K",
      "quality_label": "UHD",
      "ext": "mkv",                 // container extension
      "url": "http://example.com:80/movie/user123/pass123/136913.mkv"
    }
  ]
}
```

Movies can exist in several qualities, grouped in `sources[]` just like channels.

---

## 8. `series` — series, seasons, episodes

```jsonc
{
  "id": "series:halef",             // unique identifier for the WHOLE series
  "kind": "series",
  "title": "Halef",
  "genres": ["drama"],
  "languages": ["tr"],
  "countries": ["tr"],              // optional
  "poster": "http://.../halef.jpg", // series poster — nullable
  "backdrop": "http://.../bg.jpg",  // optional
  "year": 2025,                     // optional
  "rating": 8.1,                    // optional
  "plot": "...",                    // optional
  "external_ids": { "tmdb": "456" },// optional
  "provider_series_id": 1234,       // optional — native series id from the source
  "category_ids": ["thursday-series"],
  "seasons": [
    {
      "season": 1,
      "poster": "http://.../s01.jpg",   // optional
      "episodes": [
        {
          "stream_id": 151186,          // episode id (= playback id)
          "season": 1,
          "episode": 34,
          "title": "Halef S01E34",      // nullable
          "air_date": "2026-06-04",     // ISO date — optional
          "poster": "http://.../ep.jpg",// episode-SPECIFIC poster — nullable
          "duration_secs": 7200,        // optional
          "ext": "mp4",
          "url": "http://example.com:80/movie/user123/pass123/151186.mp4"
        }
      ]
    }
  ]
}
```

Notes:
- The series identity (`id`) groups **all** episodes, regardless of season.
- `season`/`episode` may come from structured source data or, failing that, be parsed from an `SxxExx` pattern in the name.
- A stream whose name contains `SxxExx` is classified as `series` even if its URL carries no explicit series marker.

---

## 9. Genres (normalized vocabulary)

**Single source of genres: TMDB.** The `genres[]` are **never** derived from the source labels (category, name). They are filled only when an `external_ids.tmdb` is available, through a TMDB lookup performed later (outside the base converter). Without a `tmdb_id`, `genres` is `[]`.

The vocabulary is **strictly separated**, as on TMDB: movies use only "movie" genres, series only "TV" genres.

### Movie genres (`movies[].genres[]`)
| Slug | TMDB |
|---|---|
| `action` | Action |
| `adventure` | Adventure |
| `animation` | Animation |
| `comedy` | Comedy |
| `crime` | Crime |
| `documentary` | Documentary |
| `drama` | Drama |
| `family` | Family |
| `fantasy` | Fantasy |
| `history` | History |
| `horror` | Horror |
| `music` | Music |
| `mystery` | Mystery |
| `romance` | Romance |
| `science-fiction` | Science Fiction |
| `thriller` | Thriller |
| `tv-movie` | TV Movie |
| `war` | War |
| `western` | Western |

### Series genres (`series[].genres[]`)
| Slug | TMDB |
|---|---|
| `action-adventure` | Action & Adventure |
| `animation` | Animation |
| `comedy` | Comedy |
| `crime` | Crime |
| `documentary` | Documentary |
| `drama` | Drama |
| `family` | Family |
| `kids` | Kids |
| `mystery` | Mystery |
| `news` | News |
| `reality` | Reality |
| `sci-fi-fantasy` | Sci-Fi & Fantasy |
| `soap` | Soap |
| `talk` | Talk |
| `war-politics` | War & Politics |
| `western` | Western |

> Any slug outside the list applicable to the entity is invalid. An unknown TMDB genre is **ignored** (never invented).

---

## 10. Enums

### `quality`
| Value | Typical source labels |
|---|---|
| `SD`     | SD, (none) |
| `HD`     | HD, 720p |
| `FHD`    | FHD, 1080p, FULL HD |
| `UHD_4K` | 4K, UHD, 2160p |
| `UHD_8K` | 8K, 4320p |
| `null`   | undetermined |

### `kind` (streams and categories)
`live` | `movie` | `series`

### `source.kind` (source family)
`api` | `m3u` | `m3u_plus`

---

## 11. `id` conventions

| Entity | Form | Slug base |
|---|---|---|
| channel | `ch:<slug>` | normalized name (no country/quality/punctuation) |
| movie | `movie:<stream_id>` | source-side stream id (stable) |
| series | `series:<slug>` | normalized series title |
| category | `<slug>` | original category label |

The slug: lowercase, ASCII, `[a-z0-9-]`, spaces → `-`, diacritics removed.

---

## 12. Nullable vs required (summary)

- **Always required**: `pjson_version`, `generated_at`, `source.kind`, `source.server`, every `*.id`, `*.kind`, `*.name`/`*.title`, `sources[].url`, `sources[].stream_id`.
- **Arrays are never null** (at worst `[]`): `category_ids`, `languages`, `countries`, `genres`, `sources`, `seasons`, `episodes`.
- **Nullable**: `logo`, `epg_id`, `poster`, `quality`, `quality_label`, `ext`, and every field marked "optional".
