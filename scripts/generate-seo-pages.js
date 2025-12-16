import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO content for each page
const SEO_PAGES = {
  '/pruefungszentren': {
    title: 'telc & TestDaF Prüfungszentren finden (VHS, Unis, Institute)',
    description: 'Finde telc- und TestDaF-Prüfungszentren in Deutschland: VHS, Uni-Sprachzentren, Goethe-Institut & mehr. Mit Links, Tipps zur Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren',
  },
  '/pruefungszentren/telc-berlin': {
    title: 'telc Prüfungszentren in Berlin – Termine & Anmeldung',
    description: 'Finde telc-Prüfungszentren in Berlin: VHS, Sprachschulen & Institute. Mit Tipps zur Anmeldung und Links zu offiziellen Terminen.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-berlin',
  },
  '/pruefungszentren/testdaf-berlin': {
    title: 'TestDaF Prüfungszentren in Berlin – Termine & Vorbereitung',
    description: 'TestDaF in Berlin ablegen: Uni-Sprachzentren, Goethe-Institut & mehr. Termine, Anmeldung und Tipps zur Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-berlin',
  },
  '/pruefungszentren/telc-muenchen': {
    title: 'telc Prüfungszentren in München – VHS, Berlitz & mehr',
    description: 'telc-Prüfungen in München: Finde Termine bei VHS, Berlitz, Inlingua und Goethe-Institut. Tipps zur Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-muenchen',
  },
  '/pruefungszentren/testdaf-muenchen': {
    title: 'TestDaF Prüfungszentren in München – Uni & Institute',
    description: 'TestDaF in München: LMU, TU München, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für deine TestDaF-Prüfung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-muenchen',
  },
  '/pruefungszentren/telc-hamburg': {
    title: 'telc Prüfungszentren in Hamburg – VHS & Sprachschulen',
    description: 'telc-Prüfungen in Hamburg: VHS Hamburg, Berlitz, Goethe-Institut. Termine finden, anmelden und optimal vorbereiten.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-hamburg',
  },
  '/pruefungszentren/testdaf-hamburg': {
    title: 'TestDaF Prüfungszentren in Hamburg – Uni & Institute',
    description: 'TestDaF in Hamburg ablegen: Universität Hamburg, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-hamburg',
  },
  '/pruefungszentren/telc-koeln': {
    title: 'telc Prüfungszentren in Köln – VHS & mehr',
    description: 'telc-Prüfungen in Köln: VHS, Sprachschulen, Goethe-Institut. Termine, Anmeldung und Tipps für deine telc-Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-koeln',
  },
  '/pruefungszentren/testdaf-koeln': {
    title: 'TestDaF Prüfungszentren in Köln – Uni & Institute',
    description: 'TestDaF in Köln: Universität zu Köln, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und gezielter Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-koeln',
  },
  '/pruefungszentren/telc-frankfurt': {
    title: 'telc Prüfungszentren in Frankfurt – VHS & Goethe-Institut',
    description: 'telc-Prüfungen in Frankfurt: VHS, Goethe-Institut und Sprachschulen. Termine finden, anmelden und vorbereiten.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-frankfurt',
  },
  '/pruefungszentren/testdaf-frankfurt': {
    title: 'TestDaF Prüfungszentren in Frankfurt – Goethe-Universität & mehr',
    description: 'TestDaF in Frankfurt: Goethe-Universität, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für den TestDaF.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-frankfurt',
  },
  '/pruefungszentren/telc-stuttgart': {
    title: 'telc Prüfungszentren in Stuttgart – VHS, Berlitz & mehr',
    description: 'telc-Prüfungen in Stuttgart: VHS, Berlitz, Inlingua, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/telc-stuttgart',
  },
  '/pruefungszentren/testdaf-stuttgart': {
    title: 'TestDaF Prüfungszentren in Stuttgart – Uni & Institute',
    description: 'TestDaF in Stuttgart: Universität Stuttgart, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    url: 'https://www.infinitegrammar.de/pruefungszentren/testdaf-stuttgart',
  },

  // Grammar pages
  '/grammatik': {
    title: 'Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)',
    description: 'Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden.',
    url: 'https://www.infinitegrammar.de/grammatik',
  },
  '/grammatik/a1': {
    title: 'A1 – Basis sicher machen – Deutsche Grammatik',
    description: 'Deutsche Grammatik A1: Grundlagen der deutschen Grammatik: Wortstellung, Präsens, Artikel, Pronomen und einfache Präpositionen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/a1',
  },
  '/grammatik/a2': {
    title: 'A2 – Alltag & Perfekt – Deutsche Grammatik',
    description: 'Deutsche Grammatik A2: Erweiterte Grundlagen: Kasus, Perfekt, Modalverben und erste komplexe Sätze. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/a2',
  },
  '/grammatik/b1': {
    title: 'B1 – komplexer werden – Deutsche Grammatik',
    description: 'Deutsche Grammatik B1: Mittelstufe: Relativsätze, Konjunktiv II, Wechselpräpositionen und reflexive Verben. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/b1',
  },
  '/grammatik/b2': {
    title: 'B2 – präzise & formal – Deutsche Grammatik',
    description: 'Deutsche Grammatik B2: Fortgeschritten: Indirekte Rede, Nominalisierung, Passiv und komplexe Satzstrukturen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/b2',
  },
  '/grammatik/c1': {
    title: 'C1 – anspruchsvolle Texte – Deutsche Grammatik',
    description: 'Deutsche Grammatik C1: Gehobene Sprache: Nominalstil, Partizipialkonstruktionen und komplexe Genitivkonstruktionen. Mit Regeln, Beispielen und Übungen.',
    url: 'https://www.infinitegrammar.de/grammatik/c1',
  },
  '/grammatik/thema/satzbau': {
    title: 'Satzbau & Satzarten – Deutsche Grammatik',
    description: 'Satzbau & Satzarten: Wortstellung, Nebensätze, Konjunktionen und komplexe Sätze. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/satzbau',
  },
  '/grammatik/thema/zeiten': {
    title: 'Zeiten & Modi – Deutsche Grammatik',
    description: 'Zeiten & Modi: Verbformen, Zeitformen und Modalverben. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/zeiten',
  },
  '/grammatik/thema/verben': {
    title: 'Verben & Ergänzungen – Deutsche Grammatik',
    description: 'Verben & Ergänzungen: Trennbare Verben, reflexive Verben und Verben mit Präposition. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/verben',
  },
  '/grammatik/thema/nomen': {
    title: 'Nomen, Artikel, Pronomen – Deutsche Grammatik',
    description: 'Nomen, Artikel, Pronomen: Artikel, Pronomen, Pluralbildung und Kasus. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/nomen',
  },
  '/grammatik/thema/kasus': {
    title: 'Kasus & Präpositionen – Deutsche Grammatik',
    description: 'Kasus & Präpositionen: Präpositionen für Ort, Zeit und Richtung. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/kasus',
  },
  '/grammatik/thema/adjektive': {
    title: 'Adjektive & Steigerung – Deutsche Grammatik',
    description: 'Adjektive & Steigerung: Adjektivdeklination, Komparativ und Superlativ. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/adjektive',
  },
  '/grammatik/thema/passiv': {
    title: 'Passiv & Nominalstil – Deutsche Grammatik',
    description: 'Passiv & Nominalstil: Passivformen, Nominalisierung und Partizipialkonstruktionen. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/passiv',
  },
  '/grammatik/thema/genitiv': {
    title: 'Genitiv – Deutsche Grammatik',
    description: 'Genitiv: Genitivgebrauch in gehobener Sprache. Alle Regeln mit Beispielen und Übungen (A1-C1).',
    url: 'https://www.infinitegrammar.de/grammatik/thema/genitiv',
  },
  // Grammar content pages - all 70 topics
  // Generated dynamically from grammarTopics data
  ...generateGrammarTopicPages(),
};

