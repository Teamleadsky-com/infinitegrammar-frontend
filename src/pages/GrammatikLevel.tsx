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

const GrammatikLevel = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();

  const normalizedLevel = level?.toUpperCase() as GrammarLevel;

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

  const pageTitle = `${levelNames[normalizedLevel]} – Deutsche Grammatik | Infinite Grammar`;
  const pageDescription = `Deutsche Grammatik ${normalizedLevel}: ${levelDescriptions[normalizedLevel]} Mit Regeln, Beispielen und Übungen.`;
  const pageUrl = `https://www.infinitegrammar.de/grammatik/${level}`;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>{pageTitle}</title>
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
              <Button variant="ghost" size="icon" onClick={() => navigate('/grammatik')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-base md:text-xl font-bold">{levelNames[normalizedLevel]}</h1>
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{normalizedLevel}</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{levelNames[normalizedLevel]}</h2>
              <p className="text-muted-foreground">{levelDescriptions[normalizedLevel]}</p>
            </div>
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
                        <Card
                          key={topic.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                          onClick={() => navigate(`/grammatik/${level}/${topic.slug}`)}
                        >
                          <h4 className="font-semibold mb-1 text-sm">{topic.title}</h4>
                          <p className="text-xs text-muted-foreground">{topic.shortDescription}</p>
                        </Card>
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
