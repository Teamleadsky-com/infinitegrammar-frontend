import { describe, it, expect } from 'vitest';
import {
  diffExercise,
  exercisesDiffer,
  formatCost,
  formatHmm,
  formatSeconds,
  formatTokens,
  iterationLabel,
  parseInline,
  parseMarkdown,
  pctOf,
  shortIterationLabel,
  splitPlaceholders,
  splitSentences,
  verdictGroup,
} from './pipelineTrace';

describe('iteration labels (spec §5.5.3)', () => {
  it('names iteration 0 and the repair iterations of each stage', () => {
    expect(iterationLabel('gap_checks', 0)).toBe('Verifier: L1 format rules → solver pair + judge → adjudicator on disputed gaps');
    expect(iterationLabel('gap_checks', 2)).toBe('Gap repair 2 → full re-check → strict G3 of the repaired gaps');
    expect(iterationLabel('final_gate', 1)).toBe('Repair 1 → gap checks → G6 → gate');
    expect(iterationLabel('novelty', 1)).toBe('Re-draft from the second scene (not checked again)');
    expect(iterationLabel('premise', 0)).toBe('Scene premise: the model writes 5 scenes; local rules pick one');
    expect(shortIterationLabel('coherence', 1)).toBe('Text repair 1');
  });

  it('falls back for stages it does not know', () => {
    expect(iterationLabel('other', 0)).toBe('Iteration 0');
    expect(shortIterationLabel('other', 3)).toBe('Iteration 3');
  });
});

describe('verdict groups', () => {
  it.each([
    ['passed', 'passed'], ['done', 'passed'], ['retry', 'retry'], ['failed', 'failed'],
    ['error', 'other'], ['pending', 'other'], ['unknown', 'other'],
  ])('%s counts as %s', (verdict, group) => {
    expect(verdictGroup(verdict)).toBe(group);
  });
});

describe('formatting', () => {
  it('formats shares, durations, tokens and costs, with "–" for missing values', () => {
    expect(pctOf(116, 152)).toBe('76%');
    expect(pctOf(1, 157)).toBe('<1%');
    expect(pctOf(0, 152)).toBe('0%');
    expect(pctOf(3, 0)).toBe('–');
    expect(formatSeconds(null)).toBe('–');
    expect(formatSeconds(42.4)).toBe('42 s');
    expect(formatSeconds(950.1)).toBe('16 min');
    expect(formatSeconds(7747.7)).toBe('2 h 09 min');
    expect(formatHmm(7747.7)).toBe('2:09');
    expect(formatHmm(null)).toBe('–');
    expect(formatTokens(950)).toBe('950');
    expect(formatTokens(4321)).toBe('4.3k');
    expect(formatTokens(2_500_000)).toBe('2.5M');
    expect(formatCost(0.001880)).toBe('$0.0019');
    expect(formatCost(0.058252)).toBe('$0.058');
    expect(formatCost(7.682462)).toBe('$7.68');
  });
});

describe('exercise versions', () => {
  const before = {
    text: 'Wir [1] zur Bank. Deshalb wollen wir ein billigeres Auto kaufen. Morgen [2] ich mit dem Bus.',
    gaps: [
      { no: 1, correct: 'gehen', distractors: ['gehe', 'gehst', 'geht'], explanation: 'wir gehen' },
      { no: 2, correct: 'fahre', distractors: ['fährst', 'fährt', 'fahren'], explanation: 'ich fahre' },
    ],
  };

  it('splits sentences with their punctuation and closing quotes', () => {
    expect(splitSentences('Er sagt: „Komm!“ Dann geht er. Ende')).toEqual(['Er sagt: „Komm!“ ', 'Dann geht er. ', 'Ende']);
  });

  it('finds changed gaps and sentences', () => {
    const after = {
      text: 'Wir [1] zur Bank. Deshalb kaufen wir ein billigeres Auto. Morgen [2] ich mit dem Bus.',
      gaps: [
        before.gaps[0],
        { no: 2, correct: 'fahre', distractors: ['fährst', 'fährt', 'fahrt'], explanation: 'Bei „ich“: fahre' },
        { no: 3, correct: 'neu', distractors: ['a', 'b', 'c'], explanation: 'x' },
      ],
    };
    const diff = diffExercise(after, before);
    expect(diff.gaps).toEqual({ 2: ['distractors', 'explanation'], 3: ['added'] });
    expect([...diff.changedSentences]).toEqual(['Deshalb kaufen wir ein billigeres Auto.']);
    expect(exercisesDiffer(after, before)).toBe(true);
    expect(exercisesDiffer(before, { ...before })).toBe(false);
    expect(exercisesDiffer(before, null)).toBe(false);
  });
});

describe('prompts and rules', () => {
  it('marks placeholders but not JSON examples', () => {
    expect(splitPlaceholders('Fix {failing gaps} in {grammar_section}. Format: {"text": "..."}')).toEqual([
      { text: 'Fix ', placeholder: false },
      { text: '{failing gaps}', placeholder: true },
      { text: ' in ', placeholder: false },
      { text: '{grammar_section}', placeholder: true },
      { text: '. Format: {"text": "..."}', placeholder: false },
    ]);
  });

  it('parses the Markdown of rules texts', () => {
    const md = [
      '## G5 — format (deterministic, L1)',
      '',
      'Checked without any model by `evals/verifier/rules.py`:',
      '',
      '| Check id | Rule | Bad example |',
      '|---|---|---|',
      '| `schema` | text is non-empty | missing explanation |',
      '| `gap_count` | 5–7 gaps | 10 gaps |',
      '',
      '- first item',
      '  continues here',
      '- second item',
      '',
      'Budget = floor(fraction × number of gaps).',
    ].join('\n');
    expect(parseMarkdown(md)).toEqual([
      { type: 'heading', level: 2, text: 'G5 — format (deterministic, L1)' },
      { type: 'paragraph', text: 'Checked without any model by `evals/verifier/rules.py`:' },
      { type: 'table', header: ['Check id', 'Rule', 'Bad example'], rows: [['`schema`', 'text is non-empty', 'missing explanation'], ['`gap_count`', '5–7 gaps', '10 gaps']] },
      { type: 'list', items: ['first item continues here', 'second item'] },
      { type: 'paragraph', text: 'Budget = floor(fraction × number of gaps).' },
    ]);
    expect(parseInline('a `code` and **bold** and *it*')).toEqual([
      { text: 'a ' }, { text: 'code', style: 'code' }, { text: ' and ' }, { text: 'bold', style: 'bold' },
      { text: ' and ' }, { text: 'it', style: 'italic' },
    ]);
  });
});
