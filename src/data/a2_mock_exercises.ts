// a2_mock_exercises.ts
// A2 mock exercises for Infinite Grammar MVP

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

// 1. A2 – Zeiten: Perfekt im Alltag – Exercise 1
// → maps to grammarSections.a2["tempora_praesens_perfekt"]
export const a2_zeiten_perfekt_alltag_1: Exercise = {
  id: "a2_zeiten_perfekt_alltag_1",
  level: "A2",
  grammar_section_id: "tempora_praesens_perfekt",
  grammar_ui_topics: ["verben"],
  content_topic: "Alltag und Familie",
  model: "mvp-static",
  text:
    "Normalerweise stehe ich unter der Woche früh auf, aber gestern habe ich bis acht Uhr [1]. " +
    "Danach habe ich schnell [2] und meine E-Mails [3]. Am Abend habe ich noch lange mit meiner Schwester [4].",
  gaps: [
    {
      no: 1,
      correct: "geschlafen",
      distractors: ["schlafen", "schlief", "verschlafen"],
      explanation:
        "Für das Perfekt von „schlafen“ verwendet man „haben“: „ich habe bis acht Uhr geschlafen“."
    },
    {
      no: 2,
      correct: "gefrühstückt",
      distractors: ["frühstücken", "frühstückt", "Frühstück"],
      explanation:
        "Nach „habe ich“ folgt im Perfekt das Partizip II: „habe ich gefrühstückt“."
    },
    {
      no: 3,
      correct: "gelesen",
      distractors: ["lesen", "liest", "gelesen habe"],
      explanation:
        "„habe … gelesen“ ist das Perfekt von „lesen“."
    },
    {
      no: 4,
      correct: "telefoniert",
      distractors: ["telefonieren", "Telefon", "angerufen"],
      explanation:
        "Mit „habe“ bildet man das Perfekt: „ich habe mit ihr telefoniert“."
    }
  ]
};

// 2. A2 – Modalverben im Kurs – Exercise 1
// → maps to grammarSections.a2["modalverben_grundlagen"]
export const a2_modalverben_kurs_1: Exercise = {
  id: "a2_modalverben_kurs_1",
  level: "A2",
  grammar_section_id: "modalverben_grundlagen",
  grammar_ui_topics: ["verben"],
  content_topic: "Sprachkurs",
  model: "mvp-static",
  text:
    "In meiner Sprachschule [1] wir jeden Tag Hausaufgaben machen. " +
    "Manchmal [2] ich lieber einen Film schauen, aber ich weiß, dass ich trotzdem lernen [3]. " +
    "Vor der Prüfung [4] wir besonders viel wiederholen, damit alle die Aufgaben gut [5] können.",
  gaps: [
    {
      no: 1,
      correct: "müssen",
      distractors: ["können", "dürfen", "mögen"],
      explanation:
        "Es handelt sich um eine Pflicht: „wir müssen jeden Tag Hausaufgaben machen“."
    },
    {
      no: 2,
      correct: "möchte",
      distractors: ["kann", "muss", "soll"],
      explanation:
        "„ich möchte lieber …“ drückt einen Wunsch aus."
    },
    {
      no: 3,
      correct: "muss",
      distractors: ["kann", "soll", "darf"],
      explanation:
        "Trotzdem besteht eine Notwendigkeit zu lernen: „ich muss lernen“."
    },
    {
      no: 4,
      correct: "sollen",
      distractors: ["können", "dürfen", "möchten"],
      explanation:
        "Die Lehrerin gibt eine Empfehlung/Anweisung: „wir sollen viel wiederholen“."
    },
    {
      no: 5,
      correct: "lösen",
      distractors: ["lernen", "nehmen", "schauen"],
      explanation:
        "Typische Verbindung: „Aufgaben lösen“. „damit alle die Aufgaben gut lösen können“ ist die natürliche Formulierung."
    }
  ]
};

