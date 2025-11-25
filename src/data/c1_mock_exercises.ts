// c1_mock_exercises.ts
// C1 mock exercises for Infinite Grammar MVP
// Same structure as B1/B2 exercises, but with C1-typische Grammatik

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

// 1. C1 – Komplexer Satzbau – Exercise 1
export const c1_satzbau_komplex_c1_1: Exercise = {
  id: "c1_satzbau_komplex_c1_1",
  level: "C1",
  grammar_section_id: "satzbau_komplex_c1",
  grammar_ui_topics: ["satzbau"],
  content_topic: "Datenschutz und Politik",
  model: "mvp-static",
  text:
    "Obwohl die Diskussion über Datenschutz schon seit Jahren geführt wird, [1] viele Unternehmen immer noch sehr locker mit persönlichen Daten um. " +
    "Auch wenn die Politik strengere Regeln verspricht, [2] konkrete Maßnahmen oft auf sich warten. " +
    "Erst wenn ein großer Skandal publik geworden ist, [3] sich etwas an den bestehenden Strukturen.",
  gaps: [
    {
      no: 1,
      correct: "gehen",
      distractors: ["geht", "gehen die", "viele gehen"],
      explanation:
        "Nach einem vorangestellten Nebensatz steht im Hauptsatz das konjugierte Verb an erster Stelle: „..., **gehen** viele Unternehmen ...“ (Inversion)."
    },
    {
      no: 2,
      correct: "lassen",
      distractors: ["lässt", "bleiben", "werden"],
      explanation:
        "Die feste Wendung lautet „etwas lässt auf sich warten“. Nach dem Nebensatz folgt wieder die Inversion: „..., **lassen** konkrete Maßnahmen ... auf sich warten“."
    },
    {
      no: 3,
      correct: "ändert",
      distractors: ["ändert sich", "ändern", "hat sich geändert"],
      explanation:
        "In „..., [3] sich etwas ...“ steht das konjugierte Verb vor dem Reflexivpronomen: „**ändert** sich etwas an den bestehenden Strukturen“."
    }
  ]
};

// 2. C1 – Nominalstil und Verdichtung – Exercise 1
export const c1_nominalstil_und_verdichtung_1: Exercise = {
  id: "c1_nominalstil_und_verdichtung_1",
  level: "C1",
  grammar_section_id: "nominalstil_und_verdichtung",
  grammar_ui_topics: ["nomen", "artikel"],
  content_topic: "Akademisches Schreiben",
  model: "mvp-static",
  text:
    "Nach der [1] der neuen Richtlinien kam es zu einer deutlichen [2] der Arbeitsabläufe. " +
    "Die [3] der Prozesse führte jedoch auch zu einer [4] der Fehlerquote, was von vielen Mitarbeitenden als [5] Entwicklung wahrgenommen wurde.",
  gaps: [
    {
      no: 1,
      correct: "Einführung",
      distractors: ["einführen", "eingeführt", "Einführungen"],
      explanation:
        "Typischer Nominalstil: statt „nachdem man die Richtlinien eingeführt hatte“ steht „nach der **Einführung** der Richtlinien“."
    },
    {
      no: 2,
      correct: "Vereinfachung",
      distractors: ["vereinfachen", "Vereinfachungen", "vereinfachte"],
      explanation:
        "Verbhandlung wird zum Nomen: „eine deutliche **Vereinfachung** der Arbeitsabläufe“."
    },
    {
      no: 3,
      correct: "Standardisierung",
      distractors: ["Standardisieren", "standardisierte", "Standards"],
      explanation:
        "„Die **Standardisierung** der Prozesse“ – typisches abstraktes Nomen statt Verbform."
    },
    {
      no: 4,
      correct: "Erhöhung",
      distractors: ["Erhöhung der", "erhöhte", "Erhöhungen"],
      explanation:
        "„zu einer **Erhöhung** der Fehlerquote“ entspricht verbal „dass sich die Fehlerquote erhöhte“."
    },
    {
      no: 5,
      correct: "bedenkliche",
      distractors: ["bedenklich", "bedenklichen", "bedenklicher"],
      explanation:
        "Mit bestimmtem Artikel (die Entwicklung) im Akkusativ verwendet man die Endung „-e“: „als **bedenkliche** Entwicklung“."
    }
  ]
};

