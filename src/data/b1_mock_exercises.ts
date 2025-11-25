// b1_mock_exercises.ts
// B1 mock exercises for Infinite Grammar MVP
// Same structure as other level exercises, but with B1-typische Grammatik

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

// 1. B1 – Zeiten: Präsens / Perfekt – Exercise 1
export const b1_zeiten_praesens_perfekt_1: Exercise = {
  id: "b1_zeiten_praesens_perfekt_1",
  level: "B1",
  grammar_section_id: "tempus_perfekt_praeteritum",
  grammar_ui_topics: ["verben"],
  content_topic: "Freizeit und Familie",
  model: "mvp-static",
  text:
    "Am Wochenende [1] ich oft meine Großeltern. Früher [2] ich sie nur selten, aber in den letzten Jahren [3] sich unser Verhältnis deutlich verbessert. " +
    "Letzten Sonntag [4] wir zusammen im Garten gesessen und lange [5].",
  gaps: [
    {
      no: 1,
      correct: "besuche",
      distractors: ["besuchte", "werde besuchen", "besucht"],
      explanation:
        "Es geht um eine regelmäßige Gewohnheit in der Gegenwart – dafür steht das Verb im Präsens: „ich besuche“."
    },
    {
      no: 2,
      correct: "besuchte",
      distractors: ["habe besucht", "besuchen", "besucht"],
      explanation:
        "„Früher besuchte ich sie nur selten“ beschreibt eine Gewohnheit in der Vergangenheit, daher Präteritum."
    },
    {
      no: 3,
      correct: "hat",
      distractors: ["ist", "wird", "war"],
      explanation:
        "Mit „hat sich verbessert“ wird das Perfekt gebildet: „In den letzten Jahren hat sich unser Verhältnis deutlich verbessert“."
    },
    {
      no: 4,
      correct: "haben",
      distractors: ["sind", "waren", "werden"],
      explanation:
        "„Letzten Sonntag haben wir zusammen im Garten gesessen“ – mit „wir“ bildet man hier das Perfekt mit „haben“."
    },
    {
      no: 5,
      correct: "geredet",
      distractors: ["reden", "hat geredet", "redend"],
      explanation:
        "Nach „haben wir … lange“ folgt das Partizip II: „wir haben lange geredet“."
    }
  ]
};

// 2. B1 – Modalverben – Exercise 1
export const b1_modalverben_1: Exercise = {
  id: "b1_modalverben_1",
  level: "B1",
  grammar_section_id: "modalverben_praeteritum",
  grammar_ui_topics: ["verben"],
  content_topic: "Alltag im Büro",
  model: "mvp-static",
  text:
    "In meinem neuen Job [1] ich sehr selbstständig arbeiten, aber ich [2] meine Aufgaben immer mit meiner Chefin absprechen. " +
    "Manchmal [3] wir Überstunden machen, wenn ein Projekt dringend ist. Dann [4] ich abends später nach Hause gehen und [5] am nächsten Tag etwas länger schlafen.",
  gaps: [
    {
      no: 1,
      correct: "kann",
      distractors: ["muss", "darf", "soll"],
      explanation:
        "„ich kann … arbeiten“ drückt hier eine Möglichkeit bzw. Fähigkeit aus."
    },
    {
      no: 2,
      correct: "muss",
      distractors: ["kann", "soll", "möchte"],
      explanation:
        "„ich muss meine Aufgaben absprechen“ – es handelt sich um eine Pflicht."
    },
    {
      no: 3,
      correct: "müssen",
      distractors: ["können", "dürfen", "sollen"],
      explanation:
        "„Manchmal müssen wir Überstunden machen“ – Plural „wir“ verlangt „müssen“."
    },
    {
      no: 4,
      correct: "muss",
      distractors: ["kann", "darf", "werde"],
      explanation:
        "„Dann muss ich abends später nach Hause gehen“ – wieder eine Notwendigkeit."
    },
    {
      no: 5,
      correct: "kann",
      distractors: ["muss", "soll", "dürfte"],
      explanation:
        "„… und kann am nächsten Tag etwas länger schlafen“ – hier wird eine angenehme Möglichkeit beschrieben."
    }
  ]
};