// 3. A2 – Trennbare Verben im Unterricht – Exercise 1
// → maps to grammarSections.a2["trennbare_verben"]
export const a2_trennbare_verben_1: Exercise = {
  id: "a2_trennbare_verben_1",
  level: "A2",
  grammar_section_id: "trennbare_verben",
  grammar_ui_topics: ["verben", "satzbau"],
  content_topic: "Unterricht",
  model: "mvp-static",
  text:
    "Unser Lehrer ist sehr freundlich: Er [1] die Tür [2] und begrüßt uns mit einem Lächeln. " +
    "Während des Unterrichts [3] er neue Wörter an die Tafel [4], damit wir sie besser behalten. " +
    "Am Ende der Stunde [5] er die wichtigsten Punkte noch einmal [6] und [7] uns die Hausaufgaben [8].",
  gaps: [
    {
      no: 1,
      correct: "macht",
      distractors: ["nimmt", "steht", "macht an"],
      explanation:
        "Das trennbare Verb lautet „aufmachen“ – im Satz: „Er macht die Tür auf“."
    },
    {
      no: 2,
      correct: "auf",
      distractors: ["an", "aus", "zu"],
      explanation:
        "Die Verbpartikel zu „aufmachen“ steht am Satzende: „macht … auf“."
    },
    {
      no: 3,
      correct: "schreibt",
      distractors: ["schreibt auf", "schrieb", "hat geschrieben"],
      explanation:
        "Das trennbare Verb ist „aufschreiben“ – „Er schreibt neue Wörter an die Tafel auf“."
    },
    {
      no: 4,
      correct: "auf",
      distractors: ["aus", "zu", "an"],
      explanation:
        "Im Aussagesatz steht die Verbpartikel am Ende: „schreibt … auf“."
    },
    {
      no: 5,
      correct: "fasst",
      distractors: ["macht", "nimmt", "steht"],
      explanation:
        "„zusammenfassen“: „Er fasst die wichtigsten Punkte zusammen“."
    },
    {
      no: 6,
      correct: "zusammen",
      distractors: ["auf", "an", "ein"],
      explanation:
        "Die Partikel von „zusammenfassen“ steht am Satzende: „fasst … zusammen“."
    },
    {
      no: 7,
      correct: "gibt",
      distractors: ["stellt", "schreibt", "macht"],
      explanation:
        "Das trennbare Verb ist „aufgeben“ im Sinn von „Hausaufgaben geben“: „Er gibt uns die Hausaufgaben auf“."
    },
    {
      no: 8,
      correct: "auf",
      distractors: ["an", "aus", "zu"],
      explanation:
        "Die Verbpartikel zu „aufgeben“ steht wieder am Satzende: „gibt … auf“."
    }
  ]
};

// 4. A2 – Präpositionen: Ort und Richtung – Exercise 1
// → maps to grammarSections.a2["praepositionen_ort_richtung"]
export const a2_praepositionen_ort_richtung_1: Exercise = {
  id: "a2_praepositionen_ort_richtung_1",
  level: "A2",
  grammar_section_id: "praepositionen_ort_richtung",
  grammar_ui_topics: ["praepositionen", "nomen"],
  content_topic: "Neue Stadt",
  model: "mvp-static",
  text:
    "Ich bin vor zwei Monaten [1] eine neue Stadt gezogen. " +
    "Jetzt wohne ich [2] einem kleinen Zimmer [3] einem großen Studentenwohnheim. " +
    "Jeden Morgen gehe ich [4] der Bushaltestelle und fahre [5] dem Bus zur Universität.",
  gaps: [
    {
      no: 1,
      correct: "in",
      distractors: ["nach", "auf", "an"],
      explanation:
        "Mit Bewegung in einen Ort hinein: „in eine neue Stadt ziehen“."
    },
    {
      no: 2,
      correct: "in",
      distractors: ["auf", "an", "bei"],
      explanation:
        "„in einem kleinen Zimmer“ – Ort mit „in“ + Dativ."
    },
    {
      no: 3,
      correct: "in",
      distractors: ["auf", "bei", "an"],
      explanation:
        "Auch beim Gebäude: „in einem Studentenwohnheim“."
    },
    {
      no: 4,
      correct: "zu",
      distractors: ["in", "nach", "auf"],
      explanation:
        "Man geht „zu der Bushaltestelle“ – Richtung mit „zu“."
    },
    {
      no: 5,
      correct: "mit",
      distractors: ["auf", "in", "bei"],
      explanation:
        "Verkehrsmittel: „mit dem Bus fahren“."
    }
  ]
};

