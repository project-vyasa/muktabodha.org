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

**Potential Resolution:**
We could update the `process.ts` script to globally strip `##-` and `##`. However, if `##-` was used to split a word (e.g., `paramparā##-\n grahātigraha`), simply removing `##-` and the newline would cleanly join the word (`paramparāgrahātigraha`). We must be careful to ensure that stripping them does not inadvertently merge two distinct words if the hyphenation occurred between words rather than inside a single word.
