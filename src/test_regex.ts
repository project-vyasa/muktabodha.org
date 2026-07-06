const texts = [
  "śivamakhilahṛdi sphuratsvamāyāvikasitaviśvavilāsamānatāḥ smaḥ || 1 ||",
  "This is a test | 12 |",
  "Something else || ३४ ||",
  "End of sargaḥ ||"
];

for (const t of texts) {
  const cleaned = t.replace(/\|\|?\s*[0-9०-९]+\s*\|\|?\s*$/, '').trim();
  console.log(`'${t}' -> '${cleaned}'`);
}
