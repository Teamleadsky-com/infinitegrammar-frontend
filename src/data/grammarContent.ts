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

  // B2 - Feste Präposition / Rektion
  'b2-feste-praeposition-rektion': {
    topicId: 'b2-feste-praeposition-rektion',
    shortExplanation:
      'Bei <strong>Rektion</strong> ist die Präposition (und oft der Kasus) <strong>fest</strong>: Man sagt z. B. „abhängen <strong>von</strong> + Dativ“ oder „bestehen <strong>aus</strong> + Dativ“. Diese Kombinationen lernst du am besten als <strong>Chunk</strong>.',
    whenToUse: `
      <p class="mb-3">Du brauchst Rektion, wenn du in Texten/Prüfungen präzise formulieren willst – ohne „falsche Präpositionen“:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Das hängt <strong>von</strong> den Umständen <strong>ab</strong>.</li>
        <li>Der Kurs besteht <strong>aus</strong> drei Teilen.</li>
        <li>Wir verzichten <strong>auf</strong> unnötige Details.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Merksatz:</p>
        <p class="text-sm mt-2">Nicht die „Logik“, sondern die <strong class="text-primary">Konvention</strong> entscheidet: Verb/Adjektiv/Nomen + Präposition + Kasus.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Typische Rektion (Auswahl):</h4>
          <ul class="space-y-2 ml-4">
            <li>abhängen <strong>von</strong> + Dat: Das hängt <strong>von dem</strong> Termin ab.</li>
            <li>bestehen <strong>aus</strong> + Dat: Die Prüfung besteht <strong>aus drei</strong> Teilen.</li>
            <li>teilnehmen <strong>an</strong> + Dat: Ich nehme <strong>an dem</strong> Kurs teil.</li>
            <li>verzichten <strong>auf</strong> + Akk: Wir verzichten <strong>auf den</strong> Plan.</li>
            <li>sich beziehen <strong>auf</strong> + Akk: Das bezieht sich <strong>auf die</strong> Frage.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Da-/wo- (B2-typisch):</p>
          <p class="text-sm">Wovon hängt das ab? – Es hängt <strong>davon</strong> ab. / Worauf beziehst du dich? – Ich beziehe mich <strong>darauf</strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: falsche Präposition</h4>
          <div class="space-y-2 text-sm">
            <p>✗ abhängen <strong>auf</strong></p>
            <p>✓ abhängen <strong>von</strong></p>
          </div>
        </div>
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: falscher Kasus</h4>
          <div class="space-y-2 text-sm">
            <p>✗ teilnehmen an <strong>den</strong> Kurs</p>
            <p>✓ teilnehmen an <strong>dem</strong> Kurs (an + Dativ)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Kombination als Einheit lernen (Verb/Adj/Nomen + Präposition)',
      'Kasus mitlernen (auf+Akk, an+Dat, von+Dat, …)',
      'Bei Pronomen: da-/wo- korrekt verwenden (darauf/worauf)',
    ],
    faq: [
      {
        question: 'Gibt es verlässliche Regeln für die Präposition?',
        answer:
          '<p>Nur selten. In den meisten Fällen musst du die Kombinationen als feste Einheiten lernen und häufig üben.</p>',
      },
      {
        question: 'Was ist der Unterschied zu „Verben mit Präposition“ (B1)?',
        answer:
          '<p>B2 geht stärker in die Tiefe: mehr formelle Verben, mehr Rektion + häufig da-/wo-Formen und typische Prüfungsfehler.</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // B2 - Adjektivdeklination: das System (vollständig)
  'b2-adjektivdeklination-system-komplett': {
    topicId: 'b2-adjektivdeklination-system-komplett',
    shortExplanation:
      'Die Adjektivdeklination folgt drei Mustern: <strong>stark</strong> (ohne Artikel), <strong>schwach</strong> (mit der/die/das) und <strong>gemischt</strong> (mit ein-). Entscheidend ist: <strong>Wer „zeigt“ Kasus/Genus?</strong>',
    whenToUse: `
      <p class="mb-3">Du brauchst das vollständige System, wenn du in Texten korrekt und sicher formulieren willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>mit bestimmten Artikeln: <em>den neu<strong>en</strong> Vertrag</em></li>
        <li>mit unbestimmten Artikeln: <em>ein neu<strong>er</strong> Vertrag</em></li>
        <li>ohne Artikel: <em>neu<strong>er</strong> Vertrag</em></li>
        <li>in Dativ/Genitiv: <em>mit neu<strong>em</strong> Vertrag</em>, <em>wegen neu<strong>er</strong> Regeln</em></li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Prinzip:</p>
        <p class="text-sm mt-2">Wenn der Artikel Kasus/Genus schon deutlich markiert → Adjektiv eher <strong class="text-primary">schwach</strong> (-e/-en). Wenn nicht → Adjektiv übernimmt Markierung (<strong class="text-primary">stark</strong>).</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Schnell-Orientierung (sehr praxisnah):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>der/die/das</strong> → meistens <strong>-e/-en</strong>: der gut<strong>e</strong>, den gut<strong>en</strong>, dem gut<strong>en</strong> …</li>
            <li><strong>ein-/kein-/mein-</strong> → Mischung: ein gut<strong>er</strong> (Nom m.), einen gut<strong>en</strong> (Akk m.), einem gut<strong>en</strong> (Dat m.)</li>
            <li><strong>ohne Artikel</strong> → starke Endungen: gut<strong>er</strong> Wein, gut<strong>e</strong> Idee, gut<strong>es</strong> Wetter, mit gut<strong>em</strong> Wein</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">B2-Merktipp:</p>
          <p class="text-sm">Achte zuerst auf den Artikel. Wenn er „alles zeigt“, ist das Adjektiv oft „kurz“ (-e/-en). Wenn er wenig zeigt, muss das Adjektiv stärker markieren.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Endungen „raten“ statt System anwenden</h4>
          <div class="space-y-2 text-sm">
            <p>✗ mit ein neu<strong>es</strong> Auto</p>
            <p>✓ mit ein<strong>em</strong> neu<strong>en</strong> Auto (Dativ)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Artikeltyp erkennen: der-/ein-/kein Artikel',
      'Kasus bestimmen (Nom/Akk/Dat/Gen)',
      'Danach Endung wählen (schwach/gemischt/stark)',
    ],
    faq: [
      {
        question: 'Was ist der häufigste „Knackpunkt“ auf B2?',
        answer:
          '<p>Dativ/Genitiv + „ein-“ sowie Pluralformen („mit den gut<strong>en</strong> Leuten“, „wegen gut<strong>er</strong> Gründe“).</p>',
      },
      {
        question: 'Muss ich das komplett auswendig lernen?',
        answer:
          '<p>Du brauchst kein perfektes Tabellen-Auswendiglernen, aber ein stabiles Entscheidungsprinzip + viel Übung (genau dafür sind Lückentexte ideal).</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // B2 - Passiv vertieft
  'b2-passiv-vertieft': {
    topicId: 'b2-passiv-vertieft',
    shortExplanation:
      'Auf B2 erweiterst du das Passiv über das Präsens hinaus: <strong>Präteritum</strong>, <strong>Perfekt</strong> und typische Strukturen mit Modalverben. Außerdem unterscheidest du sicher zwischen <strong>Vorgangspassiv</strong> und <strong>Zustandspassiv</strong>.',
    whenToUse: `
      <p class="mb-3">Du brauchst vertieftes Passiv besonders in formellen Texten, Anleitungen, Nachrichten und Prüfungen:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Der Antrag <strong>wird</strong> online <strong>ausgefüllt</strong>. (Präsens)</li>
        <li>Der Antrag <strong>wurde</strong> gestern <strong>abgeschickt</strong>. (Präteritum)</li>
        <li>Der Antrag <strong>ist</strong> schon <strong>abgeschickt worden</strong>. (Perfekt)</li>
        <li>Die Daten <strong>müssen</strong> gespeichert <strong>werden</strong>. (Modalverb)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Vorgangspassiv (werden):</p>
        <p class="text-sm mt-2"><strong class="text-primary">werden</strong> + Partizip II (Prozess/Handlung)</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Zeitformen im Passiv (Beispiele):</h4>
          <ul class="space-y-2 ml-4">
            <li>Präsens: Der Vertrag <strong>wird</strong> unterschrieben.</li>
            <li>Präteritum: Der Vertrag <strong>wurde</strong> unterschrieben.</li>
            <li>Perfekt: Der Vertrag <strong>ist</strong> unterschrieben <strong>worden</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Zustandspassiv (sein):</p>
          <p class="text-sm">Der Vertrag <strong>ist</strong> unterschrieben. (Ergebnis/Zustand: „fertig“)</p>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Mit Modalverben:</h4>
          <ul class="space-y-2 ml-4">
            <li>Die Aufgabe <strong>muss</strong> gemacht <strong>werden</strong>.</li>
            <li>Das Formular <strong>kann</strong> online ausgefüllt <strong>werden</strong>.</li>
          </ul>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „worden“ im Perfekt vergessen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Der Antrag ist abgeschickt.</p>
            <p>✓ Der Antrag ist abgeschickt <strong>worden</strong>. (Vorgang/Passiv)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Vorgangspassiv: werden + Partizip II',
      'Perfekt Passiv: sein + Partizip II + <strong>worden</strong>',
      'Zustandspassiv nur für Ergebnis: sein + Partizip II',
      'Mit Modalverb: Partizip II + werden am Ende',
    ],
    faq: [
      {
        question: 'Wann ist „ist gemacht“ korrekt?',
        answer:
          '<p>Wenn du den <strong>Zustand</strong> meinst (fertig/erledigt). Für den Prozess nutzt du „wird gemacht“.</p>',
      },
      {
        question: 'Warum heißt es „ist gemacht worden“?',
        answer:
          '<p>Das ist Perfekt im Vorgangspassiv: „sein“ trägt die Zeitform, „worden“ zeigt Passiv.</p>',
      },
    ],
    exerciseSection: 'Passiv',
  },

  // B2 - Nominalisierung / Nominalphrasen
  'b2-nominalisierung': {
    topicId: 'b2-nominalisierung',
    shortExplanation:
      'Bei der <strong>Nominalisierung</strong> machst du aus Verben/Adjektiven <strong>Nomen</strong> („entscheiden“ → „die Entscheidung“, „wichtig“ → „die Wichtigkeit“). Das ist typisch für formelle Texte und verdichtet Information.',
    whenToUse: `
      <p class="mb-3">Du nutzt Nominalisierung besonders …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>in formellen Texten (E-Mail, Bericht, Bewerbung)</li>
        <li>für kompakte, „sachliche“ Formulierungen</li>
        <li>um Sätze zu verkürzen: weniger Verben, mehr Nomen</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Umformungen:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li>Verb → Nomen: entscheiden → <strong>die Entscheidung</strong></li>
          <li>Adjektiv → Nomen: wichtig → <strong>die Wichtigkeit</strong></li>
          <li>Satz → Phrase: „Wir diskutieren“ → „die Diskussion“</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (vergleich):</h4>
          <ul class="space-y-2 ml-4">
            <li>Verb-Stil: Wir <strong>entscheiden</strong> morgen.</li>
            <li>Nominalstil: Die <strong>Entscheidung</strong> fällt morgen.</li>
            <li>Verb-Stil: Wir <strong>analysieren</strong> die Daten.</li>
            <li>Nominalstil: Die <strong>Analyse</strong> der Daten erfolgt morgen.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Warnung (B2 realistisch):</p>
          <p class="text-sm">Nominalstil kann schnell schwer lesbar werden. Nutze ihn gezielt – nicht in jedem Satz.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: zu viele Nomen hintereinander</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Die Durchführung der Implementierung der Optimierung …</p>
            <p>✓ Wir optimieren und implementieren … (oder: klare, kurze Nominalgruppen)</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Nominalisierung nur dort einsetzen, wo sie wirklich verdichtet',
      'Nominalgruppen nicht zu lang werden lassen',
      'Artikel/Kasus der neuen Nomen korrekt setzen',
    ],
    faq: [
      {
        question: 'Ist Nominalisierung immer „besser“?',
        answer:
          '<p>Nein. Sie wirkt formeller, aber oft auch schwerer. Gute Texte mischen Verb-Stil und Nominalstil.</p>',
      },
      {
        question: 'Woran erkenne ich Nominalstil?',
        answer:
          '<p>An vielen Nomen, häufigen Endungen wie -ung/-tion/-heit/-keit und weniger Verben.</p>',
      },
    ],
    exerciseSection: 'Nominalstil',
  },

  // B2 - Erweiterter Genitivgebrauch
  'b2-genitiv-erweiterung': {
    topicId: 'b2-genitiv-erweiterung',
    shortExplanation:
      'Auf B2 nutzt du den <strong>Genitiv</strong> sicherer: nach bestimmten Präpositionen („während“, „trotz“, „wegen“), in festen Wendungen und zur präzisen Zuordnung („die Bedeutung <strong>des</strong> Wortes“).',
    whenToUse: `
      <p class="mb-3">Du brauchst den Genitiv, wenn du …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Besitz/Zugehörigkeit ausdrückst: die Farbe <strong>des</strong> Autos</li>
        <li>formelle Präpositionen nutzt: <strong>während</strong> des Kurses</li>
        <li>formell schreibst (Prüfung/Brief/Bericht)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Genitiv-Präpositionen:</p>
        <p class="text-sm mt-2"><strong class="text-primary">während</strong>, <strong class="text-primary">trotz</strong>, <strong class="text-primary">wegen</strong>, <strong class="text-primary">innerhalb</strong>, <strong class="text-primary">außerhalb</strong>, <strong class="text-primary">anstatt/statt</strong></p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>während</strong> <strong>des</strong> Unterrichts</li>
            <li><strong>trotz</strong> <strong>der</strong> Probleme</li>
            <li><strong>wegen</strong> <strong>des</strong> Wetters (formell)</li>
            <li>die Bedeutung <strong>des</strong> Begriffs</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Hinweis:</p>
          <p class="text-sm">Im Alltag hört man teils Dativ („wegen dem Wetter“). Für Prüfungen und formelles Deutsch ist Genitiv meist sicherer.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Genitiv-Artikel falsch</h4>
          <div class="space-y-2 text-sm">
            <p>✗ während <strong>den</strong> Kurses</p>
            <p>✓ während <strong>des</strong> Kurses</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Genitiv-Präposition erkannt (während/trotz/wegen/…)',
      'Artikel korrekt: des/der (Genitiv)',
      'In formellen Texten Genitiv bevorzugen',
    ],
    faq: [
      {
        question: 'Ist „wegen dem“ immer falsch?',
        answer:
          '<p>Umgangssprachlich kommt Dativ vor. In vielen Prüfungs- und Standardkontexten gilt Genitiv als die sicherere Wahl.</p>',
      },
      {
        question: 'Wie erkenne ich Genitiv im Satz?',
        answer:
          '<p>Oft an den Artikeln <strong>des/der</strong> und bei mask./neutr. Nomen am <strong>-s/-es</strong>: „des Tag<strong>es</strong>“.</p>',
      },
    ],
    exerciseSection: 'Genitiv',
  },

  // C1 - Komplexer Satzbau
  'c1-komplexer-satzbau': {
    topicId: 'c1-komplexer-satzbau',
    shortExplanation:
      'Auf C1 geht es um <strong>komplexe Satzstrukturen</strong>: verschachtelte Nebensätze, längere Satzklammern, präzise Vorfeldgestaltung und saubere Kommasetzung – ohne dass der Satz unlesbar wird.',
    whenToUse: `
      <p class="mb-3">Du brauchst komplexen Satzbau vor allem für anspruchsvolle Texte (Studium, Beruf, Argumentation):</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Begründungen, Einschränkungen und Gegenargumente sauber strukturieren</li>
        <li>Informationen verdichten, ohne Details zu verlieren</li>
        <li>Stil variieren (nicht nur kurze Hauptsätze)</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">C1-Strategie:</p>
        <p class="text-sm mt-2">Lieber <strong class="text-primary">klar strukturiert</strong> als maximal verschachtelt. Kommas helfen beim „Lesen“.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiel mit mehreren Ebenen:</h4>
          <ul class="space-y-2 ml-4">
            <li>
              Viele unterschätzen, <strong>dass</strong> man, <strong>wenn</strong> man unter Zeitdruck <strong>steht</strong>,
              Fehler macht, <strong>die</strong> sich später kaum korrigieren <strong>lassen</strong>.
            </li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Lesbarkeit erhöhen:</p>
          <p class="text-sm">Lange Vorfelder vermeiden, Nebensätze nicht unnötig stapeln, ggf. Satz teilen.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: zu viele Einschübe ohne Struktur</h4>
          <p class="text-sm">Wenn du den Satz beim Vorlesen nicht mehr kontrollierst, ist er zu lang – lieber teilen oder umstellen.</p>
        </div>
      </div>
    `,
    checklist: [
      'Nebensätze klar mit Kommas abgrenzen',
      'Satzklammer stabil halten (Verbpositionen stimmen)',
      'Lesbarkeit prüfen: notfalls Satz teilen',
    ],
    faq: [
      {
        question: 'Was ist ein guter Kompromiss auf C1?',
        answer:
          '<p>Komplexität ja – aber mit klarer Struktur. Ein sauberer, gut lesbarer Satz wirkt stärker als ein überladener Satz.</p>',
      },
      {
        question: 'Ist „verschachteln“ immer erwünscht?',
        answer:
          '<p>Nein. Es kommt auf Textsorte und Stil an. Gute C1-Texte variieren und bleiben verständlich.</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // C1 - Konjunktiv I in der Berichtssprache
  'c1-konjunktiv-1-berichtssprache': {
    topicId: 'c1-konjunktiv-1-berichtssprache',
    shortExplanation:
      'In der <strong>Berichtssprache</strong> nutzt man den <strong>Konjunktiv I</strong>, um Aussagen zu distanzieren: „Die Sprecherin erklärte, sie <strong>sei</strong> optimistisch.“ Das wirkt neutral und journalistisch.',
    whenToUse: `
      <p class="mb-3">Du verwendest Konjunktiv I besonders …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>in Berichten, Protokollen, wissenschaftlichen Texten</li>
        <li>wenn du Aussagen wiedergibst, ohne sie zu bewerten</li>
        <li>wenn du Quellen markierst: „laut …“, „sie erklärte …“</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Formen (3. Person):</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li>sein → er <strong class="text-primary">sei</strong>, sie <strong class="text-primary">sei</strong></li>
          <li>haben → er <strong class="text-primary">habe</strong></li>
          <li>werden → er <strong class="text-primary">werde</strong></li>
          <li>kommen → er <strong class="text-primary">komme</strong></li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele:</h4>
          <ul class="space-y-2 ml-4">
            <li>Er sagt, er <strong>sei</strong> krank.</li>
            <li>Die Expertin erklärt, die Lage <strong>habe</strong> sich verbessert.</li>
            <li>Der Sprecher betont, man <strong>werde</strong> reagieren.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Wenn Konjunktiv I nicht eindeutig ist:</p>
          <p class="text-sm">Dann weicht man oft auf Konjunktiv II aus: „Sie sagte, sie <strong>hätte</strong> keine Zeit.“</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Indikativ statt Berichtsdistanz</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Er sagt, er <strong>ist</strong> krank.</p>
            <p>✓ Er sagt, er <strong>sei</strong> krank.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Aussage wird wiedergegeben? → Konjunktiv I prüfen',
      'Besonders wichtig: Formen von sein/haben/werden',
      'Bei Unklarheit: Konjunktiv II als Ausweichform',
    ],
    faq: [
      {
        question: 'Warum wirkt Konjunktiv I „formell“?',
        answer:
          '<p>Weil er in Standard- und Mediensprache die Distanz zur Aussage markiert („Berichtston“).</p>',
      },
      {
        question: 'Muss ich das im Alltag sprechen?',
        answer:
          '<p>Nicht zwingend. Für C1/Prüfung und formelle Texte ist es aber ein großer Pluspunkt.</p>',
      },
    ],
    exerciseSection: 'Konjunktiv',
  },

  // C1 - Funktionsverbgefüge
  'c1-funktionsverbgefuege': {
    topicId: 'c1-funktionsverbgefuege',
    shortExplanation:
      'Funktionsverbgefüge sind feste Kombinationen aus Nomen + „leichtem“ Verb (z. B. <strong>in Betracht ziehen</strong>, <strong>zur Verfügung stellen</strong>). Sie sind typisch für formelle, schriftliche Sprache.',
    whenToUse: `
      <p class="mb-3">Du nutzt Funktionsverbgefüge besonders …</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>in Berichten, Fachtexten, Bewerbungen</li>
        <li>um neutral/sachlich zu klingen</li>
        <li>um Varianz und Präzision im Ausdruck zu erhöhen</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Beispiele:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li>etwas <strong class="text-primary">in Betracht ziehen</strong> (= erwägen)</li>
          <li>etwas <strong class="text-primary">zur Verfügung stellen</strong> (= bereitstellen)</li>
          <li>eine Entscheidung <strong class="text-primary">treffen</strong> (= entscheiden)</li>
          <li>eine Maßnahme <strong class="text-primary">ergreifen</strong> (= handeln)</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele im Satz:</h4>
          <ul class="space-y-2 ml-4">
            <li>Wir ziehen mehrere Optionen <strong>in Betracht</strong>.</li>
            <li>Die Unterlagen werden Ihnen <strong>zur Verfügung gestellt</strong>.</li>
            <li>Die Regierung ergreift Maßnahmen, um …</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Stil-Tipp:</p>
          <p class="text-sm">Übertreibe es nicht: Zu viele Funktionsverbgefüge machen Texte schwerfällig.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: freie Kombination statt feste Wendung</h4>
          <div class="space-y-2 text-sm">
            <p>✗ eine Entscheidung <strong>machen</strong></p>
            <p>✓ eine Entscheidung <strong>treffen</strong></p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Wendung als feste Einheit lernen',
      'Kasus/Präposition beachten (in Betracht ziehen, zur Verfügung stellen)',
      'Dosiert einsetzen (Lesbarkeit!)',
    ],
    faq: [
      {
        question: 'Ist das dasselbe wie „Nomen-Verb-Verbindungen“?',
        answer:
          '<p>Verwandt: Funktionsverbgefüge sind eine besonders typische, formelle Untergruppe fester Nomen-Verb-Kombinationen.</p>',
      },
      {
        question: 'Bringt das Punkte in Prüfungen?',
        answer:
          '<p>Es kann den Ausdruck aufwerten, wenn es korrekt und passend eingesetzt wird (vor allem in schriftlichen Texten).</p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // C1 - Feste Verbindungen
  'c1-feste-verbindungen': {
    topicId: 'c1-feste-verbindungen',
    shortExplanation:
      '„Feste Verbindungen“ sind typische Wortkombinationen (Kollokationen), die im Deutschen so „üblich“ sind: <strong>eine Rolle spielen</strong>, <strong>in Frage stellen</strong>, <strong>großen Wert legen auf</strong>.',
    whenToUse: `
      <p class="mb-3">Du nutzt feste Verbindungen, um natürlicher, idiomatischer und präziser zu formulieren:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Das spielt eine wichtige <strong>Rolle</strong>.</li>
        <li>Man sollte die Ergebnisse <strong>in Frage stellen</strong>.</li>
        <li>Wir legen <strong>großen Wert</strong> auf Qualität.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Prinzip:</p>
        <p class="text-sm mt-2">Nicht jedes Wort lässt sich frei kombinieren. Gute C1-Texte nutzen <strong class="text-primary">typische Kollokationen</strong> statt „übersetztem“ Deutsch.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (Auswahl):</h4>
          <ul class="space-y-2 ml-4">
            <li>eine Entscheidung <strong>treffen</strong></li>
            <li>eine Maßnahme <strong>ergreifen</strong></li>
            <li>eine Aussage <strong>treffen</strong> / eine Aussage <strong>machen</strong> (je nach Kontext)</li>
            <li>etwas <strong>in Frage stellen</strong></li>
            <li>großen Wert <strong>auf</strong> etwas legen</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">C1-Strategie:</p>
          <p class="text-sm">Beim Lesen gezielt Kollokationen markieren und als „Bausteine“ wiederverwenden.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: „wörtliche Übersetzung“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ starken Wert <strong>machen</strong> auf</p>
            <p>✓ großen Wert <strong>legen</strong> auf</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Kollokation als Einheit merken (Verb + Nomen + Präposition)',
      'Nicht „frei“ variieren (sonst unidiomatisch)',
      'Im Zweifel: Beispiele/Corpus/Lesetexte als Referenz nutzen',
    ],
    faq: [
      {
        question: 'Wie lerne ich das effizient?',
        answer:
          '<p>Mit Listen + Kontext: Jede Verbindung mit 1–2 Beispielsätzen speichern und regelmäßig aktiv verwenden (Schreiben/Sprechen).</p>',
      },
      {
        question: 'Sind Redewendungen dasselbe?',
        answer:
          '<p>Teilweise überlappend. „Feste Verbindungen“ können neutral sein (Kollokationen), Redewendungen sind oft bildhaft/idiomatisch.</p>',
      },
    ],
    exerciseSection: 'Verben',
  },

  // C1 - Verben mit Präposition (Advanced)
  'c1-verben-mit-praeposition-advanced': {
    topicId: 'c1-verben-mit-praeposition-advanced',
    shortExplanation:
      'Auf C1 geht es um <strong>präzise</strong> und oft <strong>formelle</strong> Verb-Präposition-Kombinationen (inkl. Kasus): z. B. „absehen <strong>von</strong> + Dativ“, „sich befassen <strong>mit</strong> + Dativ“, „sich berufen <strong>auf</strong> + Akkusativ“.',
    whenToUse: `
      <p class="mb-3">Du brauchst diese Verben besonders in Texten, Argumentationen und formeller Kommunikation:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Wir sehen <strong>von</strong> weiteren Schritten <strong>ab</strong>.</li>
        <li>Ich befasse mich <strong>mit</strong> dem Thema.</li>
        <li>Er beruft sich <strong>auf</strong> seine Erfahrung.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">C1-Merksatz:</p>
        <p class="text-sm mt-2">Präposition + Kasus sind <strong class="text-primary">fest</strong>. Fehler wirken sofort unprofessionell → konsequent als Einheit lernen.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Typische Advanced-Kombinationen:</h4>
          <ul class="space-y-2 ml-4">
            <li>absehen <strong>von</strong> + Dat: Wir sehen <strong>von dem</strong> Plan ab.</li>
            <li>sich befassen <strong>mit</strong> + Dat: Ich befasse mich <strong>mit der</strong> Frage.</li>
            <li>sich berufen <strong>auf</strong> + Akk: Er beruft sich <strong>auf das</strong> Gesetz.</li>
            <li>sich orientieren <strong>an</strong> + Dat: Wir orientieren uns <strong>an den</strong> Vorgaben.</li>
            <li>bestehen <strong>aus</strong> + Dat: Der Text besteht <strong>aus</strong> drei Teilen.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Da-/wo- (C1 sicher beherrschen):</p>
          <p class="text-sm">Wovon siehst du ab? – Ich sehe <strong>davon</strong> ab. / Worauf berufst du dich? – Ich berufe mich <strong>darauf</strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Präposition oder Kasus „nach Gefühl“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ sich berufen <strong>an</strong> …</p>
            <p>✓ sich berufen <strong>auf</strong> …</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Verb + Präposition + Kasus als Einheit speichern',
      'Bei Pronomen: da-/wo- korrekt anwenden',
      'In Texten aktiv einsetzen (nicht nur passiv erkennen)',
    ],
    faq: [
      {
        question: 'Wie finde ich heraus, welche Präposition richtig ist?',
        answer:
          '<p>Am zuverlässigsten über Wörterbuch/Beispiele. Dann als Chunk lernen und in eigenen Sätzen wiederholen.</p>',
      },
      {
        question: 'Warum sind diese Verben wichtig?',
        answer:
          '<p>Sie sind typisch für formelle Texte und Argumentationen. Korrekte Rektion verbessert Stil, Präzision und Bewertung in C1-Kontexten.</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },
    // C1 - Komplexe präpositionale Ausdrücke
  'c1-komplexe-praepositionsausdruecke': {
    topicId: 'c1-komplexe-praepositionsausdruecke',
    shortExplanation:
      'Komplexe Präpositionen sind <strong>mehrteilige Ausdrücke</strong> wie „<strong>in Bezug auf</strong>“, „<strong>im Hinblick auf</strong>“, „<strong>im Rahmen von</strong>“. Sie sind typisch für formelle Texte und haben oft eine <strong>feste Rektion</strong> (Kasus).',
    whenToUse: `
      <p class="mb-3">Du nutzt komplexe Präpositionen, wenn du in formellen Texten präzise und „schriftsprachlich“ formulieren willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Bezug:</strong> in Bezug auf / hinsichtlich</li>
        <li><strong>Rahmen:</strong> im Rahmen von</li>
        <li><strong>Vergleich/Gegensatz:</strong> im Vergleich zu / im Gegensatz zu</li>
        <li><strong>Zusammenhang:</strong> im Zusammenhang mit</li>
        <li><strong>Grund/Folge:</strong> aufgrund / infolge / angesichts</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Wichtig:</p>
        <p class="text-sm mt-2">Komplexe Präpositionen funktionieren wie „normale“ Präpositionen – aber sie sind <strong class="text-primary">feste Einheiten</strong> und verlangen oft einen <strong class="text-primary">bestimmten Kasus</strong>.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Sehr typische Muster (mit Beispielen):</h4>
          <ul class="space-y-2 ml-4">
            <li><strong>in Bezug auf</strong> + Akk: In Bezug auf <strong>die</strong> Kosten gibt es Fragen.</li>
            <li><strong>im Hinblick auf</strong> + Akk: Im Hinblick auf <strong>die</strong> Prüfung ist das wichtig.</li>
            <li><strong>im Zusammenhang mit</strong> + Dat: Im Zusammenhang mit <strong>dem</strong> Projekt gab es Probleme.</li>
            <li><strong>im Vergleich zu</strong> + Dat: Im Vergleich zu <strong>dem</strong> Vorjahr sind die Zahlen besser.</li>
            <li><strong>im Rahmen von</strong> + Dat: Im Rahmen <strong>von dem</strong> Kurs üben wir das.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Genitiv in formellen Texten (häufig):</p>
          <p class="text-sm">„<strong>aufgrund</strong> des Wetters“, „<strong>infolge</strong> des Streiks“, „<strong>angesichts</strong> der Lage“ (in der Standardsprache).</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 1: Kasus „nach Gefühl“</h4>
          <div class="space-y-2 text-sm">
            <p>✗ in Bezug auf <strong>dem</strong> Thema</p>
            <p>✓ in Bezug auf <strong>das</strong> Thema (Akk)</p>
          </div>
        </div>

        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler 2: Ausdruck zerlegen</h4>
          <p class="text-sm">Komplexe Präpositionen sind feste Einheiten – nicht frei umstellbar.</p>
        </div>
      </div>
    `,
    checklist: [
      'Ist der Ausdruck eine <strong>feste Präpositionseinheit</strong> (z. B. „in Bezug auf“)?',
      'Kasus prüfen: Akk (in Bezug auf), Dat (im Zusammenhang mit), ggf. Genitiv (aufgrund/angesichts)',
      'In formellen Texten bewusst einsetzen – nicht in jedem Satz',
    ],
    faq: [
      {
        question: 'Sind „hinsichtlich“ und „bezüglich“ auch komplexe Präpositionen?',
        answer:
          '<p>Ja, funktional schon: Sie verhalten sich wie Präpositionen (meist schriftsprachlich) und brauchen eine feste Ergänzung.</p>',
      },
      {
        question: 'Muss ich immer Genitiv nach „aufgrund/wegen“ verwenden?',
        answer:
          '<p>In formellen Texten ist Genitiv meist die sicherere Wahl. Umgangssprachlich kommt Dativ vor, aber in Prüfungen wird Genitiv oft bevorzugt.</p>',
      },
    ],
    exerciseSection: 'Präpositionen',
  },

  // C1 - Adjektivdeklination: komplexe Nominalgruppen
  'c1-adjektivdeklination-komplex': {
    topicId: 'c1-adjektivdeklination-komplex',
    shortExplanation:
      'In <strong>komplexen Nominalgruppen</strong> stehen oft mehrere Adjektive und Attribute vor dem Nomen. Regel: <strong>Jedes</strong> Adjektiv bekommt eine Endung – und die Endungen folgen dem gleichen Deklinationsmuster (stark/schwach/gemischt).',
    whenToUse: `
      <p class="mb-3">Du brauchst das auf C1 besonders in schriftlichen Texten mit langen Nominalgruppen:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>die <strong>neuen internationalen</strong> Studienprogramme</li>
        <li>mit dem <strong>sehr anspruchsvollen schriftlichen</strong> Teil</li>
        <li>wegen der <strong>plötzlich auftretenden technischen</strong> Probleme</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Grundregel:</p>
        <p class="text-sm mt-2">Wenn mehrere Adjektive vor dem Nomen stehen, bekommen sie <strong class="text-primary">die gleiche Endung</strong> (je nach Artikel + Kasus).</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (mit bestimmtem Artikel):</h4>
          <ul class="space-y-2 ml-4">
            <li>Nominativ: <strong>der</strong> gut<strong>e</strong> alt<strong>e</strong> Freund</li>
            <li>Akkusativ: Ich sehe <strong>den</strong> gut<strong>en</strong> alt<strong>en</strong> Freund.</li>
            <li>Dativ: Ich spreche mit <strong>dem</strong> gut<strong>en</strong> alt<strong>en</strong> Freund.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (gemischt, „ein-“):</h4>
          <ul class="space-y-2 ml-4">
            <li>ein interessant<strong>er</strong> neu<strong>er</strong> Kurs</li>
            <li>einen interessant<strong>en</strong> neu<strong>en</strong> Kurs</li>
            <li>mit einem interessant<strong>en</strong> neu<strong>en</strong> Kurs</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">C1-Tipp für lange Gruppen:</p>
          <p class="text-sm">Bestimme zuerst <strong>Artikeltyp</strong> + <strong>Kasus</strong>, dann hängen alle Adjektiv-Endungen daran. Nicht jedes Adjektiv „neu entscheiden“.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Endungen mischen</h4>
          <div class="space-y-2 text-sm">
            <p>✗ den neu<strong>e</strong> interessant<strong>en</strong> Kurs</p>
            <p>✓ den neu<strong>en</strong> interessant<strong>en</strong> Kurs</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Artikeltyp: der-/ein-/kein Artikel?',
      'Kasus bestimmen (Nom/Akk/Dat/Gen)',
      'Mehrere Adjektive → Endungen konsequent gleich halten',
      'Bei sehr langen Gruppen: ggf. Satz vereinfachen (Lesbarkeit)',
    ],
    faq: [
      {
        question: 'Muss jedes Adjektiv eine Endung bekommen?',
        answer:
          '<p>Ja, wenn es attributiv vor dem Nomen steht: „die neu<strong>en</strong> international<strong>en</strong> Programme“.</p>',
      },
      {
        question: 'Was ist das größte Risiko auf C1?',
        answer:
          '<p>Fehler passieren oft im Dativ/Genitiv und bei maskulinem Akkusativ („den … -en“). Dort besonders sorgfältig sein.</p>',
      },
    ],
    exerciseSection: 'Adjektive',
  },

  // C1 - Passivformen in komplexen Strukturen
  'c1-passiv-komplex': {
    topicId: 'c1-passiv-komplex',
    shortExplanation:
      'In komplexen Strukturen kombinierst du Passiv mit <strong>Nebensätzen</strong>, <strong>Modalverben</strong> und „unpersönlichem Passiv“. Wichtig ist die richtige <strong>Verbklammer</strong> am Satzende.',
    whenToUse: `
      <p class="mb-3">Du brauchst komplexes Passiv, wenn du formell und präzise über Prozesse sprichst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Nebensatz: …, weil die Daten gespeichert <strong>werden müssen</strong>.</li>
        <li>Unpersönlich: Es <strong>wird</strong> hier viel <strong>gearbeitet</strong>.</li>
        <li>Dativ-Verb: Es <strong>wird</strong> den Teilnehmenden <strong>geholfen</strong>.</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">C1-Fokus:</p>
        <p class="text-sm mt-2">In Nebensätzen landen oft <strong class="text-primary">mehrere Verbteile am Ende</strong>. Reihenfolge sauber halten.</p>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Unpersönliches Passiv:</h4>
          <ul class="space-y-2 ml-4">
            <li>Es <strong>wird</strong> viel <strong>diskutiert</strong>.</li>
            <li>Hier <strong>wird</strong> nicht <strong>geraucht</strong>.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-3">Passiv mit Modalverben (sehr wichtig):</h4>
          <ul class="space-y-2 ml-4">
            <li>Die Daten <strong>müssen</strong> gespeichert <strong>werden</strong>.</li>
            <li>Die Unterlagen <strong>sollen</strong> heute verschickt <strong>werden</strong>.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Nebensatz (Verb-Endstellung):</p>
          <p class="text-sm">…, weil die Unterlagen heute verschickt <strong>werden sollen</strong>.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Verbteile in falscher Reihenfolge</h4>
          <div class="space-y-2 text-sm">
            <p>✗ … weil die Daten gespeichert <strong>sollen werden</strong>.</p>
            <p>✓ … weil die Daten gespeichert <strong>werden sollen</strong>.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Passiv-Grundform: werden + Partizip II',
      'Mit Modal: Partizip II + werden (Ende) + Modal (im Nebensatz am Ende)',
      'Unpersönlich: „Es wird + Partizip II“ (wenn kein klares Subjekt existiert)',
      'Lesbarkeit prüfen: lange Verbketten ggf. umstellen',
    ],
    faq: [
      {
        question: 'Kann ich Passiv mit Dativverben bilden (helfen)?',
        answer:
          '<p>Ja, oft als unpersönliches Passiv: „Es wird ihm geholfen.“ Das Akkusativobjekt fehlt, deshalb nutzt man „es“ oder keinen Platzhalter.</p>',
      },
      {
        question: 'Warum steht „werden“ im Nebensatz so spät?',
        answer:
          '<p>Weil im Nebensatz die Verbteile gesammelt am Satzende stehen. Bei mehreren Verben wird die Reihenfolge entscheidend.</p>',
      },
    ],
    exerciseSection: 'Passiv',
  },

  // C1 - Nominalstil / Informationsverdichtung
  'c1-nominalstil': {
    topicId: 'c1-nominalstil',
    shortExplanation:
      'Nominalstil bedeutet <strong>Informationsverdichtung</strong>: weniger Verben, mehr Nomen und Attribute. Das ist typisch für Berichte, wissenschaftliche Texte und formelle Kommunikation – aber es darf nicht unverständlich werden.',
    whenToUse: `
      <p class="mb-3">Du nutzt Nominalstil, wenn du sachlich, kompakt und formal schreiben willst:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Bericht/Analyse: objektiver Ton</li>
        <li>Argumentation: präzise Begriffe statt „umgangssprachlicher“ Verben</li>
        <li>Zusammenfassungen: viel Inhalt in wenig Text</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Techniken der Verdichtung:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li><strong class="text-primary">Nominalisierung</strong> (entscheiden → Entscheidung)</li>
          <li><strong class="text-primary">Genitiv-/Präpositionalattribute</strong> (die Analyse <em>der</em> Daten / im Hinblick <em>auf</em> …)</li>
          <li><strong class="text-primary">Partizipialattribute</strong> (die <em>vorliegende</em> Studie, die <em>bereits erhobenen</em> Daten)</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiel (Verb-Stil → Nominalstil):</h4>
          <ul class="space-y-2 ml-4">
            <li>Verb-Stil: Wir <strong>analysieren</strong> die Daten und <strong>bewerten</strong> die Ergebnisse.</li>
            <li>Nominalstil: Die <strong>Analyse</strong> der Daten und die <strong>Bewertung</strong> der Ergebnisse <strong>erfolgen</strong> im nächsten Schritt.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">C1-Hinweis:</p>
          <p class="text-sm">Nominalstil ist ein Werkzeug. Wenn Nominalketten zu lang werden, verliert der Text Punkte (Unklarheit). Dann lieber mischen.</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Nominalketten ohne Struktur</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Die Durchführung der Optimierung der Implementierung der …</p>
            <p>✓ Wir optimieren und implementieren … / oder: klare, kurze Nominalgruppen</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Verdichtet der Nominalstil wirklich oder macht er den Satz nur länger?',
      'Nominalgruppen begrenzen (max. 2–3 Attribute, sonst umformulieren)',
      'Genitiv/Präpositionen korrekt setzen (der/des, in Bezug auf, im Zusammenhang mit)',
      'Mix aus Verb- und Nominalstil für Lesbarkeit',
    ],
    faq: [
      {
        question: 'Bringt Nominalstil in Prüfungen Vorteile?',
        answer:
          '<p>Ja, wenn er korrekt und dosiert eingesetzt wird: Er wirkt sachlich und professionell. Zu viel Nominalstil wirkt aber schnell schwerfällig.</p>',
      },
      {
        question: 'Wie erkenne ich „zu viel“ Nominalstil?',
        answer:
          '<p>Wenn du beim Lesen den Faden verlierst oder zu viele Nomen hintereinander stehen, ist es Zeit, den Satz zu vereinfachen.</p>',
      },
    ],
    exerciseSection: 'Nominalstil',
  },

  // C1 - Partizipialkonstruktionen
  'c1-partizipialkonstruktionen': {
    topicId: 'c1-partizipialkonstruktionen',
    shortExplanation:
      'Partizipialkonstruktionen verdichten Informationen mit <strong>Partizip I</strong> („lachend“) und <strong>Partizip II</strong> („gebaut“). Sie können als <strong>Attribut</strong> oder als verkürzter Nebensatz auftreten.',
    whenToUse: `
      <p class="mb-3">Du nutzt Partizipialkonstruktionen, um Sätze eleganter und kompakter zu machen:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Attribut: die <strong>laufenden</strong> Kosten / die <strong>geplante</strong> Reform</li>
        <li>Verdichtung: <em>In Berlin <strong>angekommen</strong>, …</em> (= nachdem ich angekommen bin)</li>
        <li>Formeller Stil: häufig in Berichten und schriftlichen Texten</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Unterschied:</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li><strong class="text-primary">Partizip I</strong> = gleichzeitig/aktiv: „die <em>arbeitenden</em> Menschen“</li>
          <li><strong class="text-primary">Partizip II</strong> = abgeschlossen/passiv: „die <em>geschlossenen</em> Türen“</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Als Attribut (mit Endungen):</h4>
          <ul class="space-y-2 ml-4">
            <li>die <strong>steigend<strong>en</strong></strong> Preise</li>
            <li>mit den <strong>bereits erhoben<strong>en</strong></strong> Daten</li>
            <li>der <strong>neu gebaut<strong>e</strong></strong> Bahnhof</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Als „verkürzter Nebensatz“ (Verdichtung):</p>
          <p class="text-sm"><strong>In Berlin angekommen</strong>, suchte er sofort eine Wohnung. (= Nachdem er angekommen war …)</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: unklare „Bezugsperson“</h4>
          <p class="text-sm mb-2">Partizipialkonstruktionen müssen klar zeigen, <strong>wer</strong> die Handlung ausführt.</p>
          <div class="space-y-2 text-sm">
            <p>✗ In Berlin angekommen, wurde das Hotel gebucht. (Wer ist angekommen?)</p>
            <p>✓ In Berlin angekommen, <strong>buchte er</strong> das Hotel.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Partizip I = gleichzeitig/aktiv, Partizip II = abgeschlossen/passiv',
      'Bei Attributen: Endungen korrekt deklinieren (wie Adjektive)',
      'Bei Verdichtung: Bezugsperson eindeutig machen',
      'Wenn es unklar wird: lieber Nebensatz nutzen',
    ],
    faq: [
      {
        question: 'Sind Partizipialkonstruktionen Pflicht auf C1?',
        answer:
          '<p>Nicht „Pflicht“, aber sie verbessern Stil und Verdichtung – wenn sie korrekt und verständlich eingesetzt werden.</p>',
      },
      {
        question: 'Kann ich das im gesprochenen Deutsch nutzen?',
        answer:
          '<p>Als Attribute ja („die geplante Reise“). Verkürzte Konstruktionen sind eher schriftlich/formell.</p>',
      },
    ],
    exerciseSection: 'Satzbau',
  },

  // C1 - Genitivgebrauch in gehobener Sprache
  'c1-genitiv-gehobene-sprache': {
    topicId: 'c1-genitiv-gehobene-sprache',
    shortExplanation:
      'In gehobener Sprache wird der <strong>Genitiv</strong> nicht nur nach Präpositionen genutzt, sondern auch als <strong>Genitivobjekt</strong> bei bestimmten Verben/Adjektiven („sich einer Sache bewusst sein“, „einer Sache bedürfen“) und in festen Wendungen.',
    whenToUse: `
      <p class="mb-3">Du nutzt diesen Genitiv vor allem in formellen Texten und anspruchsvollen Argumentationen:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Genitivobjekt: Wir <strong>gedenken</strong> <strong>der</strong> Opfer.</li>
        <li>Adjektiv + Genitiv: Er ist sich <strong>seiner</strong> Verantwortung bewusst.</li>
        <li>formelle Präpositionen: angesichts <strong>der</strong> Lage, infolge <strong>des</strong> Streiks</li>
      </ul>
    `,
    rules: `
      <div class="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <p class="font-bold text-lg">Typische Genitiv-Verben/Adjektive (C1):</p>
        <ul class="mt-2 space-y-1 text-sm ml-4">
          <li><strong class="text-primary">gedenken</strong> + Genitiv: Wir gedenken <em>der</em> Verstorbenen.</li>
          <li><strong class="text-primary">bedürfen</strong> + Genitiv: Das Projekt bedarf <em>einer</em> klaren Struktur.</li>
          <li><strong class="text-primary">sich bewusst sein</strong> + Genitiv: Sie ist sich <em>der</em> Risiken bewusst.</li>
          <li><strong class="text-primary">sich sicher sein</strong> + Genitiv: Ich bin mir <em>des</em> Ergebnisses sicher.</li>
        </ul>
      </div>

      <div class="space-y-6 text-sm">
        <div>
          <h4 class="font-semibold text-lg mb-3">Beispiele (gehobener Stil):</h4>
          <ul class="space-y-2 ml-4">
            <li>Angesichts <strong>der</strong> aktuellen Situation ist Vorsicht geboten.</li>
            <li>Der Plan bedarf <strong>einer</strong> Überarbeitung.</li>
            <li>Wir gedenken <strong>der</strong> Opfer.</li>
          </ul>
        </div>

        <div class="p-4 bg-muted/50 rounded-lg">
          <p class="text-sm font-semibold mb-2">Stilhinweis:</p>
          <p class="text-sm">Genitivobjekte wirken formell. In Alltagssprache wird oft anders umformuliert (z. B. „Wir erinnern an …“ statt „gedenken“).</p>
        </div>
      </div>
    `,
    commonMistakes: `
      <div class="space-y-4">
        <div class="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
          <h4 class="font-semibold mb-2">Fehler: Dativ statt Genitiv bei festen Mustern</h4>
          <div class="space-y-2 text-sm">
            <p>✗ Wir gedenken <strong>den</strong> Opfern.</p>
            <p>✓ Wir gedenken <strong>der</strong> Opfer.</p>
          </div>
        </div>
      </div>
    `,
    checklist: [
      'Genitiv-Präpositionen (angesichts/aufgrund/infolge/…) korrekt',
      'Genitivobjekte erkennen (gedenken, bedürfen, sich bewusst sein …)',
      'Artikel/Pronomen im Genitiv sicher: des/der/eines/einer, seiner/ihrer',
      'Nur einsetzen, wenn es zur Textsorte passt (formell)',
    ],
    faq: [
      {
        question: 'Welche Genitiv-Verben sind am wichtigsten für C1?',
        answer:
          '<p>Sehr typisch sind „gedenken“, „bedürfen“ sowie Wendungen wie „sich einer Sache bewusst sein“ und „sich einer Sache sicher sein“.</p>',
      },
      {
        question: 'Warum lohnt sich das für SEO/Übungen?',
        answer:
          '<p>Genitiv ist ein häufiger Prüfungs- und Stilbereich auf C1: Viele Lernende suchen gezielt nach „Genitiv C1“, „Genitivobjekt“, „gehobene Sprache“.</p>',
      },
    ],
    exerciseSection: 'Genitiv',
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
