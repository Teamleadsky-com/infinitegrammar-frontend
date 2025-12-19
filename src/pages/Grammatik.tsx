import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, BookOpen, Target, Sparkles, Zap } from 'lucide-react';
import {
  grammarCategories,
  grammarTopics,
  getTopicsByLevel,
  getPopularTopics,
  type GrammarLevel,
  type GrammarCategory,
} from '@/data/grammarTopics';
import { ShareButton } from '@/components/ShareButton';
import { QuickQuiz } from '@/components/QuickQuiz';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { EXERCISES_MAINTENANCE_MODE } from '@/config/features';

const Grammatik = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'level' | 'topic'>('level');
  const [activeQuiz, setActiveQuiz] = useState<{ level: string; sectionId: string; sectionName: string } | null>(
    null
  );
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const levels: { level: GrammarLevel; name: string; description: string }[] = [
    { level: 'A1', name: 'A1 – Basis sicher machen', description: 'Wortstellung, Präsens, Artikel …' },
    { level: 'A2', name: 'A2 – Alltag & Perfekt', description: 'Kasus, Präpositionen, Modalverben …' },
    { level: 'B1', name: 'B1 – komplexer werden', description: 'Relativsätze, Konnektoren, Konjunktiv II …' },
    { level: 'B2', name: 'B2 – präzise & formal', description: 'Indirekte Rede, Nominalisierung, Rektion …' },
    { level: 'C1', name: 'C1 – anspruchsvolle Texte', description: 'Nominalstil, Partizipialkonstruktionen …' },
  ];

  const popularTopics = getPopularTopics(6);

  // Popular level/section combinations for quick testing
  // Only using grammar sections that actually have exercises in the mock data
  const quickTestOptions = [
    { level: 'A1', sectionId: 'praesens_grundform', sectionName: 'Präsens (Grundformen)', emoji: '🌱' },
    { level: 'B1', sectionId: 'reflexive_verben', sectionName: 'Reflexive Verben', emoji: '🔄' },
    { level: 'B1', sectionId: 'relativsaetze_basis', sectionName: 'Relativsätze', emoji: '🔗' },
    { level: 'B1', sectionId: 'tempus_perfekt_praeteritum', sectionName: 'Perfekt & Präteritum', emoji: '⏰' },
    { level: 'B2', sectionId: 'passiv', sectionName: 'Passiv', emoji: '🔀' },
    { level: 'B2', sectionId: 'indirekte_rede', sectionName: 'Indirekte Rede', emoji: '💬' },
  ];

  // Filter topics based on search query
  const filteredTopics = searchQuery
    ? grammarTopics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)</title>
        <meta
          name="description"
          content="Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden."
        />
        <meta property="og:title" content="Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)" />
        <meta
          property="og:description"
          content="Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden."
        />
        <meta property="og:url" content="https://www.infinitegrammar.de/grammatik" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)" />
        <meta
          name="twitter:description"
          content="Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden."
        />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base md:text-xl font-bold">Grammatik</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="shrink-0">
              Grammatik üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-start justify-center gap-2 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)
            </h2>
            <ShareButton
              url="https://www.infinitegrammar.de/grammatik"
              title="Deutsche Grammatik: Regeln, Beispiele & Übungen (A1–C1)"
              description="Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen – und passende Lückentext-Übungen zum direkten Anwenden."
            />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nachschlagen, verstehen, sofort festigen: Zu jeder Regel findest du eine kurze Erklärung mit Beispielen –
            und passende Lückentext-Übungen zum direkten Anwenden.
          </p>
        </div>

        {/* Quick Knowledge Test Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Teste dein Wissen</h3>
                <p className="text-sm text-muted-foreground">
                  Mach einen Schnelltest (5 Übungen) zu beliebten Grammatikthemen
                </p>
              </div>
            </div>

            {activeQuiz ? (
              <QuickQuiz
                level={activeQuiz.level}
                grammarSectionId={activeQuiz.sectionId}
                grammarSectionName={activeQuiz.sectionName}
                onClose={() => setActiveQuiz(null)}
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {quickTestOptions.map((option) => (
                  <Card
                    key={`${option.level}-${option.sectionId}`}
                    className="p-4 hover:shadow-md transition-all cursor-pointer hover:scale-105 bg-white"
                    onClick={() => {
                      if (EXERCISES_MAINTENANCE_MODE) {
                        setShowComingSoonModal(true);
                        return;
                      }
                      setActiveQuiz({
                        level: option.level,
                        sectionId: option.sectionId,
                        sectionName: option.sectionName,
                      });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                            {option.level}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm">{option.sectionName}</h4>
                        <p className="text-xs text-muted-foreground">5 Übungen • ca. 3 Min.</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Search Field */}
        <Card className="p-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Regel suchen (z. B. Wechselpräpositionen, Konjunktiv II, Adjektivdeklination)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-4">
              {filteredTopics.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    {filteredTopics.length} {filteredTopics.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredTopics.map((topic) => (
                      <Card
                        key={topic.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                        onClick={() => navigate(`/grammatik/${topic.level.toLowerCase()}/${topic.slug}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                            {topic.level}
                          </span>
                          <h4 className="font-semibold text-sm">{topic.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{topic.shortDescription}</p>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Keine Ergebnisse gefunden. Versuche andere Suchbegriffe.</p>
              )}
            </div>
          )}
        </Card>

        {/* Why This Page */}
        <Card className="p-6 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Warum diese Seiten?</h3>
              <p className="text-muted-foreground">
                Viele Grammatikfehler bleiben, weil man Regeln nur liest. Hier kombinierst du Theorie + Beispiele +
                Üben – damit es im Kopf bleibt.
              </p>
            </div>
          </div>
        </Card>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            variant={viewMode === 'level' ? 'default' : 'outline'}
            onClick={() => setViewMode('level')}
            className="gap-2"
          >
            <Target className="h-4 w-4" />
            Nach Niveau
          </Button>
          <Button
            variant={viewMode === 'topic' ? 'default' : 'outline'}
            onClick={() => setViewMode('topic')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Nach Thema
          </Button>
        </div>

        {/* Level View */}
        {viewMode === 'level' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Nach Niveau</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levels.map((level, idx) => {
                const topics = getTopicsByLevel(level.level);
                return (
                  <Card
                    key={level.level}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                    onClick={() => navigate(`/grammatik/${level.level.toLowerCase()}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{level.level}</span>
                      </div>
                      <h3 className="font-bold text-lg">{level.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                    <p className="text-xs text-muted-foreground">{topics.length} Themen</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic View */}
        {viewMode === 'topic' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Nach Thema</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(grammarCategories).map(([key, category], idx) => (
                <Card
                  key={key}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                  onClick={() => navigate(`/grammatik/thema/${key}`)}
                >
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Topics */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-2xl font-bold text-center mb-8">Beliebte Regeln</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularTopics.map((topic) => (
              <Card
                key={topic.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/grammatik/${topic.level.toLowerCase()}/${topic.slug}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {topic.level}
                  </span>
                  <h3 className="font-semibold text-sm">{topic.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{topic.shortDescription}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Card className="p-8 bg-gradient-primary/5">
            <h2 className="text-2xl font-bold mb-4">Bereit zum Üben?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Wähle dein Niveau und starte mit den Lückentext-Übungen. Jede Regel kannst du sofort anwenden.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate('/')}>
                Nach Niveau starten
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                if (EXERCISES_MAINTENANCE_MODE) {
                  setShowComingSoonModal(true);
                  return;
                }
                navigate('/exercise');
              }}>
                Übungen öffnen
              </Button>
            </div>
          </Card>
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

export default Grammatik;
