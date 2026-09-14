# Semantic Enrichment Design

## Overview
The raw data processing pipeline transforms Muktabodha archives into Vyasa workspace text files (e.g. `.vy` files). Because the source text can contain numerous errors and often requires layered commentary structures, a robust "out-of-band" patching and enrichment system is necessary. 

Traditional text-based patches (like `.diff` or `git diff`) and standard JSON objects are insufficient for this domain. The raw text might be regenerated (due to improvements in the regex processor), invalidating line-based patches. Instead, we require a semantically rich enrichment process anchored entirely around structural **URNs** (Uniform Resource Names).

## URN-Anchored Enrichments
The Vyasa language structure naturally tags texts with logical blocks (Chapters, Verses, etc.). 
For example, in Yoga Vasistha, a root verse (Mula) might have the URN: `urn:vyasa:yv:1:1:1` (Part 1, Chapter 1, Verse 1).

### Design Principles

1. **Decoupling Content from Annotation:**
   The `process_yv.ts` script generates the base `.vy` files. Annotations (such as grammar corrections, dictionary links, or specific framing for interpolations) are stored in separate `.vy` enrichment files.

2. **URN Resolution:**
   Enrichments must specifically reference the URN of the block they modify. 
   ```vyasa
   `patch { target="urn:vyasa:yv:1:1:1" } [
       `note[This is a semantic addition to the verse.]
       `replace { search="samsara", with="saṃsāra" }
   ]
   ```
   *Note: Exact syntax to be aligned with the final `vyasac` compiler specification.*

3. **Layering Commentary:**
   Commentary streams (e.g., Tātparyaprakāśa) are processed into parallel files. To link a commentary block to its root verse, an enrichment URN map is used:
   ```vyasa
   `link { 
       source="urn:vyasa:yv:comm:1:1:1", 
       target="urn:vyasa:yv:mula:1:1:1", 
       type="commentary" 
   }
   ```

4. **Resilience to Text Regeneration:**
   By avoiding line numbers, if `process_yv.ts` adds new spaces or normalizes dandas differently in the future, the semantic URN patch still accurately targets the logical verse `1:1:1` and applies the semantic change or link.

## Implementation Steps (Next Phase)
- **Schema Definition:** Define the precise Vyasa syntax for `patch` and `link` commands.
- **Compiler Support:** Ensure `vyasac` can parse these out-of-band files and merge the ASTs based on URN targets before rendering the final HTML.
- **Editor Feedback Loop:** Design a Vyasa workspace UI feature that allows editors to easily create these URN-anchored patches without manually typing URNs.
