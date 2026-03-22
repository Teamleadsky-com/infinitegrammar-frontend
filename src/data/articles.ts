export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  htmlContent: string;
  datePublished: string;
  dateModified: string;
}

export const articles: Article[] = [
  {
    slug: 'why-infinitegrammar-focuses-on-exam-grammar',
    title: 'Why InfiniteGrammar.de Started with Exam-Driven Grammar Demand',
    excerpt: 'The real question was not "How do I build a German learning app?" It was: where is there a repeated, high-stakes need for much more grammar practice than the market usually provides?',
    datePublished: '2026-03-01T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>When I started InfiniteGrammar.de, the key question was not "How do I build a German learning app?"</p>

<p>The real question was narrower:</p>

<blockquote>Where is there a repeated, high-stakes need for much more grammar practice than the market usually provides?</blockquote>

<p>The answer was not "German learners in general."</p>

<p>It was learners preparing for recognised exams such as <strong>telc</strong> and <strong>TestDaF</strong>.</p>

<p>That distinction matters.</p>

<p>A large part of this demand is not casual. People need certificates for university admission, professional pathways, visa and residence processes, and sometimes citizenship-related requirements. At that point, B1, B2 and C1 stop being abstract CEFR labels. They become thresholds with consequences.</p>

<p>That changes the product problem completely.</p>

<figure class="article-figure">
<img src="/images/articles/level-selection.png" alt="InfiniteGrammar level selection showing CEFR levels A1 through C1" />
<figcaption>The product is structured around CEFR levels A1 through C1 — the same levels that define exam thresholds.</figcaption>
</figure>

<p>This is no longer open-ended language learning. It is preparation under constraints:</p>

<ul>
<li>a CEFR level has to be reached,</li>
<li>the result is externally evaluated,</li>
<li>the timeline is usually fixed,</li>
<li>and weak areas become visible very quickly.</li>
</ul>

<h2>The bottleneck is usually not the rule itself</h2>

<p>Exam preparation makes one thing painfully clear.</p>

<p>Many learners already know the rule they are failing to apply.</p>

<p>They have seen adjective endings before. They know that certain verbs require specific prepositions. They understand subordinate clause word order. They have encountered passive forms, nominalisation, or Konjunktiv structures.</p>

<p>But that does not mean they can use them reliably.</p>

<p>Recognition is not the same as performance.</p>

<p>What exam-oriented learners often need is not one more explanation. They need enough repetitions for a grammar pattern to become usable under pressure, in context, across many variations.</p>

<p>That is especially visible at <strong>B1, B2 and C1</strong>. At those levels grammar stops being mainly about isolated forms and starts becoming about controlled use inside denser sentences, formal registers, and exam-style text tasks.</p>

<h2>The market gap is not grammar content in general</h2>

<p>If the problem were simply "learners need grammar," the market would already be serving it reasonably well.</p>

<p>There is no shortage of grammar material:</p>

<ul>
<li>textbooks explain the rules,</li>
<li>prep books organise content by exam level,</li>
<li>apps provide broad progression,</li>
<li>teachers and blogs cover common pain points.</li>
</ul>

<p>The scarce resource is something more specific:</p>

<p><strong>Depth of targeted practice for one narrow grammar section.</strong></p>

<p>That means the real product unit is not "German B2." It is something much smaller and much more actionable:</p>

<ul>
<li>B2 verbs with fixed prepositions,</li>
<li>B1 adjective declension in context,</li>
<li>C1 nominalisation in formal written German,</li>
<li>B2 connectors inside text-level logic,</li>
<li>C1 passive constructions in academic or administrative contexts.</li>
</ul>

<p>This is where the supply side gets thin.</p>

<p>A learner can usually find an explanation. A learner can often find a small worksheet. A learner can sometimes find broad mixed practice. What is much harder to find is <strong>hundreds of contextual exercises for one precise grammar area</strong>, with enough variation to build fluency rather than recognition.</p>

<p>That is the gap InfiniteGrammar.de explores.</p>

<h2>Why gap-fill became the core format</h2>

<p>The product is built around gap-fill exercises with several blanks, multiple answer options, and explanations.</p>

<p>Gap-fill sits close to the actual failure mode in exam preparation. The learner is not being asked whether they vaguely know the rule. They are being asked to apply it in context, under constraint, while distinguishing the correct form from nearby alternatives.</p>

<p>That makes the format useful for two reasons.</p>

<p>First, it is close enough to real exam pressure to be relevant. Second, it is structured enough to scale as a content system.</p>

<p>The product is not trying to imitate telc or TestDaF directly. But the task design and the scenario design are clearly shaped by the fact that many learners work toward those kinds of exams.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-gap-fill.png" alt="A B2 gap-fill exercise with blanks embedded in a German text about working from home" />
<figcaption>A B2 gap-fill exercise. The learner selects the correct verb form from four options for each blank — the same task structure used in telc and TestDaF exams.</figcaption>
</figure>

<h2>Why the content model is CEFR x grammar section x scenario</h2>

<p>A second early decision was to structure content across three axes at once:</p>

<ol>
<li><strong>CEFR level</strong></li>
<li><strong>Grammar section</strong></li>
<li><strong>Content topic used in telc and TestDaF exams</strong></li>
</ol>

<p>The CEFR layer keeps the system legible. The grammar-section layer makes practice precise enough to matter. The scenario layer keeps the exercises from collapsing into abstract drills.</p>

<p>This matters because grammar alone is not the whole learning unit. Vocabulary domain, sentence frame, and communicative situation all change how sticky a grammar pattern becomes.</p>

<p>The topic layer is therefore not decoration. It is part of the transfer logic.</p>

<p>It also supports the exam-oriented use case. Many scenarios sit close to domains that repeatedly matter in preparation and later real life: work, education, housing, bureaucracy, formal communication, applications, and public life.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-overview.png" alt="Grammar reference overview with quick quizzes across levels and topics" />
<figcaption>The grammar reference page organises content by level and topic — quick tests let learners target specific grammar areas directly.</figcaption>
</figure>

<h2>Why the product had to go deeper rather than broader</h2>

<p>A lot of language products optimise for breadth. They cover many topics and give a small number of tasks for each.</p>

<p>That is easy to market and weak in use.</p>

<p>The more useful direction here was the opposite: depth.</p>

<p>The product goal became:</p>

<blockquote>Make it possible for a learner to stay inside one grammar area long enough to get meaningful repetition without immediately cycling through the same exercise patterns.</blockquote>

<p>That decision quietly shaped almost everything that came later:</p>

<ul>
<li>narrower grammar sections,</li>
<li>more exercises per section,</li>
<li>explanations on every gap,</li>
<li>analytics for coverage,</li>
<li>similarity analysis to detect redundancy,</li>
<li>and section-based retention instead of generic reminders.</li>
</ul>

<p>This is one of those cases where product strategy quietly commits you to infrastructure. Once the promise becomes "targeted depth," you need a way to produce depth, measure depth, and keep depth from degenerating into repetition.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-sections-b2.png" alt="B2 grammar sections showing categories like Satzbau, Zeiten & Modi, and Verben & Ergänzungen with multiple topics each" />
<figcaption>The B2 grammar reference: 9 sections across categories like sentence structure, tenses, and verb complements. Each section links to explanations and exercises.</figcaption>
</figure>

<h2>What this means in product terms</h2>

<p>The product decision was:</p>

<blockquote>Build a system that can provide high-volume, scenario-grounded, level-specific grammar practice exactly where exam pressure is real and existing materials become shallow.</blockquote>

<p>Once the problem was framed that way, the rest of the system followed naturally:</p>

<ul>
<li>LLM generation became worth exploring,</li>
<li>explanations became mandatory,</li>
<li>similarity analysis became necessary,</li>
<li>the admin area needed coverage and demand views,</li>
<li>and retention needed to be tied to grammar sections rather than generic engagement loops.</li>
</ul>

<p>InfiniteGrammar.de started from a narrow but persistent gap.</p>

<p>Not lack of German grammar content.</p>

<p>Lack of enough targeted practice for grammar to become usable under pressure.</p>
`
  },
  {
    slug: 'gap-fill-quality-distractor-problem',
    title: 'Gap-Fill Exercise Quality Is a Distractor Design Problem',
    excerpt: 'A grammar gap-fill exercise looks deceptively simple. A short text, a few blanks, four options per blank. But what separates a useful exercise from a weak one is usually the quality of the wrong answers.',
    datePublished: '2026-03-05T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>A grammar gap-fill exercise looks deceptively simple.</p>

<p>A short text. A few blanks. Four options per blank. One explanation after submission.</p>

<p>That sounds like easy content to generate.</p>

<p>It is not.</p>

<p>For exam-oriented German learners, especially around B1, B2 and C1, this format sits close to the real failure mode. The learner is not being asked whether they have seen the rule before. They are being asked to apply it in context, while separating the correct form from nearby alternatives.</p>

<p>That is exactly why the format is useful. It is also why quality is hard.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-dropdown-open.png" alt="A gap-fill exercise with a dropdown showing four verb form options: müssten, muss, musste, müsste" />
<figcaption>A B2 Konjunktiv II exercise with the dropdown open. The learner chooses between four verb forms — all real German words, but only one fits this exact sentence.</figcaption>
</figure>

<h2>The format is simple. The specification is not.</h2>

<p>A single exercise in InfiniteGrammar.de is a short text with multiple gaps. Each gap has:</p>

<ul>
<li>one correct answer,</li>
<li>three distractors,</li>
<li>and one explanation in German.</li>
</ul>

<p>That only sounds routine until the quality bar is made explicit.</p>

<p>For one exercise to be publishable, it has to do all of the following at once:</p>

<ul>
<li>test the intended grammar section rather than a neighbouring rule,</li>
<li>stay inside the intended CEFR band in both grammar and vocabulary,</li>
<li>contain one answer that is clearly correct in context,</li>
<li>contain distractors that are plausible enough to be worth choosing,</li>
<li>and explain the underlying rule rather than merely validating the local answer.</li>
</ul>

<p>That combination is tight.</p>

<p>A draft can look fine and still fail in important ways. A distractor may be acceptable in spoken German. The sentence may drift into vocabulary difficulty rather than grammar difficulty. The explanation may restate the answer instead of teaching the rule. The sentence may be grammatical but still sound unnatural enough that a native speaker would reject it.</p>

<p>So the problem is not just generation.</p>

<p>It is specification under ambiguity.</p>

<h2>The real product surface is the distractor set</h2>

<p>The correct answer is usually the easy part.</p>

<p>If the grammar target is narrow enough, the surrounding sentence often constrains the correct form quite strongly.</p>

<p>What separates a useful exercise from a weak one is usually the quality of the wrong answers.</p>

<p>A distractor has to do three things at the same time:</p>

<ol>
<li>be plausible in German,</li>
<li>be wrong in this exact sentence,</li>
<li>and represent a mistake that a learner at this level might realistically make.</li>
</ol>

<p>That is much more demanding than "three wrong options."</p>

<p>If the target is a verb with a fixed preposition, weak distractors are obviously unrelated. Strong distractors are prepositions that are common elsewhere and therefore genuinely tempting. If the target is adjective declension, the distractors should reflect nearby case, gender, or number confusions, not random morphology.</p>

<p>This is why I ended up treating the exercise format less as "text generation" and more as "error modelling."</p>

<p>The distractors define a large part of the learning value.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-submitted.png" alt="Exercise after submission showing red incorrect answers with correct answers displayed, and one green correct answer, with a score of 1/6" />
<figcaption>After submission: wrong answers appear in red with the correct form shown below. The score (1/6) and the visual feedback make both the learner's errors and the intended answers immediately visible.</figcaption>
</figure>

<h2>Generation had to start from a much narrower contract</h2>

<p>A broad request such as "generate a B2 German grammar exercise" is not useful.</p>

<p>It leaves too many degrees of freedom open:</p>

<ul>
<li>which sub-pattern inside the grammar section is being tested,</li>
<li>how difficult the distractors should be,</li>
<li>which register the text should use,</li>
<li>whether the scenario fits exam-oriented language use,</li>
<li>and whether the explanation teaches anything transferable.</li>
</ul>

<p>The generation setup became much more constrained.</p>

<p>Each request needs to specify:</p>

<ul>
<li>the grammar section,</li>
<li>the CEFR level,</li>
<li>the exercise format,</li>
<li>the number of gaps,</li>
<li>the answer structure,</li>
<li>the explanation requirement,</li>
<li>and the scenario or content topic.</li>
</ul>

<p>The scenario matters more than it may seem. It is one of the easiest ways to control vocabulary distribution, stylistic register, and the practical feel of the exercise. At B2 and C1 especially, the text should not sound like filler. It should feel close to the kinds of contexts learners actually meet in exam preparation and formal language use: administration, workplace communication, housing, education, applications, and structured written tasks.</p>

<h2>Why one-shot generation was not enough</h2>

<p>Even with a tighter prompt, one-shot generation produced too many flawed exercises.</p>

<p>The recurring issues were usually not dramatic. They were small defects with product consequences:</p>

<ul>
<li>inconsistent gap numbering,</li>
<li>malformed JSON,</li>
<li>explanations in the wrong language,</li>
<li>weak distractors,</li>
<li>answers that were technically correct but tested the wrong rule,</li>
<li>and edge cases where more than one option could be defended.</li>
</ul>

<p>That made a review step necessary.</p>

<p>The generation pipeline became a generate\u2013assess\u2013regenerate loop with shared history:</p>

<pre><code>messages = [system_prompt, generation_request]

exercise = call_llm(gen_model, messages, temperature=0.9)
messages.append({"role": "assistant", "content": exercise})

for iteration in range(max_iterations):
    messages.append({"role": "user", "content": assessment_prompt})
    assessment = call_llm(assess_model, messages, temperature=0.3)
    messages.append({"role": "assistant", "content": assessment})

    if '"status": "pass"' in assessment:
        return exercise, passed=True

    messages.append({"role": "user", "content": regeneration_prompt})
    exercise = call_llm(regen_model, messages, temperature=0.9)
    messages.append({"role": "assistant", "content": exercise})</code></pre>

<p>The important design choice is the shared <code>messages</code> array.</p>

<p>Without that shared context, regeneration is basically just another attempt. With it, the model sees the draft, the critique, and the reasons the exercise failed. That at least makes targeted repair possible.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-explanations.png" alt="Explanations view showing each gap with its correct answer and a detailed German grammar explanation" />
<figcaption>The explanations view. Each gap shows the correct answer and a detailed explanation of the underlying grammar rule — not just what is correct, but why the alternatives are wrong.</figcaption>
</figure>

<h2>What the loop is good at</h2>

<p>The loop improves a lot of things reliably.</p>

<p>It is good at structural defects:</p>

<ul>
<li>missing fields,</li>
<li>broken formatting,</li>
<li>inconsistent numbering,</li>
<li>output-contract violations,</li>
<li>obvious mismatches between the grammar section and the actual gaps.</li>
</ul>

<p>It is also reasonably good at catching extreme level mismatches. If an A2 exercise suddenly contains unexpectedly advanced syntax, or a B2 exercise collapses into something too elementary, the assessment step often catches that.</p>

<p>That matters, because these are exactly the defects that make generated content unusable at scale.</p>

<h2>What the loop is not good enough at</h2>

<p>The harder failures are linguistic rather than structural.</p>

<p>This is where the uncomfortable limitation appears.</p>

<p>The model can still approve subtly wrong German: constructions that are almost right, distractors that are too plausible, explanations that validate a shaky answer, or sentence frames that are technically grammatical but not idiomatic enough.</p>

<p>The loop raises the floor. It does not guarantee correctness.</p>

<p>That is the important distinction.</p>

<p>For a learning product, "substantially better than raw generation" is useful. It is not the same as "reliably correct." And that difference matters because a learner who internalizes a wrong pattern is worse off than a learner who got no exercise at all.</p>

<h2>The loop is still worth having</h2>

<p>That limitation does not make the loop pointless.</p>

<p>Quite the opposite.</p>

<p>The loop is valuable because it turns implicit quality requirements into an explicit review contract. It forces the system to say, in operational terms, what a good exercise is supposed to be.</p>

<p>That already changes the quality of the output.</p>

<p>It also changes the way content generation is discussed. Once the rubric exists, the problem stops being "can the model generate German exercises?" and becomes "which classes of mistakes are structural, which are linguistic, and which still need another control layer?"</p>

<p>That is a much more useful question.</p>

<h2>The practical conclusion</h2>

<p>The format looks simple because the interface is simple.</p>

<p>The content problem is not.</p>

<p>A good gap-fill exercise is not just a short text with blanks. It is a compact system of constraints around grammar targeting, CEFR control, distractor quality, and explanation quality.</p>

<p>That is why exercise generation in InfiniteGrammar.de never became "just ask an LLM for content."</p>
`
  },
  {
    slug: 'batch-processing-exercise-generation',
    title: 'Batch Processing: Making Exercise Generation Practical',
    excerpt: 'The interesting part of the generation pipeline is not only the prompt. It is the operating model around the prompt \u2014 throughput, resumability, and cost discipline.',
    datePublished: '2026-03-10T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>The interesting part of the generation pipeline is not only the prompt.</p>

<p>It is the operating model around the prompt.</p>

<p>Once the product requirement becomes "generate and review hundreds of narrowly targeted grammar exercises, keep the output structured, retry weak drafts, and do it cheaply enough that the library can still expand," the main constraint stops being raw model capability.</p>

<p>It becomes throughput, resumability, and cost discipline.</p>

<p>That is why the generation system ended up as a batch-processing workflow.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-sections-b1.png" alt="B1 grammar sections showing 12 topics across sentence structure, tenses, verbs, prepositions, adjectives, and passive voice" />
<figcaption>Each grammar section at each CEFR level needs dozens of exercises — the batch pipeline is what makes producing this volume practical.</figcaption>
</figure>

<h2>The synchronous loop was fine for testing and bad for production</h2>

<p>The first version was synchronous:</p>

<ol>
<li>generate an exercise,</li>
<li>wait,</li>
<li>assess it,</li>
<li>if it fails, regenerate,</li>
<li>repeat until pass or retry limit.</li>
</ol>

<p>This is fine for prompt testing.</p>

<p>It is not especially good for building a content library.</p>

<p>One exercise is not one LLM call. It is potentially several: generation, assessment, and multiple regeneration-assessment cycles. Once this logic is multiplied across many exercises, the pipeline becomes expensive, slow to operate, and fragile to interruptions.</p>

<p>For a product built around depth section by section, that matters.</p>

<p>The question is not whether one exercise can be produced. The question is whether the content operation can run repeatedly and cheaply enough that the library keeps growing where coverage is thin.</p>

<h2>Batch processing fits the shape of the problem</h2>

<p>At any given moment, the system contains sets of exercises waiting for the next action:</p>

<ul>
<li>exercises waiting to be generated,</li>
<li>generated exercises waiting to be assessed,</li>
<li>failed exercises waiting to be regenerated.</li>
</ul>

<p>That makes the workflow look much more like a state machine than like a live conversational app.</p>

<p>A batch run therefore looks like this:</p>

<ol>
<li>initialize a run with grammar sections and content topics,</li>
<li>submit generation jobs,</li>
<li>collect outputs and mark them <code>pending_assessment</code>,</li>
<li>submit assessment jobs,</li>
<li>move passes to <code>completed</code>, failures to <code>pending_regeneration</code>,</li>
<li>repeat until everything is either <code>completed</code> or <code>dropped</code>.</li>
</ol>

<p>The important point is that the logic is <strong>run-level</strong>, not request-level.</p>

<p>That is where batch processing becomes useful. It turns the pipeline from a sequence of blocking calls into a controlled asynchronous workflow.</p>

<h2>The state file became the actual control surface</h2>

<p>Once the workflow moved into batch mode, the most important artifact was no longer the prompt alone.</p>

<p>It was the state file.</p>

<p>Each run is stored as a structured JSON document that records configuration, exercise state, intermediate outputs, and outcomes.</p>

<p>A simplified entry looks like this:</p>

<pre><code>{
  "id": "ex-0001",
  "iteration": 1,
  "status": "completed",
  "grammar_section": { "id": "adjektivdeklination_einstieg", "level": "A2" },
  "content_topic": { "id": "freizeit_10_wochenende" },
  "current_exercise": "{...}",
  "assessment": "{\\"status\\": \\"pass\\", \\"explanation\\": \\"\\"}",
  "exercise_id": "5f866f44-faea-4f04-a319-9fe9d1f6a960"
}</code></pre>

<p>At run level, the file also stores aggregate counts:</p>

<pre><code>{
  "stats": {
    "total": 100,
    "pending_generation": 0,
    "pending_assessment": 80,
    "pending_regeneration": 0,
    "dropped": 0,
    "completed": 20
  }
}</code></pre>

<p>This is not just an implementation detail.</p>

<p>The state file is what makes the whole process resumable and inspectable. If a batch finishes while the main process is offline, or a run is interrupted halfway through, the pipeline can resume from state rather than reconstructing its position from partial outputs.</p>

<p>That matters because content generation at this scale is not one transaction. It is a multi-step operation that can span hours or days.</p>

<h2>The same model still runs the loop</h2>

<p>One point is worth stating clearly.</p>

<p>The system does not depend on one model for generation and another for assessment. In practice, the same model is used for generation, assessment, and regeneration.</p>

<p>What changes between the steps is not the model family. It is the role, temperature, and message history.</p>

<ul>
<li>generation runs with more variation,</li>
<li>assessment runs with more consistency,</li>
<li>regeneration gets the critique and another chance to repair the draft.</li>
</ul>

<p>Conceptually, the logic is still simple:</p>

<pre><code>messages = [system_prompt, generation_request]
exercise = call_llm(model, messages, temperature=1.0)

for iteration in range(max_iterations):
    assessment = call_llm(model, messages + [assessment_prompt], temperature=0.3)
    if assessment_passes(assessment):
        break
    exercise = call_llm(model, messages + [regeneration_prompt], temperature=1.0)</code></pre>

<p>The important thing is that in production this logic is staged into batches rather than executed inline.</p>

<p>So the per-exercise logic stays conversational, while the run-level system stays asynchronous.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-b2-infinitiv.png" alt="A B2 Infinitivs\u00e4tze exercise with six gaps to fill in" />
<figcaption>The output of the pipeline: a structured gap-fill exercise with multiple blanks, each with its own set of options and a correct answer.</figcaption>
</figure>

<h2>The economics are what made this worthwhile</h2>

<p>This was the practical reason for building the batch workflow.</p>

<p>The cost is low enough to make library expansion realistic: roughly <strong>\u20AC0.03 per exercise</strong> using OpenAI Batch API.</p>

<p>That number matters because the product strategy depends on depth. If each grammar section needs many exercises rather than a few, generation cost is part of the product model, not an accounting footnote.</p>

<p>The other useful number is completion rate.</p>

<p>A good working expectation is that roughly <strong>85 exercises out of 100</strong> pass the loop within <strong>5 retries</strong>. The rest are dropped.</p>

<p>That tells two stories at once.</p>

<p>First, the system is productive enough to grow the library. Second, the loop is not magical. A visible share of drafts still fail the quality gate even after several retries.</p>

<p>That drop rate is not just waste. It is a signal about how hard the specification really is.</p>

<h2>What batch processing solves and what it does not</h2>

<p>Batch processing solves a practical problem.</p>

<p>It makes large-scale content generation cheap enough, resumable enough, and structured enough to be useful as an ongoing operation.</p>

<p>What it does <strong>not</strong> solve is correctness.</p>

<p>A completed exercise is an exercise that passed the pipeline. It is not a proof that the exercise is perfect.</p>

<p>That distinction matters.</p>

<p>The state machine makes production practical. It does not remove the deeper quality problem. The pipeline can still approve weak or subtly wrong exercises. It can still drop drafts that are perhaps salvageable. It can still route borderline content through several retries before it passes.</p>

<p>So the real contribution of the batch system is not "better exercises."</p>

<p>It is this:</p>

<blockquote>It makes the economics and the workflow of exercise production realistic enough that the product can keep expanding while still enforcing a non-trivial review loop.</blockquote>
`
  },
  {
    slug: 'measuring-exercise-diversity',
    title: 'Measuring Exercise Diversity Needed More Than Sentence Embeddings',
    excerpt: 'After a grammar section contains enough material, a new question appears. Are these genuinely different exercises, or just many versions of the same one? Off-the-shelf sentence embeddings were not especially useful here.',
    datePublished: '2026-03-12T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>After a grammar section contains enough material, a new question appears.</p>

<p>Are these genuinely different exercises, or just many versions of the same one?</p>

<p>That sounds straightforward until you try to measure it.</p>

<p>Off-the-shelf sentence embeddings were not especially useful here. Two exercises can be semantically close because they both describe travel while testing different grammar. They can also be semantically distant while still feeling repetitive to a learner because the sentence structure, gap pattern, and answer morphology are nearly identical.</p>

<p>What mattered operationally was not "topic similarity" in the generic NLP sense.</p>

<p>It was something more specific:</p>

<blockquote>How likely is a learner to experience these two exercises as redundant?</blockquote>

<figure class="article-figure">
<img src="/images/articles/exercise-b2-infinitiv.png" alt="A B2 gap-fill exercise with six blanks" />
<figcaption>Two exercises can use different words and topic contexts while still repeating the same sentence structure, gap pattern, and answer morphology. That kind of repetition is what the similarity system needs to detect.</figcaption>
</figure>

<h2>A single embedding answered the wrong question</h2>

<p>The failure mode of plain sentence embeddings was easy to spot.</p>

<ul>
<li>Same topic, different grammar \u2192 similarity too high</li>
<li>Different topic, same grammatical scaffold \u2192 similarity too low</li>
</ul>

<p>That is a poor fit for a product where repetition is often structural rather than semantic.</p>

<p>An exercise about travel and an exercise about housing may feel very different topically while still drilling the same pattern in almost the same way. From a learning point of view, that is not enough variation.</p>

<p>So the similarity model had to be decomposed.</p>

<h2>Similarity had to be treated as a multi-part signal</h2>

<p>The representation used in the pipeline combines four feature blocks.</p>

<h3>1. Word-level TF-IDF on the filled-in text</h3>

<p>This captures lexical overlap and topic repetition.</p>

<p>If two exercises repeatedly use the same vocabulary field, this block will show it.</p>

<h3>2. Character n-grams on the correct answers</h3>

<p>This captures morphological overlap.</p>

<p>Two exercises can differ in surrounding nouns and verbs while still testing nearly identical inflection patterns. Character n-grams help expose that.</p>

<h3>3. Structural features</h3>

<p>This block includes things such as:</p>

<ul>
<li>gap count,</li>
<li>average answer length,</li>
<li>text length,</li>
<li>average gap position,</li>
<li>distractor count,</li>
<li>and vocabulary-richness proxies.</li>
</ul>

<p>This is not glamorous, but it matters. Exercises can become repetitive simply because they are shaped the same way.</p>

<h3>4. POS n-grams via spaCy</h3>

<p>This is where the syntactic scaffold becomes visible.</p>

<p>Two exercises can use different words and still repeat the same clause pattern, agreement mechanics, and target-slot position. POS n-grams are a practical way to capture that without building a full symbolic grammar engine.</p>

<p>In simplified form, the weighting looks like this:</p>

<pre><code>FEATURE_WEIGHTS = {
    "text_tfidf": 0.35,
    "answers_char_ngrams": 0.25,
    "structure": 0.15,
    "pos_ngrams": 0.25,
}</code></pre>

<p>Each block is normalized independently, weighted, concatenated, and then compared using cosine similarity.</p>

<p>The important point is not the exact coefficients.</p>

<p>The important point is that the model of similarity is explicitly multi-view. It encodes what "too similar" means for this product.</p>

<h2>Why spaCy mattered here</h2>

<p>spaCy was useful because perceived repetition is often structural.</p>

<p>Two exercises can use different nouns and verbs while still repeating the same scaffold. For example, two sentences may both drill the same dative pattern in the same syntactic slot. A learner will often experience those as highly related even if a semantic model does not.</p>

<p>That is where POS n-grams help.</p>

<p>They do not solve the whole problem. They simply add a missing dimension that plain semantic similarity tends to miss.</p>

<h2>Pairwise cosine scores are necessary and not sufficient</h2>

<p>Raw pairwise similarity is useful, but not yet operational.</p>

<p>A section with 40 exercises already has 780 pairs. A list of scores is not editorial support.</p>

<p>That is why the pipeline stores both pairwise similarities and higher-level aggregates:</p>

<ul>
<li>section-level mean, median, and max similarity,</li>
<li>distribution buckets,</li>
<li>per-exercise max similarity,</li>
<li>and clustering structures for visualization.</li>
</ul>

<figure class="article-figure">
<img src="/images/articles/grammar-sections-b2.png" alt="B2 grammar sections showing categories like Satzbau, Zeiten, Verben" />
<figcaption>Each grammar section contains dozens of exercises. With 780 pairwise comparisons in a 40-exercise section, raw similarity scores need aggregation to be useful.</figcaption>
</figure>

<p>The bucket view became especially useful in the admin area:</p>

<ul>
<li><code>0\u20130.10</code></li>
<li><code>0.10\u20130.25</code></li>
<li><code>0.25\u20130.50</code></li>
<li><code>0.50\u20130.75</code></li>
<li><code>>0.75</code></li>
</ul>

<p>The last bucket is the action bucket.</p>

<p>Anything above roughly <code>0.5</code> deserves direct review as a near-duplicate candidate.</p>

<h2>Clustering made the output legible</h2>

<p>Clustering was the step that made the similarity system easier to trust.</p>

<p>The pipeline stores a SciPy-compatible linkage matrix per section, and the frontend reconstructs it as a dendrogram. That makes families of related exercises visible quickly.</p>

<p>This matters because pairwise similarity is flat. It tells you that A and B are close. It does not tell you whether A and B are part of a larger cluster of five exercises that all merge at high similarity.</p>

<p>The dendrogram and the heatmap answer different questions:</p>

<ul>
<li>the <strong>heatmap</strong> shows where local overlap is dense,</li>
<li>the <strong>dendrogram</strong> shows whether the overlap forms a family,</li>
<li>the <strong>pair detail view</strong> answers whether the family is genuinely redundant or merely related.</li>
</ul>

<p>This progressive drill-down turned the metric from an abstract score into an editorial tool.</p>

<h2>The metric changed content planning</h2>

<p>The most practical effect of the similarity pipeline was that generation stopped being driven only by volume.</p>

<p>Before the metric, the instinct was easy: add more exercises where the library looks thin.</p>

<p>After the metric, the question became better:</p>

<ul>
<li>which sections are underfilled,</li>
<li>which sections are over-clustered,</li>
<li>which sections have enough items but not enough variation,</li>
<li>and where does the next batch need to change the internal shape of the set rather than simply increase count?</li>
</ul>

<p>That is a much better operating question.</p>

<h2>What the system still does not know</h2>

<p>The metric measures overlap.</p>

<p>It does <strong>not</strong> measure pedagogy directly. The pipeline does something important, but limited. It does not answer questions "is this a good learning sequence?" or "what is the completeness of the grammar section's exercises?"</p>

<p>It answers a more modest and still useful question:</p>

<blockquote>Where is the corpus likely to be repeating itself in ways that deserve editorial attention?</blockquote>

<p>That turned out to be an important step to making the content quality measurable and sequencing deliberate.</p>
`
  },
  {
    slug: 'similarity-calculation-vast-ai',
    title: 'Why Similarity Calculation Moved to Vast.ai',
    excerpt: 'Once the similarity pipeline became part of the operating routine, local execution stopped being attractive. A cheap remote CPU instance proved to be a better place for this than a laptop.',
    datePublished: '2026-03-15T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>Once the similarity pipeline became part of the operating routine, local execution stopped being attractive.</p>

<p>Similarity was no longer something I ran once in a while. It became something I wanted to run after a new generation batch, after reordering, and whenever a section started looking suspicious. At that point local execution became a friction point. Long CPU-heavy runs block the machine, get postponed, and eventually stop happening often enough.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-hub-overview.png" alt="Grammar hub showing quick quizzes and topic search across all CEFR levels" />
<figcaption>The grammar hub spans five CEFR levels with dozens of sections. Running similarity analysis across all of them regularly is what made remote compute necessary.</figcaption>
</figure>

<p>That is why I moved the similarity pipeline to Vast.ai.</p>

<p>The goal was simple:</p>

<blockquote>Make similarity runs cheap, resumable, and operationally easy enough that running them becomes routine.</blockquote>

<h2>What actually runs on Vast.ai</h2>

<p><code>vastai_similarity.py</code> extends the local similarity pipeline with two execution modes:</p>

<div class="table-wrapper">
<table>
<thead><tr><th>Method</th><th>How it works</th><th>Used for</th></tr></thead>
<tbody>
<tr><td><code>spacy</code></td><td>TF-IDF text vectors + answer vectors + structure vectors + spaCy POS-tag vectors</td><td>Production path</td></tr>
<tr><td><code>semantic</code></td><td>Neural embeddings from a remote Vast.ai endpoint such as <code>BAAI/bge-m3</code></td><td>Experimental</td></tr>
</tbody>
</table>
</div>

<p>Both methods write into the same similarity tables. The important difference is operational.</p>

<ul>
<li><code>spacy</code> stays on the same score range as the existing dashboards.</li>
<li><code>semantic</code> produces a very different score scale and is therefore not directly compatible with the current frontend views calibrated for the TF-IDF pipeline.</li>
</ul>

<p>The production path is <code>spacy</code> as it does the job well enough for the task. The <code>spacy</code> method does not need a GPU. It is mostly a CPU-heavy batch workload:</p>

<ul>
<li>build text TF-IDF vectors,</li>
<li>build answer TF-IDF vectors,</li>
<li>build structure vectors,</li>
<li>build POS-tag vectors with spaCy,</li>
<li>combine them,</li>
<li>compute pairwise cosine similarity,</li>
<li>compute summaries and clustering.</li>
</ul>

<p>That can be run locally. The issue is that it became annoyingly slow. A cheap remote CPU instance proved to be a better place for this than a laptop.</p>

<h2>The execution model</h2>

<p>The pipeline is built around a state file.</p>

<p>That decision matters more than the instance type.</p>

<p>The state file lives under <code>vastai_runs/</code>:</p>

<pre><code>vastai_runs/
  \u2514\u2500\u2500 vastai_sim_state_&lt;run_id&gt;.json</code></pre>

<p>The run follows the same structure regardless of where the compute happens:</p>

<ul>
<li><code>init</code> fetches scope and exercise data and writes the state file</li>
<li><code>run</code> computes vectors / embeddings and stores results in the state file</li>
<li><code>finalize</code> writes results into the database</li>
</ul>

<p>That gives the pipeline three useful properties.</p>

<h3>It is resumable</h3>

<p>If a run stops halfway through, the state file already contains completed sections. Re-running continues from where it stopped.</p>

<h3>Remote compute does not need DB credentials</h3>

<p>The remote instance reads the state file and writes back to the state file. It never talks to the production database.</p>

<h3>Final DB writes stay local</h3>

<p>The compute node can disappear after the job is done. Once the updated state file is back on the local machine, <code>finalize</code> can write the results later.</p>

<p>That is the core design.</p>

<h2>What is needed locally before using Vast.ai</h2>

<h3>1. Vast.ai CLI</h3>

<p>Install and configure the Vast.ai CLI locally. The end state should be that <code>vastai --help</code> works and that you are already authenticated.</p>

<h3>2. Python environment for the similarity script</h3>

<p>For the production <code>spacy</code> method:</p>

<pre><code>pip install spacy scikit-learn psycopg2-binary python-dotenv numpy scipy
python -m spacy download de_core_news_sm</code></pre>

<h3>3. Config file</h3>

<p>Example config for the recommended <code>spacy</code> method:</p>

<pre><code>{
  "similarity_config": {
    "grammar_section_id": null,
    "level": "A2"
  },
  "SpacySimilarity": {
    "method": "spacy",
    "skip_features": true,
    "weights": {
      "text": 0.50,
      "answers": 0.15,
      "structure": 0.15,
      "pos": 0.20
    }
  }
}</code></pre>

<p>The production-friendly default is to scope by <code>level</code> or <code>grammar_section_id</code> when testing, then broaden to all sections once the pipeline is behaving as expected.</p>

<h2>Running the production spacy method on Vast.ai</h2>

<h3>Step 1. Searching for a cheap CPU instance</h3>

<p>The <code>spacy</code> path is CPU-only. No GPU needed.</p>

<pre><code>vastai search offers 'cpu_cores>=8 num_gpus=0 dph&lt;0.10 reliability>0.95 inet_down>200' -o 'dph'</code></pre>

<div class="table-wrapper">
<table>
<thead><tr><th>Filter</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td><code>cpu_cores>=8</code></td><td>Enough cores to make the run meaningfully faster than a laptop</td></tr>
<tr><td><code>num_gpus=0</code></td><td>Keeps the instance cheap</td></tr>
<tr><td><code>dph&lt;0.10</code></td><td>Puts a budget ceiling on the search</td></tr>
<tr><td><code>reliability>0.95</code></td><td>Reduces the chance of the instance disappearing mid-run</td></tr>
<tr><td><code>inet_down>200</code></td><td>Makes dependency installation less painful</td></tr>
</tbody>
</table>
</div>

<h3>Step 2. Creating the instance</h3>

<p>Once an <code>OFFER_ID</code> is picked:</p>

<pre><code>vastai create instance &lt;OFFER_ID&gt; --disk 25</code></pre>

<p>The base image does not need to be special. The <code>deploy</code> action installs the required Python packages itself.</p>

<h3>Step 3. Initializing the run locally</h3>

<p>This step fetches the exercise data from the database and writes the state file locally.</p>

<pre><code>python vastai_similarity.py --config spacy_similarity_config.json --action init</code></pre>

<p>At this point the database has already done its job. The remote node will not need DB access.</p>

<h3>Step 4. Deploying the run to Vast.ai</h3>

<pre><code>python vastai_similarity.py --action deploy --run-id &lt;RUN_ID&gt; --instance-id &lt;INSTANCE_ID&gt;</code></pre>

<p>This action creates remote directories, uploads the scripts and the state file, installs dependencies, and starts the remote similarity job in the background.</p>

<p>What gets uploaded: the similarity calculation script and the state file. What does <strong>not</strong> get uploaded: <code>.env</code>, database credentials. That is deliberate.</p>

<h3>Step 5. Monitoring the remote run</h3>

<pre><code>python vastai_similarity.py --action logs --run-id &lt;RUN_ID&gt;</code></pre>

<h3>Step 6. Finalize locally</h3>

<pre><code>python vastai_similarity.py --action finalize --run-id &lt;RUN_ID&gt;</code></pre>

<p>This pulls the state file back from the instance via <code>scp</code> and writes the results to the database. That is the only step that writes to the database.</p>

<h3>Step 7. Destroying the instance</h3>

<pre><code>vastai destroy instance &lt;INSTANCE_ID&gt;</code></pre>

<p>This is easy to forget. It is also the easiest way to waste money on Vast.ai.</p>

<h2>What the deploy action actually does</h2>

<p>The remote workflow is implemented directly in the script. The core sequence is:</p>

<ul>
<li>ask Vast.ai for instance metadata,</li>
<li>derive SSH host and port,</li>
<li>create <code>/root/sim</code> and <code>/root/sim/vastai_runs</code>,</li>
<li>upload files with <code>scp</code>,</li>
<li>install Python dependencies,</li>
<li>start the job with <code>nohup</code> in the background,</li>
<li>persist remote metadata into the local state file.</li>
</ul>

<p>The remote start command:</p>

<pre><code>cd /root/sim && nohup python vastai_similarity.py --action run --run-id &lt;RUN_ID&gt; > job.log 2>&1 & echo "PID: $!"</code></pre>

<p>That is intentionally simple. No job queue, no orchestrator, no remote database access.</p>

<h2>Condensed: Setting up Vast.ai instances and running calculations</h2>

<p>The workflow is very straightforward, let me share it here.</p>

<pre><code># 0) Install the Vast.ai CLI
pip install vastai

# 1) Set your API key
# Get it from https://cloud.vast.ai/cli and paste it here
vastai set api-key YOUR_API_KEY

# 2) Create or upload an SSH key for new instances
# Simplest CLI path:
vastai create ssh-key --api-key YOUR_API_KEY

# 3) Search for an instance
# Cheap CPU box for generic Python / ETL / spaCy / data jobs
vastai search offers 'cpu_cores>=8 num_gpus=0 dph&lt;0.10 reliability>0.95 inet_down>200' -o 'dph'

# Or a single-GPU box for ML / embeddings / inference jobs
vastai search offers 'gpu_ram>=16 num_gpus=1 dph&lt;0.50 reliability>0.98 cuda_vers>=12.0 inet_down>500' -o 'dph'

# 4) Rent the machine
# Replace OFFER_ID with the first column from search results
# --image is required; --ssh and --direct make SSH access straightforward
vastai create instance OFFER_ID --image pytorch/pytorch --disk 30 --ssh --direct

# 5) Inspect the instance
vastai show instances
vastai show instance INSTANCE_ID --raw</code></pre>

<p>After the instance is up, connect using the SSH command shown by Vast.ai in the console / instance details.</p>

<pre><code>ssh -p SSH_PORT root@INSTANCE_IP

# 6) Copy your code to the machine
scp -P SSH_PORT -r ./your_project root@INSTANCE_IP:/root/work

# 7) Connect
ssh -p SSH_PORT root@INSTANCE_IP

# 8) Inside the instance: install deps and run your job
cd /root/work
pip install -r requirements.txt

# foreground
python your_script.py --arg1 value1

# or background
nohup python your_script.py --arg1 value1 > job.log 2>&1 &
tail -f job.log</code></pre>

<p>If you need a port from the remote machine on your laptop, use SSH port forwarding:</p>

<pre><code>ssh -p SSH_PORT root@INSTANCE_IP -L 8080:localhost:8080</code></pre>

<p>When the job is finished, copy results back and terminate the instance:</p>

<pre><code># 9) Copy results home
scp -P SSH_PORT root@INSTANCE_IP:/root/work/output.json ./output.json

# 10) Destroy the instance so billing stops
vastai destroy instance INSTANCE_ID</code></pre>

<p>Make sure to destroy the instance when done; stopping can reduce GPU cost, but destroying is the clean way to stop storage charges too.</p>
`
  },
  {
    slug: 'reordering-exercises-product-problem',
    title: 'Why Sequencing Exercises Became a Product Problem, Not Just an Optimization Problem',
    excerpt: 'Even a reasonably diverse section can feel repetitive if similar exercises appear back to back. A learner does not experience the corpus as a similarity matrix. A learner experiences it as a sequence.',
    datePublished: '2026-03-18T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>Once I had pairwise similarity scores for every exercise in a grammar section, a new problem became visible: even a reasonably diverse section can feel repetitive if similar exercises appear back to back.</p>

<p>A learner does not experience the corpus as a similarity matrix. A learner experiences it as a sequence. That shifted the question from "are these exercises too similar overall?" to:</p>

<blockquote>In what order should they appear so that practice feels varied without breaking learner progress?</blockquote>

<p>That turned out to be partly an optimisation task and partly a product-constraint problem.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-a2-sequence.png" alt="An A2 gap-fill exercise showing the learner experience as a linear sequence" />
<figcaption>Learners encounter exercises one after another. If consecutive exercises share the same structure and vocabulary, the section feels repetitive regardless of its overall diversity.</figcaption>
</figure>

<h2>Why order matters even when the content is acceptable</h2>

<p>A grammar section can contain thirty or forty individually acceptable exercises and still create a poor learning experience. If several consecutive exercises use the same content frame, the same sentence scaffold, or the same narrow variant of a grammar rule, the learner feels stuck repeating the same task \u2014 even if, measured globally, the section looks diverse.</p>

<p>Similarity analysis told me which pairs looked close. It did not tell me whether the learner would encounter those pairs consecutively. A content system that ignores order leaves part of the learning experience to chance.</p>

<h2>The optimisation objective</h2>

<p>The goal is to find an ordering that minimizes similarity between consecutive exercises:</p>

<pre><code>minimize = sum(similarity(ex_i, ex_i_plus_1) for i in range(n - 1))</code></pre>

<p>This is closely related to a travelling-salesman-style path problem. The search space grows too quickly for exact optimisation, so the real question is how to find a sequence that is clearly better than insertion order or random shuffle. I used a two-step heuristic.</p>

<h3>Step 1: greedy nearest-neighbour seeding</h3>

<p>Start from the most "central" exercise \u2014 the one with the highest average similarity to all others \u2014 and repeatedly append the least similar remaining exercise:</p>

<pre><code>start = int(np.argmax(sim_matrix.mean(axis=1)))

visited = [False] * n
sequence = [start]
visited[start] = True

for _ in range(n - 1):
    current = sequence[-1]
    best_next = min(
        (j for j in range(n) if not visited[j]),
        key=lambda j: sim_matrix[current][j]
    )
    sequence.append(best_next)
    visited[best_next] = True</code></pre>

<p>This produces a strong baseline quickly. It forces the sequence away from local similarity instead of inheriting generation order. But it leaves local defects behind, especially in sections with multiple internal clusters.</p>

<h3>Step 2: 2-opt improvement</h3>

<p>2-opt is a standard local-search heuristic. It tries reversing every possible segment and keeps the reversal if it reduces the total similarity cost:</p>

<pre><code>for i in range(n - 1):
    for j in range(i + 2, n):
        delta = 0.0
        if i > 0:
            delta -= sim_matrix[sequence[i - 1]][sequence[i]]
            delta += sim_matrix[sequence[i - 1]][sequence[j]]
        if j &lt; n - 1:
            delta -= sim_matrix[sequence[j]][sequence[j + 1]]
            delta += sim_matrix[sequence[i]][sequence[j + 1]]
        if delta &lt; -1e-9:
            sequence[i:j + 1] = sequence[i:j + 1][::-1]
            improved = True</code></pre>

<p>2-opt reliably cleans up the most visible local mistakes left by the greedy pass. Small runs of similar exercises become more evenly distributed without requiring an expensive exact solver.</p>

<p>Random shuffle, by comparison, is not a neutral baseline. If a section contains topic clusters, random order still tends to leave local runs of similar items. The difference between shuffled order and similarity-aware order is visible immediately in the dashboard heatmaps.</p>

<h2>The constraint that mattered more than the algorithm</h2>

<p>Learners progress through a grammar section in order. That progress is stored as the last completed exercise position. Reordering an entire section after learners have started it would break their progress pointer \u2014 they could re-encounter completed material, skip unseen material, or resume into a sequence that no longer makes sense.</p>

<p>So the reordering system has two modes:</p>

<ul>
<li><strong>complete mode</strong> \u2014 reorder the full section when no one has started it,</li>
<li><strong>untouched mode</strong> \u2014 reorder only exercises that no learner has completed yet.</li>
</ul>

<pre><code>touched_ids = db.fetch_touched_exercise_ids(conn, grammar_section_id)
locked = [ex for ex in all_exercises if str(ex['id']) in touched_ids]
free   = [ex for ex in all_exercises if str(ex['id']) not in touched_ids]</code></pre>

<p>The locked prefix keeps its positions. Only the remaining exercises are reordered. A global optimum that breaks learner continuity is not a good solution \u2014 a weaker local optimum that respects learner progress is the right product decision.</p>

<p>There is one additional detail at the boundary: the first free exercise is selected to be as dissimilar as possible from the last locked exercise, because that is exactly where the learner resumes. This reduces the chance that the learner returns into a near-duplicate of something they just completed.</p>

<h2>Two metrics make reordering decisions actionable</h2>

<p>Reordering without measurement is guesswork. The admin dashboard tracks two custom metrics that make the quality of each section\u2019s sequence visible and comparable across runs.</p>

<h3>Weighted Neighbourhood Score (WNS)</h3>

<p><strong>Weighted Neighbourhood Score (WNS)</strong> measures the weighted average similarity of each exercise to the next five exercises in the sequence. The weights decrease exponentially: the immediate next exercise contributes 50%, the one after that 25%, then 12.5%, 7.5%, and 5%. This reflects how learners actually perceive repetition \u2014 the immediate neighbour matters most.</p>

<p>Lower is better. The dashboard uses colour-coded thresholds to make this actionable at a glance:</p>

<ul>
<li><strong>green</strong> (WNS \u2264 0.20) \u2014 good sequence variety, no action needed,</li>
<li><strong>orange</strong> (WNS 0.35\u20130.50) \u2014 noticeable local repetition, reordering recommended,</li>
<li><strong>red</strong> (WNS > 0.50) \u2014 strong local repetition, reordering or content review needed.</li>
</ul>

<p>A WNS above 0.35 is the threshold that triggers a reordering recommendation in the dashboard.</p>

<h3>Ordering Quality Ratio (OQR)</h3>

<p><strong>Ordering Quality Ratio (OQR)</strong> is a rank-based metric that compares where adjacent-pair similarities sit within the full pairwise similarity distribution. It answers the question: are the exercises that happen to be neighbours in the sequence more or less similar than the average pair in the section?</p>

<p>The early version used a simple mean-ratio formula, but that turned out to be misleading \u2014 it shifted when the number of exercises changed even if the actual sequence quality did not. The current version is rank-based, which makes it scale-invariant and stable across sections of different sizes.</p>

<p>Lower is better. An OQR near 0 means adjacent pairs are drawn from the least similar end of the distribution \u2014 exactly what good sequencing should produce. The dashboard displays this alongside WNS, so the two metrics reinforce each other: WNS shows the absolute local similarity, and OQR shows whether the ordering is making efficient use of the available diversity.</p>

<h2>The dashboard ties it all together</h2>

<p>Both metrics are stored per similarity run in the <code>section_similarity_summary</code> table, alongside the exercise order snapshot that existed at the time of the run. That makes historical comparison meaningful: when comparing two runs, the dashboard shows each run\u2019s metrics against its own ordering, not today\u2019s.</p>

<p>The practical workflow is:</p>

<ol>
<li>Run similarity analysis for a section \u2014 the dashboard shows WNS, OQR, and a heatmap of the current order.</li>
<li>If WNS > 0.35 or the heatmap shows visible clustering along the diagonal, trigger a reorder.</li>
<li>After reordering, run similarity again \u2014 compare the new WNS and OQR against the previous run to confirm improvement.</li>
</ol>

<p>This turns exercise sequencing from a one-time operation into a repeatable quality check. Sections that receive new exercises can be re-evaluated and reordered without guessing whether the change helped.</p>

<h2>What sequencing actually changed</h2>

<p>Reordering does not create diversity that is not there. It cannot fix a section whose underlying exercises are all too similar \u2014 that is still a content problem. What it can do is make the existing diversity more visible and more usable for the learner.</p>

<p>If the learner experiences the section as a sequence, then sequence quality is part of product quality. At that point, order is no longer a technical afterthought.</p>
`
  },
  {
    slug: 'email-campaigns-learning-system',
    title: 'Email Campaigns Worked Better When Treated as a Learning System',
    excerpt: 'The product is organised around narrow grammar sections rather than broad lessons. That changes the retention logic. The campaign system is section-based \u2014 every completion event can create or update one schedule for one user and one grammar section.',
    datePublished: '2026-03-20T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>The question behind the email campaign was simple:</p>

<blockquote>If the product is built around repeated practice of specific grammar sections, what is the lightest reminder system that helps learners return to the right section at roughly the right time?</blockquote>

<p>That question matters because the product is organised around narrow grammar sections rather than broad lessons.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-content-page-b2.png" alt="A B2 grammar content page for Infinitivs\u00e4tze with a practice button" />
<figcaption>Each email reminder links directly to a specific grammar section page like this one. The learner returns to the exact area they practiced, not to a generic homepage.</figcaption>
</figure>

<p>A learner does not just "practice German." They practice things like:</p>

<ul>
<li>adjective declension after articles,</li>
<li>verbs with fixed prepositions,</li>
<li>sentence connectors in B2 texts,</li>
<li>nominalisation in C1 written German.</li>
</ul>

<p>That changes the retention logic.</p>

<p>The campaign system is section-based. Every completion event can create or update one schedule for one user and one grammar section.</p>

<p>That gives the system something concrete to work with:</p>

<ul>
<li>what the learner practiced,</li>
<li>when they practiced it,</li>
<li>when it should next be revisited,</li>
<li>and which link should take them directly back there.</li>
</ul>

<h2>The schedule is deliberately simple</h2>

<p>The first version uses a fixed four-step review sequence.</p>

<div class="table-wrapper">
<table>
<thead><tr><th>Step</th><th>Delay</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td>0</td><td>+1 day</td><td>Catch the first forgetting drop</td></tr>
<tr><td>1</td><td>+3 days</td><td>Reinforce while the pattern is still accessible</td></tr>
<tr><td>2</td><td>+7 days</td><td>Move into a weekly review rhythm</td></tr>
<tr><td>3</td><td>+14 days</td><td>Test whether the pattern is becoming durable</td></tr>
</tbody>
</table>
</div>

<p>This is not a full adaptive spaced-repetition system.</p>

<p>It is a practical review schedule for a lightweight email layer.</p>

<p>That trade-off was intentional. A fixed schedule is easier to reason about, easier to debug, and easier to connect to concrete product actions. It also matches the current maturity of the product better than pretending to have a mastery model where the evidence is still thin.</p>

<p>The key detail is that the schedule is <strong>resettable</strong>.</p>

<p>If a learner practices the same section again before the schedule finishes, the system does not stack reminders. It updates the existing schedule instead. The most recent practice event becomes the new anchor.</p>

<p>That logic lives in a simple upsert:</p>

<pre><code>INSERT INTO campaign_schedule (
  user_id,
  grammar_section_id,
  step,
  next_send_at,
  preferred_send_hour,
  timezone,
  status
)
VALUES (...)
ON CONFLICT (user_id, grammar_section_id)
DO UPDATE SET
  step = 0,
  next_send_at = EXCLUDED.next_send_at,
  preferred_send_hour = EXCLUDED.preferred_send_hour,
  timezone = EXCLUDED.timezone,
  status = 'active';</code></pre>

<p>That turns the schedule into a small state machine rather than a growing pile of pending emails.</p>

<h2>Timezone awareness matters more than template polish</h2>

<p>A reminder email sent at the wrong local hour is mostly noise.</p>

<p>The system stores the learner\u2019s local send preference implicitly: when the schedule is created, it records the local hour and timezone. The hourly processor then checks whether a schedule is due <strong>and</strong> whether the current hour in that timezone matches the preferred hour.</p>

<p>Conceptually, the eligibility logic looks like this:</p>

<pre><code>WHERE cs.next_send_at &lt;= NOW()
  AND (
    cs.preferred_send_hour IS NULL
    OR cs.preferred_send_hour = EXTRACT(
         HOUR FROM NOW() AT TIME ZONE COALESCE(cs.timezone, 'Europe/Berlin')
       )::integer
  )</code></pre>

<p>This solves a mundane but important product issue.</p>

<p>A reminder that is technically on time in UTC can still be mistimed in the learner\u2019s actual day. The email does not need perfect personalisation. It does need temporal plausibility.</p>

<h2>Most of the work is in the guardrails</h2>

<p>The value of the system is not just in sending messages.</p>

<p>It is in not sending the wrong ones.</p>

<p>Before a message goes out, the processor applies several checks:</p>

<ol>
<li><strong>subscription state</strong> \u2014 do not send if the learner unsubscribed,</li>
<li><strong>pause state</strong> \u2014 do not send during a pause window,</li>
<li><strong>already-practiced check</strong> \u2014 cancel the reminder if the learner already returned to that section,</li>
<li><strong>weekly cap</strong> \u2014 do not exceed the configured email frequency,</li>
<li><strong>comeback mode</strong> \u2014 reduce cadence for learners who have been inactive longer.</li>
</ol>

<p>The third one is especially important.</p>

<p>Without it, the system can produce the most irritating kind of reminder: an email asking a learner to review a section they already revisited on their own.</p>

<p>From a systems perspective, that is a small state mismatch. From a product perspective, it makes the platform look inattentive.</p>

<p>That is why the campaign processor is better understood as a decision layer than as a mail sender.</p>

<h2>The funnel only became useful when it was broken into stages</h2>

<p>The tracking model uses four states:</p>

<ol>
<li><strong>sent</strong></li>
<li><strong>clicked</strong></li>
<li><strong>exercise started</strong></li>
<li><strong>exercise completed</strong></li>
</ol>

<p>The reason to track all four is simple.</p>

<p>"Email worked" is too coarse to guide product changes.</p>

<p>A click without a start suggests a landing or routing problem. A start without a completion suggests exercise friction or session design problems. A low click rate suggests a subject-line or relevance problem.</p>

<p>Once the funnel was staged, it became much easier to tell where the problem actually was.</p>

<p>That is the point where email analytics stopped being vanity metrics and started behaving like product diagnostics.</p>

<h2>The useful decision was section-specific, not generic</h2>

<p>This is the broader lesson.</p>

<p>The product does not need generic "come back to the app" messages. It needs reminders tied to the learner\u2019s actual practice path.</p>

<p>That is why the schedule is attached to grammar sections rather than to abstract activity streaks.</p>

<p>A reminder that says, in effect, "come back to this exact grammar area you practiced three days ago" is much closer to the product\u2019s logic than a generic engagement email.</p>

<p>The system becomes much lighter and much more relevant at the same time.</p>

<h2>Why this worked better as a learning system than as marketing</h2>

<p>Thinking of the campaign as a marketing feature would have produced the wrong design.</p>

<p>The important questions are not:</p>

<ul>
<li>how many emails were sent,</li>
<li>how polished the template looks,</li>
<li>or how often users were nudged.</li>
</ul>

<p>The important questions are:</p>

<ul>
<li>was the reminder tied to the right section,</li>
<li>did it arrive at a plausible time,</li>
<li>did it respect the learner\u2019s recent activity,</li>
<li>and where exactly did the learner drop after interacting with it?</li>
</ul>

<p>That is learning-system logic, not marketing logic.</p>

<h2>The practical lesson</h2>

<p>A lightweight email layer can be useful.</p>

<p>But it becomes much more useful when it is tied to:</p>

<ul>
<li>explicit section state,</li>
<li>a resettable schedule,</li>
<li>good guardrails,</li>
<li>timezone awareness,</li>
<li>and a funnel that distinguishes between click, start, and completion.</li>
</ul>

<p>In that form, the email campaign stops being a generic retention add-on.</p>

<p>It becomes an extension of the product\u2019s core promise: repeated practice of specific grammar areas at the right moment.</p>
`
  },
  {
    slug: 'admin-dashboard-content-system',
    title: 'The Admin Dashboard Became Part of the Content System',
    excerpt: 'Once exercise generation, similarity scoring, reordering, and email scheduling were in place, the dashboard stopped being an internal convenience layer. It became the operating surface of the content system itself.',
    datePublished: '2026-03-21T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>It is easy to think of an admin dashboard as reporting infrastructure that appears after the product starts working.</p>

<p>In InfiniteGrammar.de, that turned out to be not the case. Once exercise generation, similarity scoring, reordering, and email scheduling were in place, the dashboard stopped being an internal convenience layer. It became the operating surface of the content system itself.</p>

<p>The product was no longer just a set of exercises. It was a growing corpus with uneven coverage, variable demand, occasional redundancy, and several feedback loops that needed coordination. Without a way to inspect those dynamics, content decisions would drift back toward instinct and spot checks.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-sections-b2.png" alt="B2 grammar level page showing multiple grammar categories and topics" />
<figcaption>The learner-facing view of a grammar level. The admin dashboard operates on the same structure but shows exercise counts, similarity scores, demand metrics, and campaign data for each section.</figcaption>
</figure>

<h2>The problem was not lack of data</h2>

<p>By the time the admin area started to matter, the system already had enough raw data to be misleading. There were tables for grammar sections, exercises, user completions, email events, similarity runs, clustering outputs, and ordering snapshots.</p>

<p>The problem was not collection. The problem was operational translation. The useful question was never "what data do we have?" It was:</p>

<blockquote>Which view makes the next content or product decision easier to see?</blockquote>

<h2>1. Where is content missing?</h2>

<p>The <strong>coverage heatmap</strong> crosses CEFR level with grammar section and shows how many exercises exist in each cell. It is the fastest way to see whether the library is shaped like a curriculum or just growing opportunistically.</p>

<p>The <strong>inventory charts</strong> show exercise counts per grammar section and per content topic. These views shift content planning from "what feels underdeveloped?" to "which cells in the matrix are thin, empty, or overrepresented?"</p>

<figure class="article-figure">
<img src="/images/articles/level-selection.png" alt="Homepage showing CEFR levels A1 through C1 and grammar topic categories" />
<figcaption>The coverage heatmap in the admin area crosses these CEFR levels with grammar sections to show where the library has gaps.</figcaption>
</figure>

<h2>2. Where is learner demand concentrating?</h2>

<p>Coverage alone is not enough. A section can be underfilled and irrelevant, or overfilled and still actively consumed.</p>

<p>The <strong>exercise demand chart</strong> combines completion counts with remaining stock and shows, per grammar section, how much of the available content learners are actually completing and how much untouched material remains.</p>

<p>A section with high completion activity and low remaining depth is a candidate for expansion. A section with many remaining exercises but little usage may not have a content problem \u2014 it may have a discoverability or prioritisation problem. The response is different.</p>

<h2>3. Is the content set internally healthy?</h2>

<p>This is where the similarity dashboard becomes an editorial tool. The key object is the <strong>section overview table</strong>. For each grammar section it shows:</p>

<ul>
<li>exercise count,</li>
<li>mean / median / max similarity,</li>
<li>similarity bucket distribution,</li>
<li>Weighted Neighbourhood Score (WNS),</li>
<li>Ordering Quality Ratio (OQR),</li>
<li>and the active run selector.</li>
</ul>

<p>This table is intentionally dense. It exists to answer a triage question:</p>

<blockquote>Which sections deserve attention first, and what kind of attention do they need?</blockquote>

<p>A section with items in the <strong>&gt; 0.75</strong> similarity bucket likely contains near-duplicates. A section with elevated WNS but modest max similarity may not have duplicate content but may still produce a poor learner sequence. A section with a compressed similarity distribution may simply be intrinsically dense and need broader scenario variation. These are different problems. The overview table is what separates them.</p>

<h2>4. What exactly is wrong inside a section?</h2>

<p>Once a section is selected, the dashboard moves from triage to diagnosis with several specialised views.</p>

<h3>The dendrogram</h3>

<p>Shows whether the section contains clear internal clusters and how those clusters change under different similarity thresholds. The threshold slider lets the operator move from "show almost-duplicates" to "show broader structural families" \u2014 closer to how an editor thinks about the set.</p>

<h3>The heatmap</h3>

<p>Makes local structure visible at a glance. A red block near the diagonal means the learner is likely to hit repetition in sequence. Isolated warm cells far from the diagonal mean similarity exists but is distributed safely. Ordering snapshots are essential here \u2014 without them, historical heatmaps would render in the latest order and lose most of their value.</p>

<h3>The neighbour strip</h3>

<p>Answers the question: how similar is each exercise to the next one, the one after that, and the one after that? This is the visual counterpart of the WNS metric.</p>

<h3>The pair detail view</h3>

<p>Shows the full exercise text, answers, distractors, metadata, and similarity score side by side. The dashboard should not end at "the metric says these are similar." It has to end at "do I keep both, rewrite one, move one, or remove one?" That is the real editorial decision point.</p>

<h2>How metrics changed content planning</h2>

<p>Metrics such as WNS and rank-based OQR are only useful if they change decisions. That happened in two ways.</p>

<p>First, they made section triage faster. It became easier to see where the problem was duplication, where it was sequencing, and where it was just a need for more variety.</p>

<p>Second, they changed content planning. Generation stopped being driven only by volume. The next batch could be justified by coverage gaps, demand pressure, or diversity problems visible in the section-level views.</p>

<h2>The campaign views belong to the same system</h2>

<p>The campaign funnel and learner statistics views answer the same operational question from another angle: what gets used, where learners return, where they drop, and whether the product is creating repeated practice around the right grammar areas.</p>

<p>That is why the dashboard combines coverage, demand, similarity, and campaign views instead of splitting them into unrelated admin screens. The product is one system. The dashboard reflects that.</p>
`
  },
  {
    slug: 'tech-stack-content-heavy-language-product',
    title: 'The Tech Stack Behind InfiniteGrammar.de',
    excerpt: 'A breakdown of the technologies used across the learner-facing app, admin dashboard, content generation pipeline, and similarity analysis system \u2014 and what I would probably do differently.',
    datePublished: '2026-03-22T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>This is a factual overview of the technologies used in InfiniteGrammar.de, organised by workload. The system has several distinct parts that run differently and were built with different tools.</p>

<figure class="article-figure">
<img src="/images/articles/exercise-dropdown-open.png" alt="Exercise with dropdown showing four verb options" />
<figcaption>The learner-facing product: an interactive gap-fill exercise built with React, Tailwind, and shadcn/ui components.</figcaption>
</figure>

<h2>Frontend</h2>

<p>The learner-facing app and the admin dashboard are both built with <strong>React 18</strong>, <strong>TypeScript</strong>, and <strong>Vite</strong> (with the SWC plugin for compilation speed). Styling uses <strong>Tailwind CSS</strong> with <strong>shadcn/ui</strong> components built on <strong>Radix UI</strong> primitives.</p>

<p>Other frontend libraries in use:</p>

<ul>
<li><strong>React Router v6</strong> for routing.</li>
<li><strong>TanStack Query (React Query)</strong> for server-state fetching and caching.</li>
<li><strong>Recharts</strong> for charts in the admin dashboard.</li>
<li><strong>i18next</strong> for German/English internationalisation.</li>
<li><strong>react-helmet-async</strong> for per-route SEO meta tags.</li>
<li><strong>zod</strong> + <strong>react-hook-form</strong> for form validation.</li>
<li><strong>lucide-react</strong> for icons.</li>
</ul>

<p>The admin dashboard also uses custom SVG components for dendrograms and similarity heatmaps that are not covered by Recharts.</p>

<h2>Backend</h2>

<p>The API layer runs as <strong>Netlify Functions</strong> (serverless) written in TypeScript. These handle exercise fetching, progress tracking, statistics, campaign logic, and admin endpoints.</p>

<p>The backend uses raw SQL queries against the database rather than an ORM. This was a deliberate choice \u2014 many admin queries use PostgreSQL-specific features (CTEs, conditional aggregations, window functions) that are easier to write and debug as explicit SQL.</p>

<h2>Database</h2>

<p><strong>Neon PostgreSQL</strong> (serverless Postgres) stores everything: exercises, gaps, distractors, user progress, completions, email campaign state, similarity runs, pairwise scores, clustering output, and ordering snapshots. The <code>@neondatabase/serverless</code> driver is used for connections from Netlify Functions.</p>

<h2>Email</h2>

<p>Transactional email is sent via the <strong>Resend</strong> API. The package.json also includes <strong>Nodemailer</strong> as a dependency. Email templates are plain string interpolation \u2014 no template engine.</p>

<h2>SEO and prerendering</h2>

<p>The app is a React SPA. For grammar topic pages and other SEO-relevant routes, <strong>Puppeteer</strong> runs at build time to prerender static HTML. The build script (<code>vite build && node scripts/prerender.js</code>) produces crawlable HTML for ~120 routes. A static <code>sitemap.xml</code> is maintained manually.</p>

<figure class="article-figure">
<img src="/images/articles/grammar-content-page-b2.png" alt="A prerendered grammar content page with structured data, breadcrumbs, and practice CTA" />
<figcaption>Pages like this grammar topic page are prerendered at build time so crawlers receive full HTML instead of an empty SPA shell.</figcaption>
</figure>

<h2>Content generation pipeline</h2>

<p>Exercise generation runs as a separate <strong>Python</strong> system, not inside the Node.js/Netlify runtime. It calls the <strong>OpenAI API</strong> (including the Batch API for cost efficiency) to generate gap-fill exercises with distractors and explanations. The pipeline uses JSON-based run state for resumability and tracks each exercise through generation, assessment, and finalisation stages before writing to the database.</p>

<h2>Similarity analysis pipeline</h2>

<p>Also a separate <strong>Python</strong> system. It computes pairwise similarity between exercises within a grammar section using:</p>

<ul>
<li><strong>spaCy</strong> for POS-based linguistic features,</li>
<li><strong>scikit-learn</strong> for TF-IDF vectorisation and similarity utilities,</li>
<li><strong>NumPy</strong> for vector operations,</li>
<li><strong>SciPy</strong> for hierarchical clustering (linkage output for dendrograms).</li>
</ul>

<p>There is also an experimental semantic-embedding path that can run on <strong>Vast.ai</strong> GPU instances using <strong>SGLang</strong> or <strong>vLLM</strong> with models like <strong>BAAI/bge-m3</strong>. Remote instances process a state file and never access the database or environment variables directly \u2014 results are collected back locally and written to the database in a separate finalisation step.</p>

<h2>Hosting and deployment</h2>

<p><strong>Netlify</strong> hosts the frontend and serverless functions. Deployment is triggered by git push. The Python pipelines run locally or on remote GPU instances, not on Netlify.</p>

<h2>What I would probably do differently</h2>

<p><strong>Puppeteer prerendering is fragile.</strong> It works, but it is slow (~120 routes at build time), breaks silently when components change, and produces HTML that can drift from what React hydrates on the client. A framework with built-in SSR or static generation \u2014 Next.js, Astro, or even Vite SSG \u2014 would handle this more reliably. The prerender script was a pragmatic shortcut that avoided a framework migration, but it has become the most maintenance-prone part of the build.</p>

<p><strong>No ORM is fine until it is not.</strong> Raw SQL works well for the admin dashboard\u2019s complex queries. But for the simpler CRUD operations (user progress, completions, campaign state), a lightweight query builder like Kysely or Drizzle would reduce boilerplate and catch schema drift at compile time without sacrificing query control where it matters.</p>

<p><strong>The frontend carries unused weight.</strong> The package.json includes the full set of Radix UI primitives via shadcn/ui, but many of them are never used (menubar, context menu, hover card, navigation menu, etc.). Tree-shaking handles some of this, but the dependency list is larger than it needs to be. A cleanup pass or a more selective shadcn/ui installation would reduce surface area.</p>

<p><strong>Nodemailer and Resend are both in the dependency list.</strong> This is a leftover from migrating between providers. Only one should remain. Having both adds confusion about which path is active.</p>

<p><strong>The admin dashboard probably should not live in the same React app.</strong> It shares a router and build with the learner-facing product, which means admin-only code (heavy chart libraries, heatmap components, similarity visualisations) is part of the same bundle. Splitting the admin into a separate app or using more aggressive code splitting would reduce the main app\u2019s bundle size and make the two concerns independently deployable.</p>

<p><strong>Static sitemap maintenance does not scale.</strong> The sitemap is a manually edited XML file. With ~120 routes and growing, generating it from the route definitions or the database at build time would be less error-prone.</p>

<p><strong>Python pipelines have no formal task runner.</strong> The generation and similarity pipelines use CLI scripts with JSON state files. This works at the current scale, but there is no retry logic, no scheduling, and no visibility into failed runs beyond log files. A lightweight task runner (even just a Makefile with targets, or something like Prefect for the Python side) would make pipeline operations more predictable as the number of grammar sections grows.</p>
`
  },
  {
    slug: 'react-spa-seo-postmortem',
    title: 'React SPA SEO Postmortem: What I Learned Shipping a Content-Heavy Product',
    excerpt: 'SEO is not a content problem first. It is a rendering, routing, and deployment problem. A plain React SPA is not SEO-ready by default \u2014 here is what went wrong and what I would do differently.',
    datePublished: '2026-03-22T10:00:00+01:00',
    dateModified: '2026-03-22T10:00:00+01:00',
    htmlContent: `
<p>I learned this the hard way: SEO is not a content problem first. It is a rendering, routing, and deployment problem.</p>

<p>The first version of InfiniteGrammar.de was designed in <strong>Loveable</strong>. The rest of the development and repair work was done in <strong>Claude Code</strong>. That combination was productive for shipping quickly. It also created a trap I did not recognise early enough.</p>

<p>The app started as a <strong>React 18 + Vite + React Router SPA on Netlify</strong>. That is a reasonable shape for an interactive product. It is a weak default shape for a site that needs Google to index dozens of content pages.</p>

<figure class="article-figure">
<img src="/images/articles/pruefungszentren-overview.png" alt="Exam centers page showing telc and TestDaF locations across Germany" />
<figcaption>Pages like this exam center overview need to be indexed by search engines. Without prerendering, crawlers would see only an empty SPA shell.</figcaption>
</figure>

<h2>The real problem was architectural</h2>

<p>The site had many pages that were meant to rank: grammar overview pages, CEFR-level pages, grammar-section pages, exam-related pages. But the initial frontend stack behaved like this:</p>

<ul>
<li>React Router resolved routes client-side,</li>
<li>Vite built a static SPA shell,</li>
<li>Netlify served <code>index.html</code> and let the browser render the page,</li>
<li>content lived in the application layer rather than in pre-rendered HTML.</li>
</ul>

<p>For a crawler, that meant weak or inconsistent signals unless additional SEO infrastructure was added deliberately. The main lesson is simple:</p>

<blockquote>If a product depends on organic search, a plain React SPA is not SEO-ready by default.</blockquote>

<p>That does not mean it cannot rank. It means SEO has to be treated as part of the architecture, not as a late polish pass.</p>

<h2>The mistakes that mattered most</h2>

<h3>1. Treating meta tags as the main SEO task</h3>

<p>The first instinct was to improve titles, descriptions, Open Graph tags, and route metadata. That helped presentation. It did not solve indexation. The real issue was that the crawler still had to deal with a client-rendered application shell.</p>

<p>A page can have a polished title and still be a weak SEO page.</p>

<h3>2. Patching SEO outside the rendering model</h3>

<p>I tried approaches that modified or injected metadata after build instead of making prerendered pages the actual output. That created duplication: one source of truth in React, another in scripts, sometimes a third in sitemap or redirect logic. Once several systems define the same URLs and metadata, drift becomes likely. That drift caused real problems.</p>

<h3>3. Changing URLs too often</h3>

<p>One of the most expensive mistakes was changing URL structures repeatedly while the site was already being crawled. Every URL migration required redirects. Repeated migrations created chains. Chains wasted crawl budget, added latency, and weakened the consistency of the signals being sent.</p>

<p>For SEO, URL stability is not an implementation detail. It is a product decision.</p>

<h3>4. Underestimating trailing-slash consistency</h3>

<p>This was one of the most damaging issues and also one of the easiest to miss. In a Netlify setup that serves prerendered directory-based routes, <code>/page/</code> and <code>/page</code> are not equivalent. One may return <code>200</code>, the other may return <code>301</code>.</p>

<p>If the sitemap, canonical tags, internal links, and prerender script disagree about slash format, the site starts generating unnecessary redirects on its own canonical pages. The rule I would apply now is absolute:</p>

<blockquote>Pick one URL format and make every system obey it.</blockquote>

<p>That includes React links, React Router navigation, sitemap generation, canonical tags, prerender page lists, and Netlify redirect rules.</p>

<h3>5. Letting the sitemap drift away from the build</h3>

<p>A sitemap is only useful if it reflects what the build actually produces. In my case, the sitemap, the prerender script, and the route definitions were not always generated from the same source of truth. That meant some URLs were valid in one place and missing or redirected in another.</p>

<p>A sitemap should not be maintained as a separate editorial object. It should be derived from the same route inventory that powers prerendering and canonical generation.</p>

<h3>6. Treating prerendering as an add-on</h3>

<p>The turning point was moving to <strong>Puppeteer-based prerendering</strong> and treating it as part of the build itself. That changed the site from one SPA shell plus client rendering into a set of route-specific HTML documents that React could hydrate after load.</p>

<p>That is a much cleaner SEO model for a content-heavy site on React + Vite + Netlify. It is still more fragile than using a framework with built-in SSR or SSG. But it is workable if the pipeline is disciplined.</p>

<figure class="article-figure">
<img src="/images/articles/articles-listing.png" alt="Articles listing page with card layout for each blog post" />
<figcaption>The articles listing page \u2014 one of ~120 routes that are now prerendered at build time. Each page gets its own HTML document with proper meta tags, canonical URLs, and structured data.</figcaption>
</figure>

<h2>What the stack taught me</h2>

<p>Loveable made it easy to get a usable frontend quickly. Claude Code made it easy to iterate quickly. But speed of UI iteration can hide SEO debt if the underlying rendering model is wrong for search-driven growth.</p>

<p>The repair cost was real because the key question had not been asked early enough:</p>

<blockquote>Does this stack produce stable, crawlable HTML for every page I want indexed?</blockquote>

<p>That question should have been answered before scaling content.</p>

<h2>What I would do differently now</h2>

<h3>Path 1: use a framework with built-in SSR or SSG</h3>

<p>For content-heavy products, this is the cleaner answer. Use Next.js, Astro, Remix, or another framework where route-level HTML generation is part of the normal architecture. That removes a large amount of custom SEO plumbing.</p>

<h3>Path 2: stay on React + Vite, but define the SEO system on day one</h3>

<p>If the stack remains React 18 + TypeScript + Vite + React Router + Netlify + react-helmet-async + Puppeteer, then the following should exist before launch:</p>

<ul>
<li>a route inventory as a single source of truth,</li>
<li>build-time prerendering for every indexable route,</li>
<li>per-route canonical tags,</li>
<li>a sitemap generated from the same route inventory,</li>
<li>structured data for key content types,</li>
<li>robots rules for public vs private areas,</li>
<li>one enforced trailing-slash policy,</li>
<li>and redirect tests as part of deployment validation.</li>
</ul>

<p>That would have prevented most of the struggle.</p>

<h2>SEO guidelines I would now give Claude Code for this stack</h2>

<h3>Architecture rules</h3>

<ol>
<li>Treat SEO as a rendering problem first, not as a metadata problem.</li>
<li>Assume a plain React SPA is not sufficient for indexable content pages.</li>
<li>For every public route that should rank, produce prerendered HTML at build time.</li>
<li>Keep private routes out of the crawl surface: <code>/auth</code>, <code>/profile</code>, <code>/admin</code>, <code>/statistics</code>.</li>
<li>Pick one canonical URL format and enforce it everywhere.</li>
</ol>

<h3>Route and URL rules</h3>

<ol start="6">
<li>Use one route inventory as the single source of truth for sitemap generation, prerender targets, canonical generation, and internal linking.</li>
<li>Do not change URL structures unless absolutely necessary.</li>
<li>If URLs must change, use one-hop <code>301</code> redirects only.</li>
<li>Do not allow internal links to point at redirecting URLs.</li>
<li>Treat trailing-slash consistency as mandatory, not cosmetic.</li>
</ol>

<h3>Metadata rules</h3>

<ol start="11">
<li>Use react-helmet-async for per-route titles, descriptions, and canonical tags.</li>
<li>Add structured data where appropriate: <code>WebSite</code>, <code>BreadcrumbList</code>, <code>FAQPage</code>, <code>Article</code>, <code>LearningResource</code>.</li>
<li>Keep canonical URLs aligned with the actual deployed route format.</li>
<li>Make sure social tags and search tags are consistent, but do not mistake social metadata for SEO completeness.</li>
</ol>

<h3>Build and deployment rules</h3>

<ol start="15">
<li>Make Puppeteer prerendering part of the build, not a side script.</li>
<li>Fail the build if an indexable route is missing prerendered output.</li>
<li>Fail the build if sitemap URLs do not match the prerender route list.</li>
<li>Fail the build if canonical URLs and route inventory disagree.</li>
<li>Add automated checks for <code>200</code> on canonical pages and for accidental <code>301</code> or <code>404</code> responses.</li>
<li>Keep Netlify redirects minimal and explicit.</li>
</ol>

<h3>Crawl-surface rules</h3>

<ol start="21">
<li>Maintain a strict <code>robots.txt</code> for public vs private routes.</li>
<li>Do not let the sitemap be blocked by headers or robots directives.</li>
<li>Make sure every public content page is reachable through internal links, not only via the sitemap.</li>
<li>Treat crawlability, canonicals, redirects, sitemap output, and prerendering as one system.</li>
</ol>

<p>The frontend was easy to ship. The search surface was not. For content-heavy products, that distinction matters very early.</p>
`
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
