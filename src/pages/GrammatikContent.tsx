import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getTopicBySlugAndLevel, type GrammarLevel, grammarTopics } from '@/data/grammarTopics';
import { getTopicContent, getRelatedTopics } from '@/data/grammarContent';

const GrammatikContent = () => {
  const { level, slug } = useParams<{ level: string; slug: string }>();
  const navigate = useNavigate();

  const normalizedLevel = level?.toUpperCase() as GrammarLevel;
  const topic = getTopicBySlugAndLevel(slug || '', normalizedLevel);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Thema nicht gefunden</h1>
          <Button onClick={() => navigate('/grammatik')}>Zurück zur Übersicht</Button>
        </div>
      </div>
    );
  }

  const content = getTopicContent(topic.id);
  const relatedTopics = getRelatedTopics(topic.id);

  const pageTitle = `${topic.title} (${topic.level})`;
  const pageDescription = topic.metaDescription;
  const pageUrl = `https://www.infinitegrammar.de/grammatik/${level}/${slug}`;

  // Map topic to exercise section
  const exerciseSection = content?.exerciseSection || 'Verben';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/grammatik/${level}`)} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded shrink-0">
                    {topic.level}
                  </span>
                  <h1 className="text-base md:text-lg font-bold truncate">{topic.title}</h1>
                </div>
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/exercise?section=${exerciseSection}`)}
              className="shrink-0"
            >
              Jetzt üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
          <button onClick={() => navigate('/grammatik')} className="hover:text-primary transition-colors">
            Grammatik
          </button>
          <span>→</span>
          <button onClick={() => navigate(`/grammatik/${level}`)} className="hover:text-primary transition-colors">
            {topic.level}
          </button>
          <span>→</span>
          <span className="text-foreground">{topic.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{topic.title}</h2>
          <div className="text-lg text-muted-foreground leading-relaxed">
            <strong>Kurz erklärt:</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: content?.shortExplanation || topic.shortDescription }} />
          </div>
        </div>

        {/* CTA Card */}
        <Card className="p-4 bg-primary/5 border-primary/20 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold mb-1">
                Jetzt üben: {topic.title} ({topic.level})
              </p>
              <p className="text-sm text-muted-foreground">10–20 Lücken, sofort Feedback</p>
            </div>
            <Button
              onClick={() => navigate(`/exercise?section=${exerciseSection}`)}
              className="w-full sm:w-auto shrink-0 whitespace-normal h-auto py-3"
            >
              <span className="text-center">{topic.title} üben</span>
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </div>
        </Card>

        {/* Section 1: Wann brauchst du das? */}
        {content?.whenToUse && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">1)</span> Wann brauchst du das?
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.whenToUse }} />
          </Card>
        )}

        {/* Section 2: Die Regel */}
        {content?.rules && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">2)</span> Die Regel
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.rules }} />
          </Card>
        )}

        {/* Section 3: Häufige Fehler */}
        {content?.commonMistakes && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">3)</span> Häufige Fehler (und wie du sie vermeidest)
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.commonMistakes }} />
          </Card>
        )}

        {/* Section 4: Mini-Checkliste */}
        {content?.checklist && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">4)</span> Mini-Checkliste
            </h3>
            <ul className="space-y-3">
              {content.checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Section 5: Üben */}
        <Card
          className="p-6 mb-6 bg-gradient-success/5 border-success/20 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <h3 className="text-xl font-bold mb-3">
            Übe {topic.title} als Lückentext ({topic.level})
          </h3>
          <p className="text-muted-foreground mb-4">Kurze Sätze, typische Prüfungsfehler, sofort Feedback.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={() => navigate(`/exercise?section=${exerciseSection}`)}
              className="w-full sm:w-auto whitespace-normal h-auto py-3"
            >
              {topic.title} jetzt üben
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(`/grammatik/thema/${topic.category}`)}
              className="w-full sm:w-auto whitespace-normal h-auto py-3"
            >
              Zur Übersicht: {topic.category}
            </Button>
          </div>
        </Card>

        {/* Section 6: FAQ */}
        {content?.faq && content.faq.length > 0 && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">6)</span> FAQ
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {content.faq.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 text-left">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-bold mb-4">Verwandte Themen</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {relatedTopics.map((relatedTopic) => (
                <Card
                  key={relatedTopic.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                  onClick={() =>
                    navigate(`/grammatik/${relatedTopic.level.toLowerCase()}/${relatedTopic.slug}`)
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded uppercase">
                      {relatedTopic.level}
                    </span>
                    <h4 className="font-semibold text-sm">{relatedTopic.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{relatedTopic.shortDescription}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Back to Overview */}
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button variant="outline" onClick={() => navigate(`/grammatik/${level}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu {topic.level}
          </Button>
          <Button variant="outline" onClick={() => navigate('/grammatik')}>
            Zur Grammatik-Übersicht
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GrammatikContent;
