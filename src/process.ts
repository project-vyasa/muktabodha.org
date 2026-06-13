import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

function parseNum(str: string): number {
  const map: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const englishStr = str.split('').map(c => map[c] || c).join('');
  return parseInt(englishStr, 10);
}

function cleanVerseText(text: string): string {
    let cleaned = text;
    
    // 1. Strip the trailing verse numbers and surrounding dandas, e.g., "|| 1 ||" or "| 1 |"
    cleaned = cleaned.replace(/\|\|?\s*[0-9०-९]+\s*\|\|?\s*$/, '');

    // 2. Normalize inline double dandas to single dandas to avoid empty segments
    cleaned = cleaned.replace(/\|\|/g, '|');

    // 3. Replace square brackets with the `note[...] block to represent interpolations
    cleaned = cleaned.replace(/\[/g, '`note[');
    
    return cleaned.trim();
}

async function processFile(filePath: string, outputBaseDir: string, lang: string, partNumber: number) {
  let fileContent = "";
  try {
      fileContent = await Bun.file(filePath).text();
  } catch (e) {
      console.warn(`File not found or unreadable: ${filePath}`);
      return;
  }
  
  const lines = fileContent.split('\n');

  // Extract Metadata
  let metadataLines: string[] = [];
  let inMetadata = false;
  let metadataCount = 0;
  let lineIndex = 0;

  for (; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    if (line.includes("####################################################")) {
       inMetadata = !inMetadata;
       metadataLines.push(line);
       metadataCount++;
       if (metadataCount === 2) {
          lineIndex++;
          break; // done with metadata block
       }
    } else if (inMetadata || metadataCount === 1) {
       metadataLines.push(line);
    } else {
       continue; 
    }
  }

  // Save metadata per part
  if (metadataLines.length > 0) {
     const metaPath = join(outputBaseDir, "..", `metadata_${lang}_part${partNumber}.txt`);
     await writeFile(metaPath, metadataLines.join('\n'), "utf8");
  }

  let currentBlock: string[] = [];
  let currentMula = new Map<number, string>();
  let currentComm = new Map<number, string>();
  
  let lastN = -1;
  let currentChapter = 0; // We start at 0 for the prologue

  const flushChapter = async (chapNum: number) => {
    if (currentMula.size === 0 && currentComm.size === 0) return;
    
    // Prologue vs Chapter naming and directory
    const isProlog = chapNum === 0;
    const fileName = isProlog ? "prolog.vy" : `${chapNum}.vy`;
    
    // Mula stream
    if (currentMula.size > 0) {
      const mulaStreamDir = isProlog 
        ? join(outputBaseDir, `mula_${lang}`, partNumber.toString(), "frontmatter")
        : join(outputBaseDir, `mula_${lang}`, partNumber.toString());
      await mkdir(mulaStreamDir, { recursive: true });
      const mulaPath = join(mulaStreamDir, fileName);
      
      const blocks = Array.from(currentMula.entries()).sort((a,b) => a[0] - b[0]);
      let contentToWrite = blocks.map(([n, text]) => `\`v ${n} [\n${cleanVerseText(text)}\n]`).join("\n\n");
      
      if (isProlog) {
          contentToWrite = `\`set { scope="paratext" }\n\n` + contentToWrite;
      }
      
      await writeFile(mulaPath, contentToWrite, "utf8");
    }

    // Commentary stream
    if (currentComm.size > 0) {
      const commStreamDir = isProlog 
        ? join(outputBaseDir, `commentary_${lang}`, partNumber.toString(), "frontmatter")
        : join(outputBaseDir, `commentary_${lang}`, partNumber.toString());
      await mkdir(commStreamDir, { recursive: true });
      const commPath = join(commStreamDir, fileName);
      
      const blocks = Array.from(currentComm.entries()).sort((a,b) => a[0] - b[0]);
      let contentToWrite = blocks.map(([n, text]) => `\`v ${n} [\n${cleanVerseText(text)}\n]`).join("\n\n");
      
      if (isProlog) {
          contentToWrite = `\`set { scope="paratext" }\n\n` + contentToWrite;
      }
      
      await writeFile(commPath, contentToWrite, "utf8");
    }
  };

  for (; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    currentBlock.push(line);

    const match = line.match(/\|\|\s*([0-9०-९]+)\s*\|\|/);
    if (match) {
      const verseNumStr = match[1];
      const N = parseNum(verseNumStr);

      const cleanedBlock = currentBlock.filter(l => l.length > 0).join('\n');
      const isSarga = cleanedBlock.match(/sarga(ḥ|h|H)?\s*\|\||सर्गः?\s*\|\|/i);

      if (isSarga) {
        await flushChapter(currentChapter);
        currentMula.clear();
        currentComm.clear();
        lastN = -1;
        currentChapter = N + 1;
      } else {
        // Sequence restart logic
        if (N === 1 && lastN > 1) {
           await flushChapter(currentChapter);
           currentMula.clear();
           currentComm.clear();
           currentChapter = 1; 
        }

        if (currentMula.has(N)) {
           currentComm.set(N, cleanedBlock);
        } else {
           currentMula.set(N, cleanedBlock);
        }
        lastN = N;
      }
      currentBlock = [];
    }
  }
  
  await flushChapter(currentChapter);
  console.log(`Finished processing Part ${partNumber} for ${lang}`);
}

async function main() {
  const outputBase = join(process.cwd(), "data", "processed", "yogavasistha", "content");
  
  const parts = [
    { part: 1, id: "M00335" },
    { part: 2, id: "M00336" },
    { part: 3, id: "M00337" },
    { part: 4, id: "M00338" },
    { part: 5, id: "M00339" },
    { part: 6, id: "M00345" }
  ];

  for (const p of parts) {
      console.log(`\n--- Starting Part ${p.part} (${p.id}) ---`);
      const devFile = join(process.cwd(), "data", "raw", "DEV", `yogavAsiSTha part ${p.part} with commentary tAtparyaprakAza-${p.id}-DEV.txt`);
      const iastFile = join(process.cwd(), "data", "raw", "IAST", `yogavAsiSTha part ${p.part} with commentary tAtparyaprakAza-${p.id}-IAST.txt`);

      await processFile(devFile, outputBase, "devanagari", p.part);
      await processFile(iastFile, outputBase, "iast", p.part);
  }
}

main().catch(console.error);
