# Compiler issue: logical stream refs in view templates

**Audience:** vyasac / vyasav agent  
**Publication:** Yogavasistha (`workspaces/yogavasistha`)  
**Status:** Packed id is the `content/<folder>` name. Stream facts live in each folder’s `stream.toml`. `[build.default] streams` lists those folder names. Templates use packed names (`mula`, `root`, …); `ref="primary"` is a pack-time alias for the stream with `primary = true`.

## Problem

Craft view templates (`reading.vy`, etc.) can reference streams by **logical id** from `vyasac.toml`:

```toml
# content/mula/stream.toml
language = "sa"
script = "Deva"
kind = "source"
primary = true
```

```toml
# content/commentary_iast/stream.toml
kind = "commentary"
# ...
```

```vy
`stream { ref="primary" }
`stream { ref="commentary" }
```

At **weave time** (`vyasav` `weave_view_native`), substitution only matches `<stream ref="…">` placeholders against **runtime stream names** — the keys in the viewport row set / SQLite `streams.name` table (e.g. `mula`, `root`, `commentary_iast`).

Refs that do not match a runtime name are **silently stripped** (see `wasm.rs`: “Clear out missing streams”). The woven HTML shows empty blocks with no error.

### Observed symptom (historical)

- Devanagari streams render when refs use runtime directory names
- IAST streams empty when refs used logical names only (`primary`, `commentary`) without pack-time rewrite

### Existing registry (pack side only)

`vyasac` builds a `StreamRegistry` (`packer.rs`) mapping logical → runtime:

| Logical | Runtime (YV) |
|---------|----------------|
| `primary` | `mula` (`primary = true` in `content/mula/stream.toml`) |
| `commentary` | `commentary_iast` |
| `root` | `root` |
| `commentary_devanagari` | `commentary_devanagari` |

This registry is used for vocabulary `localization { extend = "primary" }` merge, but **is not applied** when packing or weaving view template `<stream ref="…">` tags (unless pack rewrites refs).

## Expected behavior

One of (in order of preference):

1. **Pack time:** Resolve logical refs to runtime names when compiling `html_templates` (reading item, etc.), using the same `StreamRegistry` as vocabulary.
2. **Weave time:** Pass `streams_config` / logical→runtime map in weave options; `weave_view_native` resolves refs before substitution.
3. **Manifest:** Emit `stream_aliases` JSON; viewer resolves before weave.

Publishers should be able to write `ref="primary"` and `ref="commentary"` consistently with TOML stream keys.

## Workaround (YV publisher)

`reading.vy` uses **runtime names** only:

```vy
`stream { ref="mula" }
`stream { ref="root" }
`stream { ref="commentary_devanagari" }
`stream { ref="commentary_iast" }
```

Same pattern as vyasa-bg (`ref="mula"`, `ref="iast"` — directory names, not `primary`).

## Verification

After fix:

```bash
vyasac pack workspaces/yogavasistha
vyasac inspect --urn 1:5:1 workspaces/yogavasistha/build/yogavasistha.vyview
```

Reading view at `1:5:1` should show all four streams when template uses logical refs.

## Related files

- `vyasa/vyasac/src/packer.rs` — `StreamRegistry`
- `vyasa/vyasav/src/wasm.rs` — `weave_view_native` stream ref substitution (~lines 467–512)
- `vyasa-apps/docs/guides/view-templates-guide.md` — view template contract
