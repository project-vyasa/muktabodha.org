# Compiler issue: logical stream refs in view templates

**Audience:** vyasac / vyasav agent  
**Publication:** Yogavasistha (`workspaces/yogavasistha`)  
**Status:** Workaround in place; root fix belongs in the toolchain

## Problem

Craft view templates (`reading.vy`, etc.) can reference streams by **logical id** from `vyasac.toml`:

```toml
[streams]
primary = { path = "content/mula_iast" }
commentary = { path = "content/commentary_iast" }
```

```vy
`stream { ref="primary" }
`stream { ref="commentary" }
```

At **weave time** (`vyasav` `weave_view_native`), substitution only matches `<stream ref="…">` placeholders against **runtime stream names** — the keys in the viewport row set / SQLite `streams.name` table (e.g. `mula_iast`, `commentary_iast`).

Refs that do not match a runtime name are **silently stripped** (see `wasm.rs`: “Clear out missing streams”). The woven HTML shows empty blocks with no error.

### Observed symptom

- Devanagari streams render (refs use runtime directory names: `mula_devanagari`, `commentary_devanagari`)
- IAST streams empty (refs used logical names: `primary`, `commentary`)

### Existing registry (pack side only)

`vyasac` builds a `StreamRegistry` (`packer.rs`) mapping logical → runtime:

| Logical | Runtime (YV) |
|---------|----------------|
| `primary` | `mula_iast` |
| `commentary` | `commentary_iast` |
| `mula_devanagari` | `mula_devanagari` |
| `commentary_devanagari` | `commentary_devanagari` |

This registry is used for vocabulary `localization { extend = "primary" }` merge, but **is not applied** when packing or weaving view template `<stream ref="…">` tags.

## Expected behavior

One of (in order of preference):

1. **Pack time:** Resolve logical refs to runtime names when compiling `html_templates` (reading item, etc.), using the same `StreamRegistry` as vocabulary.
2. **Weave time:** Pass `streams_config` / logical→runtime map in weave options; `weave_view_native` resolves refs before substitution.
3. **Manifest:** Emit `stream_aliases` JSON; viewer resolves before weave.

Publishers should be able to write `ref="primary"` and `ref="commentary"` consistently with TOML stream keys.

## Workaround (YV publisher)

`reading.vy` uses **runtime names** only:

```vy
`stream { ref="mula_iast" }
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
