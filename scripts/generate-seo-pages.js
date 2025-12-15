import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO content for each page
const SEO_PAGES = {
  '/pruefungszentren': {
    title: 'telc & TestDaF Prüfungszentren finden (VHS, Unis, Institute) | Infinite Grammar',
    description: 'Finde telc- und TestDaF-Prüfungszentren in Deutschland: VHS, Uni-Sprachzentren, Goethe-Institut & mehr. Mit Links, Tipps zur Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren',
  },
  '/pruefungszentren/telc-berlin': {
    title: 'telc Prüfungszentren in Berlin – Termine & Anmeldung | Infinite Grammar',
    description: 'Finde telc-Prüfungszentren in Berlin: VHS, Sprachschulen & Institute. Mit Tipps zur Anmeldung und Links zu offiziellen Terminen.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-berlin',
  },
  '/pruefungszentren/testdaf-berlin': {
    title: 'TestDaF Prüfungszentren in Berlin – Termine & Vorbereitung | Infinite Grammar',
    description: 'TestDaF in Berlin ablegen: Uni-Sprachzentren, Goethe-Institut & mehr. Termine, Anmeldung und Tipps zur Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-berlin',
  },
  '/pruefungszentren/telc-muenchen': {
    title: 'telc Prüfungszentren in München – VHS, Berlitz & mehr | Infinite Grammar',
    description: 'telc-Prüfungen in München: Finde Termine bei VHS, Berlitz, Inlingua und Goethe-Institut. Tipps zur Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-muenchen',
  },
  '/pruefungszentren/testdaf-muenchen': {
    title: 'TestDaF Prüfungszentren in München – Uni & Institute | Infinite Grammar',
    description: 'TestDaF in München: LMU, TU München, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für deine TestDaF-Prüfung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-muenchen',
  },
  '/pruefungszentren/telc-hamburg': {
    title: 'telc Prüfungszentren in Hamburg – VHS & Sprachschulen | Infinite Grammar',
    description: 'telc-Prüfungen in Hamburg: VHS Hamburg, Berlitz, Goethe-Institut. Termine finden, anmelden und optimal vorbereiten.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-hamburg',
  },
  '/pruefungszentren/testdaf-hamburg': {
    title: 'TestDaF Prüfungszentren in Hamburg – Uni & Institute | Infinite Grammar',
    description: 'TestDaF in Hamburg ablegen: Universität Hamburg, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-hamburg',
  },
  '/pruefungszentren/telc-koeln': {
    title: 'telc Prüfungszentren in Köln – VHS & mehr | Infinite Grammar',
    description: 'telc-Prüfungen in Köln: VHS, Sprachschulen, Goethe-Institut. Termine, Anmeldung und Tipps für deine telc-Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-koeln',
  },
  '/pruefungszentren/testdaf-koeln': {
    title: 'TestDaF Prüfungszentren in Köln – Uni & Institute | Infinite Grammar',
    description: 'TestDaF in Köln: Universität zu Köln, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und gezielter Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-koeln',
  },
  '/pruefungszentren/telc-frankfurt': {
    title: 'telc Prüfungszentren in Frankfurt – VHS & Goethe-Institut | Infinite Grammar',
    description: 'telc-Prüfungen in Frankfurt: VHS, Goethe-Institut und Sprachschulen. Termine finden, anmelden und vorbereiten.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-frankfurt',
  },
  '/pruefungszentren/testdaf-frankfurt': {
    title: 'TestDaF Prüfungszentren in Frankfurt – Goethe-Universität & mehr | Infinite Grammar',
    description: 'TestDaF in Frankfurt: Goethe-Universität, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für den TestDaF.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-frankfurt',
  },
  '/pruefungszentren/telc-stuttgart': {
    title: 'telc Prüfungszentren in Stuttgart – VHS, Berlitz & mehr | Infinite Grammar',
    description: 'telc-Prüfungen in Stuttgart: VHS, Berlitz, Inlingua, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-stuttgart',
  },
  '/pruefungszentren/testdaf-stuttgart': {
    title: 'TestDaF Prüfungszentren in Stuttgart – Uni & Institute | Infinite Grammar',
    description: 'TestDaF in Stuttgart: Universität Stuttgart, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-stuttgart',
  },
};

function generateHTML(meta) {
  return `<!doctype html>
<html lang="en">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-569909YP8G"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-569909YP8G');
    </script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="author" content="Infinite Grammar" />

    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.url}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />

  </head>

  <body>
    <div id="root">
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 16px;">Loading...</div>
          <div style="color: #666;">Please wait while the page loads</div>
        </div>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

// Generate HTML files
const distDir = path.join(__dirname, '..', 'dist');

console.log('Generating SEO pages...');

for (const [urlPath, meta] of Object.entries(SEO_PAGES)) {
  const html = generateHTML(meta);

  // Create directory structure
  const filePath = urlPath === '/pruefungszentren'
    ? path.join(distDir, 'pruefungszentren.html')
    : path.join(distDir, urlPath.slice(1) + '.html');

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, html);
  console.log(`✓ Generated: ${filePath}`);
}

console.log('✓ All SEO pages generated successfully!');
