export type GrammarUiTopicId =
  | "satzbau"
  | "verben"
  | "nomen"
  | "adjektive"
  | "praepositionen"
  | "artikel";

export interface GrammarSection {
  id: string;
  name: string;
  grammar_ui_topics: GrammarUiTopicId[];
  points: string[];
}

export interface GrammarSectionsByLevel {
  [level: string]: GrammarSection[];
}

export const grammarSections: GrammarSectionsByLevel = {
  b2: [
    {
      id: "satzbau_wortstellung",
      name: "Satzbau und Wortstellung",
      grammar_ui_topics: ["verben"],
      points: [
        "Verbzweitstellung im Hauptsatz",
        "Verbendstellung im Nebensatz",
        "Vorfeld, Mittelfeld, Nachfeld (Grundprinzipien)",
        'Stellung von „nicht"',
        "Reihenfolge von Adverbialen (Zeit – Art – Ort)",
        "Inversion nach Voranstellung von Adverbialen oder Objekten",
      ],
    },
    {
      id: "konnektoren_nebensaetze",
      name: "Konjunktionen und Nebensätze (erweitert)",
      grammar_ui_topics: ["verben"],
      points: [
        "Kausale Konnektoren: weil, da",
        "Konzessive Konnektoren: obwohl, obgleich, trotzdem",
        "Adversative Konnektoren: während, hingegen, jedoch",
        "Konsekutive Konnektoren: sodass / so dass, deshalb, daher",
        "Konditionale Konnektoren: wenn, falls, sofern, vorausgesetzt, dass",
        "Satzstellung in komplexen Satzgefügen",
      ],
    },
    {
      id: "konditionalsaetze_konjunktiv2",
      name: "Konditionalsätze und Konjunktiv II",
      grammar_ui_topics: ["verben"],
      points: [
        "Irreale Bedingungen in der Gegenwart (wenn + Konjunktiv II / würde-Konstruktion)",
        "Irreale Bedingungen in der Vergangenheit (wenn + Plusquamperfekt / hätte …, wäre …)",
        'Konditionalsätze ohne „wenn" (Hätte ich mehr Zeit, …)',
        "Unterschied reale vs. irreale Bedingung",
      ],
    },
    {
      id: "passiv",
      name: "Passivformen (vertieft)",
      grammar_ui_topics: ["verben"],
      points: [
        "Vorgangspassiv in verschiedenen Zeiten (wird repariert, wurde repariert, ist repariert worden …)",
        "Zustandspassiv (ist repariert, war geöffnet …)",
        "Passiv mit Modalverben (kann repariert werden, musste geschlossen werden …)",
        "Alternativen zum Passiv: man-Sätze",
      ],
    },
    {
      id: "indirekte_rede",
      name: "Indirekte Rede / Konjunktiv I und II",
      grammar_ui_topics: ["verben"],
      points: [
        "Grundformen des Konjunktiv I in der indirekten Rede",
        "Wechsel zu Konjunktiv II bei Formgleichheit mit dem Indikativ",
        "Typische Verben der Redewiedergabe (sagen, berichten, meinen, behaupten …)",
        "Satzbau in der indirekten Rede",
      ],
    },
    {
      id: "adjektivdeklination",
      name: "Adjektivdeklination (vollständiges System)",
      grammar_ui_topics: ["adjektive"],
      points: [
        "Adjektivendungen nach bestimmtem Artikel (der, die, das …)",
        "Adjektivendungen nach unbestimmtem Artikel (ein, eine, kein, mein …)",
        "Adjektivendungen ohne Artikel (Nullartikel)",
        "Partizipien als Adjektive (die lachenden Kinder, die geschriebene Arbeit)",
      ],
    },
    {
      id: "relativsaetze",
      name: "Relativsätze (erweitert)",
      grammar_ui_topics: ["artikel"],
      points: [
        "Relativpronomen im Nominativ, Akkusativ, Dativ, Genitiv",
        "Relativsätze mit Präpositionen (der Mann, mit dem …; die Dinge, über die …)",
        "wo-/was-Relativsätze (alles, was …; der Ort, wo …)",
        "Kommasetzung und Satzstellung in Relativsätzen",
      ],
    },
    {
      id: "infinitivsaetze",
      name: "Infinitivsätze",
      grammar_ui_topics: ["verben"],
      points: [
        "Infinitivsätze mit um … zu",
        "Infinitivsätze mit ohne … zu",
        "Infinitivsätze mit anstatt … zu",
        "Stellung von zu + Infinitiv bei trennbaren und mehrteiligen Verben",
      ],
    },
    {
      id: "verben_praeposition",
      name: "Verben mit fester Präposition und Rektion",
      grammar_ui_topics: ["verben", "praepositionen"],
      points: [
        "Verb–Präposition-Kombinationen (warten auf, sich freuen über/auf, sich bewerben um, leiden an/unter, abhängen von …)",
        "Richtiger Kasus nach Präposition (Akkusativ vs. Dativ)",
        "Bedeutungsunterschiede durch verschiedene Präpositionen",
      ],
    },
    {
      id: "nominalisierung",
      name: "Nominalisierung und Nominalphrasen",
      grammar_ui_topics: ["artikel"],
      points: [
        "Verben als Nomen (das Rauchen, das Lernen, das Arbeiten …)",
        "Adjektive als Nomen (das Wichtige, das Neue …)",
        "Nominalisierte Strukturen zur Informationsverdichtung (nach der Einführung der Regel, bei steigender Nachfrage …)",
      ],
    },
    {
      id: "feste_verbindungen",
      name: "Nomen-Verb- und Adjektiv-Verb-Verbindungen",
      grammar_ui_topics: ["verben", "adjektive"],
      points: [
        "Häufige Nomen-Verb-Verbindungen (eine Entscheidung treffen, in Frage kommen, Verantwortung übernehmen …)",
        "Häufige Adjektiv-Verb-Verbindungen (verantwortlich sein für, interessiert sein an …)",
        "Typische formelle und halb-formelle Ausdrücke in Textproduktion",
      ],
    },
    {
      id: "genitiv",
      name: "Erweiterter Genitivgebrauch",
      grammar_ui_topics: ["artikel", "praepositionen"],
      points: [
        "Genitiv zur Bezeichnung von Besitz und Zugehörigkeit (die Folgen des Klimawandels)",
        "Häufige Genitivpräpositionen (trotz, während, wegen, innerhalb, außerhalb …)",
        "Genitivattribute in komplexen Nominalgruppen",
      ],
    },
  ],
};

// Helper function to get grammar sections for a specific level and topic
export function getGrammarSections(level: string, topic: string): GrammarSection[] {
  const levelSections = grammarSections[level.toLowerCase()] || [];
  const topicLower = topic.toLowerCase() as GrammarUiTopicId;
  return levelSections.filter((section) =>
    section.grammar_ui_topics.includes(topicLower)
  );
}

// Helper function to get a specific grammar section by ID
export function getGrammarSectionById(level: string, sectionId: string): GrammarSection | undefined {
  const levelSections = grammarSections[level.toLowerCase()] || [];
  return levelSections.find((section) => section.id === sectionId);
}

// Helper function to get all available grammar UI topics with display names
export function getAllGrammarUiTopics(): Array<{ id: GrammarUiTopicId; name: string }> {
  return [
    { id: "satzbau", name: "Satzbau" },
    { id: "verben", name: "Verben" },
    { id: "nomen", name: "Nomen" },
    { id: "adjektive", name: "Adjektive" },
    { id: "praepositionen", name: "Präpositionen" },
    { id: "artikel", name: "Artikel" },
  ];
}
