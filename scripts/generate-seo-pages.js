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

  // Grammar pages
  '/grammatik': {
    title: 'Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1) | Infinite Grammar',
    description: 'Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden.',
    url: 'https://www.infinitegrammar.de/grammatik',
  },
  '/grammatik/a1': {
    title: 'A1 – Basis sicher machen – Deutsche Grammatik | Infinite Grammar',
    description: 'Deutsche Grammatik A1: Grundlagen der deutschen Grammatik: Wortstellung, Präsens, Artikel, Pronomen und einfache Präpositionen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/a1',
  },
  '/grammatik/a2': {
    title: 'A2 – Alltag & Perfekt – Deutsche Grammatik | Infinite Grammar',
    description: 'Deutsche Grammatik A2: Erweiterte Grundlagen: Kasus, Perfekt, Modalverben und erste komplexe Sätze. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/a2',
  },
  '/grammatik/b1': {
    title: 'B1 – komplexer werden – Deutsche Grammatik | Infinite Grammar',
    description: 'Deutsche Grammatik B1: Mittelstufe: Relativsätze, Konjunktiv II, Wechselpräpositionen und reflexive Verben. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/b1',
  },
  '/grammatik/b2': {
    title: 'B2 – präzise & formal – Deutsche Grammatik | Infinite Grammar',
    description: 'Deutsche Grammatik B2: Fortgeschritten: Indirekte Rede, Nominalisierung, Passiv und komplexe Satzstrukturen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/b2',
  },
  '/grammatik/c1': {
    title: 'C1 – anspruchsvolle Texte – Deutsche Grammatik | Infinite Grammar',
    description: 'Deutsche Grammatik C1: Gehobene Sprache: Nominalstil, Partizipialkonstruktionen und komplexe Genitivkonstruktionen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/c1',
  },
  '/grammatik/thema/satzbau': {
    title: 'Satzbau & Satzarten – Deutsche Grammatik | Infinite Grammar',
    description: 'Satzbau & Satzarten: Wortstellung, Nebensätze, Konjunktionen und komplexe Sätze. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/satzbau',
  },
  '/grammatik/thema/zeiten': {
    title: 'Zeiten & Modi – Deutsche Grammatik | Infinite Grammar',
    description: 'Zeiten & Modi: Verbformen, Zeitformen und Modalverben. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/zeiten',
  },
  '/grammatik/thema/verben': {
    title: 'Verben & Ergänzungen – Deutsche Grammatik | Infinite Grammar',
    description: 'Verben & Ergänzungen: Trennbare Verben, reflexive Verben und Verben mit Präposition. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/verben',
  },
  '/grammatik/thema/nomen': {
    title: 'Nomen, Artikel, Pronomen – Deutsche Grammatik | Infinite Grammar',
    description: 'Nomen, Artikel, Pronomen: Artikel, Pronomen, Pluralbildung und Kasus. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/nomen',
  },
  '/grammatik/thema/kasus': {
    title: 'Kasus & Präpositionen – Deutsche Grammatik | Infinite Grammar',
    description: 'Kasus & Präpositionen: Präpositionen für Ort, Zeit und Richtung. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/kasus',
  },
  '/grammatik/thema/adjektive': {
    title: 'Adjektive & Steigerung – Deutsche Grammatik | Infinite Grammar',
    description: 'Adjektive & Steigerung: Adjektivdeklination, Komparativ und Superlativ. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/adjektive',
  },
  '/grammatik/thema/passiv': {
    title: 'Passiv & Nominalstil – Deutsche Grammatik | Infinite Grammar',
    description: 'Passiv & Nominalstil: Passivformen, Nominalisierung und Partizipialkonstruktionen. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/passiv',
  },
  '/grammatik/thema/genitiv': {
    title: 'Genitiv – Deutsche Grammatik | Infinite Grammar',
    description: 'Genitiv: Genitivgebrauch in gehobener Sprache. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/genitiv',
  },
  '/grammatik/b1/wechselpraepositionen-wo-wohin': {
    title: 'Wechselpräpositionen: Wo? Wohin? (B1) | Infinite Grammar',
    description: 'Wechselpräpositionen (B1): Wo vs. Wohin – Dativ oder Akkusativ? Mit Regeln, Beispielen und häufigen Fehlern.',
    url: 'https://www.infinitegrammar.de/grammatik/b1/wechselpraepositionen-wo-wohin',
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
