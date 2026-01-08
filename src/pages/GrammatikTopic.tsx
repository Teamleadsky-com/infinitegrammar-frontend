import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import {
  getTopicsByCategory,
  grammarCategories,
  type GrammarCategory,
} from '@/data/grammarTopics';
import { ShareButton } from '@/components/ShareButton';

const GrammatikTopic = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();

  const category = grammarCategories[topic as GrammarCategory];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Thema nicht gefunden</h1>
          <Button onClick={() => navigate('/deutsche-grammatik')}>Zurück zur Übersicht</Button>
        </div>
      </div>
    );
  }

  const topics = getTopicsByCategory(topic as GrammarCategory);

  // Group topics by level
  const topicsByLevel = topics.reduce((acc, t) => {
    if (!acc[t.level]) {
      acc[t.level] = [];
    }
    acc[t.level].push(t);
    return acc;
  }, {} as Record<string, typeof topics>);

  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const pageTitle = `${category.name} – Deutsche Grammatik`;
  const pageDescription = `${category.name}: ${category.description} Alle Regeln mit Beispielen und Übungen (A1-C1).`;
  const pageUrl = `https://www.infinitegrammar.de/deutsche-grammatik/thema/${topic}/`;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <a
                href="/deutsche-grammatik"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/deutsche-grammatik');
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div>
                <h1 className="text-base md:text-xl font-bold">{category.name}</h1>
                <p className="text-xs text-muted-foreground hidden md:block">{topics.length} Themen</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="shrink-0">
              Grammatik üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold">{category.name}</h2>
            <ShareButton
              url={pageUrl}
              title={pageTitle}
              description={pageDescription}
            />
          </div>
          <p className="text-lg text-muted-foreground">{category.description}</p>
        </div>

        {/* Topics by Level */}
        <div className="space-y-8">
          {levelOrder.map((level) => {
            const levelTopics = topicsByLevel[level];
            if (!levelTopics || levelTopics.length === 0) return null;

            return (
              <div key={level} className="animate-fade-in">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{level}</span>
                    </div>
                    <h3 className="text-xl font-bold">Niveau {level}</h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {levelTopics
                      .sort((a, b) => a.orderInLevel - b.orderInLevel)
                      .map((t) => (
                        <a
                          key={t.id}
                          href={`/deutsche-grammatik/${level.toLowerCase()}-niveau-lernen/${t.slug}`}
                          className="block no-underline"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/deutsche-grammatik/${level.toLowerCase()}-niveau-lernen/${t.slug}`);
                          }}
                        >
                          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                                {t.level}
                              </span>
                              <h4 className="font-semibold text-sm">{t.title}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground">{t.shortDescription}</p>
                          </Card>
                        </a>
                      ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-in">
          <Card className="p-8 bg-gradient-primary/5">
            <h2 className="text-xl font-bold mb-3">Bereit zum Üben?</h2>
            <p className="text-muted-foreground mb-6">
              Wähle ein Grammatikthema und starte mit den passenden Lückentext-Übungen.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              Übungen starten
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GrammatikTopic;
