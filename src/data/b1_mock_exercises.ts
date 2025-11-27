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



// 2. B1 – Zeiten: Präsens / Perfekt – Exercise 2
export const b1_zeiten_praesens_perfekt_2: Exercise = {
  id: "b1_zeiten_praesens_perfekt_2",
  level: "B1",
  grammar_section_id: "tempus_perfekt_praeteritum",
  grammar_ui_topics: ["verben"],
  content_topic: "Alltag in der WG",
  model: "mvp-static",
  text:
    "Unter der Woche [1] ich meistens erst gegen sieben Uhr nach Hause. Dann [2] ich schnell etwas zu Abend und [3] mich noch kurz mit meinen Mitbewohnern. " +
    "In den letzten Tagen [4] ich allerdings so viel gearbeitet, dass ich abends oft sofort eingeschlafen [5].",
  gaps: [
    {
      no: 1,
      correct: "komme",
      distractors: ["bin gekommen", "kam", "werde kommen"],
      explanation:
        "Es geht um eine regelmäßige Gewohnheit in der Gegenwart („unter der Woche“), daher Präsens: „ich komme nach Hause“."
    },
    {
      no: 2,
      correct: "koche",
      distractors: ["habe gekocht", "kochte", "gekocht"],
      explanation:
        "Auch hier wird eine feste Routine beschrieben. Im Präsens: „Dann koche ich schnell etwas zu Abend.“"
    },
    {
      no: 3,
      correct: "unterhalte",
      distractors: ["habe unterhalten", "unterhielt", "mich unterhalten"],
      explanation:
        "Das Verb heißt „sich unterhalten“. Mit „ich“ im Präsens: „ich unterhalte mich“. Das Reflexivpronomen „mich“ steht schon im Satz."
    },
    {
      no: 4,
      correct: "habe",
      distractors: ["bin", "hatte", "werde"],
      explanation:
        "„Ich habe gearbeitet“ – das Perfekt von „arbeiten“ wird mit „haben“ gebildet: „In den letzten Tagen habe ich so viel gearbeitet …“."
    },
    {
      no: 5,
      correct: "bin",
      distractors: ["habe", "war", "gewesen"],
      explanation:
        "„einschlafen“ bildet das Perfekt mit „sein“: „ich bin eingeschlafen“. Deshalb: „dass ich abends oft sofort eingeschlafen bin“."
    }
  ]
};


// 3. B1 – Modalverben – Exercise 1
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

// 4. B1 – Modalverben – Exercise 2
export const b1_modalverben_2: Exercise = {
  id: "b1_modalverben_2",
  level: "B1",
  grammar_section_id: "modalverben_praeteritum",
  grammar_ui_topics: ["verben"],
  content_topic: "Regeln zu Hause",
  model: "mvp-static",
  text:
    "Zu Hause habe ich mit meinen Eltern klare Regeln: Unter der Woche [1] ich nicht länger als eine Stunde am Computer spielen. " +
    "Vor dem Abendessen [2] ich meiner Mutter in der Küche helfen. Am Wochenende [3] ich länger wach bleiben, wenn ich am nächsten Tag keine Schule habe. " +
    "Wenn ich schlechte Noten schreibe, [4] ich mir mehr Zeit zum Lernen nehmen. Meine Eltern sagen, ich [5] selbst entscheiden lernen, wie ich meine Freizeit nutze.",
  gaps: [
    {
      no: 1,
      correct: "darf",
      distractors: ["kann", "muss", "soll"],
      explanation:
        "„nicht länger als eine Stunde am Computer spielen“ beschreibt eine Erlaubnis mit Grenze – darum steht hier „ich darf … nicht länger spielen“."
    },
    {
      no: 2,
      correct: "soll",
      distractors: ["muss", "kann", "darf"],
      explanation:
        "Die Eltern erwarten Hilfe, aber es klingt eher nach einer Regel/Empfehlung als nach strenger Pflicht – deshalb „ich soll meiner Mutter helfen“."
    },
    {
      no: 3,
      correct: "darf",
      distractors: ["muss", "kann", "soll"],
      explanation:
        "Am Wochenende ist es erlaubt, länger wach zu bleiben: „ich darf länger wach bleiben“ drückt diese Erlaubnis aus."
    },
    {
      no: 4,
      correct: "muss",
      distractors: ["kann", "darf", "möchte"],
      explanation:
        "Bei schlechten Noten handelt es sich um eine Notwendigkeit: „ich muss mir mehr Zeit zum Lernen nehmen“."
    },
    {
      no: 5,
      correct: "soll",
      distractors: ["muss", "kann", "darf"],
      explanation:
        "Die Eltern formulieren eine Erwartung für die Zukunft: „ich soll selbst entscheiden lernen“ – eine Art Aufgabe oder Ziel."
    }
  ]
};


