// b2_mock_exercises.ts
// B2 mock exercises for Infinite Grammar MVP
// Shape matches your BackendExercise type but without explicit typing
// so you can import `BackendExercise` and annotate later if you like.

// Example type (uncomment or adjust to your project):
// export interface BackendExercise {
//   config: {
//     grammar_section: string;
//     topic: string;
//     language_level: string;
//     exam_style: string;
//     min_gaps: number;
//     max_gaps: number;
//     model: string;
//   };
//   base_text: string;
//   cloze_text: string;
//   gaps: Array<{
//     n: number;
//     original: string;
//     distractors: string[];
//     explanation: string;
//   }>;
// }

// 1. B2 – Satzbau und Wortstellung – Exercise 1
export const b2_satzbau_wortstellung_1 = {
  config: {
    grammar_section: "Satzbau und Wortstellung",
    topic: "Zeitmanagement im Studium",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Morgens trinke ich zuerst einen Kaffee, dann lese ich meine E-Mails und danach beginne ich mit der wichtigsten Aufgabe. Wenn ich keine klare Priorität habe, arbeite ich oft an vielen kleinen Dingen gleichzeitig und komme mit dem eigentlichen Projekt nicht voran. Deshalb plane ich mir inzwischen jeden Abend für den nächsten Tag drei konkrete Ziele ein.",
  cloze_text:
    "[1] trinke ich [2] einen Kaffee, dann [3] ich meine E-Mails und [4] beginne ich mit der wichtigsten Aufgabe. Wenn ich keine klare Priorität habe, arbeite ich oft an vielen kleinen Dingen gleichzeitig und komme mit dem eigentlichen Projekt nicht voran. Deshalb plane ich mir inzwischen jeden Abend für den nächsten Tag drei konkrete Ziele ein.",
  gaps: [
    {
      n: 1,
      original: "Morgens",
      distractors: ["Ich", "Oft", "Deshalb"],
      explanation:
        "„Morgens\" steht hier im Vorfeld, danach folgt das konjugierte Verb an zweiter Stelle („trinke\"). „Ich\" würde das Subjekt an den Satzanfang stellen, was hier nicht gewollt ist."
    },
    {
      n: 2,
      original: "zuerst",
      distractors: ["nicht", "auch", "immer"],
      explanation:
        "„zuerst\" markiert die zeitliche Reihenfolge der Handlungen. Die anderen Adverbien passen semantisch nicht zur Aufzählung von Schritten."
    },
    {
      n: 3,
      original: "lese",
      distractors: ["ich lese", "lesen", "gelesen"],
      explanation:
        "Im zweiten Hauptsatz steht das Verb wieder an zweiter Stelle: „dann lese ich“. Die Form „ich lese\" würde die Wortstellung stören, „lesen\" und „gelesen\" sind grammatisch unpassend."
    },
    {
      n: 4,
      original: "danach",
      distractors: ["weil", "also", "oft"],
      explanation:
        "„danach\" knüpft zeitlich an die vorherigen Tätigkeiten an. „weil\" und „also\" sind Konnektoren mit anderer Funktion, „oft\" wäre ein Adverb der Häufigkeit und verändert die Aussage."
    }
  ]
};

// 2. B2 – Konjunktionen und Nebensätze (erweitert) – Exercise 1
export const b2_konnektoren_nebensaetze_1 = {
  config: {
    grammar_section: "Konjunktionen und Nebensätze (erweitert)",
    topic: "Arbeiten im Team",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Viele Teams haben Schwierigkeiten, effektiv zu kommunizieren, obwohl alle Mitglieder eigentlich das gleiche Ziel verfolgen. Wenn die Rollen nicht klar verteilt sind, entstehen Missverständnisse, sodass wichtige Aufgaben zu spät erledigt werden. Deshalb ist es sinnvoll, gleich zu Beginn gemeinsam zu besprechen, wer wofür verantwortlich ist.",
  cloze_text:
    "Viele Teams haben Schwierigkeiten, effektiv zu kommunizieren, [1] alle Mitglieder eigentlich das gleiche Ziel verfolgen. [2] die Rollen nicht klar verteilt sind, entstehen Missverständnisse, [3] wichtige Aufgaben zu spät erledigt werden. Deshalb ist es sinnvoll, gleich zu Beginn gemeinsam zu besprechen, wer wofür verantwortlich ist.",
  gaps: [
    {
      n: 1,
      original: "obwohl",
      distractors: ["weil", "wenn", "während"],
      explanation:
        "„obwohl\" drückt einen Gegensatz aus: Es gibt Schwierigkeiten, obwohl alle das gleiche Ziel haben. „weil\" würde einen Grund, nicht einen Gegensatz markieren."
    },
    {
      n: 2,
      original: "Wenn",
      distractors: ["Obwohl", "Da", "Während"],
      explanation:
        "„Wenn\" leitet hier eine konditionale Bedingung ein. Die anderen Konnektoren würden eine andere logische Beziehung ausdrücken (Konzessiv, Kausal, Temporal)."
    },
    {
      n: 3,
      original: "sodass",
      distractors: ["obwohl", "damit", "während"],
      explanation:
        "„sodass\" drückt hier eine Folge aus: Missverständnisse führen dazu, dass Aufgaben zu spät erledigt werden. „damit\" wäre final und würde ein Ziel markieren."
    }
  ]
};

// 3. B2 – Konditionalsätze und Konjunktiv II – Exercise 1
export const b2_konditionalsaetze_konjunktiv2_1 = {
  config: {
    grammar_section: "Konditionalsätze und Konjunktiv II",
    topic: "Weiterbildung und Karriere",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Wenn ich mehr Zeit hätte, würde ich gern noch ein zusätzliches Zertifikat machen. Viele Kolleginnen sagen, sie würden sich auch weiterbilden, wenn ihr Arbeitgeber die Kosten übernehmen würde. Hätte ich früher gewusst, wie wichtig diese Qualifikation ist, hätte ich schon vor Jahren damit angefangen.",
  cloze_text:
    "Wenn ich mehr Zeit [1], [2] ich gern noch ein zusätzliches Zertifikat machen. Viele Kolleginnen sagen, sie [3] sich auch weiterbilden, wenn ihr Arbeitgeber die Kosten übernehmen [4]. [5] ich früher gewusst, wie wichtig diese Qualifikation ist, [6] ich schon vor Jahren damit angefangen.",
  gaps: [
    {
      n: 1,
      original: "hätte",
      distractors: ["habe", "hatte", "haben"],
      explanation:
        "„hätte\" steht im Konjunktiv II und beschreibt eine irreale Bedingung in der Gegenwart. „habe\" und „hatte\" sind Indikativformen."
    },
    {
      n: 2,
      original: "würde",
      distractors: ["werde", "wird", "wäre"],
      explanation:
        "„würde\" + Infinitiv ist hier die übliche Form für eine hypothetische Folge. „werde/wird\" wären Indikativ Zukunft, „wäre\" gehört zu „sein“."
    },
    {
      n: 3,
      original: "würden",
      distractors: ["werden", "wurden", "wären"],
      explanation:
        "„würden“ steht im Konjunktiv II Plural und passt zum Subjekt „sie“. „werden/wurden“ sind Indikativformen."
    },
    {
      n: 4,
      original: "würde",
      distractors: ["wird", "hätte", "wäre"],
      explanation:
        "Auch hier drückt „würde“ eine irreale Bedingung aus: Nur wenn der Arbeitgeber die Kosten übernehmen würde, würden sie sich weiterbilden."
    },
    {
      n: 5,
      original: "Hätte",
      distractors: ["Wenn", "Würde", "Wäre"],
      explanation:
        "Im verkürzten Konditionalsatz ohne „wenn“ steht die Verbform an erster Stelle: „Hätte ich früher gewusst ...“."
    },
    {
      n: 6,
      original: "hätte",
      distractors: ["würde", "habe", "hatte"],
      explanation:
        "Für die irreale Vergangenheit verwendet man „hätte“ + Partizip II: „hätte ich ... angefangen“. „würde“ + Partizip steht im Deutschen hier nicht."
    }
  ]
};

// 4. B2 – Passivformen (vertieft) – Exercise 1
export const b2_passiv_1 = {
  config: {
    grammar_section: "Passivformen (vertieft)",
    topic: "Öffentliche Bauprojekte",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Die neue Brücke wird zurzeit gebaut und soll Ende des Jahres fertiggestellt sein. In der Vergangenheit wurden ähnliche Projekte oft verzögert, weil die Anwohner nicht rechtzeitig informiert wurden. Dieses Mal ist aber geplant, die Bevölkerung schon früh in den Entscheidungsprozess einzubeziehen.",
  cloze_text:
    "Die neue Brücke [1] zurzeit gebaut und soll Ende des Jahres fertiggestellt [2]. In der Vergangenheit [3] ähnliche Projekte oft verzögert, weil die Anwohner nicht rechtzeitig informiert [4]. Dieses Mal ist aber geplant, die Bevölkerung schon früh in den Entscheidungsprozess einzubeziehen.",
  gaps: [
    {
      n: 1,
      original: "wird",
      distractors: ["ist", "war", "wäre"],
      explanation:
        "„wird gebaut\" ist Vorgangspassiv im Präsens. „ist gebaut\" wäre Zustandspassiv und würde den abgeschlossenen Zustand beschreiben."
    },
    {
      n: 2,
      original: "sein",
      distractors: ["werden", "worden", "gewesen"],
      explanation:
        "„fertiggestellt sein\" drückt den erwarteten Zustand in der Zukunft aus. „fertiggestellt werden\" würde den Vorgang betonen."
    },
    {
      n: 3,
      original: "wurden",
      distractors: ["werden", "sind", "waren"],
      explanation:
        "„wurden verzögert\" ist Passiv im Präteritum. „werden verzögert\" wäre Präsens, „waren verzögert\" ist eher Zustandspassiv."
    },
    {
      n: 4,
      original: "wurden",
      distractors: ["werden", "worden", "sind"],
      explanation:
        "Auch hier steht das Vorgangspassiv im Präteritum: „informiert wurden\". „worden\" ist Partizip, kein finites Verb."
    }
  ]
};

// 5. B2 – Indirekte Rede / Konjunktiv I und II – Exercise 1
export const b2_indirekte_rede_1 = {
  config: {
    grammar_section: "Indirekte Rede / Konjunktiv I und II",
    topic: "Unternehmenskommunikation",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Die Sprecherin sagte, das Unternehmen investiere weiterhin in nachhaltige Projekte. Sie betonte, man wolle die CO₂-Emissionen bis 2030 deutlich reduzieren. Auf Nachfrage erklärte sie, die Ergebnisse könnten sich in den nächsten Jahren noch verbessern.",
  cloze_text:
    "Die Sprecherin sagte, das Unternehmen [1] weiterhin in nachhaltige Projekte. Sie betonte, man [2] die CO₂-Emissionen bis 2030 deutlich reduzieren. Auf Nachfrage erklärte sie, die Ergebnisse [3] sich in den nächsten Jahren noch verbessern.",
  gaps: [
    {
      n: 1,
      original: "investiere",
      distractors: ["investiert", "investierte", "investieren würde"],
      explanation:
        "In der indirekten Rede wird hier der Konjunktiv I („investiere\") verwendet. „investiert\" wäre Indikativ und würde sich nicht von der direkten Rede unterscheiden."
    },
    {
      n: 2,
      original: "wolle",
      distractors: ["will", "wollte", "würde wollen"],
      explanation:
        "„man wolle\" ist Konjunktiv I und signalisiert, dass es sich um eine Wiedergabe handelt. „will\" und „wollte\" sind Indikativformen."
    },
    {
      n: 3,
      original: "könnten",
      distractors: ["können", "konnten", "würden können"],
      explanation:
        "„könnten\" ist Konjunktiv II und drückt eine Möglichkeit in der Zukunft aus. Oft wird Konjunktiv II verwendet, wenn Konjunktiv-I-Formen mit dem Indikativ identisch wären."
    }
  ]
};

// 6. B2 – Adjektivdeklination – Exercise 1
export const b2_adjektivdeklination_1 = {
  config: {
    grammar_section: "Adjektivdeklination (vollständiges System)",
    topic: "Wohnungssuche in der Stadt",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "In vielen großen Städten ist es schwierig, eine bezahlbare kleine Wohnung in guter Lage zu finden. Die meisten günstigen Angebote sind entweder sehr weit vom Zentrum entfernt oder haben einen schlechten Zustand. Trotzdem entscheiden sich viele Studierende für ein solches günstiges Zimmer, weil sie sich nichts anderes leisten können.",
  cloze_text:
    "In vielen [1] Städten ist es schwierig, eine [2] kleine Wohnung in [3] Lage zu finden. Die meisten [4] Angebote sind entweder sehr weit vom Zentrum entfernt oder haben einen [5] Zustand. Trotzdem entscheiden sich viele Studierende für ein solches günstiges Zimmer, weil sie sich nichts anderes leisten können.",
  gaps: [
    {
      n: 1,
      original: "großen",
      distractors: ["große", "großer", "groß"],
      explanation:
        "Nach „vielen\" ohne Artikel steht hier der Dativ Plural: „in vielen großen Städten\". Im Dativ Plural endet das Adjektiv immer auf „-en\"."
    },
    {
      n: 2,
      original: "bezahlbare",
      distractors: ["bezahlbaren", "bezahlbarer", "bezahlbares"],
      explanation:
        "„eine bezahlbare kleine Wohnung\" – nach unbestimmtem Artikel im Akkusativ Singular Feminin steht Adjektivendung „-e\"."
    },
    {
      n: 3,
      original: "guter",
      distractors: ["guten", "gute", "gut"],
      explanation:
        "„in guter Lage“ – Dativ Singular Feminin ohne Artikel: stark dekliniert, Endung „-er\"."
    },
    {
      n: 4,
      original: "günstigen",
      distractors: ["günstige", "günstiger", "günstigem"],
      explanation:
        "„die meisten günstigen Angebote“ – bestimmter Artikel im Plural, Adjektiv im Nominativ Plural mit Endung „-en\"."
    },
    {
      n: 5,
      original: "schlechten",
      distractors: ["schlechter", "schlechte", "schlechtem"],
      explanation:
        "„einen schlechten Zustand“ – Akkusativ Singular Maskulin nach unbestimmtem Artikel, daher „-en\"."
    }
  ]
};

// 7. B2 – Relativsätze (erweitert) – Exercise 1
export const b2_relativsaetze_1 = {
  config: {
    grammar_section: "Relativsätze (erweitert)",
    topic: "Nachhaltiger Konsum",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Viele Menschen kaufen Produkte, die sehr billig sind, deren Herstellung aber große Umweltschäden verursacht. Unternehmen, die transparent über ihre Lieferketten informieren, gewinnen das Vertrauen der Kundinnen und Kunden. Die Entscheidungen, die wir heute treffen, beeinflussen die Lebensqualität der Generationen, die nach uns kommen.",
  cloze_text:
    "Viele Menschen kaufen Produkte, [1] sehr billig sind, [2] Herstellung aber große Umweltschäden verursacht. Unternehmen, [3] transparent über ihre Lieferketten informieren, gewinnen das Vertrauen der Kundinnen und Kunden. Die Entscheidungen, die wir heute treffen, beeinflussen die Lebensqualität der Generationen, die nach uns kommen.",
  gaps: [
    {
      n: 1,
      original: "die",
      distractors: ["der", "denen", "deren"],
      explanation:
        "„Produkte, die sehr billig sind“ – Relativpronomen im Nominativ Plural, bezieht sich auf „Produkte\"."
    },
    {
      n: 2,
      original: "deren",
      distractors: ["deren die", "dessen", "denen"],
      explanation:
        "„deren Herstellung\" – Genitiv Plural, der Besitz anzeigt: die Herstellung dieser Produkte."
    },
    {
      n: 3,
      original: "die",
      distractors: ["der", "denen", "dessen"],
      explanation:
        "„Unternehmen, die transparent informieren“ – Relativpronomen im Nominativ Plural; „der\" wäre Singular, „denen\" Dativ."
    }
  ]
};

// 8. B2 – Infinitivsätze – Exercise 1
export const b2_infinitivsaetze_1 = {
  config: {
    grammar_section: "Infinitivsätze",
    topic: "Fremdsprachenlernen",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Ich habe mir vorgenommen, jeden Tag mindestens zwanzig Minuten zu lesen, um meinen Wortschatz zu erweitern. Außerdem versuche ich, Serien im Original zu schauen, ohne ständig nach Untertiteln zu suchen. Statt lange Grammatikregeln auswendig zu lernen, möchte ich mehr durch Kommunikation üben.",
  cloze_text:
    "Ich habe mir vorgenommen, jeden Tag mindestens zwanzig Minuten [1], [2] meinen Wortschatz [3]. Außerdem versuche ich, Serien im Original zu schauen, [4] ständig nach Untertiteln [5] suchen. Statt lange Grammatikregeln auswendig zu lernen, möchte ich mehr durch Kommunikation üben.",
  gaps: [
    {
      n: 1,
      original: "zu lesen",
      distractors: ["lesen", "am Lesen", "gelesen"],
      explanation:
        "Nach „vornehmen\" folgt ein Infinitiv mit „zu\": „vornehmen, etwas zu tun\". Ein bloßer Infinitiv ohne „zu\" ist hier nicht korrekt."
    },
    {
      n: 2,
      original: "um",
      distractors: ["ohne", "anstatt", "damit"],
      explanation:
        "„um ... zu\" drückt einen Zweck aus: lesen, um den Wortschatz zu erweitern. „ohne ... zu\" und „anstatt ... zu\" würden einen Gegensatz markieren."
    },
    {
      n: 3,
      original: "zu erweitern",
      distractors: ["erweitern", "erweitert", "zu erweitern zu können"],
      explanation:
        "Auch hier wird der Zweck mit „um ... zu + Infinitiv\" ausgedrückt: „um meinen Wortschatz zu erweitern\"."
    },
    {
      n: 4,
      original: "ohne",
      distractors: ["um", "anstatt", "damit"],
      explanation:
        "„ohne ... zu\" drückt aus, dass etwas nicht geschieht: Serien schauen, ohne nach Untertiteln zu suchen."
    },
    {
      n: 5,
      original: "zu",
      distractors: ["zu viel", "zum", "zu können"],
      explanation:
        "Nach „ohne\" folgt hier ebenfalls ein Infinitiv mit „zu\": „ohne ständig nach Untertiteln zu suchen\"."
    }
  ]
};

// 9. B2 – Verben mit fester Präposition und Rektion – Exercise 1
export const b2_verben_praeposition_1 = {
  config: {
    grammar_section: "Verben mit fester Präposition und Rektion",
    topic: "Berufliche Entscheidungen",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Viele Absolventinnen zweifeln an ihrer Entscheidung, wenn sie sich zu früh auf eine bestimmte Branche festgelegt haben. Andere bewerben sich gleichzeitig bei mehreren Unternehmen, um ihre Chancen auf eine Zusage zu erhöhen. Wer sich gut über die Arbeitsbedingungen informiert, kann später besser mit möglichen Enttäuschungen umgehen.",
  cloze_text:
    "Viele Absolventinnen zweifeln [1] ihrer Entscheidung, wenn sie sich zu früh [2] eine bestimmte Branche festgelegt haben. Andere bewerben sich gleichzeitig [3] mehreren Unternehmen, [4] ihre Chancen [5] eine Zusage zu erhöhen. Wer sich gut über die Arbeitsbedingungen informiert, kann später besser mit möglichen Enttäuschungen umgehen.",
  gaps: [
    {
      n: 1,
      original: "an",
      distractors: ["auf", "über", "mit"],
      explanation:
        "„zweifeln an + Dativ\": man zweifelt an einer Entscheidung, nicht *über* oder *auf* einer Entscheidung."
    },
    {
      n: 2,
      original: "auf",
      distractors: ["an", "über", "für"],
      explanation:
        "„sich festlegen auf + Akkusativ\": man legt sich auf eine Branche fest."
    },
    {
      n: 3,
      original: "bei",
      distractors: ["an", "auf", "mit"],
      explanation:
        "„sich bewerben bei + Dativ (Firma)“: man bewirbt sich bei einem Unternehmen, aber um eine Stelle."
    },
    {
      n: 4,
      original: "um",
      distractors: ["an", "auf", "für"],
      explanation:
        "Hier geht es um „Chancen auf eine Zusage erhöhen“: man erhöht seine Chancen, um eine Zusage zu bekommen."
    },
    {
      n: 5,
      original: "auf",
      distractors: ["an", "über", "mit"],
      explanation:
        "„Chancen auf + Akkusativ“: man hat Chancen auf eine Zusage."
    }
  ]
};

// 10. B2 – Nominalisierung und Nominalphrasen – Exercise 1
export const b2_nominalisierung_1 = {
  config: {
    grammar_section: "Nominalisierung und Nominalphrasen",
    topic: "Digitalisierung im Alltag",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Durch die ständige Nutzung von Smartphones hat sich unser Kommunikationsverhalten stark verändert. Die Einführung neuer Apps führt dazu, dass viele Tätigkeiten inzwischen online erledigt werden. Für die meisten Menschen ist das schnelle Versenden von Nachrichten selbstverständlich geworden.",
  cloze_text:
    "Durch die [1] Nutzung von Smartphones hat sich unser Kommunikationsverhalten stark verändert. Die [2] neuer Apps führt dazu, dass viele Tätigkeiten inzwischen online erledigt werden. Für die meisten Menschen ist das [3] Versenden von Nachrichten selbstverständlich geworden.",
  gaps: [
    {
      n: 1,
      original: "ständige",
      distractors: ["ständig", "ständiger", "ständigen"],
      explanation:
        "Hier steht ein attributives Adjektiv vor einem nominalisierten Verb („Nutzung“): „die ständige Nutzung“."
    },
    {
      n: 2,
      original: "Einführung",
      distractors: ["einführen", "Einführungen", "eingeführt"],
      explanation:
        "Das Verb „einführen\" wird nominalisiert: „die Einführung neuer Apps\". Dadurch entsteht eine kompakte Nominalphrase."
    },
    {
      n: 3,
      original: "schnelle",
      distractors: ["schnell", "schneller", "schnelles"],
      explanation:
        "„das schnelle Versenden von Nachrichten\" – Adjektiv + nominalisiertes Verb; „schnelle\" passt zur Form „das ... Versenden\"."
    }
  ]
};

// 11. B2 – Nomen-Verb- und Adjektiv-Verb-Verbindungen – Exercise 1
export const b2_feste_verbindungen_1 = {
  config: {
    grammar_section: "Nomen-Verb- und Adjektiv-Verb-Verbindungen",
    topic: "Projektarbeit",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Bevor wir eine Entscheidung treffen, sollten wir alle Risiken in Betracht ziehen. Die Projektleitung hat großen Wert darauf gelegt, dass alle Beteiligten Zugang zu den wichtigsten Informationen bekommen. Jetzt steht das Team unter Druck, die vereinbarten Ziele rechtzeitig zu erreichen.",
  cloze_text:
    "Bevor wir eine [1] treffen, sollten wir alle Risiken in [2] ziehen. Die Projektleitung hat großen [3] darauf gelegt, dass alle Beteiligten Zugang zu den wichtigsten Informationen [4]. Jetzt steht das Team unter Druck, die vereinbarten Ziele rechtzeitig zu erreichen.",
  gaps: [
    {
      n: 1,
      original: "Entscheidung",
      distractors: ["Entscheidung machen", "entscheiden", "Entscheid"],
      explanation:
        "Feste Verbindung: „eine Entscheidung treffen\", nicht *eine Entscheidung machen*."
    },
    {
      n: 2,
      original: "Betracht",
      distractors: ["Frage", "Diskussion", "Bedacht"],
      explanation:
        "Feste Nomen-Verb-Verbindung: „etwas in Betracht ziehen\"."
    },
    {
      n: 3,
      original: "Wert",
      distractors: ["Druck", "Zeit", "Frage"],
      explanation:
        "Feste Verbindung: „großen Wert auf etwas legen\"."
    },
    {
      n: 4,
      original: "bekommen",
      distractors: ["machen", "nehmen", "stellen"],
      explanation:
        "„Zugang zu Informationen bekommen\" ist eine übliche Kombination. Die anderen Verben passen hier nicht."
    }
  ]
};

// 12. B2 – Erweiterter Genitivgebrauch – Exercise 1
export const b2_genitiv_1 = {
  config: {
    grammar_section: "Erweiterter Genitivgebrauch",
    topic: "Klimawandel",
    language_level: "B2",
    exam_style: "Lückentext, TELC / TestDaF stilnah",
    min_gaps: 3,
    max_gaps: 6,
    model: "mvp-static"
  },
  base_text:
    "Die Folgen des Klimawandels sind in vielen Regionen der Welt bereits deutlich spürbar. Trotz der Warnungen zahlreicher Wissenschaftlerinnen und Wissenschaftler werden weiterhin große Mengen an Treibhausgasen ausgestoßen. Wegen fehlender politischer Maßnahmen verzögert sich die Umsetzung wirksamer Strategien.",
  cloze_text:
    "Die Folgen [1] Klimawandels sind in vielen Regionen der Welt bereits deutlich spürbar. Trotz [2] zahlreicher Wissenschaftlerinnen und Wissenschaftler werden weiterhin große Mengen an Treibhausgasen ausgestoßen. [3] fehlender politischer Maßnahmen verzögert sich die Umsetzung wirksamer Strategien.",
  gaps: [
    {
      n: 1,
      original: "des",
      distractors: ["dem", "der", "den"],
      explanation:
        "„die Folgen des Klimawandels\" – Genitiv Singular Maskulin mit bestimmtem Artikel „des\"."
    },
    {
      n: 2,
      original: "der Warnungen",
      distractors: ["die Warnungen", "den Warnungen", "Warnungen"],
      explanation:
        "Nach „trotz\" steht der Genitiv: „trotz der Warnungen\". Nominativ oder Dativ wären hier falsch."
    },
    {
      n: 3,
      original: "Wegen",
      distractors: ["Trotz", "Innerhalb", "Während"],
      explanation:
        "„Wegen\" ist eine Genitivpräposition und leitet hier die Ursache ein: „wegen fehlender politischer Maßnahmen\"."
    }
  ]
};
