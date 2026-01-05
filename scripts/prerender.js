import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages to prerender for SEO
const PAGES = [
  // Main pages
  '/grammatik',
  '/pruefungszentren',

  // Grammar level pages
  '/grammatik/a1',
  '/grammatik/a2',
  '/grammatik/b1',
  '/grammatik/b2',
  '/grammatik/c1',

  // Grammar category pages
  '/grammatik/thema/satzbau',
  '/grammatik/thema/zeiten',
  '/grammatik/thema/verben',
  '/grammatik/thema/nomen',
  '/grammatik/thema/kasus',
  '/grammatik/thema/adjektive',
  '/grammatik/thema/passiv',
  '/grammatik/thema/genitiv',

  // Grammar topic pages - A1
  '/grammatik/a1/wortstellung',
  '/grammatik/a1/praesens',
  '/grammatik/a1/imperativ',
  '/grammatik/a1/artikel-nominativ',
  '/grammatik/a1/personalpronomen-nominativ',
  '/grammatik/a1/pluralbildung',
  '/grammatik/a1/praepositionen-ort',
  '/grammatik/a1/zeitpraepositionen',
  '/grammatik/a1/adjektive-grundform',

  // Grammar topic pages - A2
  '/grammatik/a2/komplexe-saetze',
  '/grammatik/a2/perfekt-praeteritum',
  '/grammatik/a2/modalverben',
  '/grammatik/a2/trennbare-verben',
  '/grammatik/a2/pronomen-grundlagen',
  '/grammatik/a2/artikel-kasus',
  '/grammatik/a2/praepositionen-ort-richtung',
  '/grammatik/a2/adjektivdeklination-einstieg',
  '/grammatik/a2/komparativ-superlativ',

  // Grammar topic pages - B1
  '/grammatik/b1/nebensaetze-konjunktionen',
  '/grammatik/b1/relativsaetze',
  '/grammatik/b1/indirekte-fragen',
  '/grammatik/b1/futur',
  '/grammatik/b1/modalverben-praeteritum',
  '/grammatik/b1/konjunktiv-2',
  '/grammatik/b1/reflexive-verben',
  '/grammatik/b1/verben-mit-praeposition',
  '/grammatik/b1/wechselpraepositionen-wo-wohin',
  '/grammatik/b1/praepositionen-ort-zeit',
  '/grammatik/b1/adjektivdeklination-nom-akk',
  '/grammatik/b1/passiv-einstieg',

  // Grammar topic pages - B2
  '/grammatik/b2/infinitivsaetze',
  '/grammatik/b2/konjunktiv-2-konditionalsaetze',
  '/grammatik/b2/indirekte-rede',
  '/grammatik/b2/nomen-verb-verbindungen',
  '/grammatik/b2/feste-praeposition-rektion',
  '/grammatik/b2/adjektivdeklination-system-komplett',
  '/grammatik/b2/passiv-vertieft',
  '/grammatik/b2/nominalisierung',
  '/grammatik/b2/genitiv-erweiterung',

  // Grammar topic pages - C1
  '/grammatik/c1/komplexer-satzbau',
  '/grammatik/c1/konjunktiv-1-berichtssprache',
  '/grammatik/c1/funktionsverbgefuege',
  '/grammatik/c1/feste-verbindungen',
  '/grammatik/c1/verben-mit-praeposition-advanced',
  '/grammatik/c1/komplexe-praepositionsausdruecke',
  '/grammatik/c1/adjektivdeklination-komplex',
  '/grammatik/c1/passiv-komplex',
  '/grammatik/c1/nominalstil',
  '/grammatik/c1/partizipialkonstruktionen',
  '/grammatik/c1/genitiv-gehobene-sprache',
];

async function prerender() {
  console.log('Starting prerender process...');

  const distDir = path.resolve(__dirname, '../dist');

  // Start a local server to serve the built app
  console.log('Starting preview server...');
  const server = await createServer({
    root: distDir,
    server: { port: 4173 },
    configFile: false,
  });

  await server.listen();
  const baseUrl = 'http://localhost:4173';
  console.log(`Preview server running at ${baseUrl}`);

  // Launch browser
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1920, height: 1080 });

    // Prerender each page
    for (const pagePath of PAGES) {
      console.log(`Prerendering ${pagePath}...`);

      try {
        const url = `${baseUrl}${pagePath}`;

        // Navigate and wait for page to be fully loaded
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 30000,
        });

        // Wait a bit more for React to hydrate
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the rendered HTML
        const html = await page.content();

        // Determine output path
        let outputPath;
        if (pagePath === '/') {
          outputPath = path.join(distDir, 'index.html');
        } else {
          const dirPath = path.join(distDir, pagePath);
          fs.mkdirSync(dirPath, { recursive: true });
          outputPath = path.join(dirPath, 'index.html');
        }

        // Write the HTML
        fs.writeFileSync(outputPath, html);
        console.log(`✓ Saved: ${outputPath}`);
      } catch (error) {
        console.error(`✗ Failed to prerender ${pagePath}:`, error.message);
      }
    }

    console.log('\nPrerendering complete!');
  } finally {
    await browser.close();
    await server.close();
  }
}

// Run the prerender
prerender().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
