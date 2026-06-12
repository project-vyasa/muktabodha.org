import { mkdir } from "fs/promises";
import { join } from "path";

async function main() {
  console.log("Extraction script starting...");
  
  const rawDir = join(process.cwd(), "data", "raw");
  const devDir = join(rawDir, "DEV");
  const iastDir = join(rawDir, "IAST");

  await mkdir(devDir, { recursive: true });
  await mkdir(iastDir, { recursive: true });

  const devZip = join(process.cwd(), "data", "archives", "MUKTABODHA-LIBRARY-DEVANAGARI.zip");
  const iastZip = join(process.cwd(), "data", "archives", "MUKTABODHA-LIBRARY-IAST_2026_02_20.zip");

  console.log(`Extracting ${devZip} to ${devDir}...`);
  const devProc = Bun.spawn(["unzip", "-o", "-j", devZip, "-d", devDir]);
  const devExit = await devProc.exited;
  if (devExit === 0) {
    console.log(`Successfully extracted ${devZip}`);
  } else {
    console.error(`Error extracting ${devZip}, exit code: ${devExit}`);
  }

  console.log(`Extracting ${iastZip} to ${iastDir}...`);
  // Note: -x __MACOSX/* ignores the macOS metadata folder during extraction
  const iastProc = Bun.spawn(["unzip", "-o", "-j", iastZip, "-x", "__MACOSX/*", "-d", iastDir]);
  const iastExit = await iastProc.exited;
  if (iastExit === 0) {
    console.log(`Successfully extracted ${iastZip}`);
  } else {
    console.error(`Error extracting ${iastZip}, exit code: ${iastExit}`);
  }

  console.log("Extraction complete!");
}

main().catch(console.error);
