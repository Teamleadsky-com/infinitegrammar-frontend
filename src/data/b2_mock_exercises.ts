// b2_mock_exercises.ts
// B2 mock exercises for Infinite Grammar MVP
// Simplified structure without nested config

import { GrammarUiTopicId } from "./grammarSections";

export interface Exercise {
  id: string;
  level: string;
  grammar_section_id: string;
  grammar_ui_topics: GrammarUiTopicId[];
  content_topic: string;
  model: string;
  text: string;
  gaps: Array<{
    no: number;
    correct: string;
    distractors: string[];
    explanation: string;
  }>;
}

// 1. B2 – Satzbau und Wortstellung – Exercise 1
export const b2_satzbau_wortstellung_1: Exercise = {
  id: "b2_satzbau_wortstellung_1",
  level: "B2",
  grammar_section_id: "satzbau_wortstellung",
  grammar_ui_topics: ["satzbau", "verben"],
  content_topic: "Zeitmanagement im Studium",
  model: "mvp-static",
  text: "[1] trinke ich [2] einen Kaffee, dann [3] ich meine E-Mails und [4] beginne ich mit der wichtigsten Aufgabe. Wenn ich keine klare Priorität habe, arbeite ich oft an vielen kleinen Dingen gleichzeitig und komme mit dem eigentlichen Projekt nicht voran. Deshalb plane ich mir inzwischen jeden Abend für den nächsten Tag drei konkrete Ziele ein.",
  gaps: [
    {
      no: 1,
      correct: "Morgens",
      distractors: ["Ich", "Oft", "Deshalb"],
      explanation: `„Morgens" steht hier im Vorfeld, danach folgt das konjugierte Verb an zweiter Stelle („trinke"). „Ich" würde das Subjekt an den Satzanfang stellen, was hier nicht gewollt ist.`
    },
    {
      no: 2,
      correct: "zuerst",
      distractors: ["nicht", "auch", "immer"],
      explanation: `„zuerst" markiert die zeitliche Reihenfolge der Handlungen. Die anderen Adverbien passen semantisch nicht zur Aufzählung von Schritten.`
    },
    {
      no: 3,
      correct: "lese",
      distractors: ["ich lese", "lesen", "gelesen"],
      explanation: `Im zweiten Hauptsatz steht das Verb wieder an zweiter Stelle: „dann lese ich". Die Form „ich lese" würde die Wortstellung stören, „lesen" und „gelesen" sind grammatisch unpassend.`
    },
    {
      no: 4,
      correct: "danach",
      distractors: ["weil", "also", "oft"],
      explanation: `„danach" knüpft zeitlich an die vorherigen Tätigkeiten an. „weil" und „also" sind Konnektoren mit anderer Funktion, „oft" wäre ein Adverb der Häufigkeit und verändert die Aussage.`
    }
  ]
};

// 2. B2 – Konjunktionen und Nebensätze (erweitert) – Exercise 1
export const b2_konnektoren_nebensaetze_1: Exercise = {
  id: "b2_konnektoren_nebensaetze_1",
  level: "B2",
  grammar_section_id: "konnektoren_nebensaetze",
  grammar_ui_topics: ["verben"],
  content_topic: "Arbeiten im Team",
  model: "mvp-static",
  text:
    "Viele Teams haben Schwierigkeiten, effektiv zu kommunizieren, [1] alle Mitglieder eigentlich das gleiche Ziel verfolgen. " +
    "[2] die Rollen nicht klar verteilt sind, entstehen Missverständnisse; [3] wichtige Aufgaben zu spät erledigt werden und die Stimmung im Team darunter leidet. " +
    "Deshalb ist es sinnvoll, gleich zu Beginn gemeinsam zu besprechen, wer wofür verantwortlich ist, [4] Konflikte gar nicht erst entstehen.",
  gaps: [
    {
      no: 1,
      correct: "obwohl",
      distractors: ["weil", "wenn", "während"],
      explanation: `„obwohl" drückt einen Gegensatz aus: Es gibt Schwierigkeiten, obwohl alle das gleiche Ziel haben. „weil" würde einen Grund, nicht einen Gegensatz markieren.`
    },
    {
      no: 2,
      correct: "Wenn",
      distractors: ["Obwohl", "Da", "Während"],
      explanation: `„Wenn" leitet hier eine Bedingung ein: Nur wenn die Rollen nicht klar verteilt sind, entstehen Missverständnisse. Die anderen Konnektoren hätten eine andere Bedeutung (konzessiv, kausal, temporal).`
    },
    {
      no: 3,
      correct: "sodass",
      distractors: ["obwohl", "damit", "während"],
      explanation: `„sodass" drückt eine Folge aus: Missverständnisse führen dazu, dass Aufgaben zu spät erledigt werden und die Stimmung leidet. „damit" wäre final und würde ein Ziel markieren.`
    },
    {
      no: 4,
      correct: "damit",
      distractors: ["obwohl", "während", "falls"],
      explanation: `„damit" leitet einen Finalsatz ein: Man bespricht Zuständigkeiten, damit Konflikte gar nicht erst entstehen. Die anderen Konnektoren passen semantisch nicht.`
    }
  ]
};

