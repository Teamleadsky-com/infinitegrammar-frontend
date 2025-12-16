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