// 5. A2 – Personalpronomen im Dativ/Akkusativ – Exercise 1
// → maps to grammarSections.a2["pronomen_grundlagen"]
export const a2_pronomen_akk_dativ_1: Exercise = {
  id: "a2_pronomen_akk_dativ_1",
  level: "A2",
  grammar_section_id: "pronomen_grundlagen",
  grammar_ui_topics: ["nomen", "artikel"],
  content_topic: "Geburtstag",
  model: "mvp-static",
  text:
    "Meine Schwester hat nächste Woche Geburtstag und ich möchte [1] ein Buch schenken. " +
    "Mein Bruder hat [2] schon eine Nachricht geschrieben. " +
    "Unsere Eltern haben [3] zum Essen eingeladen und [4] versprochen, dass sie [5] beim Aufräumen helfen.",
  gaps: [
    {
      no: 1,
      correct: "ihr",
      distractors: ["sie", "ihn", "ihm"],
      explanation:
        "„jemandem etwas schenken“ – Dativ: „ich möchte ihr ein Buch schenken“."
    },
    {
      no: 2,
      correct: "ihr",
      distractors: ["sie", "ihn", "ihnen"],
      explanation:
        "Auch hier steht der Dativ: „Mein Bruder hat ihr eine Nachricht geschrieben“."
    },
    {
      no: 3,
      correct: "uns",
      distractors: ["wir", "unsere", "ihnen"],
      explanation:
        "„jemanden einladen“ – Akkusativ: „Sie haben uns eingeladen“."
    },
    {
      no: 4,
      correct: "mir",
      distractors: ["mich", "uns", "sie"],
      explanation:
        "„jemandem etwas versprechen“ – Dativ: „Sie haben mir versprochen …“."
    },
    {
      no: 5,
      correct: "uns",
      distractors: ["wir", "ihnen", "sie"],
      explanation:
        "„jemandem helfen“ – Dativ: „Sie helfen uns beim Aufräumen“."
    }
  ]
};

// 6. A2 – Fragewörter und Satzstellung – Exercise 1
// → maps to grammarSections.a2["satzbau_wortstellung_a2"]
export const a2_fragewoerter_satzstellung_1: Exercise = {
  id: "a2_fragewoerter_satzstellung_1",
  level: "A2",
  grammar_section_id: "satzbau_wortstellung_a2",
  grammar_ui_topics: ["satzbau"],
  content_topic: "Sprachkurs-Informationen",
  model: "mvp-static",
  text:
    "Ich möchte einen Sprachkurs machen. [1] beginnt der Kurs? [2] lange dauert er und [3] viel kostet er? " +
    "Die Sekretärin fragt mich, [4] ich vorher schon Deutsch gelernt habe.",
  gaps: [
    {
      no: 1,
      correct: "Wann",
      distractors: ["Wo", "Wie", "Was"],
      explanation:
        "Bei einer Zeitangabe benutzt man „Wann“: „Wann beginnt der Kurs?“."
    },
    {
      no: 2,
      correct: "Wie",
      distractors: ["Was", "Wo", "Wann"],
      explanation:
        "„Wie lange dauert er?“ – Frage nach der Dauer."
    },
    {
      no: 3,
      correct: "Wie",
      distractors: ["Was", "Wo", "Wann"],
      explanation:
        "„Wie viel kostet er?“ – Frage nach dem Preis."
    },
    {
      no: 4,
      correct: "ob",
      distractors: ["dass", "wann", "wie"],
      explanation:
        "In indirekten Ja/Nein-Fragen benutzt man „ob“: „Sie fragt mich, ob ich … gelernt habe“."
    }
  ]
};