// 3. B2 – Konditionalsätze und Konjunktiv II – Exercise 1
export const b2_konditionalsaetze_konjunktiv2_1: Exercise = {
  id: "b2_konditionalsaetze_konjunktiv2_1",
  level: "B2",
  grammar_section_id: "konditionalsaetze_konjunktiv2",
  grammar_ui_topics: ["verben"],
  content_topic: "Weiterbildung und Karriere",
  model: "mvp-static",
  text:
    "Wenn ich mehr Zeit [1], [2] ich gern noch ein zusätzliches Zertifikat machen. Viele Kolleginnen sagen, sie [3] sich auch weiterbilden, wenn ihr Arbeitgeber die Kosten übernehmen [4]. [5] ich früher gewusst, wie wichtig diese Qualifikation ist, [6] ich schon vor Jahren damit angefangen.",
  gaps: [
    {
      no: 1,
      correct: "hätte",
      distractors: ["habe", "hatte", "haben"],
      explanation: `„hätte" steht im Konjunktiv II und beschreibt eine irreale Bedingung in der Gegenwart. „habe" und „hatte" sind Indikativformen.`
    },
    {
      no: 2,
      correct: "würde",
      distractors: ["werde", "wird", "wäre"],
      explanation: `„würde" + Infinitiv ist hier die übliche Form für eine hypothetische Folge. „werde/wird" wären Indikativ Zukunft, „wäre" gehört zu „sein".`
    },
    {
      no: 3,
      correct: "würden",
      distractors: ["werden", "wurden", "wären"],
      explanation: `„würden" steht im Konjunktiv II Plural und passt zum Subjekt „sie". „werden/wurden" sind Indikativformen.`
    },
    {
      no: 4,
      correct: "würde",
      distractors: ["wird", "hätte", "wäre"],
      explanation: `Auch hier drückt „würde" eine irreale Bedingung aus: Nur wenn der Arbeitgeber die Kosten übernehmen würde, würden sie sich weiterbilden.`
    },
    {
      no: 5,
      correct: "Hätte",
      distractors: ["Wenn", "Würde", "Wäre"],
      explanation: `Im verkürzten Konditionalsatz ohne „wenn" steht die Verbform an erster Stelle: „Hätte ich früher gewusst ...".`
    },
    {
      no: 6,
      correct: "hätte",
      distractors: ["würde", "habe", "hatte"],
      explanation: `Für die irreale Vergangenheit verwendet man „hätte" + Partizip II: „hätte ich ... angefangen". „würde" + Partizip steht im Deutschen hier nicht.`
    }
  ]
};

