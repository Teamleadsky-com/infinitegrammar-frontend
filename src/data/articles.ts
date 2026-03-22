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
`
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
