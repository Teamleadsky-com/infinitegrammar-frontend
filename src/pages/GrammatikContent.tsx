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
import { ShareButton } from '@/components/ShareButton';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { SchemaMarkup } from '@/components/SchemaMarkup';
import { EXERCISES_MAINTENANCE_MODE } from '@/config/features';
import { useState } from 'react';

const GrammatikContent = () => {
  const { level, slug } = useParams<{ level: string; slug: string }>();
  const navigate = useNavigate();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Extract level code from URL parameter (e.g., "a1-niveau-lernen" -> "a1")
  const levelCode = level?.replace('-niveau-lernen', '') || '';
  const normalizedLevel = levelCode.toUpperCase() as GrammarLevel;
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

  const pageTitle = `${topic.title}: Regeln & Beispiele einfach erklärt | InfiniteGrammar`;
  const pageDescription = topic.metaDescription;
  const pageUrl = `https://www.infinitegrammar.de/deutsche-grammatik/${levelCode}-niveau-lernen/${slug}`;

  // Map topic to exercise section
  const exerciseSection = content?.exerciseSection || 'Verben';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Schema Markup for SEO */}
      <SchemaMarkup
        type="article"
        data={{
          headline: `${topic.title}: Regeln einfach erklärt`,
          description: pageDescription,
          url: pageUrl,
          datePublished: '2025-12-15T10:00:00+01:00',
          dateModified: '2026-01-06T14:00:00+01:00',
          keywords: ['Deutsche Grammatik', topic.title, `${topic.level} Deutsch`, 'Deutsch lernen', 'Grammatik Regeln']
        }}
      />
      <SchemaMarkup
        type="educational"
        data={{
          headline: topic.title,
          description: pageDescription,
          url: pageUrl,
          educationalLevel: topic.level,
          learningResourceType: 'Grammar Guide',
          keywords: ['Deutsche Grammatik', topic.title, `${topic.level} Deutsch`, 'Grammatikregeln']
        }}
      />
      <SchemaMarkup
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: 'Home', url: 'https://www.infinitegrammar.de/' },
            { name: 'Grammatik', url: 'https://www.infinitegrammar.de/deutsche-grammatik' },
            { name: topic.level, url: `https://www.infinitegrammar.de/deutsche-grammatik/${levelCode}-niveau-lernen` },
            { name: topic.title, url: pageUrl }
          ]
        }}
      />
      {content?.faq && content.faq.length > 0 && (
        <SchemaMarkup
          type="faq"
          data={{
            faqs: content.faq.map(item => ({
              question: item.question,
              answer: item.answer.replace(/<[^>]*>/g, '') // Strip HTML tags for schema
            }))
          }}
        />
      )}

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <a
                href={`/deutsche-grammatik/${levelCode}-niveau-lernen`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/deutsche-grammatik/${levelCode}-niveau-lernen`);
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
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
              onClick={() => {
                if (EXERCISES_MAINTENANCE_MODE) {
                  setShowComingSoonModal(true);
                  return;
                }
                navigate(`/exercise?section=${exerciseSection}`);
              }}
              className="shrink-0"
            >
              Jetzt üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 md:mb-6 animate-fade-in">
          <a
            href="/deutsche-grammatik"
            className="hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigate('/deutsche-grammatik');
            }}
          >
            Grammatik
          </a>
          <span>→</span>
          <a
            href={`/deutsche-grammatik/${levelCode}-niveau-lernen`}
            className="hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/deutsche-grammatik/${levelCode}-niveau-lernen`);
            }}
          >
            {topic.level}
          </a>
          <span>→</span>
          <span className="text-foreground">{topic.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-4 md:mb-8 animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
            <h1 className="text-2xl md:text-4xl font-bold">{topic.title}: Regeln einfach erklärt</h1>
            <ShareButton
              url={pageUrl}
              title={pageTitle}
              description={pageDescription}
            />
          </div>
          <div className="text-lg text-muted-foreground leading-relaxed">
            <strong>Kurz erklärt:</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: content?.shortExplanation || topic.shortDescription }} />
          </div>
        </div>

        {/* CTA Card */}
        <Card className="p-4 bg-primary/5 border-primary/20 mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold mb-1">
                Jetzt üben: {topic.title} ({topic.level})
              </p>
              <p className="text-sm text-muted-foreground">10–20 Lücken, sofort Feedback</p>
            </div>
            <Button
              onClick={() => {
                if (EXERCISES_MAINTENANCE_MODE) {
                  setShowComingSoonModal(true);
                  return;
                }
                navigate(`/exercise?section=${exerciseSection}`);
              }}
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
              Wann brauchst du das?
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.whenToUse }} />
          </Card>
        )}

        {/* Section 2: Die Regel */}
        {content?.rules && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Die Regel
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.rules }} />
          </Card>
        )}

        {/* Section 3: Häufige Fehler */}
        {content?.commonMistakes && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             Häufige Fehler (und wie du sie vermeidest)
            </h3>
            <div dangerouslySetInnerHTML={{ __html: content.commonMistakes }} />
          </Card>
        )}

        {/* Section 4: Mini-Checkliste */}
        {content?.checklist && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Mini-Checkliste
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
              onClick={() => {
                if (EXERCISES_MAINTENANCE_MODE) {
                  setShowComingSoonModal(true);
                  return;
                }
                navigate(`/exercise?section=${exerciseSection}`);
              }}
              className="w-full sm:w-auto whitespace-normal h-auto py-3"
            >
              {topic.title} jetzt üben
            </Button>
            <a
              href={`/deutsche-grammatik/thema/${topic.category}`}
              className="inline-flex items-center justify-center whitespace-normal rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full sm:w-auto py-3"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/deutsche-grammatik/thema/${topic.category}`);
              }}
            >
              Zur Übersicht: {topic.category}
            </a>
          </div>
        </Card>

        {/* Section 6: FAQ */}
        {content?.faq && content.faq.length > 0 && (
          <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              FAQ
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
                <a
                  key={relatedTopic.id}
                  href={`/deutsche-grammatik/${relatedTopic.level.toLowerCase()}-niveau-lernen/${relatedTopic.slug}`}
                  className="block no-underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/deutsche-grammatik/${relatedTopic.level.toLowerCase()}-niveau-lernen/${relatedTopic.slug}`);
                  }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded uppercase">
                        {relatedTopic.level}
                      </span>
                      <h4 className="font-semibold text-sm">{relatedTopic.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{relatedTopic.shortDescription}</p>
                  </Card>
                </a>
              ))}
            </div>
          </Card>
        )}

        {/* Back to Overview */}
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <a
            href={`/deutsche-grammatik/${levelCode}-niveau-lernen`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/deutsche-grammatik/${levelCode}-niveau-lernen`);
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu {topic.level}
          </a>
          <a
            href="/deutsche-grammatik"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              navigate('/deutsche-grammatik');
            }}
          >
            Zur Grammatik-Übersicht
          </a>
        </div>
      </main>

      {/* Coming Soon Modal (Maintenance Mode) */}
      <ComingSoonModal
        open={showComingSoonModal}
        onOpenChange={setShowComingSoonModal}
        language="de"
      />
    </div>
  );
};

export default GrammatikContent;
