import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import { examCenters } from "@/data/examCenters";
import { getCityExamContent } from "@/data/cityExamContent";

const CityExamPage = () => {
  const { examCity } = useParams<{ examCity: string }>();
  const navigate = useNavigate();

  // Parse exam and city from the combined parameter (e.g., "telc-berlin")
  const [exam, city] = useMemo(() => {
    if (!examCity) return ['telc', ''];
    // Split on first hyphen only (e.g., "telc-berlin" -> ["telc", "berlin"])
    const match = examCity.match(/^(telc|testdaf)-(.+)$/);
    if (match) {
      return [match[1], match[2]];
    }
    return ['telc', examCity];
  }, [examCity]);

  // Get content for this city/exam combination
  const content = getCityExamContent(city || '', (exam as 'telc' | 'testdaf') || 'telc');

  // Filter centers by city and exam type
  const filteredCenters = useMemo(() => {
    if (!content) return [];

    return examCenters.filter(center => {
      const cityMatch = center.city.toLowerCase() === content.city.toLowerCase();
      const examMatch = exam === 'telc'
        ? center.examsOffered.toLowerCase().includes('telc')
        : center.examsOffered.toLowerCase().includes('testdaf');
      return cityMatch && examMatch;
    });
  }, [content, exam]);

  // Update SEO meta tags
  useEffect(() => {
    if (content) {
      const pageTitle = `${content.title} | Infinite Grammar`;
      const pageUrl = `https://www.infinitegrammar.de/pruefungszentren/${exam}-${city}`;

      document.title = pageTitle;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', content.metaDescription);
      }

      // Update Open Graph tags for social media previews
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', pageTitle);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', content.metaDescription);
      }

      // Add or update og:url
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', pageUrl);

      // Update Twitter Card tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', pageTitle);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', content.metaDescription);
      }
    }
  }, [content, exam, city]);

  // If no content found, redirect to main directory
  if (!content) {
    navigate('/pruefungszentren');
    return null;
  }

  const examDisplay = exam === 'telc' ? 'telc' : 'TestDaF';
  const examLinkTelc = 'https://www.telc.net/sprachpruefungen/pruefungszentrum-finden/';
  const examLinkTestDaF = 'https://www.testdaf.de/de/testzentren/der-testdaf-an-ihrem-testzentrum/die-testzentren-von-gast/';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Structured Data - LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${examDisplay} Prüfungszentren in ${content.city}`,
          "description": content.metaDescription,
          "numberOfItems": filteredCenters.length,
          "itemListElement": filteredCenters.slice(0, 10).map((center, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "EducationalOrganization",
              "name": center.organization,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": center.city,
                "addressRegion": center.state,
                "addressCountry": "DE"
              },
              "url": center.website
            }
          }))
        })}
      </script>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/pruefungszentren")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base md:text-xl font-bold">{examDisplay} {content.city}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="shrink-0">
              Grammatik üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h1>

          {/* Intro Text */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.introText}
            </p>
          </div>

          {/* Tips Card */}
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 {content.tipsText}</strong>
            </p>
          </Card>

          {/* Official Finder Link */}
          <Card className="p-6 mb-8 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Offizielle Termine bestätigen
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              Prüfe aktuelle Termine und Verfügbarkeit immer direkt beim offiziellen Finder:
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(exam === 'telc' ? examLinkTelc : examLinkTestDaF, '_blank')}
            >
              {examDisplay} Finder öffnen
            </Button>
          </Card>
        </div>

        {/* Exam Centers List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {examDisplay}-Prüfungszentren in {content.city}
          </h2>

          {filteredCenters.length > 0 ? (
            <div className="space-y-4">
              {filteredCenters.map((center, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{center.organization}</h3>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                      {center.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Prüfungen:</strong> {center.examsOffered}
                  </p>
                  <a
                    href={center.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                  >
                    Website besuchen <ExternalLink className="h-3 w-3" />
                  </a>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Keine {examDisplay}-Zentren in unserer Datenbank gefunden. Nutze den offiziellen Finder oben.
              </p>
            </Card>
          )}

          {/* Link to full directory */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/pruefungszentren')}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Alle Prüfungszentren durchsuchen
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Bereitest du dich gerade vor?
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            Trainiere Grammatik als Lückentext – kurz, interaktiv und nach Niveau.
            Perfekt für die Prüfungsvorbereitung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {exam === 'telc' ? (
              <>
                <Button onClick={() => navigate('/exercise?level=a2')}>
                  telc A2 üben
                </Button>
                <Button onClick={() => navigate('/exercise?level=b1')} variant="outline">
                  telc B1 üben
                </Button>
                <Button onClick={() => navigate('/exercise?level=b2')} variant="outline">
                  telc B2 üben
                </Button>
                <Button onClick={() => navigate('/exercise?level=c1')} variant="outline">
                  telc C1 üben
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/exercise?level=b2')}>
                  TestDaF B2 üben
                </Button>
                <Button onClick={() => navigate('/exercise?level=c1')} variant="outline">
                  TestDaF C1 üben
                </Button>
              </>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Ohne Anmeldung startklar. Mit Account bekommst du Statistik & Fortschritt.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default CityExamPage;