// 7. A2 – Adjektive: Komparativ und Superlativ (einfach) – Exercise 1
// → maps to grammarSections.a2["vergleichsformen_adjektive_einstieg"]
export const a2_adjektive_komparativ_1: Exercise = {
  id: "a2_adjektive_komparativ_1",
  level: "A2",
  grammar_section_id: "vergleichsformen_adjektive_einstieg",
  grammar_ui_topics: ["adjektive"],
  content_topic: "Jahreszeiten",
  model: "mvp-static",
  text:
    "Der Sommer ist für mich [1] als der Winter, weil ich warme Tage mag. " +
    "Im Frühling sind die Temperaturen [2] und die Tage werden [3]. " +
    "Viele Leute finden den Herbst [4] Jahreszeit, aber für mich ist der Sommer [5].",
  gaps: [
    {
      no: 1,
      correct: "schöner",
      distractors: ["schön", "am schönsten", "schönste"],
      explanation:
        "Beim Vergleich mit „als“ benutzt man den Komparativ: „schöner als“."
    },
    {
      no: 2,
      correct: "milder",
      distractors: ["mild", "am mildesten", "milde"],
      explanation:
        "Der Frühling wird mit anderen Jahreszeiten verglichen: „Die Temperaturen sind milder“."
    },
    {
      no: 3,
      correct: "länger",
      distractors: ["lang", "am längsten", "lange"],
      explanation:
        "Auch hier: Vergleich – „die Tage werden länger“."
    },
    {
      no: 4,
      correct: "die schönste",
      distractors: ["schöner", "am schönsten", "schön"],
      explanation:
        "„die schönste Jahreszeit“ – bestimmter Artikel + Superlativ."
    },
    {
      no: 5,
      correct: "am schönsten",
      distractors: ["schöner", "schönste", "schön"],
      explanation:
        "Bei persönlicher Bewertung: „für mich ist der Sommer am schönsten“ – Superlativ mit „am“."
    }
  ]
};

// 8. A2 – Nebensätze mit weil / wenn – Exercise 1
// → maps to grammarSections.a2["satzbau_wortstellung_a2"]
export const a2_nebensaetze_weil_wenn_1: Exercise = {
  id: "a2_nebensaetze_weil_wenn_1",
  level: "A2",
  grammar_section_id: "satzbau_wortstellung_a2",
  grammar_ui_topics: ["satzbau", "verben"],
  content_topic: "Freizeit im Park",
  model: "mvp-static",
  text:
    "Wenn das Wetter gut ist, [1] wir oft in den Park und machen ein Picknick. " +
    "[2] es regnet, bleiben wir zu Hause, [3] es dann im Wohnzimmer gemütlich ist. " +
    "Ich freue mich, [4] wir uns am Wochenende treffen können.",
  gaps: [
    {
      no: 1,
      correct: "gehen",
      distractors: ["gehen wir", "wir gehen", "gegangen"],
      explanation:
        "Nach dem Nebensatz „Wenn …“ steht im Hauptsatz das Verb an zweiter Stelle: „gehen wir …“. In der Lücke steht nur das Verb."
    },
    {
      no: 2,
      correct: "Wenn",
      distractors: ["Weil", "Dass", "Obwohl"],
      explanation:
        "Hier wird eine Bedingung beschrieben: „Wenn es regnet …“."
    },
    {
      no: 3,
      correct: "weil",
      distractors: ["wenn", "dass", "ob"],
      explanation:
        "Der Grund für das Zuhausebleiben: „weil es dann im Wohnzimmer gemütlich ist“."
    },
    {
      no: 4,
      correct: "dass",
      distractors: ["wenn", "weil", "ob"],
      explanation:
        "Nach „ich freue mich“ steht ein „dass“-Satz: „dass wir uns am Wochenende treffen können“."
    }
  ]
};

// Optional helper array
export const a2_exercises: Exercise[] = [
  a2_zeiten_perfekt_alltag_1,
  a2_modalverben_kurs_1,
  a2_trennbare_verben_1,
  a2_praepositionen_ort_richtung_1,
  a2_pronomen_akk_dativ_1,
  a2_fragewoerter_satzstellung_1,
  a2_adjektive_komparativ_1,
  a2_nebensaetze_weil_wenn_1
];