// 3. B1 – Trennbare Verben – Exercise 1
export const b1_trennbare_verben_1: Exercise = {
  id: "b1_trennbare_verben_1",
  level: "B1",
  grammar_section_id: "trennbare_verben",
  grammar_ui_topics: ["verben", "satzbau"],
  content_topic: "Morgenroutine",
  model: "mvp-static",
  text:
    "Unter der Woche [1] ich meistens um halb sieben [2]. Dann [3] ich mein Handy [4] und [5] mir schnell einen Kaffee. " +
    "Bevor ich das Haus [6], [7] ich noch kurz die Küche [8].",
  gaps: [
    {
      no: 1,
      correct: "stehe",
      distractors: ["steigt", "stand", "werde"],
      explanation:
        "Subjekt ist „ich“, deshalb braucht man „stehe“ im Präsens."
    },
    {
      no: 2,
      correct: "auf",
      distractors: ["ein", "an", "zu"],
      explanation:
        "Das Verb heißt „aufstehen“ – im Satzfeld: „stehe … auf“."
    },
    {
      no: 3,
      correct: "mache",
      distractors: ["machen", "machte", "gemacht"],
      explanation:
        "„Dann mache ich mein Handy … an“ – konjugiertes Verb in 1. Person Singular."
    },
    {
      no: 4,
      correct: "an",
      distractors: ["auf", "aus", "zu"],
      explanation:
        "Das trennbare Verb lautet „anmachen“: „ich mache das Handy an“."
    },
    {
      no: 5,
      correct: "koche",
      distractors: ["koche auf", "gekocht", "kochte"],
      explanation:
        "„ich koche mir schnell einen Kaffee“ – übliche Formulierung im Präsens."
    },
    {
      no: 6,
      correct: "verlasse",
      distractors: ["gehe", "laufe", "komme"],
      explanation:
        "„das Haus verlassen“ ist hier die passende Verbindung."
    },
    {
      no: 7,
      correct: "räume",
      distractors: ["räumt", "räumte", "geräumt"],
      explanation:
        "Mit „ich“ steht das Verb im Präsens als „räume“."
    },
    {
      no: 8,
      correct: "auf",
      distractors: ["ein", "aus", "an"],
      explanation:
        "Das Verb heißt „aufräumen“ – „ich räume die Küche auf“."
    }
  ]
};

// 4. B1 – Reflexive Verben – Exercise 1
export const b1_reflexive_verben_1: Exercise = {
  id: "b1_reflexive_verben_1",
  level: "B1",
  grammar_section_id: "reflexive_verben",
  grammar_ui_topics: ["verben"],
  content_topic: "Stress und Entspannung",
  model: "mvp-static",
  text:
    "Wenn ich viel zu tun habe, [1] ich [2] oft gestresst. Dann setze ich [3] nach der Arbeit zuerst auf das Sofa und [4] [5] mit einem guten Buch. " +
    "Am Wochenende [6] ich [7] mit Freunden, damit wir zusammen etwas unternehmen können.",
  gaps: [
    {
      no: 1,
      correct: "fühle",
      distractors: ["fühlt", "fühlte", "habe gefühlt"],
      explanation:
        "Subjekt ist „ich“, daher „ich fühle“ im Präsens."
    },
    {
      no: 2,
      correct: "mich",
      distractors: ["mir", "dich", "mich selbst"],
      explanation:
        "Beim Verb „sich fühlen“ steht im Akkusativ „mich“ zu „ich“."
    },
    {
      no: 3,
      correct: "mich",
      distractors: ["mir", "dich", "uns"],
      explanation:
        "„sich setzen“ verlangt ebenfalls das Reflexivpronomen „mich“."
    },
    {
      no: 4,
      correct: "entspanne",
      distractors: ["entspannt", "entspannte", "habe entspannt"],
      explanation:
        "„ich entspanne mich mit einem guten Buch“ – Verb im Präsens."
    },
    {
      no: 5,
      correct: "mich",
      distractors: ["mir", "dich", "ihn"],
      explanation:
        "Auch bei „sich entspannen“ steht das Reflexivpronomen im Akkusativ: „ich entspanne mich“."
    },
    {
      no: 6,
      correct: "treffe",
      distractors: ["treffen", "traf", "habe getroffen"],
      explanation:
        "„Am Wochenende treffe ich mich mit Freunden“ – Präsensform „treffe“."
    },
    {
      no: 7,
      correct: "mich",
      distractors: ["mir", "uns", "euch"],
      explanation:
        "Das Verb lautet hier „sich treffen“: „ich treffe mich mit Freunden“."
    }
  ]
};