// 4. B2 – Passivformen (vertieft) – Exercise 1
export const b2_passiv_1: Exercise = {
  id: "b2_passiv_1",
  level: "B2",
  grammar_section_id: "passiv",
  grammar_ui_topics: ["verben"],
  content_topic: "Öffentliche Bauprojekte",
  model: "mvp-static",
  text:
    "Die neue Brücke [1] zurzeit gebaut und soll Ende des Jahres fertiggestellt [2]. In der Vergangenheit [3] ähnliche Projekte oft verzögert, weil die Anwohner nicht rechtzeitig informiert [4]. Dieses Mal ist aber geplant, die Bevölkerung schon früh in den Entscheidungsprozess einzubeziehen.",
  gaps: [
    {
      no: 1,
      correct: "wird",
      distractors: ["ist", "war", "wäre"],
      explanation: `„wird gebaut" ist Vorgangspassiv im Präsens. „ist gebaut" wäre Zustandspassiv und würde den abgeschlossenen Zustand beschreiben.`
    },
    {
      no: 2,
      correct: "sein",
      distractors: ["werden", "worden", "gewesen"],
      explanation: `„fertiggestellt sein" drückt den erwarteten Zustand in der Zukunft aus. „fertiggestellt werden" würde den Vorgang betonen.`
    },
    {
      no: 3,
      correct: "wurden",
      distractors: ["werden", "sind", "waren"],
      explanation: `„wurden verzögert" ist Passiv im Präteritum. „werden verzögert" wäre Präsens, „waren verzögert" ist eher Zustandspassiv.`
    },
    {
      no: 4,
      correct: "wurden",
      distractors: ["werden", "worden", "sind"],
      explanation: `Auch hier steht das Vorgangspassiv im Präteritum: „informiert wurden". „worden" ist Partizip, kein finites Verb.`
    }
  ]
};

// 5. B2 – Indirekte Rede / Konjunktiv I und II – Exercise 1
export const b2_indirekte_rede_1: Exercise = {
  id: "b2_indirekte_rede_1",
  level: "B2",
  grammar_section_id: "indirekte_rede",
  grammar_ui_topics: ["verben"],
  content_topic: "Unternehmenskommunikation",
  model: "mvp-static",
  text:
    "Die Sprecherin sagte, das Unternehmen [1] weiterhin in nachhaltige Projekte. Sie betonte, man [2] die CO₂-Emissionen bis 2030 deutlich reduzieren. Auf Nachfrage erklärte sie, die Ergebnisse [3] sich in den nächsten Jahren noch verbessern.",
  gaps: [
    {
      no: 1,
      correct: "investiere",
      distractors: ["investiert", "investierte", "investieren würde"],
      explanation: `In der indirekten Rede wird hier der Konjunktiv I („investiere") verwendet. „investiert" wäre Indikativ und würde sich nicht von der direkten Rede unterscheiden.`
    },
    {
      no: 2,
      correct: "wolle",
      distractors: ["will", "wollte", "würde wollen"],
      explanation: `„man wolle" ist Konjunktiv I und signalisiert, dass es sich um eine Wiedergabe handelt. „will" und „wollte" sind Indikativformen.`
    },
    {
      no: 3,
      correct: "könnten",
      distractors: ["können", "konnten", "würden können"],
      explanation: `„könnten" ist Konjunktiv II und drückt eine Möglichkeit in der Zukunft aus. Oft wird Konjunktiv II verwendet, wenn Konjunktiv-I-Formen mit dem Indikativ identisch wären.`
    }
  ]
};

// 6. B2 – Adjektivdeklination – Exercise 1
export const b2_adjektivdeklination_1: Exercise = {
  id: "b2_adjektivdeklination_1",
  level: "B2",
  grammar_section_id: "adjektivdeklination",
  grammar_ui_topics: ["adjektive"],
  content_topic: "Wohnungssuche in der Stadt",
  model: "mvp-static",
  text:
    "In vielen [1] Städten ist es schwierig, eine [2] kleine Wohnung in [3] Lage zu finden. Die meisten [4] Angebote sind entweder sehr weit vom Zentrum entfernt oder haben einen [5] Zustand. Trotzdem entscheiden sich viele Studierende für ein solches günstiges Zimmer, weil sie sich nichts anderes leisten können.",
  gaps: [
    {
      no: 1,
      correct: "großen",
      distractors: ["große", "großer", "groß"],
      explanation: `Nach „vielen" ohne Artikel steht hier der Dativ Plural: „in vielen großen Städten". Im Dativ Plural endet das Adjektiv immer auf „-en".`
    },
    {
      no: 2,
      correct: "bezahlbare",
      distractors: ["bezahlbaren", "bezahlbarer", "bezahlbares"],
      explanation: `„eine bezahlbare kleine Wohnung" – nach unbestimmtem Artikel im Akkusativ Singular Feminin steht Adjektivendung „-e".`
    },
    {
      no: 3,
      correct: "guter",
      distractors: ["guten", "gute", "gut"],
      explanation: `„in guter Lage" – Dativ Singular Feminin ohne Artikel: stark dekliniert, Endung „-er".`
    },
    {
      no: 4,
      correct: "günstigen",
      distractors: ["günstige", "günstiger", "günstigem"],
      explanation: `„die meisten günstigen Angebote" – bestimmter Artikel im Plural, Adjektiv im Nominativ Plural mit Endung „-en".`
    },
    {
      no: 5,
      correct: "schlechten",
      distractors: ["schlechter", "schlechte", "schlechtem"],
      explanation: `„einen schlechten Zustand" – Akkusativ Singular Maskulin nach unbestimmtem Artikel, daher „-en".`
    }
  ]
};

// 7. B2 – Relativsätze (erweitert) – Exercise 1
export const b2_relativsaetze_1: Exercise = {
  id: "b2_relativsaetze_1",
  level: "B2",
  grammar_section_id: "relativsaetze",
  grammar_ui_topics: ["artikel"],
  content_topic: "Nachhaltiger Konsum",
  model: "mvp-static",
  text:
    "Viele Menschen kaufen Produkte, [1] sehr billig sind, [2] Herstellung aber große Umweltschäden verursacht. Unternehmen, [3] transparent über ihre Lieferketten informieren, gewinnen das Vertrauen der Kundinnen und Kunden. Die Entscheidungen, die wir heute treffen, beeinflussen die Lebensqualität der Generationen, die nach uns kommen.",
  gaps: [
    {
      no: 1,
      correct: "die",
      distractors: ["der", "denen", "deren"],
      explanation: `„Produkte, die sehr billig sind" – Relativpronomen im Nominativ Plural, bezieht sich auf „Produkte".`
    },
    {
      no: 2,
      correct: "deren",
      distractors: ["deren die", "dessen", "denen"],
      explanation: `„deren Herstellung" – Genitiv, der Besitz anzeigt: die Herstellung dieser Produkte. „dessen" wäre Singular, „denen" Dativ Plural.`
    },
    {
      no: 3,
      correct: "die",
      distractors: ["der", "denen", "dessen"],
      explanation: `„Unternehmen, die transparent informieren" – Relativpronomen im Nominativ Plural; „der" wäre Singular, „denen" Dativ.`
    }
  ]
};

// 8. B2 – Infinitivsätze – Exercise 1 (überarbeitet, Lücken besser verteilt)
export const b2_infinitivsaetze_1: Exercise = {
  id: "b2_infinitivsaetze_1",
  level: "B2",
  grammar_section_id: "infinitivsaetze",
  grammar_ui_topics: ["verben"],
  content_topic: "Fremdsprachenlernen",
  model: "mvp-static",
  text:
    "Ich habe mir vorgenommen, jeden Tag mindestens zwanzig Minuten [1], [2] meinen Wortschatz [3]. " +
    "Außerdem versuche ich, Serien im Original zu schauen, [4] ständig nach Untertiteln [5] suchen. " +
    "Statt lange Grammatikregeln auswendig zu lernen, möchte ich mehr durch Kommunikation üben. " +
    "Außerdem versuche ich, mir realistische Ziele zu setzen, [6] motiviert zu bleiben und Rückschläge besser zu verkraften.",
  gaps: [
    {
      no: 1,
      correct: "zu lesen",
      distractors: ["lesen", "am Lesen", "gelesen"],
      explanation: `Nach „sich vornehmen" folgt ein Infinitiv mit „zu": „sich vornehmen, regelmäßig zu lesen". Ein bloßer Infinitiv ohne „zu" ist hier nicht korrekt.`
    },
    {
      no: 2,
      correct: "um",
      distractors: ["ohne", "anstatt", "damit"],
      explanation: `„um ... zu" drückt einen Zweck aus: lesen, um den Wortschatz zu erweitern. „ohne ... zu" und „anstatt ... zu" würden einen Gegensatz markieren.`
    },
    {
      no: 3,
      correct: "zu erweitern",
      distractors: ["erweitern", "erweitert", "zu erweitern zu können"],
      explanation: `Auch hier wird der Zweck mit „um ... zu + Infinitiv" ausgedrückt: „um meinen Wortschatz zu erweitern".`
    },
    {
      no: 4,
      correct: "ohne",
      distractors: ["um", "anstatt", "damit"],
      explanation: `„ohne ... zu" drückt aus, dass etwas nicht geschieht: Serien schauen, ohne ständig nach Untertiteln zu suchen.`
    },
    {
      no: 5,
      correct: "zu",
      distractors: ["zu viel", "zum", "zu können"],
      explanation: `Nach „ohne" folgt hier ein Infinitiv mit „zu": „ohne ständig nach Untertiteln zu suchen".`
    },
    {
      no: 6,
      correct: "um",
      distractors: ["ohne", "anstatt", "damit"],
      explanation: `„um motiviert zu bleiben" beschreibt den Zweck: Er setzt sich Ziele, um motiviert zu bleiben und Rückschläge besser zu verkraften.`
    }
  ]
};

// 9. B2 – Verben mit fester Präposition und Rektion – Exercise 1
export const b2_verben_praeposition_1: Exercise = {
  id: "b2_verben_praeposition_1",
  level: "B2",
  grammar_section_id: "verben_praeposition",
  grammar_ui_topics: ["verben", "praepositionen"],
  content_topic: "Berufliche Entscheidungen",
  model: "mvp-static",
  text:
    "Viele Absolventinnen zweifeln [1] ihrer Entscheidung, wenn sie sich zu früh [2] eine bestimmte Branche festgelegt haben. Andere bewerben sich gleichzeitig [3] mehreren Unternehmen, [4] ihre Chancen [5] eine Zusage zu erhöhen. Wer sich gut über die Arbeitsbedingungen informiert, kann später besser mit möglichen Enttäuschungen umgehen.",
  gaps: [
    {
      no: 1,
      correct: "an",
      distractors: ["auf", "über", "mit"],
      explanation: `„zweifeln an + Dativ": man zweifelt an einer Entscheidung, nicht *über* oder *auf* einer Entscheidung.`
    },
    {
      no: 2,
      correct: "auf",
      distractors: ["an", "über", "für"],
      explanation: `„sich festlegen auf + Akkusativ": man legt sich auf eine Branche fest.`
    },
    {
      no: 3,
      correct: "bei",
      distractors: ["an", "auf", "mit"],
      explanation: `„sich bewerben bei + Dativ (Firma)": man bewirbt sich bei einem Unternehmen, aber um eine Stelle.`
    },
    {
      no: 4,
      correct: "um",
      distractors: ["an", "auf", "für"],
      explanation: `Hier geht es um „Chancen auf eine Zusage erhöhen": man erhöht seine Chancen, um eine Zusage zu bekommen.`
    },
    {
      no: 5,
      correct: "auf",
      distractors: ["an", "über", "mit"],
      explanation: `„Chancen auf + Akkusativ": man hat Chancen auf eine Zusage.`
    }
  ]
};

// 10. B2 – Nominalisierung und Nominalphrasen – Exercise 1
export const b2_nominalisierung_1: Exercise = {
  id: "b2_nominalisierung_1",
  level: "B2",
  grammar_section_id: "nominalisierung",
  grammar_ui_topics: ["artikel"],
  content_topic: "Digitalisierung im Alltag",
  model: "mvp-static",
  text:
    "Durch die [1] Nutzung von Smartphones hat sich unser Kommunikationsverhalten stark verändert. Die [2] neuer Apps führt dazu, dass viele Tätigkeiten inzwischen online erledigt werden. Für die meisten Menschen ist das [3] Versenden von Nachrichten selbstverständlich geworden.",
  gaps: [
    {
      no: 1,
      correct: "ständige",
      distractors: ["ständig", "ständiger", "ständigen"],
      explanation: `Hier steht ein attributives Adjektiv vor einem nominalisierten Verb („Nutzung"): „die ständige Nutzung".`
    },
    {
      no: 2,
      correct: "Einführung",
      distractors: ["einführen", "Einführungen", "eingeführt"],
      explanation: `Das Verb „einführen" wird nominalisiert: „die Einführung neuer Apps". Dadurch entsteht eine kompakte Nominalphrase.`
    },
    {
      no: 3,
      correct: "schnelle",
      distractors: ["schnell", "schneller", "schnelles"],
      explanation: `„das schnelle Versenden von Nachrichten" – Adjektiv + nominalisiertes Verb; „schnelle" passt zur Form „das ... Versenden".`
    }
  ]
};

// 11. B2 – Nomen-Verb- und Adjektiv-Verb-Verbindungen – Exercise 1 (überarbeitet)
export const b2_feste_verbindungen_1: Exercise = {
  id: "b2_feste_verbindungen_1",
  level: "B2",
  grammar_section_id: "feste_verbindungen",
  grammar_ui_topics: ["verben", "adjektive"],
  content_topic: "Projektarbeit",
  model: "mvp-static",
  text:
    "Bevor wir eine [1] treffen, sollten wir alle Risiken in [2] ziehen. " +
    "Die Projektleitung hat großen [3] darauf gelegt, dass alle Beteiligten Zugang zu den wichtigsten Informationen [4]. " +
    "Jetzt [5] das Team unter Druck, die vereinbarten Ziele rechtzeitig zu erreichen.",
  gaps: [
    {
      no: 1,
      correct: "Entscheidung",
      distractors: ["Entscheidung machen", "entscheiden", "Entscheid"],
      explanation: `Feste Verbindung: „eine Entscheidung treffen", nicht *eine Entscheidung machen*.`
    },
    {
      no: 2,
      correct: "Betracht",
      distractors: ["Frage", "Diskussion", "Bedacht"],
      explanation: `Feste Nomen-Verb-Verbindung: „etwas in Betracht ziehen".`
    },
    {
      no: 3,
      correct: "Wert",
      distractors: ["Druck", "Zeit", "Frage"],
      explanation: `Feste Verbindung: „großen Wert auf etwas legen".`
    },
    {
      no: 4,
      correct: "bekommen",
      distractors: ["machen", "nehmen", "stellen"],
      explanation: `„Zugang zu Informationen bekommen" ist eine übliche Kombination. Die anderen Verben passen hier nicht.`
    },
    {
      no: 5,
      correct: "steht",
      distractors: ["liegt", "hat", "kommt"],
      explanation: `Auch „unter Druck stehen" ist eine feste Verbindung. „unter Druck haben/kommen/liegen" ist im Standarddeutsch unüblich.`
    }
  ]
};

// 12. B2 – Erweiterter Genitivgebrauch – Exercise 1
export const b2_genitiv_1: Exercise = {
  id: "b2_genitiv_1",
  level: "B2",
  grammar_section_id: "genitiv",
  grammar_ui_topics: ["artikel", "praepositionen"],
  content_topic: "Klimawandel",
  model: "mvp-static",
  text:
    "Die Folgen [1] Klimawandels sind in vielen Regionen der Welt bereits deutlich spürbar. Trotz [2] zahlreicher Wissenschaftlerinnen und Wissenschaftler werden weiterhin große Mengen an Treibhausgasen ausgestoßen. [3] fehlender politischer Maßnahmen verzögert sich die Umsetzung wirksamer Strategien.",
  gaps: [
    {
      no: 1,
      correct: "des",
      distractors: ["dem", "der", "den"],
      explanation: `„die Folgen des Klimawandels" – Genitiv Singular Maskulin mit bestimmtem Artikel „des".`
    },
    {
      no: 2,
      correct: "der Warnungen",
      distractors: ["die Warnungen", "den Warnungen", "Warnungen"],
      explanation: `Nach „trotz" steht der Genitiv: „trotz der Warnungen". Nominativ oder Dativ wären hier falsch.`
    },
    {
      no: 3,
      correct: "Wegen",
      distractors: ["Trotz", "Innerhalb", "Während"],
      explanation: `„Wegen" ist eine Genitivpräposition und leitet hier die Ursache ein: „wegen fehlender politischer Maßnahmen".`
    }
  ]
};

// Optional helper: all B2 exercises in one array
export const b2_exercises: Exercise[] = [
  b2_satzbau_wortstellung_1,
  b2_konnektoren_nebensaetze_1,
  b2_konditionalsaetze_konjunktiv2_1,
  b2_passiv_1,
  b2_indirekte_rede_1,
  b2_adjektivdeklination_1,
  b2_relativsaetze_1,
  b2_infinitivsaetze_1,
  b2_verben_praeposition_1,
  b2_nominalisierung_1,
  b2_feste_verbindungen_1,
  b2_genitiv_1
];
