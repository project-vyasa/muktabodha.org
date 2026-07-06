import { join } from "path";

function parseNum(str: string): number {
  const map: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const englishStr = str.split('').map(c => map[c] || c).join('');
  return parseInt(englishStr, 10);
}

async function testParse() {
  const iastFile = join(process.cwd(), "data", "raw", "IAST", "yogavAsiSTha part 1 with commentary tAtparyaprakAza-M00335-IAST.txt");
  const fileContent = await Bun.file(iastFile).text();
  const lines = fileContent.split('\n');

  let currentBlock: string[] = [];
  let currentMula = new Map<number, string>();
  let currentComm = new Map<number, string>();
  
  let chaptersFlushed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    currentBlock.push(line);

    const match = line.match(/\|\|\s*([0-9०-९]+)\s*\|\|/);
    if (match) {
      const verseNumStr = match[1];
      const verseNum = parseNum(verseNumStr);

      const cleanedBlock = currentBlock.filter(l => l.length > 0).join('\n');
      
      const isSarga = cleanedBlock.match(/sarga(ḥ|h|H)?\s*\|\||सर्गः?\s*\|\|/i);

      if (isSarga) {
        if (currentMula.size > 0 || currentComm.size > 0) {
           console.log(`Flushing Chapter ${verseNum}. Mula count: ${currentMula.size}, Comm count: ${currentComm.size}`);
           chaptersFlushed++;
           currentMula.clear();
           currentComm.clear();
           if (chaptersFlushed === 4) break;
        }
      } else {
        if (currentMula.has(verseNum)) {
          // If we already have a Mula and a Comm for this verse, it means the verse numbering reset without a Sarga colophon?
          if (currentComm.has(verseNum)) {
             console.log(`WARNING: Verse ${verseNum} already has Mula and Comm! Overwriting Comm.`);
          }
          currentComm.set(verseNum, cleanedBlock);
        } else {
          // Detect prologue vs actual start
          // If we are adding verse 1, but we already have verse 20 in the map, and no commentary for verse 20, 
          // it means the previous stuff was prologue.
          if (verseNum === 1 && currentMula.size > 10 && currentComm.size === 0) {
             console.log("Detected prologue, clearing Mula map.");
             currentMula.clear();
          }
          currentMula.set(verseNum, cleanedBlock);
        }
      }
      currentBlock = [];
    }
  }
}

testParse().catch(console.error);
