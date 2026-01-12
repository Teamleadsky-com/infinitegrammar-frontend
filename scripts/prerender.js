import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages to prerender for SEO - using NEW /deutsche-grammatik/ URL structure
const PAGES = [
  // Main pages
  '/deutsche-grammatik',
  '/pruefungszentren',

  // Grammar level pages (with -niveau-lernen suffix)
  '/deutsche-grammatik/a1-niveau-lernen',
  '/deutsche-grammatik/a2-niveau-lernen',
  '/deutsche-grammatik/b1-niveau-lernen',
  '/deutsche-grammatik/b2-niveau-lernen',
  '/deutsche-grammatik/c1-niveau-lernen',

  // Grammar category pages
  '/deutsche-grammatik/thema/satzbau',
  '/deutsche-grammatik/thema/zeiten',
  '/deutsche-grammatik/thema/verben',
  '/deutsche-grammatik/thema/nomen',
  '/deutsche-grammatik/thema/kasus',
  '/deutsche-grammatik/thema/adjektive',
  '/deutsche-grammatik/thema/passiv',
  '/deutsche-grammatik/thema/genitiv',

  // Grammar topic pages - A1
  '/deutsche-grammatik/a1-niveau-lernen/wortstellung-regeln-lernen',
  '/deutsche-grammatik/a1-niveau-lernen/praesens-gegenwart-deutsch',
  '/deutsche-grammatik/a1-niveau-lernen/imperativ-befehlsform-deutsch',
  '/deutsche-grammatik/a1-niveau-lernen/artikel-nominativ-der-die-das',
  '/deutsche-grammatik/a1-niveau-lernen/personalpronomen-nominativ-ich-du-er',
  '/deutsche-grammatik/a1-niveau-lernen/pluralbildung-plural-deutsch-lernen',
  '/deutsche-grammatik/a1-niveau-lernen/lokale-praepositionen-ort-deutsch',
  '/deutsche-grammatik/a1-niveau-lernen/temporale-praepositionen-zeit-deutsch',
  '/deutsche-grammatik/a1-niveau-lernen/adjektive-grundform-deutsch',

  // Grammar topic pages - A2
  '/deutsche-grammatik/a2-niveau-lernen/komplexe-saetze-nebensaetze-deutsch',
  '/deutsche-grammatik/a2-niveau-lernen/perfekt-praeteritum-vergangenheit-deutsch',
  '/deutsche-grammatik/a2-niveau-lernen/modalverben-koennen-muessen-wollen-deutsch',
  '/deutsche-grammatik/a2-niveau-lernen/trennbare-verben-aufstehen-einkaufen',
  '/deutsche-grammatik/a2-niveau-lernen/pronomen-akkusativ-dativ-deutsch',
  '/deutsche-grammatik/a2-niveau-lernen/artikel-kasus-vier-faelle-deutsch',
  '/deutsche-grammatik/a2-niveau-lernen/praepositionen-ort-richtung-wo-wohin',
  '/deutsche-grammatik/a2-niveau-lernen/adjektivdeklination-einstieg-endungen',
  '/deutsche-grammatik/a2-niveau-lernen/komparativ-superlativ-steigerung-adjektive',

  // Grammar topic pages - B1
  '/deutsche-grammatik/b1-niveau-lernen/nebensaetze-konjunktionen-weil-dass-obwohl',
  '/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch',
  '/deutsche-grammatik/b1-niveau-lernen/indirekte-fragen-ob-wann-wo-wie',
  '/deutsche-grammatik/b1-niveau-lernen/futur-1-zukunft-deutsch-werden',
  '/deutsche-grammatik/b1-niveau-lernen/modalverben-praeteritum-konnte-musste',
  '/deutsche-grammatik/b1-niveau-lernen/konjunktiv-2-wuensche-hoeflichkeit',
  '/deutsche-grammatik/b1-niveau-lernen/reflexive-verben-sich-freuen-erinnern',
  '/deutsche-grammatik/b1-niveau-lernen/verben-mit-praeposition-warten-auf-denken-an',
  '/deutsche-grammatik/b1-niveau-lernen/wechselpraepositionen-wo-wohin-dativ-akkusativ',
  '/deutsche-grammatik/b1-niveau-lernen/praepositionen-ort-zeit-kombiniert',
  '/deutsche-grammatik/b1-niveau-lernen/adjektivdeklination-nominativ-akkusativ-b1',
  '/deutsche-grammatik/b1-niveau-lernen/passiv-einstieg-vorgangspassiv-werden',

  // Grammar topic pages - B2
  '/deutsche-grammatik/b2-niveau-lernen/infinitivsaetze-um-zu-ohne-zu',
  '/deutsche-grammatik/b2-niveau-lernen/konjunktiv-2-irreale-bedingungen-wenn',
  '/deutsche-grammatik/b2-niveau-lernen/indirekte-rede-konjunktiv-1-2',
  '/deutsche-grammatik/b2-niveau-lernen/nomen-verb-verbindungen-funktionsverben',
  '/deutsche-grammatik/b2-niveau-lernen/feste-praepositionen-rektion-verben-nomen',
  '/deutsche-grammatik/b2-niveau-lernen/adjektivdeklination-komplett-alle-faelle',
  '/deutsche-grammatik/b2-niveau-lernen/passiv-vertieft-zustandspassiv-modalverben',
  '/deutsche-grammatik/b2-niveau-lernen/nominalisierung-nominalphrasen-verben-adjektive',
  '/deutsche-grammatik/b2-niveau-lernen/genitiv-erweiterung-genitivattribute',

  // Grammar topic pages - C1
  '/deutsche-grammatik/c1-niveau-lernen/komplexer-satzbau-mehrfache-einbettung',
  '/deutsche-grammatik/c1-niveau-lernen/konjunktiv-1-berichtssprache-journalismus',
  '/deutsche-grammatik/c1-niveau-lernen/funktionsverbgefuege-gehobene-sprache',
  '/deutsche-grammatik/c1-niveau-lernen/feste-verbindungen-idiome-kollokationen',
  '/deutsche-grammatik/c1-niveau-lernen/verben-mit-praeposition-fortgeschritten-c1',
  '/deutsche-grammatik/c1-niveau-lernen/komplexe-praepositionsausdruecke-mehrteilig',
  '/deutsche-grammatik/c1-niveau-lernen/adjektivdeklination-komplex-nominalgruppen',
  '/deutsche-grammatik/c1-niveau-lernen/passiv-komplex-ersatzformen-unpersoenlich',
  '/deutsche-grammatik/c1-niveau-lernen/nominalstil-informationsverdichtung',
  '/deutsche-grammatik/c1-niveau-lernen/partizipialkonstruktionen-erweiterte-attribute',
  '/deutsche-grammatik/c1-niveau-lernen/genitiv-gehobene-sprache-genitivketten',
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