// 5. B1 – Nebensätze mit weil / dass / wenn – Exercise 1
export const b1_nebensaetze_weil_dass_wenn_1: Exercise = {
  id: "b1_nebensaetze_weil_dass_wenn_1",
  level: "B1",
  grammar_section_id: "satzbau_komplex",
  grammar_ui_topics: ["satzbau", "verben"],
  content_topic: "Gesund leben",
  model: "mvp-static",
  text:
    "Ich versuche, jeden Tag Obst zu essen, [1] ich mich gesünder fühlen möchte. " +
    "Meine Ärztin hat mir erklärt, [2] regelmäßige Bewegung wichtig ist. " +
    "[3] das Wetter schlecht ist, gehe ich ins Fitnessstudio, [4] ich nicht draußen joggen kann.",
  gaps: [
    {
      no: 1,
      correct: "weil",
      distractors: ["wenn", "dass", "obwohl"],
      explanation:
        "„weil“ drückt hier einen Grund aus: Ich esse Obst, weil ich mich gesünder fühlen möchte."
    },
    {
      no: 2,
      correct: "dass",
      distractors: ["weil", "wenn", "ob"],
      explanation:
        "Nach Verben wie „erklären“ folgt häufig ein „dass“-Satz: „Sie hat mir erklärt, dass …“."
    },
    {
      no: 3,
      correct: "Wenn",
      distractors: ["Weil", "Dass", "Obwohl"],
      explanation:
        "„Wenn das Wetter schlecht ist“ beschreibt eine Bedingung. Deshalb passt „Wenn“."
    },
    {
      no: 4,
      correct: "weil",
      distractors: ["wenn", "dass", "damit"],
      explanation:
        "Hier wird der Grund erklärt, warum die Person ins Fitnessstudio geht: weil sie nicht draußen joggen kann."
    }
  ]
};

// 6. B1 – Relativsätze (Basis) – Exercise 1
export const b1_relativsaetze_basis_1: Exercise = {
  id: "b1_relativsaetze_basis_1",
  level: "B1",
  grammar_section_id: "relativsaetze_basis",
  grammar_ui_topics: ["artikel", "satzbau"],
  content_topic: "Wohnen in der Stadt",
  model: "mvp-static",
  text:
    "Ich suche eine Wohnung, [1] nicht zu teuer ist und [2] in der Nähe meiner Arbeit liegt. " +
    "Die Nachbarin, [3] neben mir wohnt, hat mir ein Haus gezeigt, [4] einen kleinen Garten hat.",
  gaps: [
    {
      no: 1,
      correct: "die",
      distractors: ["der", "das", "den"],
      explanation:
        "„Wohnung“ ist feminin Singular, daher Nominativ „die“."
    },
    {
      no: 2,
      correct: "die",
      distractors: ["der", "denen", "deren"],
      explanation:
        "Auch im zweiten Relativsatz bezieht sich das Pronomen auf „Wohnung“ – erneut Nominativ Feminin."
    },
    {
      no: 3,
      correct: "die",
      distractors: ["der", "den", "deren"],
      explanation:
        "„Die Nachbarin, die neben mir wohnt“ – Subjekt im Relativsatz, Bezug auf „Nachbarin“."
    },
    {
      no: 4,
      correct: "das",
      distractors: ["den", "dem", "dessen"],
      explanation:
        "Bezug auf „Haus“ (Neutrum): „ein Haus, das einen kleinen Garten hat“."
    }
  ]
};

