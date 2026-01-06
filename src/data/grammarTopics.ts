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
    slug: 'wortstellung-regeln-lernen',
    title: 'Deutsche Wortstellung A1',
    level: 'A1',
    category: 'satzbau',
    shortDescription: 'Grundlegende Satzstellung im Deutschen',
    metaDescription: 'Lernen Sie die deutsche Wortstellung mit einfachen A1-Regeln, praktischen Beispielen und interaktiven Übungen. Perfekt für Anfänger! ✓ Kostenlos ✓ Mit Lösungen',
    orderInLevel: 1
  },
  {
    id: 'a1-praesens',
    slug: 'praesens-gegenwart-deutsch',
    title: 'Deutsche Präsens A1',
    level: 'A1',
    category: 'zeiten',
    shortDescription: 'Gegenwart: regelmäßige und unregelmäßige Verben',
    metaDescription: 'Lernen Sie das Präsens (Gegenwart) im Deutschen mit klaren A1-Regeln für regelmäßige und unregelmäßige Verben. ✓ Einfache Erklärungen ✓ Viele Beispiele ✓ Übungen',
    orderInLevel: 2
  },
  {
    id: 'a1-imperativ',
    slug: 'imperativ-befehlsform-deutsch',
    title: 'Deutsche Imperativ A1',
    level: 'A1',
    category: 'zeiten',
    shortDescription: 'Befehlsform: du, ihr, Sie',
    metaDescription: 'Meistern Sie den Imperativ (Befehlsform) auf Deutsch! A1-Regeln für du, ihr und Sie mit praktischen Beispielen. ✓ Anfängerfreundlich ✓ Mit Übungen ✓ Kostenlos',
    orderInLevel: 3
  },
  {
    id: 'a1-artikel-nominativ',
    slug: 'artikel-nominativ-der-die-das',
    title: 'Deutsche Artikel Nominativ A1',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'Bestimmte und unbestimmte Artikel',
    metaDescription: 'Verstehen Sie der, die, das und ein, eine: Bestimmte und unbestimmte Artikel im Nominativ (A1). ✓ Einfache Regeln ✓ Tipps zum Lernen ✓ Mit Beispielen und Übungen',
    orderInLevel: 4
  },
  {
    id: 'a1-personalpronomen',
    slug: 'personalpronomen-nominativ-ich-du-er',
    title: 'Deutsche Personalpronomen Nominativ A1',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'ich, du, er, sie, es, wir, ihr, sie',
    metaDescription: 'Lernen Sie die deutschen Personalpronomen (ich, du, er, sie, es, wir, ihr, sie) im Nominativ. A1-Niveau mit klaren Beispielen. ✓ Einfach erklärt ✓ Mit Tabellen ✓ Übungen',
    orderInLevel: 5
  },
  {
    id: 'a1-pluralbildung',
    slug: 'pluralbildung-plural-deutsch-lernen',
    title: 'Deutsche Pluralbildung A1',
    level: 'A1',
    category: 'nomen',
    shortDescription: 'Wie man den Plural bildet',
    metaDescription: 'So bilden Sie den Plural im Deutschen! A1-Regeln für alle Pluralendungen (-e, -en, -er, -s) mit Beispielen und Merktipps. ✓ Übersichtlich ✓ Mit Übungen ✓ Kostenlos',
    orderInLevel: 6
  },
  {
    id: 'a1-praepositionen-ort',
    slug: 'lokale-praepositionen-ort-deutsch',
    title: 'Deutsche Präpositionen Ort A1',
    level: 'A1',
    category: 'kasus',
    shortDescription: 'in, auf, an, bei, vor, hinter, ...',
    metaDescription: 'Wo ist etwas? Lernen Sie lokale Präpositionen (in, auf, an, bei, vor, hinter) für Ortsangaben. A1-Niveau mit vielen Beispielen. ✓ Einfach ✓ Praxisnah ✓ Mit Übungen',
    orderInLevel: 7
  },
  {
    id: 'a1-zeitpraepositionen',
    slug: 'temporale-praepositionen-zeit-deutsch',
    title: 'Deutsche Zeitpräpositionen A1',
    level: 'A1',
    category: 'kasus',
    shortDescription: 'um, am, im, von...bis',
    metaDescription: 'Wann passiert etwas? Meistern Sie temporale Präpositionen (um, am, im, von...bis) für Zeitangaben. A1-Regeln mit Beispielen. ✓ Klar strukturiert ✓ Mit Übungen ✓ Kostenlos',
    orderInLevel: 8
  },
  {
    id: 'a1-adjektive-grundform',
    slug: 'adjektive-grundform-deutsch',
    title: 'Deutsche Adjektive Grundform A1',
    level: 'A1',
    category: 'adjektive',
    shortDescription: 'Prädikative und adverbiale Verwendung',
    metaDescription: 'Adjektive ohne Endungen: Lernen Sie prädikative und adverbiale Adjektive im Deutschen (A1). ✓ Keine Deklination ✓ Einfach erklärt ✓ Mit Beispielen und Übungen',
    orderInLevel: 9
  },

  // A2 Level
  {
    id: 'a2-komplexe-saetze',
    slug: 'komplexe-saetze-nebensaetze-deutsch',
    title: 'Komplexe Sätze A2',
    level: 'A2',
    category: 'satzbau',
    shortDescription: 'Hauptsatz + Hauptsatz, erste Nebensätze',
    metaDescription: 'Bilden Sie komplexe Sätze im Deutschen! A2-Regeln für Haupt- und Nebensätze mit Konjunktionen und Wortstellung. ✓ Verständlich ✓ Mit Beispielen ✓ Übungen',
    orderInLevel: 1
  },
  {
    id: 'a2-perfekt-praeteritum',
    slug: 'perfekt-praeteritum-vergangenheit-deutsch',
    title: 'Perfekt vs. Präteritum A2',
    level: 'A2',
    category: 'zeiten',
    shortDescription: 'Unterschied zwischen Perfekt und Präteritum',
    metaDescription: 'Perfekt oder Präteritum? Lernen Sie den Unterschied zwischen beiden Vergangenheitsformen im Deutschen (A2). ✓ Klare Regeln ✓ Wann was? ✓ Mit Beispielen und Übungen',
    orderInLevel: 2
  },
  {
    id: 'a2-modalverben',
    slug: 'modalverben-koennen-muessen-wollen-deutsch',
    title: 'Deutsche Modalverben A2',
    level: 'A2',
    category: 'zeiten',
    shortDescription: 'können, müssen, wollen, sollen, dürfen, mögen',
    metaDescription: 'Meistern Sie die 6 deutschen Modalverben (können, müssen, wollen, sollen, dürfen, mögen)! A2-Niveau mit Bedeutungen und Beispielen. ✓ Praxisnah ✓ Mit Übungen ✓ Kostenlos',
    orderInLevel: 3
  },
  {
    id: 'a2-trennbare-verben',
    slug: 'trennbare-verben-aufstehen-einkaufen',
    title: 'Trennbare Verben A2',
    level: 'A2',
    category: 'verben',
    shortDescription: 'aufstehen, einkaufen, mitnehmen, ...',
    metaDescription: 'Verstehen Sie trennbare Verben (aufstehen, einkaufen, mitnehmen)! A2-Regeln für Bildung und Wortstellung. ✓ Einfach erklärt ✓ Viele Beispiele ✓ Mit Übungen',
    orderInLevel: 4
  },
  {
    id: 'a2-pronomen-grundlagen',
    slug: 'pronomen-akkusativ-dativ-deutsch',
    title: 'Pronomen Grundlagen A2',
    level: 'A2',
    category: 'nomen',
    shortDescription: 'Akkusativ- und Dativpronomen',
    metaDescription: 'Lernen Sie deutsche Pronomen im Akkusativ und Dativ (A2): Personal-, Possessiv- und Demonstrativpronomen. ✓ Übersichtliche Tabellen ✓ Beispiele ✓ Übungen',
    orderInLevel: 5
  },
  {
    id: 'a2-artikel-kasus',
    slug: 'artikel-kasus-vier-faelle-deutsch',
    title: 'Artikel & Kasus A2',
    level: 'A2',
    category: 'nomen',
    shortDescription: 'Nominativ, Akkusativ, Dativ',
    metaDescription: 'Die vier Fälle im Deutschen verstehen! A2-Regeln für Nominativ, Akkusativ, Dativ und Genitiv mit Artikeln. ✓ Systematisch ✓ Mit Tabellen ✓ Übungen',
    orderInLevel: 6
  },
  {
    id: 'a2-praepositionen-ort-richtung',
    slug: 'praepositionen-ort-richtung-wo-wohin',
    title: 'Präpositionen Ort & Richtung A2',
    level: 'A2',
    category: 'kasus',
    shortDescription: 'Lokale Präpositionen erweitert',
    metaDescription: 'Wo oder wohin? Erweiterte lokale Präpositionen im Deutschen (A2) mit Akkusativ und Dativ. ✓ Klare Unterscheidung ✓ Viele Beispiele ✓ Mit Übungen',
    orderInLevel: 7
  },
  {
    id: 'a2-adjektivdeklination-einstieg',
    slug: 'adjektivdeklination-einstieg-endungen',
    title: 'Adjektivdeklination Einstieg A2',
    level: 'A2',
    category: 'adjektive',
    shortDescription: 'Erste Endungen bei attributiven Adjektiven',
    metaDescription: 'Ihr Einstieg in die Adjektivdeklination! A2-Grundlagen für Adjektivendungen vor Nomen. ✓ Schritt für Schritt ✓ Verständlich ✓ Mit Beispielen und Übungen',
    orderInLevel: 8
  },
  {
    id: 'a2-komparativ-superlativ',
    slug: 'komparativ-superlativ-steigerung-adjektive',
    title: 'Komparativ & Superlativ A2',
    level: 'A2',
    category: 'adjektive',
    shortDescription: 'Steigerung von Adjektiven',
    metaDescription: 'Steigern Sie Adjektive richtig! A2-Regeln für Komparativ und Superlativ im Deutschen. ✓ Einfache Bildung ✓ Unregelmäßige Formen ✓ Mit Beispielen und Übungen',
    orderInLevel: 9
  },

  // B1 Level
  {
    id: 'b1-nebensaetze-konjunktionen',
    slug: 'nebensaetze-konjunktionen-weil-dass-obwohl',
    title: 'Nebensätze & Konjunktionen B1',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'weil, dass, obwohl, während, ...',
    metaDescription: 'Meistern Sie deutsche Nebensätze mit Konjunktionen (weil, dass, obwohl, während)! B1-Regeln für kausale, temporale und konzessive Sätze. ✓ Systematisch ✓ Mit Übungen',
    orderInLevel: 1
  },
  {
    id: 'b1-relativsaetze',
    slug: 'relativsaetze-relativpronomen-deutsch',
    title: 'Deutsche Relativsätze B1',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'der, die, das als Relativpronomen',
    metaDescription: 'Relativsätze bilden leicht gemacht! B1-Regeln für Relativpronomen (der, die, das) in allen Fällen. ✓ Mit Tabellen ✓ Viele Beispiele ✓ Übungen',
    orderInLevel: 2
  },
  {
    id: 'b1-indirekte-fragen',
    slug: 'indirekte-fragen-ob-wann-wo-wie',
    title: 'Indirekte Fragen B1',
    level: 'B1',
    category: 'satzbau',
    shortDescription: 'Ich weiß nicht, ob/wann/wo/...',
    metaDescription: 'Lernen Sie indirekte Fragen im Deutschen (B1): Fragesätze als Nebensätze mit ob, wann, wo, wie. ✓ Klare Regeln ✓ Wortstellung ✓ Mit Beispielen und Übungen',
    orderInLevel: 3
  },
  {
    id: 'b1-futur',
    slug: 'futur-1-zukunft-deutsch-werden',
    title: 'Futur I B1',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'Zukunft mit werden + Infinitiv',
    metaDescription: 'Die Zukunft auf Deutsch ausdrücken! B1-Regeln für Futur I mit werden + Infinitiv. ✓ Bildung ✓ Verwendung ✓ Wann Futur I? ✓ Mit Beispielen und Übungen',
    orderInLevel: 4
  },
  {
    id: 'b1-modalverben-praeteritum',
    slug: 'modalverben-praeteritum-konnte-musste',
    title: 'Modalverben Präteritum B1',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'konnte, musste, wollte, ...',
    metaDescription: 'Modalverben in der Vergangenheit! B1-Regeln für Präteritum (konnte, musste, wollte, sollte, durfte, mochte). ✓ Bildung ✓ Verwendung ✓ Mit Beispielen',
    orderInLevel: 5
  },
  {
    id: 'b1-konjunktiv-2',
    slug: 'konjunktiv-2-wuensche-hoeflichkeit',
    title: 'Konjunktiv II B1',
    level: 'B1',
    category: 'zeiten',
    shortDescription: 'Wünsche und Höflichkeit',
    metaDescription: 'Höflich und wünschend! Lernen Sie Konjunktiv II für höfliche Bitten, irreale Wünsche und Bedingungen (B1). ✓ Würde-Form ✓ Echte Formen ✓ Mit vielen Beispielen',
    orderInLevel: 6
  },
  {
    id: 'b1-reflexive-verben',
    slug: 'reflexive-verben-sich-freuen-erinnern',
    title: 'Reflexive Verben B1',
    level: 'B1',
    category: 'verben',
    shortDescription: 'sich freuen, sich erinnern, ...',
    metaDescription: 'Verstehen Sie reflexive Verben (sich freuen, sich erinnern)! B1-Regeln für Verben mit Reflexivpronomen. ✓ Akkusativ vs. Dativ ✓ Listen ✓ Mit Beispielen und Übungen',
    orderInLevel: 7
  },
  {
    id: 'b1-verben-mit-praeposition',
    slug: 'verben-mit-praeposition-warten-auf-denken-an',
    title: 'Verben mit Präposition B1',
    level: 'B1',
    category: 'verben',
    shortDescription: 'warten auf, denken an, sich freuen über, ...',
    metaDescription: 'Meistern Sie Verben mit festen Präpositionen (warten auf, denken an)! B1-Regeln für Rektion und Pronominaladverbien (darauf, darüber). ✓ Wichtige Listen ✓ Mit Übungen',
    orderInLevel: 8
  },
  {
    id: 'b1-wechselpraepositionen',
    slug: 'wechselpraepositionen-wo-wohin-dativ-akkusativ',
    title: 'Wechselpräpositionen: Wo? Wohin? B1',
    level: 'B1',
    category: 'kasus',
    shortDescription: 'Dativ (wo?) vs. Akkusativ (wohin?)',
    metaDescription: 'Wo oder wohin? Verstehen Sie Wechselpräpositionen (B1): Dativ für Ort, Akkusativ für Richtung. ✓ Klare Unterscheidung ✓ Häufige Fehler vermeiden ✓ Mit vielen Beispielen',
    orderInLevel: 9
  },
  {
    id: 'b1-praepositionen-ort-zeit',
    slug: 'praepositionen-ort-zeit-kombiniert',
    title: 'Präpositionen Ort & Zeit B1',
    level: 'B1',
    category: 'kasus',
    shortDescription: 'Kombination lokaler und temporaler Angaben',
    metaDescription: 'Kombinieren Sie Orts- und Zeitangaben richtig! B1-Regeln für lokale und temporale Präpositionen zusammen. ✓ Praktische Beispiele ✓ Typische Sätze ✓ Mit Übungen',
    orderInLevel: 10
  },
  {
    id: 'b1-adjektivdeklination-nom-akk',
    slug: 'adjektivdeklination-nominativ-akkusativ-b1',
    title: 'Adjektivdeklination Nom/Akk B1',
    level: 'B1',
    category: 'adjektive',
    shortDescription: 'Systematischer Einstieg: Nominativ und Akkusativ',
    metaDescription: 'Systematische Adjektivdeklination! B1-Regeln für Nominativ und Akkusativ mit allen Endungen. ✓ Übersichtliche Tabellen ✓ Bestimmte/Unbestimmte Artikel ✓ Mit Übungen',
    orderInLevel: 11
  },
  {
    id: 'b1-passiv-einstieg',
    slug: 'passiv-einstieg-vorgangspassiv-werden',
    title: 'Passiv Einstieg B1',
    level: 'B1',
    category: 'passiv',
    shortDescription: 'Vorgangspassiv Präsens und Präteritum',
    metaDescription: 'Ihr Einstieg ins deutsche Passiv! B1-Regeln für Vorgangspassiv mit werden + Partizip II. ✓ Bildung ✓ Verwendung ✓ Präsens & Präteritum ✓ Mit Beispielen und Übungen',
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
