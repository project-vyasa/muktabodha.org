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
  let lastN = -1;
  let prologueCount = 0;
  let chaptersFlushed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    currentBlock.push(line);

    const match = line.match(/\|\|\s*([0-9०-९]+)\s*\|\|/);
    if (match) {
      const verseNumStr = match[1];
      const N = parseNum(verseNumStr);

      const cleanedBlock = currentBlock.filter(l => l.length > 0).join('\n');
      
      const isSarga = cleanedBlock.match(/sarga(ḥ|h|H)?\s*\|\||सर्गः?\s*\|\|/i);

      if (isSarga) {
        // This block is a colophon
        if (currentMula.size > 0 || currentComm.size > 0) {
           console.log(`Flushing Chapter ${N}. Mula: ${currentMula.size}, Comm: ${currentComm.size}`);
           chaptersFlushed++;
           currentMula.clear();
           currentComm.clear();
           lastN = -1;
           if (chaptersFlushed === 4) break;
        }
      } else {
        // Sequence restart detection (e.g. going from Prologue 24 back to 1)
        if (N === 1 && lastN > 1) {
           console.log(`Sequence restart detected! lastN was ${lastN}. Flushing as Prologue (Chapter 0).`);
           currentMula.clear();
           currentComm.clear();
           prologueCount++;
        }

        if (currentMula.has(N)) {
           // We already have mula, so this must be comm
           currentComm.set(N, cleanedBlock);
        } else {
           // This is mula
           currentMula.set(N, cleanedBlock);
        }
        lastN = N;
      }
      currentBlock = [];
    }
  }
}

testParse().catch(console.error);
