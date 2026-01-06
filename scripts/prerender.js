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
  '/grammatik/a1/wortstellung-regeln-lernen',
  '/grammatik/a1/praesens-gegenwart-deutsch',
  '/grammatik/a1/imperativ-befehlsform-deutsch',
  '/grammatik/a1/artikel-nominativ-der-die-das',
  '/grammatik/a1/personalpronomen-nominativ-ich-du-er',
  '/grammatik/a1/pluralbildung-plural-deutsch-lernen',
  '/grammatik/a1/lokale-praepositionen-ort-deutsch',
  '/grammatik/a1/temporale-praepositionen-zeit-deutsch',
  '/grammatik/a1/adjektive-grundform-deutsch',

  // Grammar topic pages - A2
  '/grammatik/a2/komplexe-saetze-nebensaetze-deutsch',
  '/grammatik/a2/perfekt-praeteritum-vergangenheit-deutsch',
  '/grammatik/a2/modalverben-koennen-muessen-wollen-deutsch',
  '/grammatik/a2/trennbare-verben-aufstehen-einkaufen',
  '/grammatik/a2/pronomen-akkusativ-dativ-deutsch',
  '/grammatik/a2/artikel-kasus-vier-faelle-deutsch',
  '/grammatik/a2/praepositionen-ort-richtung-wo-wohin',
  '/grammatik/a2/adjektivdeklination-einstieg-endungen',
  '/grammatik/a2/komparativ-superlativ-steigerung-adjektive',

  // Grammar topic pages - B1
  '/grammatik/b1/nebensaetze-konjunktionen-weil-dass-obwohl',
  '/grammatik/b1/relativsaetze-relativpronomen-deutsch',
  '/grammatik/b1/indirekte-fragen-ob-wann-wo-wie',
  '/grammatik/b1/futur-1-zukunft-deutsch-werden',
  '/grammatik/b1/modalverben-praeteritum-konnte-musste',
  '/grammatik/b1/konjunktiv-2-wuensche-hoeflichkeit',
  '/grammatik/b1/reflexive-verben-sich-freuen-erinnern',
  '/grammatik/b1/verben-mit-praeposition-warten-auf-denken-an',
  '/grammatik/b1/wechselpraepositionen-wo-wohin-dativ-akkusativ',
  '/grammatik/b1/praepositionen-ort-zeit-kombiniert',
  '/grammatik/b1/adjektivdeklination-nominativ-akkusativ-b1',
  '/grammatik/b1/passiv-einstieg-vorgangspassiv-werden',

  // Grammar topic pages - B2
  '/grammatik/b2/infinitivsaetze-um-zu-ohne-zu',
  '/grammatik/b2/konjunktiv-2-irreale-bedingungen-wenn',
  '/grammatik/b2/indirekte-rede-konjunktiv-1-2',
  '/grammatik/b2/nomen-verb-verbindungen-funktionsverben',
  '/grammatik/b2/feste-praepositionen-rektion-verben-nomen',
  '/grammatik/b2/adjektivdeklination-komplett-alle-faelle',
  '/grammatik/b2/passiv-vertieft-zustandspassiv-modalverben',
  '/grammatik/b2/nominalisierung-nominalphrasen-verben-adjektive',
  '/grammatik/b2/genitiv-erweiterung-genitivattribute',

  // Grammar topic pages - C1
  '/grammatik/c1/komplexer-satzbau-mehrfache-einbettung',
  '/grammatik/c1/konjunktiv-1-berichtssprache-journalismus',
  '/grammatik/c1/funktionsverbgefuege-gehobene-sprache',
  '/grammatik/c1/feste-verbindungen-idiome-kollokationen',
  '/grammatik/c1/verben-mit-praeposition-fortgeschritten-c1',
  '/grammatik/c1/komplexe-praepositionsausdruecke-mehrteilig',
  '/grammatik/c1/adjektivdeklination-komplex-nominalgruppen',
  '/grammatik/c1/passiv-komplex-ersatzformen-unpersoenlich',
  '/grammatik/c1/nominalstil-informationsverdichtung',
  '/grammatik/c1/partizipialkonstruktionen-erweiterte-attribute',
  '/grammatik/c1/genitiv-gehobene-sprache-genitivketten',
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
