// Grammar topics organized by level and category for the reference guide

export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type GrammarCategory =
  | 'satzbau'
  | 'zeiten'
  | 'verben'
  | 'nomen'
  | 'kasus'
  | 'adjektive'
  | 'passiv'
  | 'genitiv';

export interface GrammarTopic {
  id: string;
  slug: string;
  title: string;
  level: GrammarLevel;
  category: GrammarCategory;
  shortDescription: string;
  metaDescription: string;
  orderInLevel: number;
}

export const grammarCategories: Record<GrammarCategory, { name: string; description: string }> = {
  satzbau: {
    name: 'Satzbau & Satzarten',
    description: 'Wortstellung, Nebensätze, Konjunktionen und komplexe Sätze'
  },
  zeiten: {
    name: 'Zeiten & Modi',
    description: 'Verbformen, Zeitformen und Modalverben'
  },
  verben: {
    name: 'Verben & Ergänzungen',
    description: 'Trennbare Verben, reflexive Verben und Verben mit Präposition'
  },
  nomen: {
    name: 'Nomen, Artikel, Pronomen',
    description: 'Artikel, Pronomen, Pluralbildung und Kasus'
  },
  kasus: {
    name: 'Kasus & Präpositionen',
    description: 'Präpositionen für Ort, Zeit und Richtung'
  },
  adjektive: {
    name: 'Adjektive & Steigerung',
    description: 'Adjektivdeklination, Komparativ und Superlativ'
  },
  passiv: {
    name: 'Passiv & Nominalstil',
    description: 'Passivformen, Nominalisierung und Partizipialkonstruktionen'
  },
  genitiv: {
    name: 'Genitiv',
    description: 'Genitivgebrauch in gehobener Sprache'
  }
};

