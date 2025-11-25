// a1_mock_exercises.ts
// A1 mock exercises for Infinite Grammar MVP

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

// 1. A1 – Personalpronomen im Nominativ – Exercise 1
export const a1_personalpronomen_1: Exercise = {
  id: "a1_personalpronomen_1",
  level: "A1",
  // matches grammarSections.a1[id: "personalpronomen_nominativ"]
  grammar_section_id: "personalpronomen_nominativ",
  grammar_ui_topics: ["nomen", "artikel"],
  content_topic: "Freunde und Nachbarn",
  model: "mvp-static",
  text:
    "Das ist Lukas. [1] kommt aus Polen. Ich bin sein Freund. [2] wohnen in derselben Straße. " +
    "Am Wochenende treffen [3] uns oft im Park.",
  gaps: [
    {
      no: 1,
      correct: "Er",
      distractors: ["Sie", "Wir", "Ich"],
      explanation:
        `„Er“ ist das Personalpronomen im Nominativ für eine männliche Person: „Er kommt aus Polen."`
    },
    {
      no: 2,
      correct: "Wir",
      distractors: ["Sie", "Ihr", "Er"],
      explanation:
        `Das Subjekt ist „Lukas und ich“ – zusammen „wir“: „Wir wohnen in derselben Straße."`
    },
    {
      no: 3,
      correct: "wir",
      distractors: ["uns", "sie", "ihr"],
      explanation:
        `Im Satz „treffen wir uns“ steht „wir“ als Subjekt, „uns“ ist Reflexivpronomen.`
    }
  ]
};

// 2. A1 – Verben: sein und haben (Präsens) – Exercise 1
export const a1_sein_haben_1: Exercise = {
  id: "a1_sein_haben_1",
  level: "A1",
  // Präsens-Grundformen → grammarSections.a1[id: "praesens_grundform"]
  grammar_section_id: "praesens_grundform",
  grammar_ui_topics: ["verben"],
  content_topic: "Wohnsituation",
  model: "mvp-static",
  text:
    "Ich [1] 28 Jahre alt und [2] eine kleine Wohnung. " +
    "Meine Wohnung [3] nur zwei Zimmer, aber sie [4] sehr hell. " +
    "Am Abend [5] ich oft müde, aber zufrieden.",
  gaps: [
    {
      no: 1,
      correct: "bin",
      distractors: ["habe", "ist", "sind"],
      explanation:
        `Mit dem Verb „sein“: „Ich bin 28 Jahre alt.“`
    },
    {
      no: 2,
      correct: "habe",
      distractors: ["bin", "hat", "ist"],
      explanation:
        `Besitz drückt man mit „haben“ aus: „Ich habe eine kleine Wohnung.“`
    },
    {
      no: 3,
      correct: "hat",
      distractors: ["habe", "ist", "sind"],
      explanation:
        `Subjekt „meine Wohnung“ (Singular) → „hat“: „Meine Wohnung hat nur zwei Zimmer.“`
    },
    {
      no: 4,
      correct: "ist",
      distractors: ["hat", "sind", "bin"],
      explanation:
        `Zustand mit „sein“: „sie ist sehr hell.“`
    },
    {
      no: 5,
      correct: "bin",
      distractors: ["habe", "ist", "sind"],
      explanation:
        `„Ich bin müde“ – Adjektiv mit „sein“ im Präsens.`
    }
  ]
};

// 3. A1 – Regelmäßige Verben im Präsens – Exercise 1
export const a1_regelmaessige_verben_1: Exercise = {
  id: "a1_regelmaessige_verben_1",
  level: "A1",
  // ebenfalls Teil der Präsens-Grundformen
  grammar_section_id: "praesens_grundform",
  grammar_ui_topics: ["verben", "satzbau"],
  content_topic: "Arbeit und Freizeit",
  model: "mvp-static",
  text:
    "Ich [1] in Hamburg und [2] in einem Büro. " +
    "Nach der Arbeit [3] ich Deutsch und am Wochenende [4] ich Fußball mit Freunden.",
  gaps: [
    {
      no: 1,
      correct: "wohne",
      distractors: ["wohnen", "wohnt", "gewohnt"],
      explanation:
        `1. Person Singular Präsens: „Ich wohne in Hamburg.“`
    },
    {
      no: 2,
      correct: "arbeite",
      distractors: ["arbeitet", "arbeiten", "gearbeitet"],
      explanation:
        `1. Person Singular Präsens: „Ich arbeite in einem Büro.“`
    },
    {
      no: 3,
      correct: "lerne",
      distractors: ["lernen", "lernt", "gelernt"],
      explanation:
        `Nach dem Satzanfang mit Zeitangabe steht das Verb an zweiter Stelle: „Nach der Arbeit lerne ich Deutsch.“`
    },
    {
      no: 4,
      correct: "spiele",
      distractors: ["spielt", "spielen", "gespielt"],
      explanation:
        `„Am Wochenende spiele ich Fußball“ – regelmäßiges Verb, 1. Person Singular: „spiele“.`
    }
  ]
};

