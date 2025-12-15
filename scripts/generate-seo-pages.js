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

function generateHTML(baseHtml, meta) {
  // Replace title
  let html = baseHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(meta.description)}"`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}"`
  );

  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}"`
  );

  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${escapeHtml(meta.url)}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}"`
  );

  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}"`
  );

  return html;
}

function escapeHtml(str) {
  return str.replace(/"/g, '&quot;');
}

// Generate HTML files
const distDir = path.join(__dirname, '..', 'dist');

console.log('Generating SEO pages...');

// Read the base index.html
const baseIndexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(baseIndexPath, 'utf-8');

for (const [urlPath, meta] of Object.entries(SEO_PAGES)) {
  const html = generateHTML(baseHtml, meta);

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
