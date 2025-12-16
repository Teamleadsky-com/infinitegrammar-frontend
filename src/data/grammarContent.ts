// Grammar content data for all topics
import { grammarTopics, type GrammarTopic } from './grammarTopics';

export interface GrammarContent {
  topicId: string;
  shortExplanation: string;
  whenToUse: string;
  rules: string;
  commonMistakes?: string;
  checklist: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  exerciseSection: string; // Maps to exercise category
}

// Content for all grammar topics
export const grammarContentData: Record<string, GrammarContent> = {
  // B1 - Wechselpräpositionen
  'b1-wechselpraepositionen': {
    topicId: 'b1-wechselpraepositionen',
    shortExplanation:
      'Wechselpräpositionen stehen mit <strong>Dativ</strong>, wenn es um einen Ort (wo?) geht – und mit <strong>Akkusativ</strong>, wenn es um eine Richtung/Bewegung (wohin?) geht.',
    whenToUse: `
      <p class="mb-3">Du brauchst Wechselpräpositionen, wenn du sagen willst,</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>wo</strong> etwas ist (Ort) oder</li>
        <li><strong>wohin</strong> sich etwas bewegt (Richtung).</li>
      </ul>
      <div class="mt-4 p-4 bg-muted/50 rounded-lg">
        <p class="text-sm font-semibold mb-2">Typische Präpositionen:</p>
        <p class="text-sm">an, auf, hinter, in, neben, über, unter, vor, zwischen</p>
      </div>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz:</p>
        <p class="text-lg mt-2"><strong class="text-primary">wo?</strong> → Dativ</p>
        <p class="text-lg"><strong class="text-primary">wohin?</strong> → Akkusativ</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3 flex items-center gap-2">
            Dativ (Ort, keine Bewegung):
          </h4>
          <ul class="space-y-2 ml-4">
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Ich sitze <strong>auf dem Stuhl</strong>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Das Bild hängt <strong>an der Wand</strong>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Das Handy liegt <strong>in der Tasche</strong>.</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3 flex items-center gap-2">
            Akkusativ (Richtung, Bewegung/Veränderung):
          </h4>
          <ul class="space-y-2 ml-4">
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Ich setze mich <strong>auf den Stuhl</strong>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Ich hänge das Bild <strong>an die Wand</strong>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">•</span>
              <span>Ich lege das Handy <strong>in die Tasche</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: „Bewegung" mit „wohin" verwechseln</h4>
          <p class="text-sm mb-3">
            Nicht jede Bewegung ist automatisch „wohin". Entscheidend ist: ändert sich der Ort/Zustand?
          </p>
          <div class="space-y-2 text-sm">
            <p>✓ Ich laufe <strong>im Park</strong>. (Ort bleibt Park → <strong>Dativ</strong>)</p>
            <p>✓ Ich laufe <strong>in den Park</strong>. (Richtung ins Innere → <strong>Akkusativ</strong>)</p>
          </div>
        </div>

        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: falsches Fragewort</h4>
          <p class="text-sm">Wenn du unsicher bist: stelle die Frage.</p>
          <ul class="mt-2 space-y-1 text-sm ml-4">
            <li><strong>Wo?</strong> → Dativ</li>
            <li><strong>Wohin?</strong> → Akkusativ</li>
          </ul>
        </div>
      </div>
    `,
    checklist: [
      'Kann ich <strong>„wo?"</strong> fragen? → Dativ',
      'Kann ich <strong>„wohin?"</strong> fragen? → Akkusativ',
      'Geht es um <strong>„hinein/hinauf/hinter…"</strong>? → oft Akkusativ',
    ],
    faq: [
      {
        question: 'Welche Präpositionen sind Wechselpräpositionen?',
        answer: '<p>an, auf, hinter, in, neben, über, unter, vor, zwischen.</p>',
      },
      {
        question: 'Warum ist „im Park" Dativ, obwohl ich laufe?',
        answer:
          '<p>Weil der Ort „Park" gleich bleibt (<strong>wo?</strong>), nicht die Richtung (<strong>wohin?</strong>). Die Bewegung findet <em>innerhalb</em> des Parks statt, ohne dass du hineingehst.</p>',
      },
      {
        question: 'Gilt das auch bei „stellen/legen/setzen"?',
        answer:
          '<p>Ja – das sind klassische <strong>Akkusativ-Verben</strong> in Kombination mit Richtung (<strong>wohin?</strong>). Du stellst etwas <em>irgendwohin</em>, legst etwas <em>irgendwohin</em>, setzt dich <em>irgendwohin</em>.</p>',
      },
      {
        question: 'Was ist mit „über" und „unter"?',
        answer:
          '<p>Sie funktionieren gleich: <strong>über/unter dem Tisch</strong> (wo? = Dativ), aber <strong>über/unter den Tisch</strong> (wohin? = Akkusativ).</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // A1 - Wortstellung
  'a1-wortstellung': {
    topicId: 'a1-wortstellung',
    shortExplanation:
      'Im deutschen Hauptsatz steht das <strong>Verb immer an zweiter Position</strong>. Das Subjekt kann vor oder nach dem Verb stehen.',
    whenToUse: `
      <p class="mb-3">Die Wortstellung ist grundlegend für jeden deutschen Satz. Sie bestimmt:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>die Position des Verbs (immer Position 2)</li>
        <li>die Position des Subjekts (flexibel)</li>
        <li>die Reihenfolge von Zeit-, Orts- und Artangaben</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundregel:</p>
        <p class="text-lg mt-2">Position 1 + <strong class="text-primary">Verb (Position 2)</strong> + Mittelfeld + Satzende</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Normale Wortstellung (Subjekt zuerst):</h4>
          <ul class="space-y-2 ml-4">
            <li><span class="text-primary">•</span> <strong>Ich</strong> gehe heute ins Kino.</li>
            <li><span class="text-primary">•</span> <strong>Maria</strong> lernt jeden Tag Deutsch.</li>
            <li><span class="text-primary">•</span> <strong>Der Lehrer</strong> erklärt die Grammatik.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Inversion (etwas anderes an Position 1):</h4>
          <ul class="space-y-2 ml-4">
            <li><span class="text-primary">•</span> <strong>Heute</strong> gehe ich ins Kino.</li>
            <li><span class="text-primary">•</span> <strong>Jeden Tag</strong> lernt Maria Deutsch.</li>
            <li><span class="text-primary">•</span> <strong>Die Grammatik</strong> erklärt der Lehrer.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: Verb an falscher Position</h4>
          <p class="text-sm mb-3">Das Verb MUSS an Position 2 stehen.</p>
          <div class="space-y-2 text-sm">
            <p>✗ Ich heute gehe ins Kino.</p>
            <p>✓ Ich gehe heute ins Kino.</p>
          </div>
        </div>

        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: Subjekt vergessen nach Inversion</h4>
          <p class="text-sm mb-3">Nach dem Verb an Position 2 muss das Subjekt folgen (wenn es nicht schon an Position 1 steht).</p>
          <div class="space-y-2 text-sm">
            <p>✗ Heute gehe ins Kino.</p>
            <p>✓ Heute gehe ich ins Kino.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Steht das Verb an <strong>Position 2</strong>?',
      'Folgt das Subjekt direkt nach dem Verb (bei Inversion)?',
      'Steht die Zeitangabe vor der Ortsangabe? (Wann → Wo)',
    ],
    faq: [
      {
        question: 'Was bedeutet "Position 2"?',
        answer:
          '<p>Position 2 bedeutet: Das Verb ist das zweite <em>Element</em> im Satz, nicht unbedingt das zweite Wort. "Der Lehrer" = 1 Element, "erklärt" = Position 2.</p>',
      },
      {
        question: 'Kann ich jeden Satz mit Zeitangabe beginnen?',
        answer:
          '<p>Ja! Zeitangaben (heute, gestern, morgen, jeden Tag) können an Position 1 stehen. Dann kommt das Verb, dann das Subjekt.</p>',
      },
      {
        question: 'Was ist mit Fragen?',
        answer:
          '<p>In Ja/Nein-Fragen steht das Verb an Position 1: "<strong>Gehst</strong> du ins Kino?" In W-Fragen steht das Fragewort an Position 1, das Verb an Position 2: "<strong>Wann gehst</strong> du ins Kino?"</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // A1 - Präsens
  'a1-praesens': {
    topicId: 'a1-praesens',
    shortExplanation:
      'Das Präsens ist die Gegenwartsform. Es beschreibt, was <strong>jetzt</strong> passiert oder was <strong>allgemein gilt</strong>.',
    whenToUse: `
      <p class="mb-3">Das Präsens verwendest du für:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>aktuelle Handlungen: <em>Ich lerne Deutsch.</em></li>
        <li>allgemeine Wahrheiten: <em>Die Sonne scheint.</em></li>
        <li>Gewohnheiten: <em>Ich gehe jeden Tag joggen.</em></li>
        <li>Zukunft (mit Zeitangabe): <em>Morgen fahre ich nach Berlin.</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Bildung:</p>
        <p class="text-lg mt-2">Verbstamm + Endung</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Regelmäßige Verben (z.B. "lernen"):</h4>
          <ul class="space-y-2 ml-4">
            <li>ich lern<strong>e</strong></li>
            <li>du lern<strong>st</strong></li>
            <li>er/sie/es lern<strong>t</strong></li>
            <li>wir lern<strong>en</strong></li>
            <li>ihr lern<strong>t</strong></li>
            <li>sie/Sie lern<strong>en</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Unregelmäßige Verben (z.B. "sein"):</h4>
          <ul class="space-y-2 ml-4">
            <li>ich <strong>bin</strong></li>
            <li>du <strong>bist</strong></li>
            <li>er/sie/es <strong>ist</strong></li>
            <li>wir <strong>sind</strong></li>
            <li>ihr <strong>seid</strong></li>
            <li>sie/Sie <strong>sind</strong></li>
          </ul>
        </div>
      </div>
    `,
    checklist: [
      'Hast du die richtige <strong>Endung</strong> für die Person verwendet?',
      'Bei „du" und „ihr": Endung <strong>-st</strong> und <strong>-t</strong>',
      'Bei „er/sie/es": Endung <strong>-t</strong>',
    ],
    faq: [
      {
        question: 'Was sind die wichtigsten unregelmäßigen Verben?',
        answer: '<p>sein, haben, werden, können, müssen, wollen, sollen, dürfen, mögen, gehen, fahren, sehen</p>',
      },
      {
        question: 'Kann ich Präsens für die Zukunft verwenden?',
        answer:
          '<p>Ja! Mit einer Zeitangabe (morgen, nächste Woche) kannst du Präsens für Zukunft verwenden: "Morgen gehe ich ins Kino."</p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // B1 - Konjunktiv II
  'b1-konjunktiv-2': {
    topicId: 'b1-konjunktiv-2',
    shortExplanation:
      'Der Konjunktiv II drückt <strong>Wünsche</strong>, <strong>höfliche Bitten</strong> und <strong>irreale Bedingungen</strong> aus.',
    whenToUse: `
      <p class="mb-3">Du verwendest Konjunktiv II für:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Höfliche Bitten:</strong> Könnten Sie mir helfen?</li>
        <li><strong>Wünsche:</strong> Ich wäre gern reich.</li>
        <li><strong>Irreale Bedingungen:</strong> Wenn ich Zeit hätte, würde ich kommen.</li>
        <li><strong>Vorschläge:</strong> Wir könnten ins Kino gehen.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Bildung:</p>
        <p class="text-lg mt-2">Präteritum + Umlaut (bei starken Verben) oder würde + Infinitiv</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Häufige Formen (stark):</h4>
          <ul class="space-y-2 ml-4">
            <li>ich <strong>wäre</strong> (sein), du <strong>wärst</strong>, er <strong>wäre</strong></li>
            <li>ich <strong>hätte</strong> (haben), du <strong>hättest</strong>, er <strong>hätte</strong></li>
            <li>ich <strong>könnte</strong> (können), du <strong>könntest</strong>, er <strong>könnte</strong></li>
            <li>ich <strong>müsste</strong> (müssen), du <strong>müsstest</strong>, er <strong>müsste</strong></li>
            <li>ich <strong>würde</strong> (werden), du <strong>würdest</strong>, er <strong>würde</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">würde + Infinitiv (bei schwachen Verben):</h4>
          <ul class="space-y-2 ml-4">
            <li>ich <strong>würde lernen</strong>, du <strong>würdest lernen</strong></li>
            <li>ich <strong>würde kaufen</strong>, du <strong>würdest kaufen</strong></li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: "würde" bei Modalverben</h4>
          <p class="text-sm mb-3">Bei Modalverben und "sein/haben" nicht "würde" verwenden!</p>
          <div class="space-y-2 text-sm">
            <p>✗ Ich würde können...</p>
            <p>✓ Ich könnte...</p>
            <p>✗ Ich würde wären...</p>
            <p>✓ Ich wäre...</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Bei <strong>sein, haben, Modalverben</strong>: direkte Konjunktiv-II-Form',
      'Bei <strong>anderen Verben</strong>: würde + Infinitiv',
      'Bei <strong>höflichen Bitten</strong>: könnte/würde',
    ],
    faq: [
      {
        question: 'Wann benutze ich "wäre" vs. "würde sein"?',
        answer: '<p>Immer "wäre". "Würde sein" ist umgangssprachlich und klingt nicht gut.</p>',
      },
      {
        question: 'Was ist der Unterschied zu Konjunktiv I?',
        answer:
          '<p>Konjunktiv I wird für indirekte Rede verwendet ("Er sagt, er <strong>sei</strong> krank"). Konjunktiv II für Wünsche und irreale Bedingungen.</p>',
      },
    ],
    exerciseSection: 'Konjunktiv',
  },
    // A1 - Imperativ
  'a1-imperativ': {
    topicId: 'a1-imperativ',
    shortExplanation:
      'Der <strong>Imperativ</strong> wird für <strong>Aufforderungen</strong>, <strong>Bitten</strong> und <strong>Anweisungen</strong> benutzt. Das Verb steht dabei meist <strong>an Position 1</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt den Imperativ, wenn du …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>jemanden direkt ansprichst: <em>Komm bitte!</em></li>
        <li>eine Bitte formulierst: <em>Hilf mir bitte.</em></li>
        <li>eine Anweisung gibst: <em>Öffnen Sie das Fenster.</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundmuster:</p>
        <p class="text-lg mt-2"><strong class="text-primary">Verb</strong> + (Objekte/Angaben) + !</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Imperativ für <strong>du</strong>:</h4>
          <p class="text-sm mb-2">Stammform (meist ohne <em>-st</em>). Oft ohne Pronomen.</p>
          <ul class="space-y-2 ml-4">
            <li>gehen → <strong>Geh!</strong></li>
            <li>kommen → <strong>Komm!</strong></li>
            <li>lesen → <strong>Lies!</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Imperativ für <strong>ihr</strong>:</h4>
          <p class="text-sm mb-2">Wie Präsens „ihr“ (Endung <em>-t</em>), Pronomen meist weglassen.</p>
          <ul class="space-y-2 ml-4">
            <li>gehen → <strong>Geht!</strong></li>
            <li>kommen → <strong>Kommt!</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Höflich (Sie):</h4>
          <p class="text-sm mb-2"><strong>Sie</strong> + Infinitiv.</p>
          <ul class="space-y-2 ml-4">
            <li><strong>Kommen Sie</strong> bitte herein.</li>
            <li><strong>Bitte warten Sie</strong> kurz.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: Pronomen „du“ mitsagen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ <strong>Du</strong> geh nach Hause!</p>
            <p>✓ <strong>Geh</strong> nach Hause!</p>
          </div>
        </div>
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: Verb nicht an Position 1</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Bitte du kommst.</p>
            <p>✓ <strong>Komm</strong> bitte.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Steht das <strong>Verb an Position 1</strong>?',
      'Hast du die richtige Form (du/ihr/Sie) gewählt?',
      'Bei <strong>Sie</strong>: „Sie“ groß + Infinitiv',
    ],
    faq: [
      {
        question: 'Wann benutze ich „bitte“ im Imperativ?',
        answer:
          '<p>„Bitte“ macht Aufforderungen höflicher: <strong>Komm bitte</strong> kurz. / <strong>Bitte kommen Sie</strong> kurz.</p>',
      },
      {
        question: 'Gibt es unregelmäßige Imperativformen?',
        answer:
          '<p>Ja, z. B. bei starken Verben: „lesen“ → <strong>Lies!</strong>, „nehmen“ → <strong>Nimm!</strong>, „geben“ → <strong>Gib!</strong>.</p>',
      },
      {
        question: 'Wie ist der Imperativ von „sein“?',
        answer: '<p>du: <strong>Sei!</strong> · ihr: <strong>Seid!</strong> · Sie: <strong>Seien Sie!</strong></p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // A1 - Artikel Nominativ
  'a1-artikel-nominativ': {
    topicId: 'a1-artikel-nominativ',
    shortExplanation:
      'Im <strong>Nominativ</strong> steht meist das <strong>Subjekt</strong>. Dazu passen die Artikel <strong>der / die / das</strong> und <strong>ein / eine / ein</strong>.',
    whenToUse: `
      <p class="mb-3">Der Nominativ steht typischerweise …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>beim <strong>Subjekt</strong>: <em>Der Mann</em> kommt.</li>
        <li>nach <strong>sein/werden/bleiben</strong>: Er ist <em>ein Lehrer</em>.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Artikel im Nominativ:</p>
        <p class="text-lg mt-2"><strong class="text-primary">der</strong> (mask.) · <strong class="text-primary">die</strong> (fem.) · <strong class="text-primary">das</strong> (neutr.) · <strong class="text-primary">die</strong> (Plural)</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Bestimmter Artikel:</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>der</strong> Tisch · <strong>die</strong> Lampe · <strong>das</strong> Buch · <strong>die</strong> Bücher</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-lg mb-3">Unbestimmter Artikel:</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>ein</strong> Tisch · <strong>eine</strong> Lampe · <strong>ein</strong> Buch</li>
            <li class="text-sm text-muted-foreground">Im Plural gibt es kein „ein“ → „(keine)“ oder „—“</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-lg mb-3">Negation mit „kein“:</h4>
          <ul class="space-y-2 ml-4">
            <li>Das ist <strong>kein</strong> Tisch. / Das ist <strong>keine</strong> Lampe.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Akkusativ-Formen im Nominativ verwenden</h4>
          <div class="space-y-2 text-sm">
            <p>✗ <strong>Den</strong> Mann kommt.</p>
            <p>✓ <strong>Der</strong> Mann kommt.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Ist das Wort das <strong>Subjekt</strong> (wer/was)? → Nominativ',
      'Passt der Artikel zu <strong>Genus</strong> (der/die/das)?',
      'Nach <strong>sein/werden/bleiben</strong> bleibt es Nominativ',
    ],
    faq: [
      {
        question: 'Woher weiß ich, ob ein Nomen „der/die/das“ ist?',
        answer:
          '<p>Es gibt Tendenzen (z. B. -ung meist feminin), aber du lernst es am besten <strong>immer mit Artikel</strong>: <em>die Frage</em>, <em>der Tisch</em>, <em>das Buch</em>.</p>',
      },
      {
        question: 'Warum steht nach „sein“ auch Nominativ?',
        answer:
          '<p>„sein“ verbindet zwei Nomen/Pronomen gleichwertig: <em>Er ist <strong>ein Lehrer</strong></em> (kein Objekt, sondern Gleichsetzung).</p>',
      },
    ],
    exerciseSection: 'Nomen',
  },

  // A1 - Personalpronomen Nominativ
  'a1-personalpronomen-nominativ': {
    topicId: 'a1-personalpronomen-nominativ',
    shortExplanation:
      'Personalpronomen im <strong>Nominativ</strong> stehen als <strong>Subjekt</strong>: <strong>ich, du, er/sie/es, wir, ihr, sie/Sie</strong>.',
    whenToUse: `
      <p class="mb-3">Du verwendest Personalpronomen, wenn du Personen/Sachen nicht ständig wiederholen willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Maria ist hier. <strong>Sie</strong> lernt Deutsch.</li>
        <li>Der Kurs ist gut. <strong>Er</strong> macht Spaß.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Formen im Nominativ:</p>
        <p class="text-lg mt-2">
          <strong class="text-primary">ich</strong> · <strong class="text-primary">du</strong> · <strong class="text-primary">er/sie/es</strong> ·
          <strong class="text-primary">wir</strong> · <strong class="text-primary">ihr</strong> · <strong class="text-primary">sie</strong> · <strong class="text-primary">Sie</strong>
        </p>
      </div>

      <div class="space-y-4 text-sm">
        <p><strong>Singular:</strong> ich, du, er/sie/es</p>
        <p><strong>Plural:</strong> wir, ihr, sie</p>
        <p><strong>Höflich:</strong> <strong>Sie</strong> (immer großgeschrieben)</p>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: „sie“ vs. „Sie“ verwechseln</h4>
          <p class="text-sm mb-2">„Sie“ (Höflichkeitsform) wird immer großgeschrieben.</p>
          <div class="space-y-2 text-sm">
            <p>✓ <strong>Sie</strong> sind Frau Müller. (höflich)</p>
            <p>✓ <strong>sie</strong> sind meine Freunde. (Plural)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Ist das Pronomen das <strong>Subjekt</strong>? → Nominativ',
      'Bei Höflichkeit: <strong>Sie</strong> großschreiben',
      'Passende Person/Anzahl (ich/du/wir/ihr/…)',
    ],
    faq: [
      {
        question: 'Wann benutze ich „man“?',
        answer:
          '<p>„man“ ist unpersönlich: <em>In Deutschland trinkt man viel Kaffee.</em> Es entspricht oft „one/people“.</p>',
      },
      {
        question: 'Ist „es“ immer für Dinge?',
        answer:
          '<p>Meist für Neutrum-Nomen (<em>das Buch → es</em>) und für Wetter/Allgemeines: <em>Es regnet.</em></p>',
      },
    ],
    exerciseSection: 'Pronomen',
  },

  // A1 - Pluralbildung
  'a1-pluralbildung': {
    topicId: 'a1-pluralbildung',
    shortExplanation:
      'Die Pluralbildung ist im Deutschen nicht einheitlich. Häufige Muster sind <strong>-e</strong>, <strong>-er</strong>, <strong>-(e)n</strong>, <strong>-s</strong> oder <strong>kein Suffix</strong> – manchmal mit Umlaut.',
    whenToUse: `
      <p class="mb-3">Du brauchst den Plural, wenn du über <strong>mehr als eins</strong> sprichst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>ein Buch → zwei Bücher</li>
        <li>die Frau → die Frauen</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Wichtig:</p>
        <p class="text-sm mt-2">Es gibt keine einzige Regel. Lerne neue Nomen am besten mit Plural: <em>das Buch – die Bücher</em>.</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Häufige Muster (Beispiele):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>-(e)n</strong>: die Frau → die Frau<strong>en</strong>, die Sprache → die Sprache<strong>n</strong></li>
            <li><strong>-e</strong>: der Tag → die Tag<strong>e</strong>, der Hund → die Hund<strong>e</strong></li>
            <li><strong>-er</strong> (+ Umlaut): das Buch → die Büch<strong>er</strong>, das Kind → die Kind<strong>er</strong></li>
            <li><strong>-s</strong>: das Auto → die Auto<strong>s</strong>, das Café → die Café<strong>s</strong></li>
            <li><strong>kein Suffix</strong> (+ Umlaut): der Vater → die Väter, der Lehrer → die Lehrer</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Artikel im Plural:</p>
          <p class="text-sm"><strong>die</strong> + Pluralform (immer gleich): die Bücher, die Frauen, die Autos</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „-s“ überall anhängen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ die Frau<strong>s</strong></p>
            <p>✓ die Frau<strong>en</strong></p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Plural immer mitlernen: <strong>das Wort – die …</strong>',
      'Im Plural steht meistens <strong>die</strong> als Artikel',
      'Achte auf mögliche <strong>Umlaute</strong> (a→ä, o→ö, u→ü)',
    ],
    faq: [
      {
        question: 'Gibt es sichere Regeln für den Plural?',
        answer:
          '<p>Es gibt Tendenzen (z. B. -e → oft -(e)n), aber viele Ausnahmen. Am zuverlässigsten ist: <strong>Plural mitlernen</strong>.</p>',
      },
      {
        question: 'Warum haben manche Nomen keinen Plural?',
        answer:
          '<p>Einige Nomen werden meist nur im Singular benutzt (z. B. „Wasser“, „Milch“) – je nach Kontext gibt es aber fachliche/abzählbare Pluralformen.</p>',
      },
    ],
    exerciseSection: 'Nomen',
  },

  // A1 - Präpositionen Ort
  'a1-praepositionen-ort': {
    topicId: 'a1-praepositionen-ort',
    shortExplanation:
      'Für Orte (Antwort auf <strong>wo?</strong>) nutzt du häufig <strong>in, an, auf, bei, zu, nach</strong>. Viele Ortspräpositionen stehen im A1-Kontext typischerweise mit <strong>Dativ</strong>.',
    whenToUse: `
      <p class="mb-3">Du brauchst Ortspräpositionen, wenn du sagst, <strong>wo</strong> etwas ist:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Ich bin <strong>in</strong> der Schule.</li>
        <li>Sie ist <strong>bei</strong> ihrer Freundin.</li>
        <li>Wir sind <strong>zu</strong> Hause.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Frage:</p>
        <p class="text-lg mt-2"><strong class="text-primary">Wo?</strong> → Ort (oft Dativ)</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Typische Präpositionen (Ort):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>in</strong>: Ich bin <strong>in der</strong> Schule.</li>
            <li><strong>an</strong>: Das Bild hängt <strong>an der</strong> Wand.</li>
            <li><strong>auf</strong>: Das Buch liegt <strong>auf dem</strong> Tisch.</li>
            <li><strong>bei</strong>: Ich bin <strong>bei</strong> meiner Mutter.</li>
            <li><strong>zu</strong>: Ich gehe <strong>zu</strong> meiner Freundin. (Ziel/Person)</li>
            <li><strong>nach</strong>: Ich fahre <strong>nach</strong> Berlin. (Stadt/Land ohne Artikel)</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Merktipp:</p>
          <p class="text-sm">„<strong>nach</strong>“ für Städte/Länder ohne Artikel, „<strong>in</strong>“ für Länder mit Artikel: <em>in die Schweiz</em>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „nach“ mit Artikel</h4>
          <div class="space-y-2 text-sm">
            <p>✗ nach <strong>der</strong> Schweiz</p>
            <p>✓ <strong>in die</strong> Schweiz</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Fragst du <strong>wo?</strong> (Ort) oder wohin? (Richtung)?',
      'Stadt/Land ohne Artikel → oft <strong>nach</strong>',
      'Länder mit Artikel → meist <strong>in</strong> + Artikel',
    ],
    faq: [
      {
        question: 'Was ist der Unterschied zwischen „bei“ und „zu“?',
        answer:
          '<p>„bei“ = Aufenthalt/Ort (ich bin bei Maria). „zu“ = Ziel/Bewegung/Adressat (ich gehe zu Maria).</p>',
      },
      {
        question: 'Ist „zu Hause“ eine Präposition?',
        answer:
          '<p>„zu Hause“ ist eine feste Wendung für den Ort „daheim“.</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // A1 - Zeitpräpositionen
  'a1-zeitpraepositionen': {
    topicId: 'a1-zeitpraepositionen',
    shortExplanation:
      'Einfache Zeitpräpositionen sind z. B. <strong>am</strong> (Tage), <strong>um</strong> (Uhrzeit), <strong>im</strong> (Monate/Jahreszeiten) sowie <strong>von … bis</strong>.',
    whenToUse: `
      <p class="mb-3">Du verwendest Zeitpräpositionen, um zu sagen, <strong>wann</strong> etwas passiert:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>am</strong> Montag</li>
        <li><strong>um</strong> 8 Uhr</li>
        <li><strong>im</strong> Winter / im Januar</li>
        <li><strong>von</strong> 9 <strong>bis</strong> 12 Uhr</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Die wichtigsten Formen:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li><strong class="text-primary">am</strong> + Tag/Datum</li>
          <li><strong class="text-primary">um</strong> + Uhrzeit</li>
          <li><strong class="text-primary">im</strong> + Monat/Jahreszeit</li>
          <li><strong class="text-primary">von … bis</strong> + Zeitraum</li>
        </ul>
      </div>

      <div class="space-y-4 text-sm">
        <p>✓ <strong>am</strong> Dienstag / <strong>am</strong> 5. Mai</p>
        <p>✓ <strong>um</strong> 14:30</p>
        <p>✓ <strong>im</strong> Sommer / <strong>im</strong> Oktober</p>
        <p>✓ <strong>von</strong> Montag <strong>bis</strong> Freitag</p>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „im Montag“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ im Montag</p>
            <p>✓ <strong>am</strong> Montag</p>
          </div>
        </div>
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „am 8 Uhr“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ am 8 Uhr</p>
            <p>✓ <strong>um</strong> 8 Uhr</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Tag/Datum → <strong>am</strong>',
      'Uhrzeit → <strong>um</strong>',
      'Monat/Jahreszeit → <strong>im</strong>',
    ],
    faq: [
      {
        question: 'Sagt man „am Wochenende“ oder „im Wochenende“?',
        answer: '<p>Richtig ist: <strong>am</strong> Wochenende.</p>',
      },
      {
        question: 'Wie sage ich „in the morning“?',
        answer: '<p>Meist: <strong>am Morgen</strong> (oder: <strong>morgens</strong>).</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // A1 - Adjektive Grundform
  'a1-adjektive-grundform': {
    topicId: 'a1-adjektive-grundform',
    shortExplanation:
      'Adjektive beschreiben Personen/Sachen. In der <strong>Grundform</strong> (besonders nach <strong>sein/werden/bleiben</strong>) haben sie <strong>keine Endung</strong>: „Der Kaffee ist heiß.“',
    whenToUse: `
      <p class="mb-3">Die Grundform nutzt du besonders …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>nach <strong>sein</strong>: Das Wetter ist <em>schön</em>.</li>
        <li>nach <strong>werden</strong>: Es wird <em>kalt</em>.</li>
        <li>nach <strong>bleiben</strong>: Der Film bleibt <em>spannend</em>.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Regel:</p>
        <p class="text-lg mt-2">Nach <strong class="text-primary">sein/werden/bleiben</strong> → Adjektiv <strong>ohne Endung</strong></p>
      </div>

      <div class="space-y-4 text-sm">
        <p>✓ Der Kaffee ist <strong>heiß</strong>.</p>
        <p>✓ Das Essen wird <strong>teuer</strong>.</p>
        <p>✓ Die Aufgabe bleibt <strong>einfach</strong>.</p>
      </div>

      <div class="mt-6 p-4 bg-muted/50 rounded-lg">
        <p class="text-sm font-semibold mb-2">Achtung (Vorschau auf A2/B1):</p>
        <p class="text-sm">Vor dem Nomen bekommen Adjektive Endungen: <em>ein heiß<strong>er</strong> Kaffee</em> (das kommt ausführlich in der Adjektivdeklination).</p>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Endung nach „sein“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Der Kaffee ist heiß<strong>er</strong>.</p>
            <p>✓ Der Kaffee ist <strong>heiß</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Steht das Adjektiv <strong>nach sein/werden/bleiben</strong>? → keine Endung',
      'Beschreibt es eine Eigenschaft (wie ist etwas?)',
      'Nicht mit Adjektiven <strong>vor</strong> dem Nomen verwechseln (dann Endungen)',
    ],
    faq: [
      {
        question: 'Kann ich mehrere Adjektive verwenden?',
        answer: '<p>Ja: „Der Film ist <strong>spannend</strong> und <strong>lustig</strong>.“</p>',
      },
      {
        question: 'Wann braucht ein Adjektiv Endungen?',
        answer:
          '<p>Wenn es <strong>vor einem Nomen</strong> steht: „ein <strong>schönes</strong> Bild“. Das lernst du in der Adjektivdeklination (A2/B1).</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // A2 - Komplexe Sätze
  'a2-komplexe-saetze': {
    topicId: 'a2-komplexe-saetze',
    shortExplanation:
      'In komplexen Sätzen verbindest du zwei Aussagen. Bei <strong>Nebensätzen</strong> steht das Verb meist <strong>am Ende</strong>: „…, weil ich keine Zeit <strong>habe</strong>.“',
    whenToUse: `
      <p class="mb-3">Komplexe Sätze brauchst du, um …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Gründe zu nennen: <strong>weil</strong></li>
        <li>Wünsche/Ziele auszudrücken: <strong>damit</strong></li>
        <li>Informationen zu ergänzen: <strong>dass</strong></li>
        <li>Bedingungen zu nennen: <strong>wenn</strong></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Wichtig:</p>
        <p class="text-sm mt-2">Im <strong>Nebensatz</strong> steht das konjugierte Verb oft <strong>am Satzende</strong>. Nebensätze werden mit <strong>Komma</strong> abgetrennt.</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Hauptsatz + Nebensatz:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich bleibe zu Hause, <strong>weil</strong> ich keine Zeit <strong>habe</strong>.</li>
            <li>Er sagt, <strong>dass</strong> er morgen <strong>kommt</strong>.</li>
            <li>Wenn ich Zeit <strong>habe</strong>, besuche ich dich.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Nebenordnende Konjunktionen (kein Verb-Ende!):</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich komme, <strong>aber</strong> ich bin müde.</li>
            <li>Wir lernen, <strong>und</strong> wir üben.</li>
            <li>Ich gehe nicht, <strong>denn</strong> ich bin krank.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: Verb nicht am Ende im Nebensatz</h4>
          <div class="space-y-2 text-sm">
            <p>✗ … weil ich <strong>habe</strong> keine Zeit.</p>
            <p>✓ … weil ich keine Zeit <strong>habe</strong>.</p>
          </div>
        </div>
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: Komma vergessen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich bleibe zu Hause weil ich keine Zeit habe.</p>
            <p>✓ Ich bleibe zu Hause, weil ich keine Zeit habe.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Bei <strong>weil/dass/wenn</strong>: Verb im Nebensatz <strong>am Ende</strong>',
      'Nebensatz mit <strong>Komma</strong> abtrennen',
      'Bei <strong>und/aber/denn/oder</strong>: normale Wortstellung (Verb Position 2)',
    ],
    faq: [
      {
        question: 'Kann der Nebensatz am Anfang stehen?',
        answer:
          '<p>Ja. Dann kommt im Hauptsatz das Verb direkt nach dem Nebensatz: <em>Wenn ich Zeit habe, <strong>komme</strong> ich.</em></p>',
      },
      {
        question: 'Was ist der Unterschied zwischen „denn“ und „weil“?',
        answer:
          '<p>Beide geben einen Grund. Bei <strong>weil</strong> ist es ein Nebensatz (Verb am Ende). Bei <strong>denn</strong> bleibt es ein Hauptsatz (Verb Position 2).</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // A2 - Perfekt vs. Präteritum
  'a2-perfekt-praeteritum': {
    topicId: 'a2-perfekt-praeteritum',
    shortExplanation:
      'Im Alltag wird Vergangenes oft im <strong>Perfekt</strong> erzählt („ich <strong>habe</strong> gelernt“). Das <strong>Präteritum</strong> ist häufiger in Texten – und bei <strong>sein/haben</strong> auch im Sprechen.',
    whenToUse: `
      <p class="mb-3">Du nutzt …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Perfekt</strong> im Gespräch: Ich <em>habe</em> Deutsch <em>gelernt</em>.</li>
        <li><strong>Präteritum</strong> in Texten/Erzählungen: Er <em>ging</em> nach Hause.</li>
        <li>Präteritum oft bei <strong>sein/haben</strong>: Ich <em>war</em> müde. Ich <em>hatte</em> Zeit.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Perfekt bilden:</p>
        <p class="text-sm mt-2"><strong class="text-primary">haben/sein</strong> + Partizip II (am Satzende)</p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Perfekt-Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich <strong>habe</strong> einen Film <strong>gesehen</strong>.</li>
            <li>Wir <strong>sind</strong> nach Berlin <strong>gefahren</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">haben oder sein?</p>
          <p class="text-sm"><strong>sein</strong> oft bei Bewegung/Zustandswechsel: gehen, fahren, kommen, aufstehen, werden …</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: falsches Hilfsverb</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich <strong>habe</strong> nach Hause <strong>gegangen</strong>.</p>
            <p>✓ Ich <strong>bin</strong> nach Hause <strong>gegangen</strong>.</p>
          </div>
        </div>
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: Partizip nicht am Ende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich habe <strong>gesehen</strong> einen Film.</p>
            <p>✓ Ich habe einen Film <strong>gesehen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Hilfsverb richtig? (<strong>sein</strong> bei Bewegung/Zustandswechsel)',
      'Partizip II steht <strong>am Satzende</strong>',
      'Im Alltag bevorzugt: <strong>Perfekt</strong> (außer sein/haben oft Präteritum)',
    ],
    faq: [
      {
        question: 'Kann ich immer Perfekt statt Präteritum benutzen?',
        answer:
          '<p>Im Alltag fast immer. In geschriebenen Geschichten/Texts ist Präteritum häufig. Bei „sein/haben“ hört man Präteritum auch im Gespräch oft.</p>',
      },
      {
        question: 'Welche Verben nehmen fast immer „sein“?',
        answer:
          '<p>Typisch sind Bewegungsverben (gehen, fahren, kommen) und Zustandswechsel (aufstehen, einschlafen, werden).</p>',
      },
    ],
    exerciseSection: 'Zeiten',
  },

  // A2 - Modalverben (Grundlagen)
  'a2-modalverben': {
    topicId: 'a2-modalverben',
    shortExplanation:
      'Modalverben wie <strong>können, müssen, dürfen, sollen, wollen, mögen</strong> ändern die Aussage: Fähigkeit, Pflicht, Erlaubnis, Wunsch. Das Vollverb steht im <strong>Infinitiv am Satzende</strong>.',
    whenToUse: `
      <p class="mb-3">Modalverben nutzt du, um …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Fähigkeit auszudrücken: Ich <strong>kann</strong> schwimmen.</li>
        <li>Pflicht zu nennen: Du <strong>musst</strong> lernen.</li>
        <li>Erlaubnis zu geben: Du <strong>darfst</strong> gehen.</li>
        <li>Wunsch/Absicht: Ich <strong>will</strong> Deutsch lernen.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Satzbau mit Modalverb:</p>
        <p class="text-lg mt-2">Modalverb (Position 2) + … + <strong class="text-primary">Infinitiv am Ende</strong></p>
      </div>

      <div class="space-y-4 text-sm">
        <p>✓ Ich <strong>kann</strong> heute nicht <strong>kommen</strong>.</p>
        <p>✓ Wir <strong>müssen</strong> viel <strong>üben</strong>.</p>
        <p>✓ Du <strong>darfst</strong> hier <strong>parken</strong>.</p>
      </div>

      <div class="mt-6 p-4 bg-muted/50 rounded-lg">
        <p class="text-sm font-semibold mb-2">Formen sind oft unregelmäßig:</p>
        <p class="text-sm">ich <strong>kann</strong>, du <strong>kannst</strong>, er <strong>kann</strong> (3. Person oft ohne -t)</p>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Infinitiv nicht am Ende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich kann <strong>kommen</strong> heute nicht.</p>
            <p>✓ Ich kann heute nicht <strong>kommen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Steht das Modalverb an <strong>Position 2</strong>?',
      'Steht das Vollverb als <strong>Infinitiv am Ende</strong>?',
      'Passende Bedeutung gewählt (können/müssen/dürfen/…)?',
    ],
    faq: [
      {
        question: 'Was ist der Unterschied zwischen „müssen“ und „sollen“?',
        answer:
          '<p>„müssen“ = starke Pflicht/Notwendigkeit. „sollen“ = Empfehlung/Auftrag von jemandem (z. B. Arzt/Lehrer).</p>',
      },
      {
        question: 'Warum heißt es „er kann“ und nicht „er kannt“?',
        answer:
          '<p>Viele Modalverben sind unregelmäßig: In der 3. Person Singular fehlt oft die Endung <em>-t</em> (er kann, er muss, er will).</p>',
      },
    ],
    exerciseSection: 'Verben',
  },
    // A2 - Trennbare Verben
  'a2-trennbare-verben': {
    topicId: 'a2-trennbare-verben',
    shortExplanation:
      'Bei <strong>trennbaren Verben</strong> wird das Präfix im <strong>Hauptsatz abgetrennt</strong> und steht meist <strong>am Satzende</strong>: „Ich rufe dich <strong>an</strong>.“',
    whenToUse: `
      <p class="mb-3">Trennbare Verben brauchst du sehr oft im Alltag, z. B. bei:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>anrufen</strong>, <strong>aufstehen</strong>, <strong>einkaufen</strong>, <strong>mitkommen</strong></li>
        <li>Alltagsroutinen: <em>Ich stehe um 7 Uhr auf.</em></li>
        <li>Telefon/Kommunikation: <em>Ich rufe dich später an.</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundregel:</p>
        <p class="text-lg mt-2">Verb (Position 2) … + <strong class="text-primary">Präfix am Ende</strong></p>
      </div>

      <div class="space-y-6">
        <div>
          <h4 class="font-semibold text-lg mb-3">Hauptsatz (trennbar):</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich <strong>rufe</strong> dich heute <strong>an</strong>.</li>
            <li>Wir <strong>stehen</strong> früh <strong>auf</strong>.</li>
            <li>Er <strong>kauft</strong> im Supermarkt <strong>ein</strong>.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Nebensatz / Infinitiv (nicht trennen):</h4>
          <ul class="space-y-2 ml-4">
            <li>…, weil ich dich später <strong>anrufe</strong>.</li>
            <li>Ich will dich später <strong>anrufen</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Perfekt (kurz):</p>
          <p class="text-sm">Präfix + <strong>ge</strong> + Stamm + (t/en): <em>anrufen → angerufen</em>, <em>aufstehen → aufgestanden</em></p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Präfix nicht ans Satzende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich rufe <strong>an</strong> dich.</p>
            <p>✓ Ich rufe dich <strong>an</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Hauptsatz: Präfix steht <strong>am Ende</strong>',
      'Nebensatz/Infinitiv: Verb bleibt <strong>zusammen</strong>',
      'Bei Perfekt: <strong>Präfix + ge</strong> richtig gesetzt (z. B. <em>angerufen</em>)',
    ],
    faq: [
      {
        question: 'Woran erkenne ich trennbare Verben?',
        answer:
          '<p>Oft am Präfix (an-, auf-, ein-, mit-, weg-, vor-, zurück- …). Im Hauptsatz hörst du die Trennung: <em>Ich stehe … auf</em>.</p>',
      },
      {
        question: 'Trennt man auch bei Modalverben?',
        answer:
          '<p>Ja: <em>Ich <strong>muss</strong> früh <strong>aufstehen</strong></em> (Infinitiv bleibt zusammen, weil am Ende).</p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // A2 - Pronomen Grundlagen
  'a2-pronomen-grundlagen': {
    topicId: 'a2-pronomen-grundlagen',
    shortExplanation:
      'Neben dem Nominativ brauchst du im A2 vor allem Personalpronomen im <strong>Akkusativ</strong> und <strong>Dativ</strong>: <strong>mich</strong>/<strong>mir</strong>, <strong>dich</strong>/<strong>dir</strong>, <strong>ihn</strong>/<strong>ihm</strong> …',
    whenToUse: `
      <p class="mb-3">Du nutzt Akkusativ/Dativ-Pronomen, wenn das Pronomen …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>ein <strong>Objekt</strong> ist: Ich sehe <strong>ihn</strong>. (wen?)</li>
        <li>ein <strong>Empfänger</strong> ist: Ich helfe <strong>ihm</strong>. (wem?)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Kurz-Tabelle:</p>
        <div class="mt-3 text-sm space-y-2">
          <p><strong>Akkusativ:</strong> mich, dich, ihn, sie, es, uns, euch, sie/Sie</p>
          <p><strong>Dativ:</strong> mir, dir, ihm, ihr, ihm, uns, euch, ihnen/Ihnen</p>
        </div>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele Akkusativ (wen/was?):</h4>
          <ul class="space-y-2 ml-4">
            <li>Kannst du <strong>mich</strong> hören?</li>
            <li>Ich treffe <strong>dich</strong> morgen.</li>
            <li>Ich sehe <strong>ihn</strong> jeden Tag.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele Dativ (wem?):</h4>
          <ul class="space-y-2 ml-4">
            <li>Kannst du <strong>mir</strong> helfen?</li>
            <li>Ich gebe <strong>dir</strong> das Buch.</li>
            <li>Wir danken <strong>ihnen</strong>.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „ihn“ und „ihm“ verwechseln</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich helfe <strong>ihn</strong>.</p>
            <p>✓ Ich helfe <strong>ihm</strong>. (helfen = Dativ)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Frage: <strong>wen/was?</strong> → Akkusativ',
      'Frage: <strong>wem?</strong> → Dativ',
      'Höflichkeitsform: <strong>Ihnen</strong> (Dativ) / <strong>Sie</strong> (Akkusativ) groß',
    ],
    faq: [
      {
        question: 'Welche Verben sind typisch für Dativ?',
        answer:
          '<p>Sehr häufig: <strong>helfen</strong>, <strong>danken</strong>, <strong>gehören</strong>, <strong>schmecken</strong>, <strong>passen</strong>.</p>',
      },
      {
        question: 'Gibt es zwei Objekte in einem Satz?',
        answer:
          '<p>Ja: „Ich gebe <strong>dir</strong> (Dativ) <strong>das Buch</strong> (Akkusativ).“ Pronomen stehen oft zuerst: „Ich gebe <strong>es</strong> <strong>dir</strong>.“</p>',
      },
    ],
    exerciseSection: 'Pronomen',
  },

  // A2 - Artikel & Kasus
  'a2-artikel-kasus': {
    topicId: 'a2-artikel-kasus',
    shortExplanation:
      'Im A2 lernst du die wichtigsten Artikel-Formen in <strong>Nominativ</strong>, <strong>Akkusativ</strong> und <strong>Dativ</strong> (der/den/dem …).',
    whenToUse: `
      <p class="mb-3">Kasus zeigen die Funktion im Satz:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Nominativ</strong> = Subjekt (wer/was?)</li>
        <li><strong>Akkusativ</strong> = direktes Objekt (wen/was?)</li>
        <li><strong>Dativ</strong> = indirektes Objekt/Empfänger (wem?)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Die wichtigsten Formen (bestimmt):</p>
        <div class="mt-3 text-sm space-y-1">
          <p><strong>Nominativ:</strong> der / die / das / die</p>
          <p><strong>Akkusativ:</strong> <strong>den</strong> / die / das / die</p>
          <p><strong>Dativ:</strong> <strong>dem</strong> / <strong>der</strong> / <strong>dem</strong> / <strong>den</strong> (+ <em>-n</em> im Plural)</p>
        </div>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>Der</strong> Mann kommt. (Nominativ)</li>
            <li>Ich sehe <strong>den</strong> Mann. (Akkusativ)</li>
            <li>Ich helfe <strong>dem</strong> Mann. (Dativ)</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Merktipp:</p>
          <p class="text-sm">Maskulin ändert sich am stärksten: <strong>der → den → dem</strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Dativ und Akkusativ verwechseln</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich helfe <strong>den</strong> Mann.</p>
            <p>✓ Ich helfe <strong>dem</strong> Mann. (helfen = Dativ)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Subjekt? (wer/was) → <strong>Nominativ</strong>',
      'Direktes Objekt? (wen/was) → <strong>Akkusativ</strong>',
      'Empfänger? (wem) → <strong>Dativ</strong>',
    ],
    faq: [
      {
        question: 'Warum heißt es „Ich sehe den Mann“, aber „Ich helfe dem Mann“?',
        answer:
          '<p>Weil „sehen“ meist Akkusativ verlangt, „helfen“ aber Dativ. Kasus hängt oft vom Verb ab.</p>',
      },
      {
        question: 'Was bedeutet „Plural + -n“ im Dativ?',
        answer:
          '<p>Im Dativ Plural kommt oft ein <strong>-n</strong> ans Nomen: „mit den Kind<strong>ern</strong>“, „bei den Freund<strong>en</strong>“ (wenn nicht schon -n/-s vorhanden).</p>',
      },
    ],
    exerciseSection: 'Kasus',
  },

  // A2 - Präpositionen Ort + Richtung
  'a2-praepositionen-ort-richtung': {
    topicId: 'a2-praepositionen-ort-richtung',
    shortExplanation:
      'Bei Ort vs. Richtung unterscheidest du <strong>wo?</strong> (Ort, oft Dativ) und <strong>wohin?</strong> (Richtung, oft Akkusativ) – plus wichtige Ziele mit <strong>nach</strong> und <strong>zu</strong>.',
    whenToUse: `
      <p class="mb-3">Du brauchst diese Präpositionen, wenn du sagst …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>wo</strong> du bist: <em>Ich bin in der Schule.</em></li>
        <li><strong>wohin</strong> du gehst: <em>Ich gehe in die Schule.</em></li>
        <li>Ziel Stadt/Land: <em>Ich fahre nach Berlin.</em></li>
        <li>Ziel Person/Ort als „Adressat“: <em>Ich gehe zu meiner Freundin.</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz:</p>
        <p class="text-lg mt-2"><strong class="text-primary">wo?</strong> → Ort (Dativ) · <strong class="text-primary">wohin?</strong> → Richtung (Akkusativ)</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">in / auf / an (Ort vs. Richtung):</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich bin <strong>in der</strong> Schule. (wo?)</li>
            <li>Ich gehe <strong>in die</strong> Schule. (wohin?)</li>
            <li>Das Buch liegt <strong>auf dem</strong> Tisch. (wo?)</li>
            <li>Ich lege das Buch <strong>auf den</strong> Tisch. (wohin?)</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">nach / zu (Ziel):</p>
          <ul class="mt-2 space-y-1 text-sm ml-4">
            <li><strong>nach</strong> + Stadt/Land ohne Artikel: <em>nach Berlin, nach Frankreich</em></li>
            <li><strong>zu</strong> + Person/Institution: <em>zu Maria, zum Arzt, zur Arbeit</em></li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „nach“ bei Ländern mit Artikel</h4>
          <div class="space-y-2 text-sm">
            <p>✗ nach der Schweiz</p>
            <p>✓ <strong>in die</strong> Schweiz</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Fragst du <strong>wo?</strong> (Ort) oder <strong>wohin?</strong> (Richtung)?',
      'Stadt/Land ohne Artikel → meist <strong>nach</strong>',
      'Person/Institution → meist <strong>zu</strong>',
    ],
    faq: [
      {
        question: 'Warum heißt es „zur Arbeit“, aber „in die Schule“?',
        answer:
          '<p>„zu“ steht oft bei Zielen als Institution/Adressat (Arbeit/Arzt). „in“ wird häufig bei „hinein“/Gebäuden genutzt (in die Schule, ins Kino).</p>',
      },
      {
        question: 'Ist das schon „Wechselpräpositionen“?',
        answer:
          '<p>Ja, das ist die Grundlage. Auf B1 lernst du Wechselpräpositionen systematisch (wo/wohin → Dativ/Akkusativ).</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // A2 - Adjektivdeklination Einstieg
  'a2-adjektivdeklination-einstieg': {
    topicId: 'a2-adjektivdeklination-einstieg',
    shortExplanation:
      'Wenn Adjektive <strong>vor einem Nomen</strong> stehen, bekommen sie Endungen: „ein <strong>kalter</strong> Kaffee“, „die <strong>große</strong> Tasche“.',
    whenToUse: `
      <p class="mb-3">Du brauchst Adjektivendungen, wenn du ein Nomen genauer beschreibst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>ein <strong>neues</strong> Handy</li>
        <li>die <strong>kleine</strong> Wohnung</li>
        <li>der <strong>gute</strong> Film</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">A2-Startregel (Nominativ):</p>
        <p class="text-sm mt-2">Nach <strong>der/die/das</strong> oft <strong>-e</strong>, nach <strong>ein/eine</strong> oft <strong>-er/-e/-es</strong>.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Mit bestimmtem Artikel (Nominativ):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>der</strong> alt<strong>e</strong> Mann</li>
            <li><strong>die</strong> alt<strong>e</strong> Frau</li>
            <li><strong>das</strong> alt<strong>e</strong> Kind</li>
            <li><strong>die</strong> alt<strong>en</strong> Leute (Plural)</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Mit unbestimmtem Artikel (Nominativ):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>ein</strong> gut<strong>er</strong> Film</li>
            <li><strong>eine</strong> gut<strong>e</strong> Idee</li>
            <li><strong>ein</strong> gut<strong>es</strong> Buch</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Merktipp:</p>
          <p class="text-sm">Bei „ein-“ fehlt die Artikelendung → das Adjektiv zeigt sie: <strong>ein gut<strong>er</strong></strong>, <strong>ein gut<strong>es</strong></strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Adjektiv ohne Endung vor Nomen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ ein gut Film</p>
            <p>✓ ein gut<strong>er</strong> Film</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Steht das Adjektiv <strong>vor</strong> dem Nomen? → Endung nötig',
      'Mit <strong>der/die/das</strong> oft -e/-en',
      'Mit <strong>ein/eine</strong>: Adjektiv trägt häufig die „fehlende“ Endung (-er/-e/-es)',
    ],
    faq: [
      {
        question: 'Ist das schon das komplette System?',
        answer:
          '<p>Nein. Das ist der Einstieg (Nominativ). Ab B1/B2 kommt das vollständige System (auch Akkusativ/Dativ/Genitiv).</p>',
      },
      {
        question: 'Warum heißt es „die alten Leute“ (-en)?',
        answer:
          '<p>Im Plural steht nach „die“ meistens <strong>-en</strong>: die alt<strong>en</strong> Leute.</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // A2 - Vergleich: Komparativ/Superlativ
  'a2-komparativ-superlativ': {
    topicId: 'a2-komparativ-superlativ',
    shortExplanation:
      'Mit <strong>Komparativ</strong> vergleichst du zwei Dinge („größer“), mit <strong>Superlativ</strong> nennst du das Maximum („am größten“).',
    whenToUse: `
      <p class="mb-3">Du nutzt die Steigerung, wenn du …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>vergleichst: Berlin ist <strong>größer</strong> als München.</li>
        <li>das Maximum ausdrückst: Das ist <strong>am besten</strong>.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Bildung:</p>
        <p class="text-sm mt-2"><strong>Komparativ:</strong> Adjektiv + <strong>-er</strong> · <strong>Superlativ:</strong> <strong>am</strong> + Adjektiv + <strong>-sten</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Regelmäßige Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>schnell → schnell<strong>er</strong> → am schnell<strong>sten</strong></li>
            <li>klein → klein<strong>er</strong> → am klein<strong>sten</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Häufig unregelmäßig:</h4>
          <ul class="space-y-2 ml-4">
            <li>gut → <strong>besser</strong> → <strong>am besten</strong></li>
            <li>viel → <strong>mehr</strong> → <strong>am meisten</strong></li>
            <li>gern → <strong>lieber</strong> → <strong>am liebsten</strong></li>
            <li>hoch → <strong>höher</strong> → <strong>am höchsten</strong></li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Vergleichssatz:</p>
          <p class="text-sm"><strong>als</strong> nach Komparativ: „größer <strong>als</strong>“, „besser <strong>als</strong>“</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „mehr besser“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ mehr besser</p>
            <p>✓ <strong>besser</strong></p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Komparativ: Endung <strong>-er</strong> (z. B. schneller)',
      'Superlativ: <strong>am</strong> + -sten (am schnellsten)',
      'Nach Komparativ kommt <strong>als</strong>',
    ],
    faq: [
      {
        question: 'Heißt es „wie“ oder „als“?',
        answer:
          '<p><strong>wie</strong> = gleich: „so groß <strong>wie</strong>“. <strong>als</strong> = Unterschied: „größer <strong>als</strong>“.</p>',
      },
      {
        question: 'Warum heißt es „am höchsten“ (nicht „am hochsten“)?',
        answer:
          '<p>„hoch“ bekommt im Komparativ/Superlativ oft Umlaut: höher, am höchsten.</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // B1 - Nebensätze/Konjunktionen
  'b1-nebensaetze-konjunktionen': {
    topicId: 'b1-nebensaetze-konjunktionen',
    shortExplanation:
      'Bei vielen Konjunktionen bildet man einen <strong>Nebensatz</strong>: Der Nebensatz wird mit Komma abgetrennt und das Verb steht <strong>am Ende</strong> (z. B. weil, dass, obwohl, wenn).',
    whenToUse: `
      <p class="mb-3">Du nutzt Nebensätze, um Aussagen logisch zu verbinden, z. B. für …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Grund:</strong> weil</li>
        <li><strong>Folge:</strong> sodass</li>
        <li><strong>Gegensatz:</strong> obwohl</li>
        <li><strong>Bedingung:</strong> wenn</li>
        <li><strong>Inhaltssatz:</strong> dass</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Wichtig:</p>
        <p class="text-sm mt-2">Nebensatz → <strong>Komma</strong> + Verb <strong>am Ende</strong>.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich gehe nicht mit, <strong>weil</strong> ich keine Zeit <strong>habe</strong>.</li>
            <li>Er sagt, <strong>dass</strong> er morgen <strong>kommt</strong>.</li>
            <li>Wir gehen spazieren, <strong>obwohl</strong> es <strong>regnet</strong>.</li>
            <li><strong>Wenn</strong> ich Zeit <strong>habe</strong>, besuche ich dich.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Startet der Satz mit Nebensatz?</p>
          <p class="text-sm">Dann folgt im Hauptsatz direkt das Verb: „Wenn ich Zeit habe, <strong>komme</strong> ich.“</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Verb nicht am Ende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ … weil ich <strong>habe</strong> keine Zeit.</p>
            <p>✓ … weil ich keine Zeit <strong>habe</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Konjunktion = Nebensatz? → Verb <strong>am Ende</strong>',
      'Nebensatz immer mit <strong>Komma</strong> abtrennen',
      'Nebensatz am Anfang → im Hauptsatz <strong>Verb direkt danach</strong>',
    ],
    faq: [
      {
        question: 'Was ist der Unterschied zwischen „denn“ und „weil“?',
        answer:
          '<p>„weil“ leitet einen Nebensatz ein (Verb am Ende). „denn“ verbindet zwei Hauptsätze (Verb Position 2).</p>',
      },
      {
        question: 'Gilt das auch für „dass“?',
        answer:
          '<p>Ja: „Er glaubt, <strong>dass</strong> es morgen <strong>schneit</strong>.“</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // B1 - Relativsätze (Basis)
  'b1-relativsaetze': {
    topicId: 'b1-relativsaetze',
    shortExplanation:
      'Relativsätze geben Zusatzinfos zu einem Nomen. Sie beginnen meist mit <strong>der/die/das</strong> (oder Plural: die) und haben das Verb <strong>am Ende</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt Relativsätze, wenn du etwas genauer beschreiben willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Das ist der Mann, <strong>der</strong> hier wohnt.</li>
        <li>Ich suche eine Wohnung, <strong>die</strong> günstig ist.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz:</p>
        <p class="text-sm mt-2">Relativsatz → <strong>Komma</strong> + Relativpronomen + … + Verb <strong>am Ende</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Nominativ (wer/was?):</h4>
          <ul class="space-y-2 ml-4">
            <li>Das ist der Mann, <strong>der</strong> hier <strong>wohnt</strong>.</li>
            <li>Das ist die Frau, <strong>die</strong> Deutsch <strong>lernt</strong>.</li>
            <li>Das ist das Kind, <strong>das</strong> laut <strong>ist</strong>.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Akkusativ (wen/was?) – Basisidee:</h4>
          <ul class="space-y-2 ml-4">
            <li>Das ist der Mann, <strong>den</strong> ich gut <strong>kenne</strong>.</li>
            <li>Das ist die Tasche, <strong>die</strong> ich <strong>kaufe</strong>.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Komma vergessen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Das ist der Mann der hier wohnt.</p>
            <p>✓ Das ist der Mann, der hier wohnt.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Relativsatz mit <strong>Kommas</strong> abtrennen',
      'Verb steht <strong>am Ende</strong>',
      'Relativpronomen passt zu <strong>Genus</strong> und <strong>Kasus</strong> (der/den/dem …)',
    ],
    faq: [
      {
        question: 'Wie finde ich den Kasus des Relativpronomens?',
        answer:
          '<p>Frag im Relativsatz: <strong>wer/was</strong> (Nominativ), <strong>wen/was</strong> (Akkusativ), <strong>wem</strong> (Dativ). Das Bezugswort bestimmt Genus/Number, der Relativsatz bestimmt den Kasus.</p>',
      },
      {
        question: 'Kann ein Relativsatz in der Mitte stehen?',
        answer:
          '<p>Ja: „Der Mann, <strong>den</strong> ich kenne, wohnt hier.“</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // B1 - Indirekte Fragen
  'b1-indirekte-fragen': {
    topicId: 'b1-indirekte-fragen',
    shortExplanation:
      'Indirekte Fragen sind „eingebettete“ Fragen. Sie haben <strong>kein Fragezeichen</strong> und das Verb steht oft <strong>am Ende</strong>: „Ich weiß nicht, wann er kommt.“',
    whenToUse: `
      <p class="mb-3">Du nutzt indirekte Fragen, wenn du eine Frage in einen Satz einbaust, z. B. nach:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>ob</strong> (Ja/Nein): Ich frage mich, <strong>ob</strong> er Zeit hat.</li>
        <li>Fragewort: Ich weiß nicht, <strong>wo</strong> sie wohnt.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Struktur:</p>
        <p class="text-sm mt-2">Hauptsatz + Komma + <strong class="text-primary">ob / Fragewort</strong> + … + Verb <strong>am Ende</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele mit „ob“:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich weiß nicht, <strong>ob</strong> er morgen <strong>kommt</strong>.</li>
            <li>Kannst du mir sagen, <strong>ob</strong> das Restaurant offen <strong>ist</strong>?</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele mit Fragewort:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich weiß nicht, <strong>wo</strong> sie <strong>wohnt</strong>.</li>
            <li>Er fragt, <strong>wann</strong> der Kurs <strong>beginnt</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Wichtig:</p>
          <p class="text-sm">Indirekte Fragen enden meistens mit Punkt, nicht mit Fragezeichen.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Wortstellung wie direkte Frage</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich weiß nicht, wann <strong>kommt</strong> er.</p>
            <p>✓ Ich weiß nicht, wann er <strong>kommt</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Einleitung + Komma (z. B. „Ich weiß nicht,“)',
      'ob/Fragewort am Anfang des Nebensatzes',
      'Verb steht <strong>am Ende</strong> und meist <strong>kein</strong> Fragezeichen',
    ],
    faq: [
      {
        question: 'Wann benutze ich „ob“?',
        answer:
          '<p>„ob“ nutzt du für Ja/Nein-Fragen: „ob er kommt“, „ob das stimmt“. Für W-Fragen nutzt du das Fragewort: „wann/wo/warum …“</p>',
      },
      {
        question: 'Kann ich indirekte Fragen höflich machen?',
        answer:
          '<p>Ja, z. B.: „Könnten Sie mir sagen, ob …“ / „Wissen Sie, wann …“</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // B1 - Futur I
  'b1-futur': {
    topicId: 'b1-futur',
    shortExplanation:
      'Das <strong>Futur I</strong> bildet man mit <strong>werden</strong> + Infinitiv. Es wird für <strong>Vermutungen</strong> und manchmal für <strong>Planungen</strong> verwendet.',
    whenToUse: `
      <p class="mb-3">Du nutzt Futur I besonders für …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Vermutungen:</strong> Er <strong>wird</strong> schon zu Hause <strong>sein</strong>.</li>
        <li><strong>Ankündigungen/Pläne:</strong> Ich <strong>werde</strong> morgen länger <strong>lernen</strong>.</li>
        <li><strong>Versprechen:</strong> Ich <strong>werde</strong> dir helfen.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Bildung:</p>
        <p class="text-lg mt-2"><strong class="text-primary">werden</strong> (Position 2) + … + <strong class="text-primary">Infinitiv am Ende</strong></p>
      </div>

      <div class="space-y-4 text-sm">
        <p>✓ Ich <strong>werde</strong> morgen viel <strong>lernen</strong>.</p>
        <p>✓ Sie <strong>wird</strong> gleich <strong>kommen</strong>.</p>
        <p>✓ Er <strong>wird</strong> krank <strong>sein</strong>. (Vermutung)</p>
      </div>

      <div class="mt-6 p-4 bg-muted/50 rounded-lg">
        <p class="text-sm font-semibold mb-2">Hinweis (B1-realistisch):</p>
        <p class="text-sm">Für feste Pläne nutzt man oft auch Präsens + Zeitangabe: „Morgen <strong>gehe</strong> ich zum Arzt.“</p>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Infinitiv nicht am Ende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich werde <strong>lernen</strong> morgen.</p>
            <p>✓ Ich werde morgen <strong>lernen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      '„werden“ konjugiert an <strong>Position 2</strong>',
      'Vollverb als <strong>Infinitiv am Ende</strong>',
      'Für Vermutung oft: „wird wohl …“ / Kontext beachten',
    ],
    faq: [
      {
        question: 'Wann ist Futur I besser als Präsens?',
        answer:
          '<p>Vor allem bei <strong>Vermutungen</strong> („Er wird schon unterwegs sein.“). Für Pläne reicht oft Präsens mit Zeitangabe.</p>',
      },
      {
        question: 'Ist „werden“ ein Modalverb?',
        answer:
          '<p>Nein. „werden“ ist ein Hilfsverb (u. a. für Futur). Es verhält sich im Satzbau ähnlich: Infinitiv steht am Ende.</p>',
      },
    ],
    exerciseSection: 'Zeiten',
  },
    // B1 - Modalverben im Präteritum
  'b1-modalverben-praeteritum': {
    topicId: 'b1-modalverben-praeteritum',
    shortExplanation:
      'Im <strong>Präteritum</strong> haben Modalverben sehr häufige Formen wie <strong>konnte, musste, wollte, durfte, sollte</strong>. Das Vollverb steht weiterhin als <strong>Infinitiv am Satzende</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt Modalverben im Präteritum, wenn du über Vergangenes sprichst, z. B. …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Fähigkeit:</strong> Ich <strong>konnte</strong> nicht kommen.</li>
        <li><strong>Pflicht:</strong> Wir <strong>mussten</strong> früh aufstehen.</li>
        <li><strong>Wunsch/Absicht:</strong> Ich <strong>wollte</strong> Deutsch lernen.</li>
        <li><strong>Erlaubnis:</strong> Ich <strong>durfte</strong> nicht rausgehen.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Satzbau:</p>
        <p class="text-lg mt-2">Modalverb (Präteritum, Position 2) + … + <strong class="text-primary">Infinitiv am Ende</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Häufige Formen:</h4>
          <ul class="space-y-2 ml-4">
            <li>können → ich <strong>konnte</strong>, du <strong>konntest</strong>, er <strong>konnte</strong></li>
            <li>müssen → ich <strong>musste</strong>, du <strong>musstest</strong>, er <strong>musste</strong></li>
            <li>wollen → ich <strong>wollte</strong>, du <strong>wolltest</strong>, er <strong>wollte</strong></li>
            <li>dürfen → ich <strong>durfte</strong>, du <strong>durftest</strong>, er <strong>durfte</strong></li>
            <li>sollen → ich <strong>sollte</strong>, du <strong>solltest</strong>, er <strong>sollte</strong></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich <strong>konnte</strong> gestern nicht <strong>kommen</strong>.</li>
            <li>Wir <strong>mussten</strong> viel <strong>lernen</strong>.</li>
            <li>Er <strong>wollte</strong> sofort <strong>gehen</strong>.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Infinitiv nicht am Ende</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich konnte <strong>kommen</strong> gestern nicht.</p>
            <p>✓ Ich konnte gestern nicht <strong>kommen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Modalverb im Präteritum korrekt (konnte/musste/wollte/…)',
      'Vollverb als <strong>Infinitiv am Ende</strong>',
      'Zeitangaben bleiben flexibel, aber Verbklammer bleibt stabil',
    ],
    faq: [
      {
        question: 'Warum sagt man so oft „ich musste“ statt „ich habe gemusst“?',
        answer:
          '<p>Im Alltag ist das Präteritum bei Modalverben sehr verbreitet und klingt natürlicher. Perfekt-Formen existieren, wirken aber oft schwerfällig.</p>',
      },
      {
        question: 'Gilt das auch für „mögen“?',
        answer:
          '<p>Ja: „Ich <strong>mochte</strong> den Film.“ (Präteritum). In der Höflichkeit nutzt man oft Konjunktiv II: „Ich <strong>möchte</strong> …“</p>',
      },
    ],
    exerciseSection: 'Zeiten',
  },

  // B1 - Reflexive Verben
  'b1-reflexive-verben': {
    topicId: 'b1-reflexive-verben',
    shortExplanation:
      'Reflexive Verben beziehen sich auf das Subjekt zurück: „Ich wasche <strong>mich</strong>.“ Das Reflexivpronomen richtet sich nach Person und Kasus (<strong>mich/dich/sich/uns/euch/sich</strong>).',
    whenToUse: `
      <p class="mb-3">Reflexive Verben nutzt du u. a. für …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Alltag/Body: sich waschen, sich anziehen, sich setzen</li>
        <li>Gefühle: sich freuen, sich ärgern, sich wundern</li>
        <li>Interessen: sich interessieren (für)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Reflexivpronomen (Akkusativ):</p>
        <p class="text-sm mt-2"><strong class="text-primary">mich</strong>, <strong class="text-primary">dich</strong>, <strong class="text-primary">sich</strong>, <strong class="text-primary">uns</strong>, <strong class="text-primary">euch</strong>, <strong class="text-primary">sich</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Typisch Akkusativ:</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich <strong>wasche mich</strong>.</li>
            <li>Du <strong>ziehst dich</strong> an.</li>
            <li>Er <strong>setzt sich</strong> hin.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Manchmal Dativ (wenn es noch ein Akkusativ-Objekt gibt):</p>
          <p class="text-sm">Ich wasche <strong>mir</strong> die Hände. (Hände = Akkusativ, mir = Dativ)</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: falsches Reflexivpronomen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich wasche <strong>mich</strong> die Hände.</p>
            <p>✓ Ich wasche <strong>mir</strong> die Hände.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Reflexivpronomen passt zur Person (ich→mich/…)',
      'Gibt es noch ein Akkusativobjekt? → Reflexiv oft <strong>Dativ</strong> (mir/dir/…)',
      'Reflexiv + Präpositionen ggf. mitlernen (sich interessieren <strong>für</strong>)',
    ],
    faq: [
      {
        question: 'Ist „sich treffen“ reflexiv?',
        answer:
          '<p>Ja: „Wir <strong>treffen uns</strong> um 18 Uhr.“ (reflexiv im Plural).</p>',
      },
      {
        question: 'Warum heißt es „Ich freue mich“?',
        answer:
          '<p>„sich freuen“ ist ein reflexives Verb: Das Gefühl bezieht sich auf das Subjekt zurück.</p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // B1 - Verben mit Präposition
  'b1-verben-mit-praeposition': {
    topicId: 'b1-verben-mit-praeposition',
    shortExplanation:
      'Viele Verben verlangen eine <strong>feste Präposition</strong> und oft auch einen bestimmten <strong>Kasus</strong>: „warten <strong>auf</strong> + Akkusativ“, „sich interessieren <strong>für</strong> + Akkusativ“.',
    whenToUse: `
      <p class="mb-3">Du brauchst Verben mit Präposition, wenn du typische Alltagsverben korrekt ergänzen willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>warten <strong>auf</strong></li>
        <li>denken <strong>an</strong></li>
        <li>sich freuen <strong>auf/über</strong></li>
        <li>sprechen <strong>mit</strong></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz:</p>
        <p class="text-sm mt-2">Präposition ist Teil des Verbs → <strong>mitlernen</strong> (inkl. Kasus).</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Häufige Muster:</h4>
          <ul class="space-y-2 ml-4">
            <li>warten <strong>auf</strong> + Akk: Ich warte <strong>auf den</strong> Bus.</li>
            <li>denken <strong>an</strong> + Akk: Ich denke <strong>an meine</strong> Familie.</li>
            <li>sprechen <strong>mit</strong> + Dat: Ich spreche <strong>mit dem</strong> Lehrer.</li>
            <li>sich interessieren <strong>für</strong> + Akk: Ich interessiere mich <strong>für das</strong> Thema.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Da-/wo- (kurz):</p>
          <p class="text-sm">Wenn kein Nomen folgt: „Woran denkst du?“ – „Ich denke <strong>daran</strong>.“</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: falsche Präposition</h4>
          <div class="space-y-2 text-sm">
            <p>✗ warten <strong>für</strong> den Bus</p>
            <p>✓ warten <strong>auf</strong> den Bus</p>
          </div>
        </div>

        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: falscher Kasus</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich interessiere mich für <strong>dem</strong> Kurs.</p>
            <p>✓ Ich interessiere mich für <strong>den</strong> Kurs. (für + Akk)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Verb + Präposition immer als Einheit lernen',
      'Kasus prüfen (Akk/Dativ/Genitiv je nach Verb)',
      'Bei Pronomen: da-/wo- korrekt (daran/woran)',
    ],
    faq: [
      {
        question: 'Warum ist das so schwer?',
        answer:
          '<p>Weil die Präposition oft nicht „logisch“ ableitbar ist. Es hilft nur: feste Kombinationen als Chunk lernen und üben.</p>',
      },
      {
        question: 'Kann ein Verb mehrere Präpositionen haben?',
        answer:
          '<p>Ja: „sich freuen <strong>auf</strong>“ (Zukunft) vs. „sich freuen <strong>über</strong>“ (Grund/Anlass).</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // B1 - Präpositionen Ort + Zeit (B1)
  'b1-praepositionen-ort-zeit': {
    topicId: 'b1-praepositionen-ort-zeit',
    shortExplanation:
      'Auf B1 werden Orts- und Zeitpräpositionen systematischer: <strong>seit</strong> (Startpunkt bis jetzt), <strong>vor</strong> (Zeitpunkt in der Vergangenheit), <strong>in</strong> (in 2 Tagen), <strong>für</strong> (Dauer) usw.',
    whenToUse: `
      <p class="mb-3">Diese Präpositionen nutzt du, wenn du Zeit und Ort präziser angibst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>seit</strong> 2022 (bis heute)</li>
        <li><strong>vor</strong> zwei Tagen</li>
        <li><strong>in</strong> zwei Wochen (in der Zukunft)</li>
        <li><strong>für</strong> drei Monate (Dauer)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Kernpaare:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li><strong class="text-primary">seit</strong> + Zeitpunkt (bis jetzt)</li>
          <li><strong class="text-primary">vor</strong> + Zeitraum (zurück)</li>
          <li><strong class="text-primary">in</strong> + Zeitraum (nach vorn)</li>
          <li><strong class="text-primary">für</strong> + Dauer</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (Zeit):</h4>
          <ul class="space-y-2 ml-4">
            <li>Ich wohne <strong>seit</strong> 2021 in Berlin.</li>
            <li>Wir haben uns <strong>vor</strong> zwei Tagen gesehen.</li>
            <li>Der Kurs beginnt <strong>in</strong> drei Wochen.</li>
            <li>Ich bin <strong>für</strong> zwei Wochen im Urlaub.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Ortspräpositionen bleiben wichtig:</p>
          <p class="text-sm">wo/wohin-System (Dativ/Akkusativ) + feste Ziele (nach/zu) – je nach Satz.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „seit“ für Zukunft</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Der Kurs beginnt <strong>seit</strong> zwei Wochen.</p>
            <p>✓ Der Kurs beginnt <strong>in</strong> zwei Wochen.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      '„seit“ = Startpunkt bis <strong>jetzt</strong>',
      '„vor“ = zurück in die Vergangenheit',
      '„in“ = nach vorn (Zukunft)',
      '„für“ = Dauer',
    ],
    faq: [
      {
        question: 'Was ist der Unterschied zwischen „in zwei Tagen“ und „für zwei Tage“?',
        answer:
          '<p>„in zwei Tagen“ = Zeitpunkt/Zukunft (nach zwei Tagen). „für zwei Tage“ = Dauer (zwei Tage lang).</p>',
      },
      {
        question: 'Kann ich „seit“ mit Präteritum/Perfekt kombinieren?',
        answer:
          '<p>Ja, aber der Zustand muss bis heute gelten: „Ich habe seit 2021 hier gewohnt“ klingt meist schlechter als „Ich wohne seit 2021 hier“.</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // B1 - Adjektivdeklination Nominativ/Akkusativ
  'b1-adjektivdeklination-nom-akk': {
    topicId: 'b1-adjektivdeklination-nom-akk',
    shortExplanation:
      'Im B1 stabilisierst du die Adjektivendungen im <strong>Nominativ</strong> und <strong>Akkusativ</strong> – besonders die wichtigen maskulinen Formen: <strong>der gut<strong>e</strong> Mann</strong> vs. <strong>den gut<strong>en</strong> Mann</strong>.',
    whenToUse: `
      <p class="mb-3">Du brauchst das ständig, wenn du Nomen mit Adjektiven beschreibst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Ich sehe <strong>den neuen</strong> Film.</li>
        <li>Wir kaufen <strong>eine frische</strong> Pizza.</li>
        <li>Er hat <strong>ein großes</strong> Auto.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz (B1):</p>
        <p class="text-sm mt-2">Maskulin Akkusativ ist der Knackpunkt: <strong class="text-primary">den + -en</strong>, <strong class="text-primary">einen + -en</strong>.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Mit bestimmtem Artikel:</h4>
          <ul class="space-y-2 ml-4">
            <li>Nominativ: <strong>der</strong> gut<strong>e</strong> Mann / <strong>die</strong> gut<strong>e</strong> Frau / <strong>das</strong> gut<strong>e</strong> Kind</li>
            <li>Akkusativ: <strong>den</strong> gut<strong>en</strong> Mann / <strong>die</strong> gut<strong>e</strong> Frau / <strong>das</strong> gut<strong>e</strong> Kind</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Mit unbestimmtem Artikel:</h4>
          <ul class="space-y-2 ml-4">
            <li>Nominativ: <strong>ein</strong> gut<strong>er</strong> Mann / <strong>eine</strong> gut<strong>e</strong> Frau / <strong>ein</strong> gut<strong>es</strong> Kind</li>
            <li>Akkusativ: <strong>einen</strong> gut<strong>en</strong> Mann / <strong>eine</strong> gut<strong>e</strong> Frau / <strong>ein</strong> gut<strong>es</strong> Kind</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „den gute Mann“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ den gut<strong>e</strong> Mann</p>
            <p>✓ den gut<strong>en</strong> Mann</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Akkusativ maskulin: <strong>den/einen + -en</strong>',
      'Feminin/Neutrum oft stabiler (die/eine + -e, das/ein + -e/-es)',
      'Plural mit „die“ meist <strong>-en</strong> (die guten Leute)',
    ],
    faq: [
      {
        question: 'Warum ist es „den guten Mann“, aber „die gute Frau“?',
        answer:
          '<p>Im Akkusativ ändert sich vor allem die maskuline Artikel-Form (der→den) und damit auch die typische Adjektivendung (-en).</p>',
      },
      {
        question: 'Kommt Dativ hier auch schon vor?',
        answer:
          '<p>In B1 kann Dativ schon vorkommen, aber diese Seite fokussiert Nominativ/Akkusativ. Das vollständige System folgt auf B2.</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // B1 - Passiv (Einstieg)
  'b1-passiv-einstieg': {
    topicId: 'b1-passiv-einstieg',
    shortExplanation:
      'Im <strong>Passiv</strong> steht die Handlung im Fokus, nicht der Handelnde: „Der Brief <strong>wird</strong> geschrieben.“ Bildung: <strong>werden</strong> + Partizip II.',
    whenToUse: `
      <p class="mb-3">Du nutzt Passiv, wenn …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>der Handelnde unwichtig/unknown ist: <em>Hier wird viel gebaut.</em></li>
        <li>du Prozesse/Regeln beschreibst: <em>Der Antrag wird online ausgefüllt.</em></li>
        <li>du neutral/formell schreibst: <em>Die Daten werden gespeichert.</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Bildung (Präsens):</p>
        <p class="text-lg mt-2"><strong class="text-primary">werden</strong> (Position 2) + … + <strong class="text-primary">Partizip II am Ende</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Aktiv → Passiv:</h4>
          <ul class="space-y-2 ml-4">
            <li>Aktiv: Der Chef schreibt <strong>den Brief</strong>.</li>
            <li>Passiv: <strong>Der Brief</strong> <strong>wird</strong> (vom Chef) <strong>geschrieben</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Handelnder im Passiv:</p>
          <p class="text-sm"><strong>von</strong> + Dativ: „Der Brief wird <strong>von dem Chef</strong> geschrieben.“</p>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Vergangenheit (Mini-Vorschau):</h4>
          <ul class="space-y-2 ml-4">
            <li>Der Brief <strong>wurde</strong> geschrieben.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „sein“-Passiv statt „werden“-Passiv</h4>
          <p class="text-sm mb-2">B1-Einstieg: Fokus auf <strong>Vorgangspassiv</strong> mit „werden“.</p>
          <div class="space-y-2 text-sm">
            <p>✗ Der Brief <strong>ist</strong> geschrieben. (Zustand)</p>
            <p>✓ Der Brief <strong>wird</strong> geschrieben. (Vorgang)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Passiv = <strong>werden</strong> + Partizip II',
      'Partizip II steht <strong>am Satzende</strong>',
      'Handelnder optional mit <strong>von</strong> + Dativ',
    ],
    faq: [
      {
        question: 'Was ist der Unterschied zwischen „wird gemacht“ und „ist gemacht“?',
        answer:
          '<p>„wird gemacht“ = Vorgang/Prozess. „ist gemacht“ = Ergebnis/Zustand (es ist fertig).</p>',
      },
      {
        question: 'Kann jedes Verb ins Passiv?',
        answer:
          '<p>Vor allem Verben mit Akkusativobjekt passen gut (den Brief schreiben). Bei reinen Dativverben ist es schwieriger/anders gelöst.</p>',
      },
    ],
    exerciseSection: 'Passiv',
  },

  // B2 - Infinitivsätze
  'b2-infinitivsaetze': {
    topicId: 'b2-infinitivsaetze',
    shortExplanation:
      'Infinitivsätze bestehen aus <strong>zu + Infinitiv</strong>: „Ich versuche, pünktlich <strong>zu kommen</strong>.“ Häufige Varianten sind <strong>um … zu</strong>, <strong>ohne … zu</strong>, <strong>statt … zu</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt Infinitivsätze, um Absicht, Grund oder Alternative kompakt auszudrücken:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Absicht:</strong> Ich lerne, <strong>um</strong> die Prüfung <strong>zu bestehen</strong>.</li>
        <li><strong>ohne:</strong> Er ging, <strong>ohne</strong> etwas <strong>zu sagen</strong>.</li>
        <li><strong>statt:</strong> Sie ruft an, <strong>statt</strong> zu schreiben.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundform:</p>
        <p class="text-lg mt-2">… , <strong class="text-primary">zu</strong> + Infinitiv</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Typische Auslöser:</h4>
          <p class="text-sm">versuchen, planen, vergessen, hoffen, anfangen, aufhören, bitten, erlauben, empfehlen …</p>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Komma-Regel (praktisch):</h4>
          <ul class="space-y-2 ml-4">
            <li>Meist Komma bei <strong>um/ohne/statt</strong> und bei längeren Konstruktionen.</li>
            <li>Bei sehr kurzen „zu“-Ergänzungen ist das Komma teils optional (stilabhängig).</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">„zu“ bei trennbaren Verben:</p>
          <p class="text-sm">„anrufen“ → „anzurufen“: Ich versuche, dich <strong>anzurufen</strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „zu“ vergessen oder falsch platzieren</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Ich versuche, dich morgen anzurufen. (ohne „zu“ bei „zu“-Verb verlangt)</p>
            <p>✓ Ich versuche, dich morgen <strong>anzurufen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Brauchst du <strong>zu + Infinitiv</strong> (versuchen/planen/…)?',
      'Bei trennbaren Verben: <strong>zu</strong> zwischen Präfix und Stamm (anzurufen)',
      'um/ohne/statt → Infinitivsatz meist mit <strong>Komma</strong>',
    ],
    faq: [
      {
        question: 'Wann benutze ich „um … zu“?',
        answer:
          '<p>Wenn du eine <strong>Absicht/Ziel</strong> ausdrückst: „Ich lerne, <strong>um</strong> die Prüfung <strong>zu bestehen</strong>.“</p>',
      },
      {
        question: 'Kann man Infinitivsätze durch Nebensätze ersetzen?',
        answer:
          '<p>Oft ja: „um … zu“ ↔ „damit“. „Ich lerne, damit ich bestehe.“</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // B2 - Konjunktiv II: Konditionalsätze
  'b2-konjunktiv-2-konditionalsaetze': {
    topicId: 'b2-konjunktiv-2-konditionalsaetze',
    shortExplanation:
      'Irreale Bedingungen formulierst du mit <strong>wenn</strong> + Konjunktiv II und meist <strong>würde</strong> im Hauptsatz: „Wenn ich Zeit <strong>hätte</strong>, <strong>würde</strong> ich kommen.“',
    whenToUse: `
      <p class="mb-3">Du nutzt das, wenn die Bedingung unrealistisch oder nur hypothetisch ist:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Ich würde reisen, wenn ich mehr Zeit hätte.</li>
        <li>Wenn ich du wäre, würde ich das anders machen.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundmuster:</p>
        <p class="text-sm mt-2"><strong class="text-primary">Wenn</strong> + Konjunktiv II, <strong class="text-primary">würde</strong> + Infinitiv.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>Wenn</strong> ich mehr Zeit <strong>hätte</strong>, <strong>würde</strong> ich öfter <strong>kochen</strong>.</li>
            <li><strong>Wenn</strong> er schneller <strong>wäre</strong>, <strong>würde</strong> er den Bus <strong>kriegen</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Ohne „wenn“ (Inversion möglich):</p>
          <p class="text-sm"><strong>Hätte</strong> ich mehr Zeit, <strong>würde</strong> ich reisen.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Indikativ statt Konjunktiv II</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Wenn ich Zeit <strong>habe</strong>, würde ich kommen. (oft nicht „irreal“)</p>
            <p>✓ Wenn ich Zeit <strong>hätte</strong>, würde ich kommen. (irreal/hypothetisch)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Irreal/hypothetisch? → Konjunktiv II (hätte/wäre/könnte/…)',
      'Hauptsatz oft: <strong>würde</strong> + Infinitiv',
      'Alternative Form: „Hätte ich …, würde ich …“',
    ],
    faq: [
      {
        question: 'Wann benutze ich „würde“ und wann die direkte Konjunktivform?',
        answer:
          '<p>Bei <strong>sein/haben/Modalverben</strong> nutzt man meist die direkte Form (wäre/hätte/könnte). Bei vielen anderen Verben ist „würde + Infinitiv“ üblich.</p>',
      },
      {
        question: 'Ist „wenn“ immer nötig?',
        answer:
          '<p>Nein. Inversion ist möglich: „Wäre ich reich, …“</p>',
      },
    ],
    exerciseSection: 'Konjunktiv',
  },

  // B2 - Indirekte Rede (Konjunktiv I + II)
  'b2-indirekte-rede': {
    topicId: 'b2-indirekte-rede',
    shortExplanation:
      'In der <strong>indirekten Rede</strong> gibst du Aussagen wieder. Typisch ist <strong>Konjunktiv I</strong>: „Er sagt, er <strong>sei</strong> krank.“ Wenn Konjunktiv I nicht eindeutig ist, nutzt man oft <strong>Konjunktiv II</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt indirekte Rede, wenn du Aussagen/Informationen wiedergibst, z. B. in Nachrichten, Berichten oder formellen Texten:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Er sagt, er <strong>sei</strong> müde.</li>
        <li>Sie meint, sie <strong>habe</strong> keine Zeit.</li>
        <li>Er behauptet, er <strong>wäre</strong> unschuldig. (Konj. II)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundprinzip:</p>
        <p class="text-sm mt-2">Einleitung (sagen/behaupten/erklären) + Nebensatz → häufig <strong class="text-primary">Konjunktiv</strong>.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Konjunktiv I (Beispiele):</h4>
          <ul class="space-y-2 ml-4">
            <li>Er sagt, er <strong>sei</strong> krank.</li>
            <li>Sie sagt, sie <strong>komme</strong> später.</li>
            <li>Er erklärt, er <strong>habe</strong> keine Zeit.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Wenn Konjunktiv I „gleich aussieht“:</p>
          <p class="text-sm">Dann nutzt man oft Konjunktiv II: „Sie sagt, sie <strong>hätte</strong> keine Zeit.“</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Indikativ ohne Distanz</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Er sagt, er <strong>ist</strong> krank. (klingt wie direkte Übernahme)</p>
            <p>✓ Er sagt, er <strong>sei</strong> krank. (indirekte Rede)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Aussage wird wiedergegeben? → indirekte Rede prüfen',
      'Konjunktiv I bevorzugt (sei/habe/komme/…)',
      'Wenn Form unklar: Konjunktiv II (wäre/hätte/käme/…)',
    ],
    faq: [
      {
        question: 'Muss ich immer „dass“ benutzen?',
        answer:
          '<p>Nein. „dass“ ist möglich, aber in klassischer indirekter Rede oft ohne „dass“: „Er sagt, er sei krank.“</p>',
      },
      {
        question: 'Ist das nur für formelle Texte?',
        answer:
          '<p>Vor allem ja. Im Alltag nutzt man oft Indikativ, in Berichten/Prüfungen ist Konjunktiv wichtiger.</p>',
      },
    ],
    exerciseSection: 'Konjunktiv',
  },

  // B2 - Nomen-Verb-Verbindungen
  'b2-nomen-verb-verbindungen': {
    topicId: 'b2-nomen-verb-verbindungen',
    shortExplanation:
      'Nomen-Verb-Verbindungen (z. B. „eine Entscheidung <strong>treffen</strong>“) sind feste Kombinationen, typisch für formelleres Deutsch. Sie wirken oft neutraler als ein einzelnes Verb.',
    whenToUse: `
      <p class="mb-3">Du nutzt Nomen-Verb-Verbindungen besonders …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>in formellen Texten, E-Mails, Bewerbungen</li>
        <li>in Argumentationen und Berichten</li>
        <li>als stilistische Alternative zu „starken“ Verben</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Muster:</p>
        <p class="text-sm mt-2">Artikel/Attribut + <strong class="text-primary">Nomen</strong> + „leichtes“ Verb (machen/treffen/führen/stellen/nehmen …)</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Häufige Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>eine Entscheidung <strong>treffen</strong> (= entscheiden)</li>
            <li>einen Antrag <strong>stellen</strong> (= beantragen)</li>
            <li>Kontakt <strong>aufnehmen</strong> (= kontaktieren)</li>
            <li>eine Frage <strong>stellen</strong> (= fragen)</li>
            <li>Einfluss <strong>haben</strong> (= beeinflussen)</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Stil-Tipp:</p>
          <p class="text-sm">In Prüfungen/Textsorte kann das eleganter wirken: „Wir haben eine Entscheidung getroffen“ statt „Wir haben entschieden“.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: falscher Artikel/Kasus oder falsches „leichtes“ Verb</h4>
          <div class="space-y-2 text-sm">
            <p>✗ eine Entscheidung <strong>machen</strong></p>
            <p>✓ eine Entscheidung <strong>treffen</strong></p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Kombination als Einheit lernen (Nomen + Verb)',
      'Artikel/Kasus korrekt setzen (eine/einen/einem …)',
      'Nicht „frei“ kombinieren (z. B. Entscheidung ≠ machen)',
    ],
    faq: [
      {
        question: 'Sind das „Funktionsverbgefüge“?',
        answer:
          '<p>Teilweise ja. „Nomen-Verb-Verbindungen“ ist der breite Begriff; „Funktionsverbgefüge“ sind eine formellere Untergruppe (kommt stark auf Terminologie an).</p>',
      },
      {
        question: 'Soll ich das im Alltag benutzen?',
        answer:
          '<p>Im Alltag geht beides. Für formelle Texte sind diese Verbindungen besonders nützlich.</p>',
      },
    ],
    exerciseSection: 'Verben',
  },



};

// Helper function to get content for a topic
export function getTopicContent(topicId: string): GrammarContent | undefined {
  return grammarContentData[topicId];
}

// Helper function to get related topics
export function getRelatedTopics(topicId: string, limit: number = 3): GrammarTopic[] {
  const topic = grammarTopics.find((t) => t.id === topicId);
  if (!topic) return [];

  // Find related topics:
  // 1. Same category, different level
  // 2. Same level, related category
  const related = grammarTopics
    .filter((t) => {
      if (t.id === topicId) return false;

      // Same category
      if (t.category === topic.category) return true;

      // Same level and somewhat related
      if (t.level === topic.level) {
        // Define related categories
        const relatedCategories: Record<string, string[]> = {
          satzbau: ['verben', 'zeiten'],
          zeiten: ['verben', 'satzbau'],
          verben: ['zeiten', 'kasus'],
          nomen: ['kasus', 'adjektive'],
          kasus: ['verben', 'nomen'],
          adjektive: ['nomen', 'genitiv'],
          passiv: ['verben', 'nominalstil'],
          genitiv: ['nomen', 'adjektive'],
        };

        return relatedCategories[topic.category]?.includes(t.category) || false;
      }

      return false;
    })
    .slice(0, limit);

  return related;
}