// 4. A1 – Artikel: bestimmt / unbestimmt – Exercise 1
export const a1_artikel_grundformen_1: Exercise = {
  id: "a1_artikel_grundformen_1",
  level: "A1",
  // matches grammarSections.a1[id: "artikel_grundlagen"]
  grammar_section_id: "artikel_grundlagen",
  grammar_ui_topics: ["artikel", "nomen"],
  content_topic: "Wohnzimmer",
  model: "mvp-static",
  text:
    "Im Wohnzimmer steht [1] Sofa und [2] kleiner Tisch. " +
    "[3] Lampe an der Decke ist sehr hell. " +
    "Abends sitze ich gern auf [4] Sofa und lese [5] Buch.",
  gaps: [
    {
      no: 1,
      correct: "ein",
      distractors: ["eine", "der", "das"],
      explanation:
        `Unbestimmter Artikel im Nominativ Neutrum: „ein Sofa“ – „Im Wohnzimmer steht ein Sofa …“`
    },
    {
      no: 2,
      correct: "ein",
      distractors: ["einen", "eine", "dem"],
      explanation:
        `„und ein kleiner Tisch“ – unbestimmter Artikel im Nominativ Maskulin: „ein Tisch“ (Subjekt).`
    },
    {
      no: 3,
      correct: "Die",
      distractors: ["Der", "Das", "Ein"],
      explanation:
        `Bestimmter Artikel für „Lampe“ (feminin): „Die Lampe an der Decke ist sehr hell.“`
    },
    {
      no: 4,
      correct: "dem",
      distractors: ["den", "ein", "einem"],
      explanation:
        `Ort mit „auf“ + Dativ: „auf dem Sofa“ – kein Richtungswechsel, sondern Position.`
    },
    {
      no: 5,
      correct: "ein",
      distractors: ["eine", "dem", "der"],
      explanation:
        `Akkusativobjekt Neutrum: „ein Buch“ – „ich lese ein Buch.“`
    }
  ]
};

// 5. A1 – Präpositionen des Ortes – Exercise 1
export const a1_praepositionen_ort_1: Exercise = {
  id: "a1_praepositionen_ort_1",
  level: "A1",
  // matches grammarSections.a1[id: "praepositionen_ort"]
  grammar_section_id: "praepositionen_ort",
  grammar_ui_topics: ["praepositionen"],
  content_topic: "Küche",
  model: "mvp-static",
  text:
    "In meiner Küche steht der Tisch [1] dem Fenster. " +
    "Die Stühle stehen [2] den Tisch. " +
    "[3] dem Tisch steht ein Regal, und [4] dem Regal stehen viele Gläser. " +
    "Wenn Besuch kommt, sitzen wir alle [5] dem Tisch.",
  gaps: [
    {
      no: 1,
      correct: "neben",
      distractors: ["auf", "unter", "an"],
      explanation:
        `„neben dem Fenster“ beschreibt eine Position direkt seitlich vom Fenster.`
    },
    {
      no: 2,
      correct: "um",
      distractors: ["an", "auf", "in"],
      explanation:
        `„um den Tisch“ – die Stühle stehen rund um den Tisch herum (Akkusativ).`
    },
    {
      no: 3,
      correct: "Hinter",
      distractors: ["Über", "Unter", "Vor"],
      explanation:
        `Satzanfang, daher groß: „Hinter dem Tisch steht ein Regal.“`
    },
    {
      no: 4,
      correct: "auf",
      distractors: ["in", "unter", "neben"],
      explanation:
        `„Auf dem Regal stehen viele Gläser“ – die Gläser stehen oben auf der Fläche.`
    },
    {
      no: 5,
      correct: "an",
      distractors: ["auf", "unter", "in"],
      explanation:
        `„an dem Tisch sitzen“ – wir sitzen mit den Stühlen an der Tischkante.`
    }
  ]
};

// 6. A1 – Familie: Personal- und Possessivpronomen – Exercise 1
export const a1_familie_pronomen_1: Exercise = {
  id: "a1_familie_pronomen_1",
  level: "A1",
  // auch Personalpronomen → gleiche Section wie Übung 1
  grammar_section_id: "personalpronomen_nominativ",
  grammar_ui_topics: ["nomen", "artikel"],
  content_topic: "Familie vorstellen",
  model: "mvp-static",
  text:
    "Das ist meine Familie: Das ist mein Vater. [1] heißt Thomas. " +
    "Das ist meine Mutter. [2] heißt Anna. " +
    "Ich habe eine Schwester. [3] heißt Julia und [4] Zimmer ist sehr bunt.",
  gaps: [
    {
      no: 1,
      correct: "Er",
      distractors: ["Sie", "Ihr", "Sein"],
      explanation:
        `Für den Vater benutzt man „Er“: „Er heißt Thomas.“`
    },
    {
      no: 2,
      correct: "Sie",
      distractors: ["Er", "Ihr", "Sie heißt"],
      explanation:
        `Für die Mutter: „Sie heißt Anna.“ – Personalpronomen feminin.`
    },
    {
      no: 3,
      correct: "Sie",
      distractors: ["Ihr", "Er", "Du"],
      explanation:
        `Auch für die Schwester: „Sie heißt Julia.“`
    },
    {
      no: 4,
      correct: "Ihr",
      distractors: ["Sein", "Mein", "Ihrer"],
      explanation:
        `Possessivpronomen für die Schwester: „Ihr Zimmer ist sehr bunt.“`
    }
  ]
};

