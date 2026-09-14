# Yogavasistha Vyasa Workspace

This directory contains the processed Vyasa workspace for the **Yogavasistha**, parsed from the Muktabodha Indological Research Institute archives.

## Content Streams

The text is divided into four distinct streams located in the `content/` directory to support both the original script and transliteration, as well as separate views for the mula verses and the commentary:

- `mula_devanagari/`: The core text (mula) in Devanagari script.
- `mula_iast/`: The core text (mula) transliterated into IAST.
- `commentary_devanagari/`: The *tātparyaprakāśa* commentary in Devanagari script.
- `commentary_iast/`: The *tātparyaprakāśa* commentary transliterated into IAST.

## Structure and Nesting

Because Yogavasistha is a massive work divided into six parts (Prakaranas), the chapters (Sargas) are nested under their respective part number (1 through 6) to prevent collisions.

For example, **Part 1 (Vairagya Prakaranam)** chapters are stored as:
`content/[stream]/1/[chapter_number].vy`

## Prologue and Metadata

- **Prologue (`prologue.vy`)**: The commentator's invocational prologue (typically the first 24 verses of the text) is cleanly separated from the core chapters and stored as `prologue.vy` inside the part directory. This prevents it from being incorrectly merged with Chapter 1.
- **Metadata (`metadata_*.txt`)**: The original source files contained a large metadata header block (enclosed in `###`). These blocks have been fully extracted and are saved as `metadata_devanagari_part[N].txt` and `metadata_iast_part[N].txt` in the root of this workspace for reference. They are not included in the `.vy` files.

## Transliteration and Verification Methodology

To ensure data integrity between the provided IAST and Devanagari raw files, a verification pass was executed across the text for both the Mula and Commentary streams across all 6 parts. Six separate audit reports (`audit_report_part[1-6].txt`) were generated.
1. **Transliteration**: The `@indic-transliteration/sanscript` package was used to programmatically map the IAST text back to standard Devanagari. Muktabodha's page break sequences (`##` or `##-`) were normalized beforehand as they act as escape sequences that turn off transliteration in the library.
2. **Comparison**: Using `fast-levenshtein`, the generated Devanagari was compared against the Muktabodha Devanagari reference text verse by verse. Whitespace, line breaks, Devanagari digits, and punctuation (Danda `|`, `||`, and `#`) were stripped from both strings prior to comparison.
3. **Findings**: A staggering 40,997 total verses (Mula + Commentary) were evaluated across all 6 parts. 40,303 verses matched perfectly (98.3% global accuracy). The mismatches logged in the audit reports typically reveal minor spelling or OCR errors in the source Muktabodha text (e.g., `sāhāyyaṃ` in IAST versus the misspelled `साहाययं` in the Devanagari text).