// 3. C1 – Partizipialkonstruktionen – Exercise 1
export const c1_partizipialkonstruktionen_1: Exercise = {
  id: "c1_partizipialkonstruktionen_1",
  level: "C1",
  grammar_section_id: "partizipialkonstruktionen",
  grammar_ui_topics: ["adjektive", "satzbau"],
  content_topic: "Organisation und Change",
  model: "mvp-static",
  text:
    "Die im letzten Jahr [1] Richtlinien haben zu mehreren [2] Konflikten geführt. " +
    "[3] von unterschiedlichen Interpretationen der Regeln, versuchten die Teams, eigene Lösungen zu finden, " +
    "[4] jedoch oft neue Probleme [5].",
  gaps: [
    {
      no: 1,
      correct: "eingeführten",
      distractors: ["eingeführt", "einführenden", "einführen"],
      explanation:
        "Attributive Partizipialkonstruktion: „die im letzten Jahr **eingeführten** Richtlinien“ (Partizip II mit Endung -en)."
    },
    {
      no: 2,
      correct: "unerwarteten",
      distractors: ["unerwartete", "unerwarteter", "unerwartetem"],
      explanation:
        "„zu mehreren **unerwarteten** Konflikten“ – Dativ Plural nach „zu“ verlangt die Endung -en."
    },
    {
      no: 3,
      correct: "Ausgelöst",
      distractors: ["Auslösend", "Weil", "Während"],
      explanation:
        "Satzverkürzung mit Partizip II: „**Ausgelöst** von unterschiedlichen Interpretationen ...“ statt „Weil sie durch ... ausgelöst wurden, ...“."
    },
    {
      no: 4,
      correct: "die",
      distractors: ["der", "den", "welche"],
      explanation:
        "Relativpronomen im Nominativ Plural, Bezug auf „Lösungen“: „Lösungen, **die** jedoch oft ... schufen“."
    },
    {
      no: 5,
      correct: "schufen",
      distractors: ["schaffen", "geschaffen", "schafften"],
      explanation:
        "Präteritum von „schaffen“ (Plural): „..., die jedoch oft neue Probleme **schufen**.“"
    }
  ]
};

// 4. C1 – Konjunktiv I in der Berichtssprache – Exercise 1
export const c1_konjunktiv1_berichtssprache_1: Exercise = {
  id: "c1_konjunktiv1_berichtssprache_1",
  level: "C1",
  grammar_section_id: "konjunktiv1_berichtssprache",
  grammar_ui_topics: ["verben", "satzbau"],
  content_topic: "Politische Berichte",
  model: "mvp-static",
  text:
    "Die Sprecherin erklärte, die Regierung [1] entschlossen, rasch zu handeln. " +
    "In der offiziellen Mitteilung heißt es weiter, es [2] bereits einen Entwurf für ein neues Gesetz. " +
    "Der Ministersprecher betonte, man [3] alle Betroffenen umfassend informieren, bevor die Änderungen [4] in Kraft träten.",
  gaps: [
    {
      no: 1,
      correct: "sei",
      distractors: ["ist", "wäre", "war"],
      explanation:
        "In der indirekten Rede verwendet man im Deutschen meist den Konjunktiv I: „die Regierung **sei** entschlossen“."
    },
    {
      no: 2,
      correct: "gebe",
      distractors: ["gibt", "gäbe", "habe gegeben"],
      explanation:
        "„es **gebe** bereits einen Entwurf“ – Konjunktiv I von „geben“ für neutrale Berichtssprache."
    },
    {
      no: 3,
      correct: "werde",
      distractors: ["würde", "wird", "hat"],
      explanation:
        "„man **werde** alle Betroffenen informieren“ – Futur in der indirekten Rede: „werde ... informieren“."
    },
    {
      no: 4,
      correct: "in Kraft",
      distractors: ["zur Kraft", "in Kräfte", "in die Kraft"],
      explanation:
        "Die feste Verbindung lautet „in Kraft treten“. Im Satz: „bevor die Änderungen **in Kraft** träten“."
    }
  ]
};

// 5. C1 – Passivformen in komplexen Strukturen – Exercise 1
export const c1_passiv_komplex_c1_1: Exercise = {
  id: "c1_passiv_komplex_c1_1",
  level: "C1",
  grammar_section_id: "passiv_komplex_c1",
  grammar_ui_topics: ["verben"],
  content_topic: "Infrastruktur und Stadtplanung",
  model: "mvp-static",
  text:
    "Das Gebäude [1] seit Monaten renoviert und [2] voraussichtlich erst Ende des Jahres wieder vollständig genutzt werden. " +
    "Während der Arbeiten [3] einzelne Bereiche immer wieder kurzfristig gesperrt, sodass viele Veranstaltungen in andere Räume verlegt [4].",
  gaps: [
    {
      no: 1,
      correct: "wird",
      distractors: ["ist", "war", "wurde"],
      explanation:
        "Vorgangspassiv im Präsens: „Das Gebäude **wird** renoviert.“"
    },
    {
      no: 2,
      correct: "kann",
      distractors: ["wird", "soll", "muss"],
      explanation:
        "Passiv mit Modalverb: „**kann** ... genutzt werden“ (Modalverb konjugiert, Partizip + „werden“ am Satzende)."
    },
    {
      no: 3,
      correct: "wurden",
      distractors: ["werden", "sind", "würden"],
      explanation:
        "Erzählung in der Vergangenheit: „Während der Arbeiten **wurden** einzelne Bereiche ... gesperrt.“"
    },
    {
      no: 4,
      correct: "werden mussten",
      distractors: ["wurden", "worden sind", "werden konnten"],
      explanation:
        "Doppelte Verbklammer mit Modalverb + Passiv: „verlegt **werden mussten**“ (Modalverb im Präteritum, „werden“ am Ende)."
    }
  ]
};

// 6. C1 – Adjektivdeklination in komplexen Gruppen – Exercise 1
export const c1_adjektivdeklination_komplex_1: Exercise = {
  id: "c1_adjektivdeklination_komplex_1",
  level: "C1",
  grammar_section_id: "adjektivdeklination_komplex",
  grammar_ui_topics: ["adjektive", "artikel"],
  content_topic: "Studium und Universität",
  model: "mvp-static",
  text:
    "Viele Studierende wünschen sich eine [1] und [2] Betreuung, vor allem wenn sie an einem [3] Projekt mitarbeiten. " +
    "In [4] Seminaren ist dafür jedoch kaum Zeit.",
  gaps: [
    {
      no: 1,
      correct: "engere",
      distractors: ["enger", "engeren", "enges"],
      explanation:
        "„eine **engere** Betreuung“ – Akkusativ Singular Feminin mit unbestimmtem Artikel verlangt Endung -e."
    },
    {
      no: 2,
      correct: "individuelle",
      distractors: ["individueller", "individuellen", "individuelles"],
      explanation:
        "Gleiche Struktur wie bei [1]: „eine engere und **individuelle** Betreuung“ – auch hier -e."
    },
    {
      no: 3,
      correct: "interdisziplinären",
      distractors: ["interdisziplinäres", "interdisziplinärer", "interdisziplinärenes"],
      explanation:
        "Nach „an einem“ steht der Dativ Singular Neutrum: „an einem **interdisziplinären** Projekt“ (-en)."
    },
    {
      no: 4,
      correct: "großen",
      distractors: ["große", "größer", "großer"],
      explanation:
        "Dativ Plural ohne Artikel: „In **großen** Seminaren“ – Plural-Dativ endet regelmäßig auf -en."
    }
  ]
};

// 7. C1 – Genitivgebrauch – Exercise 1
export const c1_genitiv_c1_1: Exercise = {
  id: "c1_genitiv_c1_1",
  level: "C1",
  grammar_section_id: "genitiv_c1",
  grammar_ui_topics: ["nomen", "artikel"],
  content_topic: "Umwelt und Klima",
  model: "mvp-static",
  text:
    "Die Diskussion über die langfristigen Folgen [1] Klimawandels zeigt, wie komplex die Bewertung [2] Maßnahmen ist. " +
    "Viele Expert*innen weisen darauf hin, dass die Kosten [3] Nichthandelns die Ausgaben für eine rechtzeitige [4] deutlich übersteigen könnten.",
  gaps: [
    {
      no: 1,
      correct: "des",
      distractors: ["der", "dem", "den"],
      explanation:
        "Genitiv Singular von „der Klimawandel“: „die Folgen **des** Klimawandels“."
    },
    {
      no: 2,
      correct: "der",
      distractors: ["die", "den", "des"],
      explanation:
        "Wessen Bewertung? – Genitiv: „die Bewertung **der** Maßnahmen“."
    },
    {
      no: 3,
      correct: "des",
      distractors: ["der", "dem", "den"],
      explanation:
        "Genitiv von „das Nichthandeln“: „die Kosten **des** Nichthandelns“."
    },
    {
      no: 4,
      correct: "Umstellung",
      distractors: ["Umstellungen", "umstellen", "umgestellt"],
      explanation:
        "Substantiviertes Verb im Genitivzusammenhang: „Ausgaben für eine rechtzeitige **Umstellung**“."
    }
  ]
};

// 8. C1 – Komplexe präpositionale Ausdrücke – Exercise 1
export const c1_praepositionale_ausdruecke_c1_1: Exercise = {
  id: "c1_praepositionale_ausdruecke_c1_1",
  level: "C1",
  grammar_section_id: "praepositionale_ausdruecke_c1",
  grammar_ui_topics: ["praepositionen"],
  content_topic: "Unternehmen und Management",
  model: "mvp-static",
  text:
    "Die neuen Richtlinien wurden [1] die Umsetzung des Projekts verabschiedet. " +
    "[2] der zahlreichen Beschwerden der Kundschaft sollen vor allem die Abläufe [3] der Bearbeitung von Reklamationen überarbeitet werden. " +
    "[4] dieser Maßnahmen erhofft sich das Unternehmen eine deutliche Verbesserung der Servicequalität.",
  gaps: [
    {
      no: 1,
      correct: "im Hinblick auf",
      distractors: ["in Bezug auf", "aufgrund", "wegen"],
      explanation:
        "Der mehrteilige präpositionale Ausdruck „**im Hinblick auf** die Umsetzung des Projekts“ bedeutet „mit Blick auf“."
    },
    {
      no: 2,
      correct: "Aufgrund",
      distractors: ["Im Rahmen", "Trotz", "Neben"],
      explanation:
        "„**Aufgrund** der zahlreichen Beschwerden“ drückt hier den Grund aus."
    },
    {
      no: 3,
      correct: "im Rahmen",
      distractors: ["im Hinblick auf", "wegen", "innerhalb von"],
      explanation:
        "Die feste Verbindung lautet „**im Rahmen** der Bearbeitung von Reklamationen“."
    },
    {
      no: 4,
      correct: "Durch",
      distractors: ["Trotz", "Wegen", "Ohne"],
      explanation:
        "„**Durch** diese Maßnahmen“ benennt das Mittel bzw. die Ursache der Verbesserung."
    }
  ]
};

// 9. C1 – Verben mit Präposition (C1) – Exercise 1
export const c1_verben_praeposition_c1_1: Exercise = {
  id: "c1_verben_praeposition_c1_1",
  level: "C1",
  grammar_section_id: "verben_praeposition_c1",
  grammar_ui_topics: ["verben", "praepositionen"],
  content_topic: "Arbeitswelt und Mitbestimmung",
  model: "mvp-static",
  text:
    "Viele Beschäftigte [1] sich darüber, dass sie nicht ausreichend [2] wichtigen Entscheidungen beteiligt werden. " +
    "Einige [3] sich deshalb um alternative Stellen, während andere intensiv [4], ob sie in Teilzeit wechseln sollten. " +
    "Das Management [5] auf die Kritik mit dem Hinweis, dass bereits Gespräche mit dem Betriebsrat laufen.",
  gaps: [
    {
      no: 1,
      correct: "beschweren",
      distractors: ["beschäftigen", "bedanken", "bewerben"],
      explanation:
        "Die feste Verbindung lautet „sich **beschweren** über etwas“ – hier: „beschweren sich darüber, dass ...“."
    },
    {
      no: 2,
      correct: "an",
      distractors: ["bei", "in", "mit"],
      explanation:
        "Man ist „an Entscheidungen beteiligt“: „nicht ausreichend **an** wichtigen Entscheidungen beteiligt“."
    },
    {
      no: 3,
      correct: "bewerben",
      distractors: ["erkundigen", "wenden", "interessieren"],
      explanation:
        "„sich **bewerben** um eine Stelle“ – hier: „Einige bewerben sich um alternative Stellen“."
    },
    {
      no: 4,
      correct: "nachdenken",
      distractors: ["reagieren", "entscheiden", "teilnehmen"],
      explanation:
        "Die Verbindung lautet „über etwas nachdenken“ – hier verkürzt: „intensiv **nachdenken**, ob ...“."
    },
    {
      no: 5,
      correct: "reagiert",
      distractors: ["wartet", "besteht", "denkt"],
      explanation:
        "„auf Kritik reagieren“ ist die typische Verbindung: „Das Management **reagiert** auf die Kritik ...“."
    }
  ]
};

// 10. C1 – Feste Verbindungen und Funktionsverbgefüge – Exercise 1
export const c1_feste_verbindungen_c1_1: Exercise = {
  id: "c1_feste_verbindungen_c1_1",
  level: "C1",
  grammar_section_id: "feste_verbindungen_c1",
  grammar_ui_topics: ["verben", "nomen", "adjektive"],
  content_topic: "Unternehmensstrategie",
  model: "mvp-static",
  text:
    "Der Vorstand musste schließlich [1], dass bestimmte Einschnitte notwendig sind. " +
    "Bevor man jedoch eine endgültige Entscheidung [2], wurden alle möglichen Alternativen [3]. " +
    "Den Mitarbeitenden soll ein Unterstützungsprogramm [4], damit sie die Veränderungen besser bewältigen können.",
  gaps: [
    {
      no: 1,
      correct: "in Kauf nehmen",
      distractors: ["zur Verfügung stehen", "eine Entscheidung treffen", "in Frage stellen"],
      explanation:
        "Die feste Verbindung lautet „etwas **in Kauf nehmen**“ im Sinn von „eine negative Folge akzeptieren“."
    },
    {
      no: 2,
      correct: "trifft",
      distractors: ["macht", "nimmt", "zieht"],
      explanation:
        "Funktionsverbgefüge: „eine Entscheidung **treffen**“, nicht „machen“ oder „nehmen“."
    },
    {
      no: 3,
      correct: "in Betracht gezogen",
      distractors: ["zur Sprache gebracht", "in Frage gestellt", "umgesetzt"],
      explanation:
        "Die feste Wendung ist „etwas **in Betracht ziehen**“ – im Passiv Perfekt: „wurden Alternativen **in Betracht gezogen**“."
    },
    {
      no: 4,
      correct: "zur Verfügung gestellt werden",
      distractors: ["in Anspruch genommen werden", "getroffen werden", "zum Ausdruck kommen"],
      explanation:
        "„ein Programm **zur Verfügung gestellt bekommen/werden**“ – hier: „soll ein Unterstützungsprogramm **zur Verfügung gestellt werden**“."
    }
  ]
};

// Optional helper array
export const c1_exercises: Exercise[] = [
  c1_satzbau_komplex_c1_1,
  c1_nominalstil_und_verdichtung_1,
  c1_partizipialkonstruktionen_1,
  c1_konjunktiv1_berichtssprache_1,
  c1_passiv_komplex_c1_1,
  c1_adjektivdeklination_komplex_1,
  c1_genitiv_c1_1,
  c1_praepositionale_ausdruecke_c1_1,
  c1_verben_praeposition_c1_1,
  c1_feste_verbindungen_c1_1
];
