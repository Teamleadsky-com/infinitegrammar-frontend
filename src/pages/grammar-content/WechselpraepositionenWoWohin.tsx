import { useNavigate } from 'react-router-dom';
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

const WechselpraepositionenWoWohin = () => {
  const navigate = useNavigate();

  const pageTitle = 'Wechselpräpositionen: Wo? Wohin? (B1)';
  const pageDescription =
    'Wechselpräpositionen (B1): Wo vs. Wohin – Dativ oder Akkusativ? Mit Regeln, Beispielen und häufigen Fehlern.';
  const pageUrl = 'https://www.infinitegrammar.de/grammatik/b1/wechselpraepositionen-wo-wohin';

  const relatedTopics = [
    { title: 'Präpositionen Ort+Zeit', slug: 'praepositionen-ort-zeit', level: 'b1' },
    { title: 'Artikel & Kasus', slug: 'artikel-kasus', level: 'a2' },
    { title: 'Verben mit Präposition', slug: 'verben-mit-praeposition', level: 'b1' },
  ];

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
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/grammatik/b1')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">B1</span>
                  <h1 className="text-base md:text-lg font-bold">Wechselpräpositionen: Wo? Wohin?</h1>
                </div>
                <p className="text-xs text-muted-foreground hidden md:block">Kasus & Präpositionen</p>
              </div>
            </div>
            <Button variant="default" size="sm" onClick={() => navigate('/exercise?section=Präpositionen')} className="shrink-0 sticky-cta">
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
          <button onClick={() => navigate('/grammatik/b1')} className="hover:text-primary transition-colors">
            B1
          </button>
          <span>→</span>
          <span className="text-foreground">Wechselpräpositionen</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Wechselpräpositionen: Wo? Wohin?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            <strong>Kurz erklärt:</strong> Wechselpräpositionen stehen mit <strong>Dativ</strong>, wenn es um einen
            Ort (wo?) geht – und mit <strong>Akkusativ</strong>, wenn es um eine Richtung/Bewegung (wohin?) geht.
          </p>
        </div>

        {/* CTA Card */}
        <Card className="p-4 bg-primary/5 border-primary/20 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold mb-1">Jetzt üben: Wechselpräpositionen (B1)</p>
              <p className="text-sm text-muted-foreground">10–20 Lücken, sofort Feedback</p>
            </div>
            <Button onClick={() => navigate('/exercise?section=Präpositionen')}>
              Wechselpräpositionen üben <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Section 1: Wann brauchst du das? */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             Wann brauchst du das?
          </h3>
          <p className="mb-3">Du brauchst Wechselpräpositionen, wenn du sagen willst,</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>wo</strong> etwas ist (Ort) oder
            </li>
            <li>
              <strong>wohin</strong> sich etwas bewegt (Richtung).
            </li>
          </ul>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">Typische Präpositionen:</p>
            <p className="text-sm">an, auf, hinter, in, neben, über, unter, vor, zwischen</p>
          </div>
        </Card>

        {/* Section 2: Die Regel */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             Die Regel
          </h3>

          <div className="mb-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
            <p className="font-bold text-lg">Merksatz:</p>
            <p className="text-lg mt-2">
              <strong className="text-primary">wo?</strong> → Dativ
            </p>
            <p className="text-lg">
              <strong className="text-primary">wohin?</strong> → Akkusativ
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Dativ (Ort, keine Bewegung):
              </h4>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Ich sitze <strong>auf dem Stuhl</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Das Bild hängt <strong>an der Wand</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Das Handy liegt <strong>in der Tasche</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Akkusativ (Richtung, Bewegung/Veränderung):
              </h4>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Ich setze mich <strong>auf den Stuhl</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Ich hänge das Bild <strong>an die Wand</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Ich lege das Handy <strong>in die Tasche</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 3: Häufige Fehler */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            Häufige Fehler (und wie du sie vermeidest)
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Fehler 1: „Bewegung" mit „wohin" verwechseln
              </h4>
              <p className="text-sm mb-3">
                Nicht jede Bewegung ist automatisch „wohin". Entscheidend ist: ändert sich der Ort/Zustand?
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <CheckCircle2 className="inline h-4 w-4 text-success mr-1" />
                  Ich laufe <strong>im Park</strong>. (Ort bleibt Park → <strong>Dativ</strong>)
                </p>
                <p>
                  <CheckCircle2 className="inline h-4 w-4 text-success mr-1" />
                  Ich laufe <strong>in den Park</strong>. (Richtung ins Innere → <strong>Akkusativ</strong>)
                </p>
              </div>
            </div>

            <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Fehler 2: falsches Fragewort
              </h4>
              <p className="text-sm">Wenn du unsicher bist: stelle die Frage.</p>
              <ul className="mt-2 space-y-1 text-sm ml-4">
                <li>
                  <strong>Wo?</strong> → Dativ
                </li>
                <li>
                  <strong>Wohin?</strong> → Akkusativ
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 4: Mini-Checkliste */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            Mini-Checkliste
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <span>
                Kann ich <strong>„wo?"</strong> fragen? → Dativ
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <span>
                Kann ich <strong>„wohin?"</strong> fragen? → Akkusativ
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <span>
                Geht es um <strong>„hinein/hinauf/hinter…"</strong>? → oft Akkusativ
              </span>
            </li>
          </ul>
        </Card>

        {/* Section 5: Üben */}
        <Card className="p-6 mb-6 bg-gradient-success/5 border-success/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-bold mb-3">Übe Wechselpräpositionen als Lückentext (B1)</h3>
          <p className="text-muted-foreground mb-4">
            Kurze Sätze, typische Prüfungsfehler, sofort Feedback.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button size="lg" onClick={() => navigate('/exercise?section=Präpositionen')}>
              Wechselpräpositionen jetzt üben
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/grammatik/thema/kasus')}>
              Zur Übersicht: Kasus & Präpositionen
            </Button>
          </div>
        </Card>

        {/* Section 6: FAQ */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             FAQ
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-left">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  Welche Präpositionen sind Wechselpräpositionen?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>an, auf, hinter, in, neben, über, unter, vor, zwischen.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-left">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  Warum ist „im Park" Dativ, obwohl ich laufe?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Weil der Ort „Park" gleich bleibt (<strong>wo?</strong>), nicht die Richtung (
                  <strong>wohin?</strong>). Die Bewegung findet <em>innerhalb</em> des Parks statt, ohne dass du
                  hineingehst.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-left">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  Gilt das auch bei „stellen/legen/setzen"?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Ja – das sind klassische <strong>Akkusativ-Verben</strong> in Kombination mit Richtung (
                  <strong>wohin?</strong>). Du stellst etwas <em>irgendwohin</em>, legst etwas <em>irgendwohin</em>,
                  setzt dich <em>irgendwohin</em>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-left">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  Was ist mit „über" und „unter"?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Sie funktionieren gleich: <strong>über/unter dem Tisch</strong> (wo? = Dativ), aber{' '}
                  <strong>über/unter den Tisch</strong> (wohin? = Akkusativ).
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Related Topics */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-bold mb-4">Verwandte Themen</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedTopics.map((topic) => (
              <Card
                key={topic.slug}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
                onClick={() => navigate(`/grammatik/${topic.level}/${topic.slug}`)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded uppercase">
                    {topic.level}
                  </span>
                  <h4 className="font-semibold text-sm">{topic.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Back to Overview */}
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button variant="outline" onClick={() => navigate('/grammatik/b1')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu B1
          </Button>
          <Button variant="outline" onClick={() => navigate('/grammatik')}>
            Zur Grammatik-Übersicht
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WechselpraepositionenWoWohin;
