import { join } from "path";
import { readdir, readFile, writeFile } from "fs/promises";
import levenshtein from "fast-levenshtein";
import { transliterateIastToDevanagari } from "./transliterate";

/**
 * Parses a .vy file into a Map of verseNumber -> verseText
 */
export async function parseVyFile(filePath: string): Promise<Map<number, string>> {
  const content = await readFile(filePath, "utf8");
  const verses = new Map<number, string>();
  
  const regex = /`v\s+(\d+)\s+\[([\s\S]*?)\]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const verseNum = parseInt(match[1], 10);
    const verseText = match[2].trim();
    verses.set(verseNum, verseText);
  }
  
  return verses;
}

/**
 * Normalizes Devanagari text for comparison.
 * Removes spaces, newlines, dandas (| and ||), devanagari numbers, hyphens, and hashes.
 */
function normalizeDevanagari(text: string): string {
    return text
        .replace(/[\s\n\r|॥।0-9०-९-#]+/g, "")
        .trim();
}

async function verifyStream(iastDir: string, devDir: string, reportLines: string[], streamName: string) {
    let files: string[] = [];
    try {
        files = await readdir(iastDir);
    } catch (e) {
        reportLines.push(`[WARN] Could not read directory ${iastDir}`);
        return { total: 0, perfect: 0, mismatches: 0, missing: 0 };
    }
    
    reportLines.push(`\nStream: ${streamName}`);
    reportLines.push(`===================\n`);
    
    let totalVerses = 0;
    let perfectMatches = 0;
    let mismatchedVerses = 0;
    let missingVerses = 0;

    for (const file of files) {
        if (!file.endsWith('.vy')) continue;
        
        const chapStr = file.replace('.vy', '');
        
        const iastFile = join(iastDir, file);
        const devFile = join(devDir, file);
        
        let iastVerses = new Map<number, string>();
        let devVerses = new Map<number, string>();
        
        try {
            iastVerses = await parseVyFile(iastFile);
        } catch (e) {
            console.error(`Failed to read ${iastFile}`);
            continue;
        }
        
        try {
            devVerses = await parseVyFile(devFile);
        } catch (e) {
            // It's possible the devanagari stream is missing this file entirely
            devVerses = new Map<number, string>();
        }
        
        for (const [verseNum, iastText] of iastVerses.entries()) {
            totalVerses++;
            
            if (!devVerses.has(verseNum)) {
                missingVerses++;
                reportLines.push(`[MISSING] Chapter ${chapStr}, Verse ${verseNum} missing in Devanagari stream.`);
                continue;
            }
            
            const devText = devVerses.get(verseNum)!;
            
            const transliteratedDev = transliterateIastToDevanagari(iastText);
            
            const normTrans = normalizeDevanagari(transliteratedDev);
            const normDev = normalizeDevanagari(devText);
            
            const dist = levenshtein.get(normTrans, normDev);
            const maxLength = Math.max(normTrans.length, normDev.length);
            const diffPercent = maxLength === 0 ? 0 : (dist / maxLength) * 100;
            
            if (dist === 0) {
                perfectMatches++;
            } else {
                mismatchedVerses++;
                reportLines.push(`[MISMATCH] Chapter ${chapStr}, Verse ${verseNum} (Diff: ${dist} chars, ${diffPercent.toFixed(1)}%)`);
                reportLines.push(`  IAST        : ${iastText.replace(/\n/g, ' ')}`);
                reportLines.push(`  Translit(N) : ${normTrans}`);
                reportLines.push(`  Source(N)   : ${normDev}`);
                reportLines.push(`  Source      : ${devText.replace(/\n/g, ' ')}`);
                reportLines.push(`-`);
            }
        }
    }
    
    reportLines.push(`Stream Summary (${streamName}):`);
    reportLines.push(`  Total Verses Evaluated: ${totalVerses}`);
    reportLines.push(`  Perfect Matches       : ${perfectMatches}`);
    reportLines.push(`  Mismatches            : ${mismatchedVerses}`);
    reportLines.push(`  Missing in Source     : ${missingVerses}`);
    reportLines.push(`-------------------\n`);
    
    return {
        total: totalVerses,
        perfect: perfectMatches,
        mismatches: mismatchedVerses,
        missing: missingVerses
    };
}

async function main() {
    const baseDir = join(process.cwd(), "data", "processed", "yogavasistha");
    const contentDir = join(baseDir, "content");
    
    const parts = [1, 2, 3, 4, 5, 6];
    
    for (const part of parts) {
        console.log(`Verifying Part ${part}...`);
        const reportPath = join(baseDir, `audit_report_part${part}.txt`);
        const reportLines: string[] = [];
        reportLines.push(`Verification Report - Part ${part}`);
        
        let globalTotal = 0;
        let globalPerfect = 0;
        let globalMismatches = 0;
        let globalMissing = 0;
        
        // 1. Verify Mula
        const mulaIastDir = join(contentDir, "mula_iast", part.toString());
        const mulaDevDir = join(contentDir, "mula_devanagari", part.toString());
        const mulaStats = await verifyStream(mulaIastDir, mulaDevDir, reportLines, "Mula");
        globalTotal += mulaStats.total;
        globalPerfect += mulaStats.perfect;
        globalMismatches += mulaStats.mismatches;
        globalMissing += mulaStats.missing;
        
        // 2. Verify Commentary
        const commIastDir = join(contentDir, "commentary_iast", part.toString());
        const commDevDir = join(contentDir, "commentary_devanagari", part.toString());
        const commStats = await verifyStream(commIastDir, commDevDir, reportLines, "Commentary");
        globalTotal += commStats.total;
        globalPerfect += commStats.perfect;
        globalMismatches += commStats.mismatches;
        globalMissing += commStats.missing;
        
        // Global Summary at Top
        reportLines.splice(1, 0, `===================\nGlobal Summary:\n  Total Verses Evaluated: ${globalTotal}\n  Perfect Matches       : ${globalPerfect}\n  Mismatches            : ${globalMismatches}\n  Missing in Source     : ${globalMissing}\n-------------------\n`);
        
        await writeFile(reportPath, reportLines.join('\n'), "utf8");
        console.log(`Verification for Part ${part} complete. Perfect: ${globalPerfect}/${globalTotal}. Mismatches: ${globalMismatches}. Report saved to ${reportPath}`);
    }
}

main().catch(console.error);
