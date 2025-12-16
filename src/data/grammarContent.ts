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