// 7. B1 – Präpositionen für Ort und Zeit – Exercise 1
export const b1_praepositionen_ort_zeit_1: Exercise = {
  id: "b1_praepositionen_ort_zeit_1",
  level: "B1",
  grammar_section_id: "praepositionen_ort_zeit",
  grammar_ui_topics: ["praepositionen", "nomen"],
  content_topic: "Tagesablauf",
  model: "mvp-static",
  text:
    "Ich stehe [1] sieben Uhr auf und fahre [2] dem Frühstück zur Arbeit. " +
    "[3] der Mittagspause gehe ich kurz [4] draußen und mache einen kleinen Spaziergang. " +
    "[5] Abend bleibe ich meistens zu Hause.",
  gaps: [
    {
      no: 1,
      correct: "um",
      distractors: ["am", "im", "von"],
      explanation:
        "Uhrzeiten werden im Deutschen normalerweise mit „um“ angegeben: „um sieben Uhr“."
    },
    {
      no: 2,
      correct: "nach",
      distractors: ["vor", "bei", "seit"],
      explanation:
        "Nach einem Ereignis verwendet man „nach“: „nach dem Frühstück“."
    },
    {
      no: 3,
      correct: "In",
      distractors: ["Am", "Um", "Bei"],
      explanation:
        "Für Zeiträume wie „in der Mittagspause“ nutzt man „in“."
    },
    {
      no: 4,
      correct: "nach",
      distractors: ["in", "auf", "von"],
      explanation:
        "„nach draußen gehen“ ist die übliche Verbindung: Man geht nach draußen."
    },
    {
      no: 5,
      correct: "Am",
      distractors: ["Im", "Um", "In"],
      explanation:
        "Bei Tageszeiten wie „am Abend“ verwendet man die Präposition „am“."
    }
  ]
};

// 8. B1 – Adjektivdeklination (Basis) – Exercise 1
export const b1_adjektivdeklination_basis_1: Exercise = {
  id: "b1_adjektivdeklination_basis_1",
  level: "B1",
  grammar_section_id: "adjektivdeklination_b1",
  grammar_ui_topics: ["adjektive", "artikel"],
  content_topic: "Reisen",
  model: "mvp-static",
  text:
    "Wir haben ein [1] Hotel in einer [2] Stadt gebucht. Vom Balkon aus hatten wir einen [3] Blick auf einen [4] See. " +
    "Abends sind wir oft durch die [5] Altstadt spaziert.",
  gaps: [
    {
      no: 1,
      correct: "schönes",
      distractors: ["schöne", "schöner", "schönen"],
      explanation:
        "Nach „ein“ im Nominativ/Akkusativ Neutrum steht die Endung „-es“: „ein schönes Hotel“."
    },
    {
      no: 2,
      correct: "kleinen",
      distractors: ["kleine", "kleiner", "kleinem"],
      explanation:
        "„in einer kleinen Stadt“ – Dativ Singular Feminin nach „in einer“ verlangt „-en“."
    },
    {
      no: 3,
      correct: "tollen",
      distractors: ["toller", "tolle", "tolles"],
      explanation:
        "„einen tollen Blick“ – Akkusativ Singular Maskulin nach „einen“ mit Endung „-en“."
    },
    {
      no: 4,
      correct: "ruhigen",
      distractors: ["ruhige", "ruhiger", "ruhigem"],
      explanation:
        "„auf einen ruhigen See“ – Akkusativ Maskulin, daher „-en“."
    },
    {
      no: 5,
      correct: "historische",
      distractors: ["historischen", "historischer", "historisch"],
      explanation:
        "„durch die historische Altstadt“ – Akkusativ Singular Feminin mit bestimmtem Artikel „die“ verlangt „-e“."
    }
  ]
};