// Function to generate all grammar topic SEO pages
function generateGrammarTopicPages() {
  const topics = [
    { level: 'a1', slug: 'wortstellung', title: 'Wortstellung', desc: 'Deutsche Wortstellung (A1): Regeln für die Grundsatzstellung im Hauptsatz. Mit Beispielen und Übungen.' },
    { level: 'a1', slug: 'praesens', title: 'Präsens', desc: 'Präsens (A1): Bildung und Verwendung der Gegenwartsform. Regelmäßige und unregelmäßige Verben.' },
    { level: 'a1', slug: 'imperativ', title: 'Imperativ', desc: 'Imperativ (A1): Die Befehlsform im Deutschen. Bildung für du, ihr und Sie mit Beispielen.' },
    { level: 'a1', slug: 'artikel-nominativ', title: 'Artikel Nominativ', desc: 'Artikel im Nominativ (A1): der, die, das, ein, eine. Bestimmte und unbestimmte Artikel.' },
    { level: 'a1', slug: 'personalpronomen-nominativ', title: 'Personalpronomen Nominativ', desc: 'Personalpronomen Nominativ (A1): ich, du, er/sie/es, wir, ihr, sie/Sie.' },
    { level: 'a1', slug: 'pluralbildung', title: 'Pluralbildung', desc: 'Pluralbildung (A1): Die verschiedenen Pluralendungen im Deutschen mit Regeln und Beispielen.' },
    { level: 'a1', slug: 'praepositionen-ort', title: 'Präpositionen Ort', desc: 'Lokale Präpositionen (A1): Ortsangaben mit in, auf, an, bei. Mit Beispielen und Übungen.' },
    { level: 'a1', slug: 'zeitpraepositionen', title: 'Zeitpräpositionen', desc: 'Temporale Präpositionen (A1): Zeitangaben mit um, am, im, von...bis.' },
    { level: 'a1', slug: 'adjektive-grundform', title: 'Adjektive Grundform', desc: 'Adjektive Grundform (A1): Adjektive ohne Deklination. Prädikativ und adverbial.' },
    { level: 'a2', slug: 'komplexe-saetze', title: 'Komplexe Sätze', desc: 'Komplexe Sätze (A2): Verbindung von Haupt- und Nebensätzen. Konjunktionen und Wortstellung.' },
    { level: 'a2', slug: 'perfekt-praeteritum', title: 'Perfekt vs. Präteritum', desc: 'Perfekt vs. Präteritum (A2): Wann verwendet man welche Vergangenheitsform? Mit Regeln und Beispielen.' },
    { level: 'a2', slug: 'modalverben', title: 'Modalverben', desc: 'Modalverben (A2): Bedeutung und Verwendung von können, müssen, wollen, sollen, dürfen, mögen.' },
    { level: 'a2', slug: 'trennbare-verben', title: 'Trennbare Verben', desc: 'Trennbare Verben (A2): Bildung und Wortstellung bei trennbaren Verben. Mit Beispielen.' },
    { level: 'a2', slug: 'pronomen-grundlagen', title: 'Pronomen Grundlagen', desc: 'Pronomen Grundlagen (A2): Personal-, Possessiv- und Demonstrativpronomen im Akkusativ und Dativ.' },
    { level: 'a2', slug: 'artikel-kasus', title: 'Artikel & Kasus', desc: 'Artikel & Kasus (A2): Die vier Fälle. Verwendung von Nominativ, Akkusativ, Dativ mit Artikeln.' },
    { level: 'a2', slug: 'praepositionen-ort-richtung', title: 'Präpositionen Ort+Richtung', desc: 'Präpositionen Ort und Richtung (A2): Erweiterte lokale Präpositionen mit Akkusativ und Dativ.' },
    { level: 'a2', slug: 'adjektivdeklination-einstieg', title: 'Adjektivdeklination Einstieg', desc: 'Adjektivdeklination Einstieg (A2): Grundlagen der Adjektivendungen vor Nomen.' },
    { level: 'a2', slug: 'komparativ-superlativ', title: 'Vergleich: Komparativ/Superlativ', desc: 'Komparativ und Superlativ (A2): Adjektive steigern. Bildung und Verwendung mit Beispielen.' },
    { level: 'b1', slug: 'nebensaetze-konjunktionen', title: 'Nebensätze/Konjunktionen', desc: 'Nebensätze und Konjunktionen (B1): Kausale, temporale und konzessive Nebensätze.' },
    { level: 'b1', slug: 'relativsaetze', title: 'Relativsätze', desc: 'Relativsätze (B1): Bildung mit Relativpronomen. Nominativ, Akkusativ, Dativ, Genitiv.' },
    { level: 'b1', slug: 'indirekte-fragen', title: 'Indirekte Fragen', desc: 'Indirekte Fragen (B1): Fragesätze als Nebensätze. Mit ob, wann, wo, wie.' },
    { level: 'b1', slug: 'futur', title: 'Futur I', desc: 'Futur I (B1): Die Zukunftsform im Deutschen. Bildung mit werden + Infinitiv.' },
    { level: 'b1', slug: 'modalverben-praeteritum', title: 'Modalverben Präteritum', desc: 'Modalverben Präteritum (B1): Vergangenheitsformen der Modalverben.' },
    { level: 'b1', slug: 'konjunktiv-2', title: 'Konjunktiv II', desc: 'Konjunktiv II (B1): Höfliche Bitten, irreale Wünsche und Bedingungen. Bildung und Verwendung.' },
    { level: 'b1', slug: 'reflexive-verben', title: 'Reflexive Verben', desc: 'Reflexive Verben (B1): Verben mit Reflexivpronomen. Akkusativ und Dativ.' },
    { level: 'b1', slug: 'verben-mit-praeposition', title: 'Verben mit Präposition', desc: 'Verben mit Präposition (B1): Feste Verbindungen. Rektion und Pronominaladverbien (darauf, darüber, ...).' },
    { level: 'b1', slug: 'wechselpraepositionen-wo-wohin', title: 'Wechselpräpositionen: Wo? Wohin?', desc: 'Wechselpräpositionen (B1): Wo vs. Wohin – Dativ oder Akkusativ? Mit Regeln, Beispielen und häufigen Fehlern.' },
    { level: 'b1', slug: 'praepositionen-ort-zeit', title: 'Präpositionen Ort+Zeit', desc: 'Präpositionen Ort und Zeit (B1): Kombination von lokalen und temporalen Präpositionen.' },
    { level: 'b1', slug: 'adjektivdeklination-nom-akk', title: 'Adjektivdeklination Nom/Akk', desc: 'Adjektivdeklination Nominativ und Akkusativ (B1): Systematische Übersicht der Endungen.' },
    { level: 'b1', slug: 'passiv-einstieg', title: 'Passiv Einstieg', desc: 'Passiv Einstieg (B1): Das Vorgangspassiv. Bildung mit werden + Partizip II.' },
    { level: 'b2', slug: 'infinitivsaetze', title: 'Infinitivsätze', desc: 'Infinitivsätze (B2): Infinitivkonstruktionen mit um...zu, ohne...zu, (an)statt...zu.' },
    { level: 'b2', slug: 'konjunktiv-2-konditionalsaetze', title: 'Konjunktiv II: Konditionalsätze', desc: 'Konjunktiv II Konditionalsätze (B2): Irreale Bedingungssätze. Gegenwart und Vergangenheit.' },
    { level: 'b2', slug: 'indirekte-rede', title: 'Indirekte Rede (Konjunktiv I+II)', desc: 'Indirekte Rede (B2): Konjunktiv I und II für die indirekte Rede. Regeln und Beispiele.' },
    { level: 'b2', slug: 'nomen-verb-verbindungen', title: 'Nomen-Verb-Verbindungen', desc: 'Nomen-Verb-Verbindungen (B2): Funktionsverbgefüge. Typische Kombinationen in formeller Sprache.' },
    { level: 'b2', slug: 'feste-praeposition-rektion', title: 'Feste Präposition/Rektion', desc: 'Feste Präpositionen (B2): Rektion bei Verben, Nomen und Adjektiven. Systematische Übersicht.' },
    { level: 'b2', slug: 'adjektivdeklination-system-komplett', title: 'Adjektivdeklination: das System', desc: 'Adjektivdeklination komplett (B2): Systematische Übersicht aller Endungen in allen Fällen.' },
    { level: 'b2', slug: 'passiv-vertieft', title: 'Passiv vertieft', desc: 'Passiv vertieft (B2): Zustandspassiv vs. Vorgangspassiv. Passiv mit Modalverben.' },
    { level: 'b2', slug: 'nominalisierung', title: 'Nominalisierung/Nominalphrasen', desc: 'Nominalisierung (B2): Verben und Adjektive als Nomen. Typisch für formelle Texte.' },
    { level: 'b2', slug: 'genitiv-erweiterung', title: 'Erweiterter Genitivgebrauch', desc: 'Erweiterter Genitiv (B2): Genitivattribute und Präpositionen mit Genitiv.' },
    { level: 'c1', slug: 'komplexer-satzbau', title: 'Komplexer Satzbau', desc: 'Komplexer Satzbau (C1): Mehrfach eingebettete Nebensätze und komplexe Satzstrukturen.' },
    { level: 'c1', slug: 'konjunktiv-1-berichtssprache', title: 'Konjunktiv I Berichtssprache', desc: 'Konjunktiv I Berichtssprache (C1): Verwendung in Zeitungen und formellen Berichten.' },
    { level: 'c1', slug: 'funktionsverbgefuege', title: 'Funktionsverbgefüge', desc: 'Funktionsverbgefüge (C1): Komplexe Nomen-Verb-Verbindungen in gehobener Sprache.' },
    { level: 'c1', slug: 'feste-verbindungen', title: 'Feste Verbindungen', desc: 'Feste Verbindungen (C1): Idiomatische Wendungen und typische Kollokationen.' },
    { level: 'c1', slug: 'verben-mit-praeposition-advanced', title: 'Verben mit Präposition (C1)', desc: 'Verben mit Präposition C1: Gehobene und seltenere Verb-Präposition-Kombinationen.' },
    { level: 'c1', slug: 'komplexe-praepositionsausdruecke', title: 'Komplexe präpositionale Ausdrücke', desc: 'Komplexe Präpositionalausdrücke (C1): Formelle mehrteilige Präpositionen.' },
    { level: 'c1', slug: 'adjektivdeklination-komplex', title: 'Adjektivdeklination: komplexe Nominalgruppen', desc: 'Adjektivdeklination komplex (C1): Mehrere Adjektive und erweiterte Nominalgruppen.' },
    { level: 'c1', slug: 'passiv-komplex', title: 'Passiv komplex', desc: 'Passiv komplex (C1): Passiversatzformen (sein...zu, lassen sich) und unpersönliches Passiv.' },
    { level: 'c1', slug: 'nominalstil', title: 'Nominalstil/Informationsverdichtung', desc: 'Nominalstil (C1): Informationsverdichtung durch Nominalisierung. Typisch für wissenschaftliche Texte.' },
    { level: 'c1', slug: 'partizipialkonstruktionen', title: 'Partizipialkonstruktionen', desc: 'Partizipialkonstruktionen (C1): Erweiterte Partizipialattribute zur Satzverdichtung.' },
    { level: 'c1', slug: 'genitiv-gehobene-sprache', title: 'Genitiv gehobene Sprache', desc: 'Genitiv gehobene Sprache (C1): Komplexe Genitivkonstruktionen in formellen Texten.' },
  ];

  const pages = {};
  topics.forEach(topic => {
    const url = `/grammatik/${topic.level}/${topic.slug}`;
    pages[url] = {
      title: `${topic.title} (${topic.level.toUpperCase()})`,
      description: topic.desc,
      url: `https://www.infinitegrammar.de${url}`
    };
  });

  return pages;
}

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
