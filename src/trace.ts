import { join } from "path";

function parseNum(str: string): number {
  const map: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const englishStr = str.split('').map(c => map[c] || c).join('');
  return parseInt(englishStr, 10);
}

async function dumpFlow() {
  const iastFile = join(process.cwd(), "data", "raw", "IAST", "yogavAsiSTha part 1 with commentary tAtparyaprakAza-M00335-IAST.txt");
  const fileContent = await Bun.file(iastFile).text();
  const lines = fileContent.split('\n');

  let currentBlock: string[] = [];
  let currentChapter = 0;
  let lastN = -1;
  let mCount = 0, cCount = 0;

  for (let i = 0; i < 2000; i++) {
    const line = lines[i].trim();
    currentBlock.push(line);

    const match = line.match(/\|\|\s*([0-9०-९]+)\s*\|\|/);
    if (match) {
      const N = parseNum(match[1]);
      const cleanedBlock = currentBlock.filter(l => l.length > 0).join('\n');
      
      const isSarga = cleanedBlock.match(/sarga(ḥ|h|H)?\s*\|\||सर्गः?\s*\|\|/i);
      
      if (isSarga) {
         console.log(`[COLOPHON] N=${N} Block: ${cleanedBlock.replace(/\n/g, ' ')}`);
         console.log(` -> Flushing Chapter ${currentChapter} (mCount: ${mCount}, cCount: ${cCount})`);
         mCount = 0; cCount = 0;
         lastN = -1;
         currentChapter = N + 1;
         console.log(` -> Next Chapter will be ${currentChapter}`);
      } else {
         if (N === 1 && lastN > 1) {
             console.log(`[RESTART] Sequence restart detected! lastN was ${lastN}.`);
             console.log(` -> Flushing Chapter ${currentChapter} (mCount: ${mCount}, cCount: ${cCount})`);
             mCount = 0; cCount = 0;
             currentChapter = 1;
             console.log(` -> Next Chapter will be ${currentChapter}`);
         }
         
         if (N === 1) {
            console.log(`[VERSE 1] Ch:${currentChapter} Block starts with: ${currentBlock[0]}`);
         }
         
         // just counting for logs
         mCount++;
         lastN = N;
      }
      currentBlock = [];
    }
  }
}

dumpFlow().catch(console.error);