// 9. B1 – Komparativ und Superlativ – Exercise 1
export const b1_vergleich_komparativ_superlativ_1: Exercise = {
  id: "b1_vergleich_komparativ_superlativ_1",
  level: "B1",
  grammar_section_id: "vergleich_komparativ_superlativ",
  grammar_ui_topics: ["adjektive"],
  content_topic: "Verkehrsmittel",
  model: "mvp-static",
  text:
    "In der Stadt ist die U-Bahn oft [1] als das Auto, weil man nicht im Stau steht. Für kurze Strecken ist das Fahrrad [2], " +
    "aber im Winter ist es [3]. Viele Leute finden das Auto [4], weil sie nicht umsteigen müssen, aber das Ticket für die U-Bahn ist meistens [5].",
  gaps: [
    {
      no: 1,
      correct: "schneller",
      distractors: ["schnell", "am schnellsten", "schnellste"],
      explanation:
        "Beim Vergleich mit „als“ verwendet man den Komparativ: „schneller als“."
    },
    {
      no: 2,
      correct: "am praktischsten",
      distractors: ["praktischer", "praktisch", "praktischste"],
      explanation:
        "Hier wird das Fahrrad mit anderen Möglichkeiten allgemein verglichen: „ist das Fahrrad am praktischsten“."
    },
    {
      no: 3,
      correct: "unangenehmer",
      distractors: ["am unangenehmsten", "unangenehm", "unangenehme"],
      explanation:
        "„Im Winter ist es unangenehmer“ – Vergleich mit einer anderen Jahreszeit."
    },
    {
      no: 4,
      correct: "bequemer",
      distractors: ["am bequemsten", "bequem", "bequeme"],
      explanation:
        "„Viele Leute finden das Auto bequemer“ – wieder Komparativ."
    },
    {
      no: 5,
      correct: "günstiger",
      distractors: ["am günstigsten", "günstig", "günstige"],
      explanation:
        "Im Vergleich mit dem Auto: „das Ticket ist günstiger“."
    }
  ]
};

// 10. B1 – Satzbau: Haupt- und Nebensätze – Exercise 1
export const b1_satzbau_haupt_nebensaetze_1: Exercise = {
  id: "b1_satzbau_haupt_nebensaetze_1",
  level: "B1",
  grammar_section_id: "satzbau_komplex",
  grammar_ui_topics: ["satzbau"],
  content_topic: "Pläne fürs Wochenende",
  model: "mvp-static",
  text:
    "Am Freitag arbeite ich nur bis 18 Uhr, [1] ich danach Freunde treffe. " +
    "Am Samstag möchte ich ausschlafen, [2] ich die ganze Woche früh aufstehen musste. " +
    "Wenn das Wetter gut ist, [3] wir einen Ausflug ins Grüne, [4] wir dort ein Picknick machen können.",
  gaps: [
    {
      no: 1,
      correct: "weil",
      distractors: ["denn", "obwohl", "wenn"],
      explanation:
        "„weil ich danach Freunde treffe“ ist ein Nebensatz mit Verb am Ende. „denn“ würde einen Hauptsatz einleiten."
    },
    {
      no: 2,
      correct: "weil",
      distractors: ["dass", "ob", "wenn"],
      explanation:
        "Auch hier wird ein Grund genannt: „weil ich die ganze Woche früh aufstehen musste“."
    },
    {
      no: 3,
      correct: "machen",
      distractors: ["machen wir", "wir machen", "gemacht"],
      explanation:
        "Nach dem Wenn-Satz steht im Hauptsatz das Verb an zweiter Stelle: „Wenn …, machen wir einen Ausflug …“. In der Lücke steht deshalb nur das Verb."
    },
    {
      no: 4,
      correct: "damit",
      distractors: ["weil", "wenn", "dass"],
      explanation:
        "„damit wir dort ein Picknick machen können“ beschreibt ein Ziel/Zweck des Ausflugs."
    }
  ]
};

// Optional helper array
export const b1_exercises: Exercise[] = [
  b1_zeiten_praesens_perfekt_1,
  b1_modalverben_1,
  b1_trennbare_verben_1,
  b1_reflexive_verben_1,
  b1_nebensaetze_weil_dass_wenn_1,
  b1_relativsaetze_basis_1,
  b1_praepositionen_ort_zeit_1,
  b1_adjektivdeklination_basis_1,
  b1_vergleich_komparativ_superlativ_1,
  b1_satzbau_haupt_nebensaetze_1
];
