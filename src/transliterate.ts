import Sanscript from "@indic-transliteration/sanscript";

/**
 * Transliterates IAST text into Devanagari using the Sanscript library.
 * It also performs any normalization needed before transliteration.
 */
export function transliterateIastToDevanagari(iastText: string): string {
    // Normalization: Muktabodha uses ##- or ## to indicate line breaks or page breaks.
    // In Sanscript, `##` is an escape toggle that TURNS OFF transliteration!
    // We must remove it before passing to Sanscript.
    const normalizedIast = iastText.replace(/##-?/g, "");
    return Sanscript.t(normalizedIast, 'iast', 'devanagari');
}