export const grammarTopics: GrammarTopic[] = [
  // A1 Level
  {
    id: 'a1-wortstellung',
    slug: 'wortstellung',
    title: 'Wortstellung',
    level: 'A1',
    category: 'satzbau',
    shortDescription: 'Grundlegende Satzstellung im Deutschen',
    metaDescription: 'Deutsche Wortstellung (A1): Regeln für die Grundsatzstellung im Hauptsatz. Mit Beispielen und Übungen.',
    orderInLevel: 1
  },
  {
    id: 'a1-praesens',
    slug: 'praesens',
    title: 'Präsens',
    level: 'A1',
    category: 'zeiten',
    shortDescription: 'Gegenwart: regelmäßige und unregelmäßige Verben',
    metaDescription: 'Präsens (A1): Bildung und Verwendung der Gegenwartsform. Regelmäßige und unregelmäßige Verben.',
    orderInLevel: 2
  },
  {
    id: 'a1-imperativ',
    slug: 'imperativ',
    title: 'Imperativ',
    level: 'A1',
    category: 'zeiten',
    shortDescription: 'Befehlsform: du, ihr, Sie',
    metaDescription: 'Imperativ (A1): Die Befehlsform im Deutschen. Bildung für du, ihr und Sie mit Beispielen.',
    orderInLevel: 3
  },
  {
    id: 'a1-artikel-nominativ',
    slug: 'artikel-nominativ',
    title: 'Artikel Nominativ',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'Bestimmte und unbestimmte Artikel',
    metaDescription: 'Artikel im Nominativ (A1): der, die, das, ein, eine. Bestimmte und unbestimmte Artikel.',
    orderInLevel: 4
  },
  {
    id: 'a1-personalpronomen',
    slug: 'personalpronomen-nominativ',
    title: 'Personalpronomen Nominativ',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'ich, du, er, sie, es, wir, ihr, sie',
    metaDescription: 'Personalpronomen Nominativ (A1): ich, du, er/sie/es, wir, ihr, sie/Sie.',
    orderInLevel: 5
  },
  {
    id: 'a1-pluralbildung',
    slug: 'pluralbildung',
    title: 'Pluralbildung',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'Wie man den Plural bildet',
    metaDescription: 'Pluralbildung (A1): Die verschiedenen Pluralendungen im Deutschen mit Regeln und Beispielen.',
    orderInLevel: 6
  },
  {
    id: 'a1-praepositionen-ort',
    slug: 'praepositionen-ort',
    title: 'Präpositionen Ort',
    level: 'A1',
    category: 'kasus',
    shortDescription: 'in, auf, an, bei, vor, hinter, ...',
    metaDescription: 'Lokale Präpositionen (A1): Ortsangaben mit in, auf, an, bei. Mit Beispielen und Übungen.',
    orderInLevel: 7
  },
  {
    id: 'a1-zeitpraepositionen',
    slug: 'zeitpraepositionen',
    title: 'Zeitpräpositionen',
    level: 'A1',
    category: 'kasus',
    shortDescription: 'um, am, im, von...bis',
    metaDescription: 'Temporale Präpositionen (A1): Zeitangaben mit um, am, im, von...bis.',
    orderInLevel: 8
  },
  {
    id: 'a1-adjektive-grundform',
    slug: 'adjektive-grundform',
    title: 'Adjektive Grundform',
    level: 'A1',
    category: 'adjektive',
    shortDescription: 'Prädikative und adverbiale Verwendung',
    metaDescription: 'Adjektive Grundform (A1): Adjektive ohne Deklination. Prädikativ und adverbial.',
    orderInLevel: 9
  },

  // A2 Level
  {
    id: 'a2-komplexe-saetze',
    slug: 'komplexe-saetze',
    title: 'Komplexe Sätze',
    level: 'A2',
    category: 'satzbau',
    shortDescription: 'Hauptsatz + Hauptsatz, erste Nebensätze',
    metaDescription: 'Komplexe Sätze (A2): Verbindung von Haupt- und Nebensätzen. Konjunktionen und Wortstellung.',
    orderInLevel: 1
  },
  {
    id: 'a2-perfekt-praeteritum',
    slug: 'perfekt-praeteritum',
    title: 'Perfekt vs. Präteritum',
    level: 'A2',
    category: 'zeiten',
    shortDescription: 'Unterschied zwischen Perfekt und Präteritum',
    metaDescription: 'Perfekt vs. Präteritum (A2): Wann verwendet man welche Vergangenheitsform? Mit Regeln und Beispielen.',
    orderInLevel: 2
  },
  {
    id: 'a2-modalverben',
    slug: 'modalverben',
    title: 'Modalverben',
    level: 'A2',
    category: 'zeiten',
    shortDescription: 'können, müssen, wollen, sollen, dürfen, mögen',
    metaDescription: 'Modalverben (A2): Bedeutung und Verwendung von können, müssen, wollen, sollen, dürfen, mögen.',
    orderInLevel: 3
  },
  {
    id: 'a2-trennbare-verben',
    slug: 'trennbare-verben',
    title: 'Trennbare Verben',
    level: 'A2',
    category: 'verben',
    shortDescription: 'aufstehen, einkaufen, mitnehmen, ...',
    metaDescription: 'Trennbare Verben (A2): Bildung und Wortstellung bei trennbaren Verben. Mit Beispielen.',
    orderInLevel: 4
  },
  {
    id: 'a2-pronomen-grundlagen',
    slug: 'pronomen-grundlagen',
    title: 'Pronomen Grundlagen',
    level: 'A2',
    category: 'nomen',
    shortDescription: 'Akkusativ- und Dativpronomen',
    metaDescription: 'Pronomen Grundlagen (A2): Personal-, Possessiv- und Demonstrativpronomen im Akkusativ und Dativ.',
    orderInLevel: 5
  },
  {
    id: 'a2-artikel-kasus',
    slug: 'artikel-kasus',
    title: 'Artikel & Kasus',
    level: 'A2',
    category: 'nomen',
    shortDescription: 'Nominativ, Akkusativ, Dativ',
    metaDescription: 'Artikel & Kasus (A2): Die vier Fälle. Verwendung von Nominativ, Akkusativ, Dativ mit Artikeln.',
    orderInLevel: 6
  },
  {
    id: 'a2-praepositionen-ort-richtung',
    slug: 'praepositionen-ort-richtung',
    title: 'Präpositionen Ort+Richtung',
    level: 'A2',
    category: 'kasus',
    shortDescription: 'Lokale Präpositionen erweitert',
    metaDescription: 'Präpositionen Ort und Richtung (A2): Erweiterte lokale Präpositionen mit Akkusativ und Dativ.',
    orderInLevel: 7
  },
  {
    id: 'a2-adjektivdeklination-einstieg',
    slug: 'adjektivdeklination-einstieg',
    title: 'Adjektivdeklination Einstieg',
    level: 'A2',
    category: 'adjektive',
    shortDescription: 'Erste Endungen bei attributiven Adjektiven',
    metaDescription: 'Adjektivdeklination Einstieg (A2): Grundlagen der Adjektivendungen vor Nomen.',
    orderInLevel: 8
  },
  {
    id: 'a2-komparativ-superlativ',
    slug: 'komparativ-superlativ',
    title: 'Vergleich: Komparativ/Superlativ',
    level: 'A2',
    category: 'adjektive',
    shortDescription: 'Steigerung von Adjektiven',
    metaDescription: 'Komparativ und Superlativ (A2): Adjektive steigern. Bildung und Verwendung mit Beispielen.',
    orderInLevel: 9
  },

  // B1 Level
  {
    id: 'b1-nebensaetze-konjunktionen',
    slug: 'nebensaetze-konjunktionen',
    title: 'Nebensätze/Konjunktionen',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'weil, dass, obwohl, während, ...',
    metaDescription: 'Nebensätze und Konjunktionen (B1): Kausale, temporale und konzessive Nebensätze.',
    orderInLevel: 1
  },
  {
    id: 'b1-relativsaetze',
    slug: 'relativsaetze',
    title: 'Relativsätze',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'der, die, das als Relativpronomen',
    metaDescription: 'Relativsätze (B1): Bildung mit Relativpronomen. Nominativ, Akkusativ, Dativ, Genitiv.',
    orderInLevel: 2
  },
  {
    id: 'b1-indirekte-fragen',
    slug: 'indirekte-fragen',
    title: 'Indirekte Fragen',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'Ich weiß nicht, ob/wann/wo/...',
    metaDescription: 'Indirekte Fragen (B1): Fragesätze als Nebensätze. Mit ob, wann, wo, wie.',
    orderInLevel: 3
  },
  {
    id: 'b1-futur',
    slug: 'futur',
    title: 'Futur I',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'Zukunft mit werden + Infinitiv',
    metaDescription: 'Futur I (B1): Die Zukunftsform im Deutschen. Bildung mit werden + Infinitiv.',
    orderInLevel: 4
  },
  {
    id: 'b1-modalverben-praeteritum',
    slug: 'modalverben-praeteritum',
    title: 'Modalverben Präteritum',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'konnte, musste, wollte, ...',
    metaDescription: 'Modalverben Präteritum (B1): Vergangenheitsformen der Modalverben.',
    orderInLevel: 5
  },
  {
    id: 'b1-konjunktiv-2',
    slug: 'konjunktiv-2',
    title: 'Konjunktiv II',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'Wünsche und Höflichkeit',
    metaDescription: 'Konjunktiv II (B1): Höfliche Bitten, irreale Wünsche und Bedingungen. Bildung und Verwendung.',
    orderInLevel: 6
  },
  {
    id: 'b1-reflexive-verben',
    slug: 'reflexive-verben',
    title: 'Reflexive Verben',
    level: 'B1',
    category: 'verben',
    shortDescription: 'sich freuen, sich erinnern, ...',
    metaDescription: 'Reflexive Verben (B1): Verben mit Reflexivpronomen. Akkusativ und Dativ.',
    orderInLevel: 7
  },
  {
    id: 'b1-verben-mit-praeposition',
    slug: 'verben-mit-praeposition',
    title: 'Verben mit Präposition',
    level: 'B1',
    category: 'verben',
    shortDescription: 'warten auf, denken an, sich freuen über, ...',
    metaDescription: 'Verben mit Präposition (B1): Feste Verbindungen. Rektion und Pronominaladverbien (darauf, darüber, ...).',
    orderInLevel: 8
  },
  {
    id: 'b1-wechselpraepositionen',
    slug: 'wechselpraepositionen-wo-wohin',
    title: 'Wechselpräpositionen: Wo? Wohin?',
    level: 'B1',
    category: 'kasus',
    shortDescription: 'Dativ (wo?) vs. Akkusativ (wohin?)',
    metaDescription: 'Wechselpräpositionen (B1): Wo vs. Wohin – Dativ oder Akkusativ? Mit Regeln, Beispielen und häufigen Fehlern.',
    orderInLevel: 9
  },
  {
    id: 'b1-praepositionen-ort-zeit',
    slug: 'praepositionen-ort-zeit',
    title: 'Präpositionen Ort+Zeit',
    level: 'B1',
    category: 'kasus',
    shortDescription: 'Kombination lokaler und temporaler Angaben',
    metaDescription: 'Präpositionen Ort und Zeit (B1): Kombination von lokalen und temporalen Präpositionen.',
    orderInLevel: 10
  },
  {
    id: 'b1-adjektivdeklination-nom-akk',
    slug: 'adjektivdeklination-nom-akk',
    title: 'Adjektivdeklination Nom/Akk',
    level: 'B1',
    category: 'adjektive',
    shortDescription: 'Systematischer Einstieg: Nominativ und Akkusativ',
    metaDescription: 'Adjektivdeklination Nominativ und Akkusativ (B1): Systematische Übersicht der Endungen.',
    orderInLevel: 11
  },
  {
    id: 'b1-passiv-einstieg',
    slug: 'passiv-einstieg',
    title: 'Passiv Einstieg',
    level: 'B1',
    category: 'passiv',
    shortDescription: 'Vorgangspassiv Präsens und Präteritum',
    metaDescription: 'Passiv Einstieg (B1): Das Vorgangspassiv. Bildung mit werden + Partizip II.',
    orderInLevel: 12
  },

  // B2 Level
  {
    id: 'b2-infinitivsaetze',
    slug: 'infinitivsaetze',
    title: 'Infinitivsätze',
    level: 'B2',
    category: 'satzbau',
    shortDescription: 'um...zu, ohne...zu, (an)statt...zu',
    metaDescription: 'Infinitivsätze (B2): Infinitivkonstruktionen mit um...zu, ohne...zu, (an)statt...zu.',
    orderInLevel: 1
  },
  {
    id: 'b2-konjunktiv-2-konditionalsaetze',
    slug: 'konjunktiv-2-konditionalsaetze',
    title: 'Konjunktiv II: Konditionalsätze',
    level: 'B2',
    category: 'zeiten',
    shortDescription: 'Irreale Bedingungen: Wenn ich Zeit hätte, ...',
    metaDescription: 'Konjunktiv II Konditionalsätze (B2): Irreale Bedingungssätze. Gegenwart und Vergangenheit.',
    orderInLevel: 2
  },
  {
    id: 'b2-indirekte-rede',
    slug: 'indirekte-rede',
    title: 'Indirekte Rede (Konjunktiv I+II)',
    level: 'B2',
    category: 'zeiten',
    shortDescription: 'Er sagt, dass er komme / käme',
    metaDescription: 'Indirekte Rede (B2): Konjunktiv I und II für die indirekte Rede. Regeln und Beispiele.',
    orderInLevel: 3
  },
  {
    id: 'b2-nomen-verb-verbindungen',
    slug: 'nomen-verb-verbindungen',
    title: 'Nomen-Verb-Verbindungen',
    level: 'B2',
    category: 'verben',
    shortDescription: 'zur Verfügung stellen, in Betracht ziehen, ...',
    metaDescription: 'Nomen-Verb-Verbindungen (B2): Funktionsverbgefüge. Typische Kombinationen in formeller Sprache.',
    orderInLevel: 4
  },
  {
    id: 'b2-feste-praeposition-rektion',
    slug: 'feste-praeposition-rektion',
    title: 'Feste Präposition/Rektion',
    level: 'B2',
    category: 'verben',
    shortDescription: 'Verben, Nomen, Adjektive mit festen Präpositionen',
    metaDescription: 'Feste Präpositionen (B2): Rektion bei Verben, Nomen und Adjektiven. Systematische Übersicht.',
    orderInLevel: 5
  },
  {
    id: 'b2-adjektivdeklination-system',
    slug: 'adjektivdeklination-system-komplett',
    title: 'Adjektivdeklination: das System',
    level: 'B2',
    category: 'adjektive',
    shortDescription: 'Alle vier Fälle systematisch',
    metaDescription: 'Adjektivdeklination komplett (B2): Systematische Übersicht aller Endungen in allen Fällen.',
    orderInLevel: 6
  },
  {
    id: 'b2-passiv-vertieft',
    slug: 'passiv-vertieft',
    title: 'Passiv vertieft',
    level: 'B2',
    category: 'passiv',
    shortDescription: 'Zustandspassiv, Passiv mit Modalverben',
    metaDescription: 'Passiv vertieft (B2): Zustandspassiv vs. Vorgangspassiv. Passiv mit Modalverben.',
    orderInLevel: 7
  },
  {
    id: 'b2-nominalisierung',
    slug: 'nominalisierung',
    title: 'Nominalisierung/Nominalphrasen',
    level: 'B2',
    category: 'passiv',
    shortDescription: 'Von Verben und Adjektiven zu Nomen',
    metaDescription: 'Nominalisierung (B2): Verben und Adjektive als Nomen. Typisch für formelle Texte.',
    orderInLevel: 8
  },
  {
    id: 'b2-genitiv-erweiterung',
    slug: 'genitiv-erweiterung',
    title: 'Erweiterter Genitivgebrauch',
    level: 'B2',
    category: 'genitiv',
    shortDescription: 'Genitivattribute, Genitivpräpositionen',
    metaDescription: 'Erweiterter Genitiv (B2): Genitivattribute und Präpositionen mit Genitiv.',
    orderInLevel: 9
  },

  // C1 Level
  {
    id: 'c1-komplexer-satzbau',
    slug: 'komplexer-satzbau',
    title: 'Komplexer Satzbau',
    level: 'C1',
    category: 'satzbau',
    shortDescription: 'Mehrfache Einbettung, Satzklammern',
    metaDescription: 'Komplexer Satzbau (C1): Mehrfach eingebettete Nebensätze und komplexe Satzstrukturen.',
    orderInLevel: 1
  },
  {
    id: 'c1-konjunktiv-1-berichtssprache',
    slug: 'konjunktiv-1-berichtssprache',
    title: 'Konjunktiv I Berichtssprache',
    level: 'C1',
    category: 'zeiten',
    shortDescription: 'Journalistische indirekte Rede',
    metaDescription: 'Konjunktiv I Berichtssprache (C1): Verwendung in Zeitungen und formellen Berichten.',
    orderInLevel: 2
  },
  {
    id: 'c1-funktionsverbgefuege',
    slug: 'funktionsverbgefuege',
    title: 'Funktionsverbgefüge',
    level: 'C1',
    category: 'verben',
    shortDescription: 'zum Ausdruck bringen, in Erscheinung treten, ...',
    metaDescription: 'Funktionsverbgefüge (C1): Komplexe Nomen-Verb-Verbindungen in gehobener Sprache.',
    orderInLevel: 3
  },
  {
    id: 'c1-feste-verbindungen',
    slug: 'feste-verbindungen',
    title: 'Feste Verbindungen',
    level: 'C1',
    category: 'verben',
    shortDescription: 'Idiomatische Ausdrücke und Kollokationen',
    metaDescription: 'Feste Verbindungen (C1): Idiomatische Wendungen und typische Kollokationen.',
    orderInLevel: 4
  },
  {
    id: 'c1-verben-mit-praeposition-advanced',
    slug: 'verben-mit-praeposition-advanced',
    title: 'Verben mit Präposition (C1)',
    level: 'C1',
    category: 'verben',
    shortDescription: 'Erweiterte Rektion gehobener Sprache',
    metaDescription: 'Verben mit Präposition C1: Gehobene und seltenere Verb-Präposition-Kombinationen.',
    orderInLevel: 5
  },
  {
    id: 'c1-komplexe-praepositionsausdruecke',
    slug: 'komplexe-praepositionsausdruecke',
    title: 'Komplexe präpositionale Ausdrücke',
    level: 'C1',
    category: 'kasus',
    shortDescription: 'im Hinblick auf, im Zuge von, ...',
    metaDescription: 'Komplexe Präpositionalausdrücke (C1): Formelle mehrteilige Präpositionen.',
    orderInLevel: 6
  },
  {
    id: 'c1-adjektivdeklination-komplex',
    slug: 'adjektivdeklination-komplex',
    title: 'Adjektivdeklination: komplexe Nominalgruppen',
    level: 'C1',
    category: 'adjektive',
    shortDescription: 'Mehrere Adjektive, erweiterte Attribute',
    metaDescription: 'Adjektivdeklination komplex (C1): Mehrere Adjektive und erweiterte Nominalgruppen.',
    orderInLevel: 7
  },
  {
    id: 'c1-passiv-komplex',
    slug: 'passiv-komplex',
    title: 'Passiv komplex',
    level: 'C1',
    category: 'passiv',
    shortDescription: 'Passiversatzformen, unpersönliches Passiv',
    metaDescription: 'Passiv komplex (C1): Passiversatzformen (sein...zu, lassen sich) und unpersönliches Passiv.',
    orderInLevel: 8
  },
  {
    id: 'c1-nominalstil',
    slug: 'nominalstil',
    title: 'Nominalstil/Informationsverdichtung',
    level: 'C1',
    category: 'passiv',
    shortDescription: 'Verdichtung durch Nominalisierung',
    metaDescription: 'Nominalstil (C1): Informationsverdichtung durch Nominalisierung. Typisch für wissenschaftliche Texte.',
    orderInLevel: 9
  },
  {
    id: 'c1-partizipialkonstruktionen',
    slug: 'partizipialkonstruktionen',
    title: 'Partizipialkonstruktionen',
    level: 'C1',
    category: 'passiv',
    shortDescription: 'Erweiterte Partizipialattribute',
    metaDescription: 'Partizipialkonstruktionen (C1): Erweiterte Partizipialattribute zur Satzverdichtung.',
    orderInLevel: 10
  },
  {
    id: 'c1-genitiv-gehobene-sprache',
    slug: 'genitiv-gehobene-sprache',
    title: 'Genitiv gehobene Sprache',
    level: 'C1',
    category: 'genitiv',
    shortDescription: 'Genitivketten, Stilniveau',
    metaDescription: 'Genitiv gehobene Sprache (C1): Komplexe Genitivkonstruktionen in formellen Texten.',
    orderInLevel: 11
  }
];

// Helper functions
export function getTopicsByLevel(level: GrammarLevel): GrammarTopic[] {
  return grammarTopics.filter(topic => topic.level === level);
}

export function getTopicsByCategory(category: GrammarCategory): GrammarTopic[] {
  return grammarTopics.filter(topic => topic.category === category);
}

export function getTopicBySlugAndLevel(slug: string, level: GrammarLevel): GrammarTopic | undefined {
  return grammarTopics.find(topic => topic.slug === slug && topic.level === level);
}

export function getTopicById(id: string): GrammarTopic | undefined {
  return grammarTopics.find(topic => topic.id === id);
}

export function getPopularTopics(count: number = 6): GrammarTopic[] {
  // Return some popular topics for the main page
  const popularIds = [
    'b1-wechselpraepositionen',
    'b2-adjektivdeklination-system',
    'b1-konjunktiv-2',
    'b2-indirekte-rede',
    'b1-verben-mit-praeposition',
    'b1-relativsaetze'
  ];

  return popularIds
    .map(id => getTopicById(id))
    .filter((topic): topic is GrammarTopic => topic !== undefined)
    .slice(0, count);
}
