import { writeFile, readFile } from "fs/promises";
import { join } from "path";
// @ts-ignore
import Sanscript from "@indic-transliteration/sanscript";

function parseNum(str: string): number {
  const map: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const englishStr = str.split('').map(c => map[c] || c).join('');
  return parseInt(englishStr, 10);
}

function titleCaseIast(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function extractMetadata() {
  const parts = [
    { part: 1, id: "M00335", titleDeva: "वैराग्यप्रकरणम्", titleIast: "Vairāgya-prakaraṇam" },
    { part: 2, id: "M00336", titleDeva: "मुमुक्षुव्यवहारप्रकरणम्", titleIast: "Mumukṣuvyahāra-prakaraṇam" },
    { part: 3, id: "M00337", titleDeva: "उत्पत्तिप्रकरणम्", titleIast: "Utpatti-prakaraṇam" },
    { part: 4, id: "M00338", titleDeva: "स्थितिप्रकरणम्", titleIast: "Sthiti-prakaraṇam" },
    { part: 5, id: "M00339", titleDeva: "उपशमप्रकरणम्", titleIast: "Upaśama-prakaraṇam" },
    { part: 6, id: "M00345", titleDeva: "निर्वाणप्रकरणम्", titleIast: "Nirvāṇa-prakaraṇam" }
  ];

  const metadata: any = {
    corpus: "yogavasistha",
    title: {
      devanagari: "योगवासिष्ठम्",
      iast: "Yogavāsiṣṭham"
    },
    books: {}
  };

  for (const p of parts) {
    const bookKey = p.part.toString();
    metadata.books[bookKey] = {
      title: {
        devanagari: p.titleDeva,
        iast: p.titleIast
      },
      chapters: p.part === 1 ? {
        "1": {
          title: {
            devanagari: "सुतीक्ष्णागस्त्यसंवादः",
            iast: "Sutīkṣṇāgastya-saṃvādaḥ"
          }
        }
      } : {}
    };

    const devFile = join(process.cwd(), "data", "raw", "DEV", `yogavAsiSTha part ${p.part} with commentary tAtparyaprakAza-${p.id}-DEV.txt`);
    try {
      const content = await readFile(devFile, "utf8");
      const lines = content.split('\n');

      for (const line of lines) {
        // Look for colophons like: "सूत्रपातनको नाम द्वितीयः सर्गः || २ ||"
        const match = line.match(/(?:इति\s+.*?||\s*)(.*?)\s+नाम\s+.*?(?:सर्गः|सर्गः\s*\|\|)\s*\|\|\s*([0-9०-९]+)\s*\|\|/);
        if (match) {
          let rawTitle = match[1].trim();
          // Remove leading "इति श्री..." if captured
          rawTitle = rawTitle.replace(/^इति\s+.*?(?:प्रकरणे|सारे|वाल्मीकीये|मोक्षोपाये)\s*/, '').trim();
          rawTitle = rawTitle.replace(/^इति\s+/, '').trim();
          const chapNum = parseNum(match[2]);

          if (rawTitle && chapNum > 0 && !metadata.books[bookKey].chapters[chapNum]) {
            const devaTitle = rawTitle;
            const iastTitle = titleCaseIast(Sanscript.t(devaTitle, "devanagari", "iast"));

            metadata.books[bookKey].chapters[chapNum.toString()] = {
              title: {
                devanagari: devaTitle,
                iast: iastTitle
              }
            };
          }
        }
      }
    } catch (e) {
      console.warn(`Could not read ${devFile}:`, e);
    }
  }

  const outPath = join(process.cwd(), "data", "metadata", "yogavasistha", "metadata.json");
  await writeFile(outPath, JSON.stringify(metadata, null, 2), "utf8");
  console.log(`Successfully extracted metadata to ${outPath}`);
}

extractMetadata().catch(console.error);