// 7. A1 – Fragewörter – Exercise 1
export const a1_fragewoerter_1: Exercise = {
  id: "a1_fragewoerter_1",
  level: "A1",
  // Fragen gehören thematisch zum Satzbau/Wortstellung (Fragesätze)
  grammar_section_id: "satzbau_wortstellung",
  grammar_ui_topics: ["satzbau"],
  content_topic: "Neue Stadt",
  model: "mvp-static",
  text:
    "Ich bin neu in der Stadt und habe viele Fragen. [1] heißt diese Straße? " +
    "[2] fährt der Bus zur Schule? Und [3] kostet eine Fahrkarte? " +
    "Die Frau an der Haltestelle hilft mir und erklärt mir, [4] ich umsteigen muss.",
  gaps: [
    {
      no: 1,
      correct: "Wie",
      distractors: ["Was", "Wer", "Wo"],
      explanation:
        `„Wie heißt …?“ ist die typische Frage nach einem Namen: „Wie heißt diese Straße?“`
    },
    {
      no: 2,
      correct: "Wann",
      distractors: ["Wie", "Wo", "Was"],
      explanation:
        `Hier geht es um die Zeit: „Wann fährt der Bus zur Schule?“`
    },
    {
      no: 3,
      correct: "Wie viel",
      distractors: ["Wann", "Wo", "Wie"],
      explanation:
        `Frage nach dem Preis: „Wie viel kostet eine Fahrkarte?“`
    },
    {
      no: 4,
      correct: "wo",
      distractors: ["wann", "wie", "was"],
      explanation:
        `Indirekte Frage: „Sie erklärt mir, wo ich umsteigen muss.“`
    }
  ]
};

// 8. A1 – Satzbau: Verbzweitstellung – Exercise 1
export const a1_satzbau_verbzweit_1: Exercise = {
  id: "a1_satzbau_verbzweit_1",
  level: "A1",
  // Satzbau/Wortstellung-Grundlage
  grammar_section_id: "satzbau_wortstellung",
  grammar_ui_topics: ["satzbau", "verben"],
  content_topic: "Tagesablauf",
  model: "mvp-static",
  text:
    "Am Morgen [1] ich zuerst einen Kaffee und dann [2] ich zur Arbeit. " +
    "Im Büro [3] ich E-Mails und telefoniere mit Kunden. " +
    "Abends [4] ich oft müde, aber ich [5] trotzdem noch ein bisschen Deutsch.",
  gaps: [
    {
      no: 1,
      correct: "trinke",
      distractors: ["trinkt", "trinken", "getrunken"],
      explanation:
        `Nach der Zeitangabe „Am Morgen“ steht das Verb an zweiter Stelle: „Am Morgen trinke ich …“`
    },
    {
      no: 2,
      correct: "gehe",
      distractors: ["geht", "gehen", "gegangen"],
      explanation:
        `„dann gehe ich zur Arbeit“ – 1. Person Singular: „gehe“`
    },
    {
      no: 3,
      correct: "schreibe",
      distractors: ["schreibt", "schreiben", "geschrieben"],
      explanation:
        `„Im Büro schreibe ich E-Mails“ – Verb wieder an zweiter Stelle: „schreibe“.`
    },
    {
      no: 4,
      correct: "bin",
      distractors: ["habe", "ist", "sind"],
      explanation:
        `Zustand am Abend: „Abends bin ich oft müde.“`
    },
    {
      no: 5,
      correct: "lerne",
      distractors: ["lernen", "lernt", "gelernt"],
      explanation:
        `„ich lerne noch ein bisschen Deutsch“ – regelmäßiges Verb, 1. Person Singular: „lerne“.`
    }
  ]
};

// Optional helper array for easy import
export const a1_exercises: Exercise[] = [
  a1_personalpronomen_1,
  a1_sein_haben_1,
  a1_regelmaessige_verben_1,
  a1_artikel_grundformen_1,
  a1_praepositionen_ort_1,
  a1_familie_pronomen_1,
  a1_fragewoerter_1,
  a1_satzbau_verbzweit_1
];
