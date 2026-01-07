import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  getTopicsByLevel,
  grammarCategories,
  type GrammarLevel,
} from '@/data/grammarTopics';
import { ShareButton } from '@/components/ShareButton';
import { SchemaMarkup } from '@/components/SchemaMarkup';

const GrammatikLevel = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();

  // Extract level code from URL parameter (e.g., "a1-niveau-lernen" -> "a1")
  const levelCode = level?.replace('-niveau-lernen', '') || '';
  const normalizedLevel = levelCode.toUpperCase() as GrammarLevel;

  if (!['A1', 'A2', 'B1', 'B2', 'C1'].includes(normalizedLevel)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Niveau nicht gefunden</h1>
          <Button onClick={() => navigate('/grammatik')}>Zurück zur Übersicht</Button>
        </div>
      </div>
    );
  }

  const topics = getTopicsByLevel(normalizedLevel);

  // Group topics by category
  const topicsByCategory = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, typeof topics>);

  const levelNames: Record<GrammarLevel, string> = {
    A1: 'A1 – Basis sicher machen',
    A2: 'A2 – Alltag & Perfekt',
    B1: 'B1 – komplexer werden',
    B2: 'B2 – präzise & formal',
    C1: 'C1 – anspruchsvolle Texte',
  };

  const levelDescriptions: Record<GrammarLevel, string> = {
    A1: 'Grundlagen der deutschen Grammatik: Wortstellung, Präsens, Artikel, Pronomen und einfache Präpositionen.',
    A2: 'Erweiterte Grundlagen: Kasus, Perfekt, Modalverben und erste komplexe Sätze.',
    B1: 'Mittelstufe: Relativsätze, Konjunktiv II, Wechselpräpositionen und reflexive Verben.',
    B2: 'Fortgeschritten: Indirekte Rede, Nominalisierung, Passiv und komplexe Satzstrukturen.',
    C1: 'Gehobene Sprache: Nominalstil, Partizipialkonstruktionen und komplexe Genitivkonstruktionen.',
  };

  const levelMetaDescriptions: Record<GrammarLevel, string> = {
    A1: 'Deutsche Grammatik A1: Grundlagen mit Wortstellung, Präsens, Artikeln und Pronomen. ✓ Einsteigerfreundlich ✓ Mit Beispielen ✓ Interaktive Übungen ✓ Kostenlos',
    A2: 'Deutsche Grammatik A2: Kasus, Perfekt, Modalverben und komplexe Sätze meistern. ✓ Aufbauend ✓ Praktische Beispiele ✓ Mit Übungen ✓ Kostenlos lernen',
    B1: 'Deutsche Grammatik B1: Relativsätze, Konjunktiv II, Wechselpräpositionen und mehr. ✓ Mittelstufe ✓ Strukturiert erklärt ✓ Mit Übungen ✓ Kostenlos',
    B2: 'Deutsche Grammatik B2: Indirekte Rede, Nominalisierung, Passiv und komplexe Strukturen. ✓ Fortgeschritten ✓ Präzise Regeln ✓ Mit Übungen ✓ Kostenlos',
    C1: 'Deutsche Grammatik C1: Nominalstil, Partizipialkonstruktionen und Genitivketten. ✓ Gehobene Sprache ✓ Anspruchsvoll ✓ Mit Beispielen ✓ Kostenlos',
  };

  const pageTitle = `Deutsche Grammatik ${normalizedLevel}: Regeln & Übungen einfach erklärt | InfiniteGrammar`;
  const pageDescription = levelMetaDescriptions[normalizedLevel];
  const pageUrl = `https://www.infinitegrammar.de/deutsche-grammatik/${levelCode}-niveau-lernen`;

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

      {/* Schema Markup for SEO */}
      <SchemaMarkup
        type="article"
        data={{
          headline: `Deutsche Grammatik ${normalizedLevel}: Regeln & Übungen einfach erklärt`,
          description: pageDescription,
          url: pageUrl,
          datePublished: '2025-12-15T10:00:00+01:00',
          dateModified: '2026-01-06T14:00:00+01:00',
          keywords: ['Deutsche Grammatik', `${normalizedLevel} Grammatik`, `Grammatik ${normalizedLevel}`, 'Deutsch lernen', 'Grammatikregeln']
        }}
      />
      <SchemaMarkup
        type="educational"
        data={{
          headline: `Deutsche Grammatik ${normalizedLevel}`,
          description: levelDescriptions[normalizedLevel],
          url: pageUrl,
          educationalLevel: normalizedLevel,
          learningResourceType: 'Grammar Guide',
          keywords: ['Deutsche Grammatik', `${normalizedLevel} Deutsch`, 'Grammatikregeln', 'Deutsch lernen']
        }}
      />
      <SchemaMarkup
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: 'Home', url: 'https://www.infinitegrammar.de/' },
            { name: 'Grammatik', url: 'https://www.infinitegrammar.de/deutsche-grammatik' },
            { name: normalizedLevel, url: pageUrl }
          ]
        }}
      />

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
                <div className="text-base md:text-xl font-bold">{levelNames[normalizedLevel]}</div>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {topics.length} Grammatikthemen
                </p>
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
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{normalizedLevel}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Deutsche Grammatik {normalizedLevel}: Regeln einfach erklärt</h1>
                <p className="text-muted-foreground">{levelDescriptions[normalizedLevel]}</p>
              </div>
            </div>
            <ShareButton
              url={pageUrl}
              title={pageTitle}
              description={pageDescription}
            />
          </div>
        </div>

        {/* Topics by Category */}
        <div className="space-y-8">
          {Object.entries(topicsByCategory).map(([categoryKey, categoryTopics]) => {
            const category = grammarCategories[categoryKey as keyof typeof grammarCategories];
            if (!category) return null;

            return (
              <div key={categoryKey} className="animate-fade-in">
                <Card className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 mt-4">
                    {categoryTopics
                      .sort((a, b) => a.orderInLevel - b.orderInLevel)
                      .map((topic) => (
                        <a
                          key={topic.id}
                          href={`/deutsche-grammatik/${levelCode}-niveau-lernen/${topic.slug}`}
                          className="block no-underline"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/deutsche-grammatik/${levelCode}-niveau-lernen/${topic.slug}`);
                          }}
                        >
                          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                            <h4 className="font-semibold mb-1 text-sm">{topic.title}</h4>
                            <p className="text-xs text-muted-foreground">{topic.shortDescription}</p>
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

export default GrammatikLevel;