// 5. B1 – Trennbare Verben – Exercise 1
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

// 6. B1 – Trennbare Verben – Exercise 2
export const b1_trennbare_verben_2: Exercise = {
  id: "b1_trennbare_verben_2",
  level: "B1",
  grammar_section_id: "trennbare_verben",
  grammar_ui_topics: ["verben", "satzbau"],
  content_topic: "Feierabend",
  model: "mvp-static",
  text:
    "Am Freitag [1] ich meistens pünktlich um 17 Uhr mit der Arbeit [2]. " +
    "Zu Hause [3] ich mir zuerst die bequeme Hose [4] und [5] den Fernseher [6], um kurz abzuschalten. " +
    "Später [7] ich meine Freundin [8], ob sie noch Lust auf einen Spaziergang hat.",
  gaps: [
    {
      no: 1,
      correct: "höre",
      distractors: ["höre auf", "hörte", "habe"],
      explanation:
        "Das Verb heißt „aufhören“. Im Satz steht das konjugierte Verb an Position 2: „Am Freitag höre ich … auf“. In die Lücke kommt nur „höre“."
    },
    {
      no: 2,
      correct: "auf",
      distractors: ["zu", "an", "aus"],
      explanation:
        "Die Vorsilbe von „aufhören“ steht am Satzende: „mit der Arbeit auf“. Andere Präfixe würden ein anderes oder kein korrektes Verb ergeben."
    },
    {
      no: 3,
      correct: "ziehe",
      distractors: ["ziehe aus", "zog", "habe"],
      explanation:
        "Das trennbare Verb ist „ausziehen“: „Zu Hause ziehe ich mir … aus“. Verbzweitstellung → „ziehe“ steht an Position 2."
    },
    {
      no: 4,
      correct: "aus",
      distractors: ["an", "auf", "ein"],
      explanation:
        "Die Verbpartikel von „ausziehen“ steht am Ende des Satzteils: „die bequeme Hose aus“."
    },
    {
      no: 5,
      correct: "mache",
      distractors: ["mache an", "mach", "machte"],
      explanation:
        "Hier steht das Verb „anmachen“ im Präsens: „ich mache den Fernseher an“. Die konjugierte Form „mache“ steht an Position 2."
    },
    {
      no: 6,
      correct: "an",
      distractors: ["auf", "aus", "ein"],
      explanation:
        "Die Vorsilbe von „anmachen“ ist „an“: „den Fernseher an“. Andere Präfixe würden eine andere Bedeutung haben oder wären falsch."
    },
    {
      no: 7,
      correct: "rufe",
      distractors: ["rufe an", "rief", "habe"],
      explanation:
        "Das Verb lautet „anrufen“: „Später rufe ich meine Freundin an“. Wegen der Verbzweitstellung steht „rufe“ allein in der Lücke."
    },
    {
      no: 8,
      correct: "an",
      distractors: ["auf", "aus", "ein"],
      explanation:
        "Die Partikel von „anrufen“ kommt ans Satzende: „meine Freundin an“. „auf-/aus-/einrufen“ gibt es in diesem Zusammenhang nicht."
    }
  ]
};


// 7. B1 – Reflexive Verben – Exercise 1
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

