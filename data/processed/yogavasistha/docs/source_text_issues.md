# Source Text Issues Log

This file tracks linguistic, typographical, or formatting issues identified in the original raw text files (e.g., Muktabodha OCR/transcription artifacts) that may require future cleaning or manual intervention.

## 1. Page Break / Hyphenation Markers (`##-` and `##`)
**Location:** Widespread throughout the commentary streams (e.g., `commentary_iast/1/frontmatter/prolog.vy`).

**Description:**
The source texts contain literal `##-` or `##` sequences inline within words or sentences. These appear to be artifacts of the transcription process, likely representing page breaks or line hyphenation from the original print manuscript.

**Examples from Source (Part 1, Prologue):**
- `...duḥsvapnabhramaparamparā##-grahātigraha...`
- `...taṭasthasvarūpa##-jāayante...`

**Impact:**
Currently, these artifacts are preserved verbatim in the extracted `.vy` files. If they split a word in half, they will cause typographical errors in the final HTML projections and may interfere with dictionary lookups or NLP tools. 

**Potential Resolution (Implemented):**
The `process.ts` script now globally strips `##-` and `##` artifacts from the text. This cleanly joins the words that were split by hyphenation without losing characters, preserving text integrity.

## 2. Stray Backticks (Compiler Conflicts)
**Location:** `content/mula_iast/6/36.vy` (Line 9: `nirj`neyajñeyarūpiṇī`)

**Description:**
The source text pipeline accidentally injected or preserved a single backtick (`` ` ``) in the middle of a Sanskrit word. Because the Vyasa parser specifically relies on backticks as the control character to initiate semantic commands, a stray backtick immediately triggers an `Unknown command` parsing error (e.g., `Unknown command: 'neyaj'`).

**Potential Resolution (Implemented):**
The `process.ts` pipeline script now aggressively sanitizes and escapes stray backticks (`` ` ``) by replacing them with single quotes (`'`) before outputting the `.vy` format. This successfully unblocks compilation.
