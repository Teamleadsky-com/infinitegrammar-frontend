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
  a1: [
    {
      id: "satzbau_wortstellung",
      name: "Satzbau und Wortstellung (A1-Basis)",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Einfacher Aussagesatz: Subjekt + Verb + Ergänzungen (Ich wohne in Berlin.)",
        "Ja-/Nein-Fragen mit Verb am Satzanfang (Wohnst du in Berlin?)",
        "W-Fragen mit Fragewort am Satzanfang (Wo wohnst du?)",
        "Einfache Verneinung mit „nicht“ und „kein“ (Ich arbeite nicht. Ich habe kein Auto.)",
      ],
    },
    {
      id: "praesens_grundform",
      name: "Präsens (Grundformen)",
      grammar_ui_topics: ["verben"],
      points: [
        "Konjugation regelmäßiger Verben im Präsens (wohnen, lernen, arbeiten …)",
        "Häufige unregelmäßige Verben im Präsens (sein, haben, gehen, kommen …)",
        "Präsens für Gegenwart und nahe Zukunft (Ich fahre morgen nach Köln.)",
        "Typische Alltagsverben in einfachen Sätzen",
      ],
    },
    {
      id: "imperativ_grundlagen",
      name: "Imperativ (Aufforderungen)",
      grammar_ui_topics: ["verben"],
      points: [
        "Du-Imperativ ohne Pronomen (Komm!, Lies!, Warte!)",
        "Sie-Imperativ mit „bitte“ (Kommen Sie bitte rein.)",
        "Wir-Form als Vorschlag (Gehen wir spazieren.)",
        "Höfliche Aufforderungen mit Modalverben (Können Sie bitte …?)",
      ],
    },
    {
      id: "artikel_grundlagen",
      name: "Artikel (Grundlagen im Nominativ)",
      grammar_ui_topics: ["artikel"],
      points: [
        "Bestimmte Artikel im Nominativ (der, die, das)",
        "Unbestimmte Artikel im Nominativ (ein, eine)",
        "Unterscheidung zwischen „ein“ und „kein“",
        "Typische Nomen mit Artikel im Alltag (die Wohnung, das Auto, der Bus …)",
      ],
    },
    {
      id: "personalpronomen_nominativ",
      name: "Personalpronomen im Nominativ",
      grammar_ui_topics: ["artikel", "nomen"],
      points: [
        "Pronomentabelle: ich, du, er, sie, es, wir, ihr, sie, Sie",
        "Zuordnung zu Personen und Höflichkeitsform (du vs. Sie)",
        "Pronomen als Subjekt im Satz (Ich komme aus Spanien.)",
        "Wechsel zwischen Nomen und Pronomen (Der Mann ist Lehrer. Er kommt aus Italien.)",
      ],
    },
    {
      id: "pluralbildung_nomen",
      name: "Pluralbildung bei Nomen (Überblick)",
      grammar_ui_topics: ["nomen"],
      points: [
        "Häufige Pluralendungen (-e, -er, -(e)n, -s)",
        "Nomen mit Umlaut im Plural (der Apfel – die Äpfel)",
        "Nomen mit gleichbleibender Form (das Fenster – die Fenster)",
        "Artikel im Plural: die (die Bücher, die Wohnungen …)",
      ],
    },
    {
      id: "praepositionen_ort",
      name: "Präpositionen für Ort (A1)",
      grammar_ui_topics: ["praepositionen"],
      points: [
        "Einfache lokale Präpositionen: in, auf, an, bei",
        "Fragen mit „wo?“ (Ich bin in der Küche. Er ist im Büro.)",
        "Typische Ortsangaben mit Artikeln (in der Stadt, im Park, im Café)",
        "Einfache Ausdrücke mit „nach“ und „zu“ (nach Hause, zur Arbeit)",
      ],
    },
    {
      id: "praepositionen_zeit_einfach",
      name: "Einfache Zeitangaben mit Präpositionen",
      grammar_ui_topics: ["praepositionen"],
      points: [
        "Zeitangaben mit „am“ + Tag (am Montag, am Wochenende)",
        "Zeitangaben mit „um“ + Uhrzeit (um 8 Uhr, um halb neun)",
        "Zeitangaben mit „im“ + Monat oder Jahreszeit (im Januar, im Sommer)",
        "Adverbien für Zeit: heute, morgen, gestern, jetzt, später",
      ],
    },
    {
      id: "adjektive_grundform",
      name: "Adjektive im Alltag (Grundform)",
      grammar_ui_topics: ["adjektive"],
      points: [
        "Adjektive nach „sein“ ohne Endung (Die Wohnung ist klein. Das Essen ist gut.)",
        "Häufige Adjektive zur Beschreibung von Personen und Dingen (groß, klein, jung, alt, teuer, billig …)",
        "Einfache Gegensätze (groß/klein, neu/alt, schnell/langsam)",
        "Adjektive in festen Wendungen (guten Tag, schöne Wohnung …)",
      ],
    },
  ],

  a2: [
    {
      id: "satzbau_wortstellung_a2",
      name: "Satzbau und Wortstellung (A2)",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Verbzweitstellung im Aussagesatz mit mehreren Ergänzungen",
        "Ja-/Nein-Fragen und W-Fragen mit längeren Ergänzungen",
        "Einfache Nebensätze mit „weil“ und „dass“",
        "Satzklammer bei Modalverben und trennbaren Verben (Ich möchte heute einkaufen gehen.)",
      ],
    },
    {
      id: "tempora_praesens_perfekt",
      name: "Zeitformen: Präsens und Perfekt",
      grammar_ui_topics: ["verben"],
      points: [
        "Präsens zur Beschreibung von Gewohnheiten und Plänen",
        "Bildung des Perfekts mit „haben“ und „sein“",
        "Partizip II regelmäßiger und wichtiger unregelmäßiger Verben",
        "Unterschied Präsens vs. Perfekt im Alltag (heute – gestern – schon)",
        "Typische Zeitangaben mit Perfekt (gestern, schon, noch nicht, seit …)",
      ],
    },
    {
      id: "modalverben_grundlagen",
      name: "Modalverben (Grundlagen A2)",
      grammar_ui_topics: ["verben"],
      points: [
        "Bedeutung der Modalverben (können, müssen, dürfen, sollen, wollen)",
        "Stellung von Modalverb + Infinitiv im Satz (Ich muss heute lange arbeiten.)",
        "Fragen und Verneinungen mit Modalverben",
        "Unterschied zwischen Höflichkeit und Pflicht (können vs. müssen vs. sollen)",
      ],
    },
    {
      id: "trennbare_verben",
      name: "Trennbare Verben",
      grammar_ui_topics: ["verben", "satzbau"],
      points: [
        "Trennung im Hauptsatz (Ich stehe früh auf. Er ruft seine Freundin an.)",
        "Nicht-Trennung im Infinitiv und Nebensatz (früh aufzustehen, dass er seine Freundin anruft)",
        "Häufige trennbare Verben im Alltag (aufstehen, einkaufen, anrufen, mitbringen …)",
        "Position von Zeit- und Ortsangaben bei trennbaren Verben",
      ],
    },
    {
      id: "praepositionen_ort_richtung",
      name: "Präpositionen für Ort und Richtung",
      grammar_ui_topics: ["praepositionen"],
      points: [
        "Lokale Präpositionen mit Dativ (bei, mit, von, in, an, auf im Sinn von „wo?“)",
        "Wechselpräpositionen mit Akkusativ für „wohin?“ (in, auf, an …)",
        "Typische Kombinationen (im Büro, in der Stadt, auf dem Land, an der Haltestelle)",
        "Ausdrücke mit nach, zu, in (nach Berlin, zur Arbeit, ins Kino)",
      ],
    },
    {
      id: "praepositionen_zeit",
      name: "Präpositionen für Zeitangaben (A2)",
      grammar_ui_topics: ["praepositionen"],
      points: [
        "Temporale Präpositionen: vor, seit, ab, bis, in",
        "Zeitangaben mit Dativ (am Montag, im Juli, im Jahr 2023)",
        "„seit“ + Präsens für Handlungen, die noch dauern",
        "Unterschied „vor zwei Jahren“ vs. „in zwei Jahren“",
      ],
    },
    {
      id: "artikel_kasus",
      name: "Artikel und Kasus (Nominativ, Akkusativ, Dativ)",
      grammar_ui_topics: ["artikel", "nomen"],
      points: [
        "Wiederholung der bestimmten und unbestimmten Artikel im Nominativ",
        "Akkusativ für direkte Objekte (Ich kaufe einen Computer.)",
        "Einführung des Dativs mit häufigen Verben (helfen, danken, gefallen …)",
        "Typische Strukturen mit Akkusativ und Dativ (jemandem etwas geben, schicken, zeigen …)",
      ],
    },
    {
      id: "pronomen_grundlagen",
      name: "Pronomen (A2-Grundlagen)",
      grammar_ui_topics: ["artikel", "nomen"],
      points: [
        "Personalpronomen in Nominativ, Akkusativ und einfachem Dativ (ich, mich, mir …)",
        "Possessivpronomen im Satz (mein, dein, sein, ihr, unser, euer, Ihr)",
        "Unterscheidung von „ihr“ und „Ihr“ in der Anrede",
        "Einfache Reflexivpronomen (wir treffen uns, ich beeile mich …)",
      ],
    },
    {
      id: "adjektivdeklination_einstieg",
      name: "Adjektivdeklination (Einstieg)",
      grammar_ui_topics: ["adjektive", "artikel"],
      points: [
        "Adjektive als Ergänzung zu Verben ohne Endung (Das Essen ist lecker.)",
        "Adjektive mit unbestimmtem Artikel im Nominativ (ein neuer Job, eine kleine Stadt)",
        "Adjektive mit bestimmtem Artikel im Nominativ (der neue Job, die kleine Stadt)",
        "Häufige Adjektive im Alltag (teuer, billig, interessant, wichtig, schwierig …)",
      ],
    },
    {
      id: "vergleichsformen_adjektive_einstieg",
      name: "Vergleichsformen der Adjektive (A2)",
      grammar_ui_topics: ["adjektive"],
      points: [
        "Bildung des Komparativs (größer, schneller, wichtiger …)",
        "Einfache Vergleiche mit „als“ (Mein Zimmer ist größer als dein Zimmer.)",
        "Vergleiche mit „so … wie“ (Die Wohnung ist so teuer wie das Haus.)",
        "Wichtige unregelmäßige Formen (gern – lieber, viel – mehr, gut – besser)",
      ],
    },
  ],

  b1: [
    {
      id: "satzbau_komplex",
      name: "Satzbau in komplexen Sätzen (B1)",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Kombination von Haupt- und Nebensätzen mit „weil“, „dass“, „wenn“, „obwohl“",
        "Stellung von Verb und Satzklammer in längeren Sätzen",
        "Inversion nach vorangestellten Nebensätzen (Wenn ich Zeit habe, gehe ich spazieren.)",
        "Nutzung von Konnektoren wie „deshalb“, „trotzdem“, „außerdem“",
      ],
    },
    {
      id: "tempus_perfekt_praeteritum",
      name: "Perfekt und Präteritum im Alltag",
      grammar_ui_topics: ["verben"],
      points: [
        "Wiederholung der Perfektbildung mit „haben“ und „sein“",
        "Gebrauch von Perfekt vs. Präteritum bei häufigen Verben (war, hatte, ging, kam …)",
        "Typische Erzählsituationen (mündlich eher Perfekt, schriftlich mehr Präteritum)",
        "Zeitangaben in Erzähltexten (gestern, früher, damals, neulich …)",
      ],
    },
    {
      id: "futur1_und_planung",
      name: "Futur I und Planungen",
      grammar_ui_topics: ["verben"],
      points: [
        "Bildung von Futur I mit „werden“ + Infinitiv",
        "Unterschied zwischen Präsens mit Zukunftsbedeutung und Futur I",
        "Vermutung in der Gegenwart mit Futur I (Er wird schon zu Hause sein.)",
        "Typische Kontexte für Zukunftsaussagen",
      ],
    },
    {
      id: "modalverben_praeteritum",
      name: "Modalverben im Präteritum",
      grammar_ui_topics: ["verben"],
      points: [
        "Formen von „konnte, musste, durfte, sollte, wollte“ im Präteritum",
        "Unterschied zwischen Präsens und Präteritum bei Modalverben",
        "Verwendung von Modalverben in Erzählungen über die Vergangenheit",
        "Satzklammer mit Modalverb + Infinitiv im Präteritum",
      ],
    },
    {
      id: "konnektoren_b1",
      name: "Konnektoren im B1-Niveau",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Kausale Konnektoren: weil, denn",
        "Konsekutive Konnektoren: deshalb, daher, sodass",
        "Adversative Konnektoren: aber, jedoch, trotzdem",
        "Aufzählungen und Ergänzungen mit „und, oder, außerdem“",
      ],
    },
    {
      id: "relativsaetze_basis",
      name: "Relativsätze (Basis)",
      grammar_ui_topics: ["satzbau", "artikel"],
      points: [
        "Relativpronomen im Nominativ und Akkusativ (der, die, das, den)",
        "Einfache Relativsätze im Alltag (Die Frau, die dort sitzt, ist meine Lehrerin.)",
        "Kommasetzung bei Relativsätzen",
        "Verbindung von zwei einfachen Sätzen zu einem Relativsatz",
      ],
    },
    {
      id: "passiv_einstieg",
      name: "Passiv (Einstieg)",
      grammar_ui_topics: ["verben"],
      points: [
        "Bildung des Vorgangspassivs im Präsens (Das Auto wird repariert.)",
        "Unterscheidung Aktiv vs. Passiv im Alltag",
        "Passiv mit und ohne Agens („von + Dativ“)",
        "Typische Verben im Passiv (bauen, herstellen, produzieren …)",
      ],
    },
    {
      id: "adjektivdeklination_b1",
      name: "Adjektivdeklination im Nominativ und Akkusativ",
      grammar_ui_topics: ["adjektive", "artikel"],
      points: [
        "Adjektivendungen nach bestimmtem Artikel im Nominativ und Akkusativ",
        "Adjektivendungen nach unbestimmtem Artikel im Nominativ und Akkusativ",
        "Wiederholung der wichtigsten Deklinationsmuster im Singular",
        "Häufige Phrasen mit Adjektiv + Nomen (eine wichtige Entscheidung, ein neues Projekt …)",
      ],
    },
    {
      id: "praepositionen_wechselpraepositionen",
      name: "Wechselpräpositionen: Wohin? Wo?",
      grammar_ui_topics: ["praepositionen", "nomen"],
      points: [
        "Gebrauch von Akkusativ bei Richtungsangabe (in, an, auf, über …)",
        "Gebrauch von Dativ bei Ortsangabe (in, an, auf, über …)",
        "Typische Beispiele (Ich gehe in die Stadt. Ich bin in der Stadt.)",
        "Häufige Fehler und Strategien zur Unterscheidung",
      ],
    },
    {
      id: "verben_mit_praeposition_b1",
      name: "Verben mit Präposition (B1)",
      grammar_ui_topics: ["verben", "praepositionen"],
      points: [
        "Häufige Verben mit Präposition (warten auf, sprechen über, sich interessieren für …)",
        "Richtiges Fragen mit Präposition (Worauf wartest du?)",
        "Ergänzung mit Nomen oder Pronomen im richtigen Kasus",
        "Bedeutungsunterschiede durch verschiedene Präpositionen (denken an/über)",
      ],
    },
    {
      id: "indirekte_fragen",
      name: "Indirekte Fragen",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Einleitung mit „ich möchte wissen, ob … / wann … / warum …“",
        "Stellung des Verbs am Satzende in indirekten Fragen",
        "Unterschied zwischen direkter und indirekter Frage",
        "Höfliche Formulierungen im Alltag (Können Sie mir sagen, ob …?)",
      ],
    },
    {
      id: "konjunktiv2_hoeflichkeit",
      name: "Konjunktiv II für Wünsche und Höflichkeit",
      grammar_ui_topics: ["verben"],
      points: [
        "Formen von „hätte, wäre, würde“ auf B1-Niveau",
        "Wünsche mit „ich hätte gern … / ich wäre gern …“",
        "Höfliche Bitten mit „könnte, würde, dürfte“",
        "Unterschied zwischen realer und hypothetischer Aussage",
      ],
    },
  ],

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

  c1: [
    {
      id: "satzbau_komplex_c1",
      name: "Komplexer Satzbau in anspruchsvollen Texten",
      grammar_ui_topics: ["satzbau"],
      points: [
        "Mehrfache Unterordnungen und Einschübe in langen Sätzen",
        "Verschiebung von Informationen im Vorfeld und Mittelfeld",
        "Stellung von Modal-, Temporal- und Kausalangaben in komplexen Strukturen",
        "Reduktion von Nebensätzen durch Infinitiv- und Partizipialkonstruktionen",
      ],
    },
    {
      id: "nominalstil_und_verdichtung",
      name: "Nominalstil und Informationsverdichtung",
      grammar_ui_topics: ["nomen", "artikel"],
      points: [
        "Umwandlung von Verbstrukturen in Nominalphrasen",
        "Typische Muster in Berichten und wissenschaftlichen Texten",
        "Genitivattribute und lange Attributketten",
        "Auswirkungen des Nominalstils auf Verständlichkeit und Stil",
      ],
    },
    {
      id: "partizipialkonstruktionen",
      name: "Partizipialkonstruktionen",
      grammar_ui_topics: ["adjektive", "satzbau"],
      points: [
        "Bildung und Gebrauch von Partizip I (die lachenden Kinder)",
        "Bildung und Gebrauch von Partizip II (die geschriebene Arbeit)",
        "Verkürzung von Nebensätzen durch Partizipialkonstruktionen",
        "Typische Fehlerquellen bei Partizipkonstruktionen",
      ],
    },
    {
      id: "konjunktiv1_berichtssprache",
      name: "Konjunktiv I in der Berichtssprache",
      grammar_ui_topics: ["verben", "satzbau"],
      points: [
        "Formen des Konjunktiv I in allen Personen",
        "Verwendung in Nachrichten, Berichten und wissenschaftlichen Texten",
        "Wechsel zum Konjunktiv II bei Formgleichheit mit dem Indikativ",
        "Stilistische Wirkung von Konjunktiv I vs. indirekte Rede mit „würde“",
      ],
    },
    {
      id: "passiv_komplex_c1",
      name: "Passivformen in komplexen Strukturen",
      grammar_ui_topics: ["verben"],
      points: [
        "Vorgangs- und Zustandspassiv in verschiedenen Zeiten",
        "Passiversatzformen (man-Konstruktionen, unpersönliche Formulierungen)",
        "Passiv in fachsprachlichen und wissenschaftlichen Texten",
        "Sein + zu + Infinitiv (ist zu beachten, ist zu unterscheiden …)",
      ],
    },
    {
      id: "adjektivdeklination_komplex",
      name: "Adjektivdeklination in komplexen Nominalgruppen",
      grammar_ui_topics: ["adjektive", "artikel"],
      points: [
        "Mehrere Adjektive vor einem Nomen (eine fachlich fundierte, ausführliche Analyse)",
        "Adjektive mit Ergänzungen (für etwas Verantwortliche, an etwas Interessierte)",
        "Adjektive in festen fachsprachlichen Wendungen",
        "Kombination mit Genitiv- und Präpositionalattributen",
      ],
    },
    {
      id: "genitiv_c1",
      name: "Genitivgebrauch in gehobener Sprache",
      grammar_ui_topics: ["nomen", "artikel"],
      points: [
        "Komplexe Genitivattribute mit mehreren Bezugswörtern",
        "Genitiv zur stilistischen Aufwertung (statt von-Formulierungen)",
        "Genitiv in fachsprachlichen festen Wendungen",
        "Spannungsfeld zwischen gesprochener und geschriebener Sprache",
      ],
    },
    {
      id: "praepositionale_ausdruecke_c1",
      name: "Komplexe präpositionale Ausdrücke",
      grammar_ui_topics: ["praepositionen"],
      points: [
        "Mehrteilige Präpositionen (im Hinblick auf, in Bezug auf, im Rahmen von …)",
        "Feste Präpositionen in fachsprachlichen Ausdrücken",
        "Stilistische Unterschiede zwischen einfachen und komplexen Präpositionen",
        "Typische Kollokationen mit Nomen und Präposition",
      ],
    },
    {
      id: "verben_praeposition_c1",
      name: "Verben mit Präposition (C1)",
      grammar_ui_topics: ["verben", "praepositionen"],
      points: [
        "Weniger häufige, aber prüfungsrelevante Verb–Präposition-Verbindungen",
        "Präzise Bedeutungsunterschiede durch unterschiedliche Präpositionen",
        "Typische Verb–Präposition-Kombinationen in akademischen und beruflichen Kontexten",
        "Strategien zum systematischen Lernen von Verb–Präposition-Verbindungen",
      ],
    },
    {
      id: "feste_verbindungen_c1",
      name: "Feste Verbindungen und Funktionsverbgefüge",
      grammar_ui_topics: ["verben", "nomen", "adjektive"],
      points: [
        "Häufige Funktionsverbgefüge (in Betracht ziehen, zur Verfügung stehen, eine Entscheidung treffen …)",
        "Stilistische Wirkung von Funktionsverbgefügen in formellen Texten",
        "Unterschied zwischen einfacher und formeller Ausdrucksweise (sagen vs. zur Sprache bringen)",
        "Typische Fehler und Strategien zum Erlernen fester Verbindungen",
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
export function getGrammarSectionById(
  level: string,
  sectionId: string
): GrammarSection | undefined {
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