// 8. B1 – Reflexive Verben – Exercise 2
export const b1_reflexive_verben_2: Exercise = {
  id: "b1_reflexive_verben_2",
  level: "B1",
  grammar_section_id: "reflexive_verben",
  grammar_ui_topics: ["verben"],
  content_topic: "Vorbereitung auf ein Vorstellungsgespräch",
  model: "mvp-static",
  text:
    "Am Tag vor einem wichtigen Vorstellungsgespräch [1] ich [2] immer besonders gut vor. " +
    "Zuerst [3] ich [4] alle Unterlagen zurecht und überlege, welche Fragen gestellt werden könnten. " +
    "Dann [5] ich [6] im Spiegel an und übe, wie ich mich vorstellen kann. " +
    "Wenn ich merke, dass ich nervös werde, [7] ich [8] bewusst ein paar Minuten, um ruhig zu atmen.",
  gaps: [
    {
      no: 1,
      correct: "bereite",
      distractors: ["bereiten", "bereitete", "habe bereitet"],
      explanation:
        "Das Verb heißt „sich vorbereiten“. Mit „ich“ steht es im Präsens als „ich bereite … vor“."
    },
    {
      no: 2,
      correct: "mich",
      distractors: ["mir", "dich", "uns"],
      explanation:
        "Bei „sich vorbereiten“ steht das Reflexivpronomen im Akkusativ: „ich bereite mich vor“."
    },
    {
      no: 3,
      correct: "lege",
      distractors: ["lege mir", "legte", "habe gelegt"],
      explanation:
        "Das Verb ist „sich etwas zurechtlegen“. Das konjugierte Verb steht an Position 2: „ich lege mir … zurecht“."
    },
    {
      no: 4,
      correct: "mir",
      distractors: ["mich", "dich", "uns"],
      explanation:
        "„sich etwas zurechtlegen“ verwendet das Reflexivpronomen im Dativ: „ich lege mir alle Unterlagen zurecht“."
    },
    {
      no: 5,
      correct: "sehe",
      distractors: ["schaue", "sehe mir", "sehe an"],
      explanation:
        "Das Verb lautet „sich ansehen“: „Dann sehe ich mich im Spiegel an“. Im Mittelfeld steht nur das konjugierte Verb „sehe“."
    },
    {
      no: 6,
      correct: "mich",
      distractors: ["mir", "dich", "ihn"],
      explanation:
        "Bei „sich etwas ansehen“ steht das Reflexivpronomen im Akkusativ: „ich sehe mich im Spiegel an“."
    },
    {
      no: 7,
      correct: "nehme",
      distractors: ["nehme mir", "nahm", "genommen"],
      explanation:
        "Das Verb heißt „sich Zeit nehmen“. Wegen der Verbzweitstellung steht hier nur „nehme“: „nehme ich mir …“."
    },
    {
      no: 8,
      correct: "mir",
      distractors: ["mich", "uns", "dir"],
      explanation:
        "Bei „sich Zeit nehmen“ steht das Reflexivpronomen im Dativ: „ich nehme mir ein paar Minuten“."
    }
  ]
};

// 9. B1 – Nebensätze mit weil / dass / wenn – Exercise 1
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

// 10. B1 – Nebensätze mit weil / dass / wenn – Exercise 2
export const b1_nebensaetze_weil_dass_wenn_2: Exercise = {
  id: "b1_nebensaetze_weil_dass_wenn_2",
  level: "B1",
  grammar_section_id: "satzbau_komplex",
  grammar_ui_topics: ["satzbau", "verben"],
  content_topic: "Zur Arbeit pendeln",
  model: "mvp-static",
  text:
    "Ich fahre meistens mit dem Zug zur Arbeit, [1] ich so die Staus auf der Autobahn vermeiden kann. " +
    "Mein Chef hat mir erklärt, [2] es sehr wichtig ist, pünktlich zu sein. " +
    "[3] der Zug Verspätung hat, schreibe ich ihm sofort eine Nachricht, [4] er sonst nicht weiß, dass ich später komme.",
  gaps: [
    {
      no: 1,
      correct: "weil",
      distractors: ["wenn", "dass", "obwohl"],
      explanation:
        "„weil ich so die Staus … vermeiden kann“ – hier wird ein Grund genannt, warum die Person mit dem Zug fährt. Dafür verwendet man „weil“."
    },
    {
      no: 2,
      correct: "dass",
      distractors: ["weil", "wenn", "ob"],
      explanation:
        "Nach Verben wie „erklären“ steht häufig ein „dass“-Satz: „Mein Chef hat mir erklärt, dass es sehr wichtig ist …“."
    },
    {
      no: 3,
      correct: "Wenn",
      distractors: ["Weil", "Dass", "Obwohl"],
      explanation:
        "„Wenn der Zug Verspätung hat“ beschreibt eine Bedingung bzw. eine Situation, unter der etwas passiert. Deshalb passt „Wenn“."
    },
    {
      no: 4,
      correct: "weil",
      distractors: ["wenn", "dass", "damit"],
      explanation:
        "Hier wird wieder ein Grund genannt: Er schreibt eine Nachricht, weil der Chef sonst nicht weiß, dass er später kommt."
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
