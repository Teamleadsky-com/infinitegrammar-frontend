import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, ExternalLink, Info } from "lucide-react";
import { examCenters, uniqueStates, uniqueTypes } from "@/data/examCenters";

const PruefungsZentren = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterExam, setFilterExam] = useState("all");
  const [searchOrg, setSearchOrg] = useState("");

  // SEO: Update page title dynamically
  useEffect(() => {
    document.title = "telc & TestDaF Prüfungszentren finden (VHS, Unis, Institute) | Infinite Grammar";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Finde telc- und TestDaF-Prüfungszentren in Deutschland: VHS, Uni-Sprachzentren, Goethe-Institut & mehr. Mit Links, Tipps zur Anmeldung und Vorbereitung.');
    }
  }, []);

  // Filter centers based on search and filters
  const filteredCenters = useMemo(() => {
    return examCenters.filter(center => {
      const matchesCity = searchCity === "" || center.city.toLowerCase().includes(searchCity.toLowerCase());
      const matchesState = filterState === "all" || center.state === filterState;
      const matchesType = filterType === "all" || center.type === filterType;
      const matchesOrg = searchOrg === "" || center.organization.toLowerCase().includes(searchOrg.toLowerCase());

      let matchesExam = true;
      if (filterExam !== "all") {
        const examsLower = center.examsOffered.toLowerCase();
        matchesExam = filterExam === "telc"
          ? examsLower.includes("telc")
          : examsLower.includes("testdaf");
      }

      return matchesCity && matchesState && matchesType && matchesExam && matchesOrg;
    });
  }, [searchCity, filterState, filterType, filterExam, searchOrg]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Structured Data - FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Sind alle Einträge offizielle Prüfungszentren?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Die Einträge sind als Orientierung gedacht. Ob und wann Prüfungen stattfinden, hängt von Terminplänen und Lizenzierungen ab. Bitte bestätige Details immer auf der Website des Anbieters oder über den offiziellen Finder."
              }
            },
            {
              "@type": "Question",
              "name": "Warum finde ich manchmal keine Termine?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Viele Anbieter veröffentlichen Termine nur periodisch oder sind schnell ausgebucht. Prüfe mehrere Städte oder warte auf neue Terminfenster."
              }
            },
            {
              "@type": "Question",
              "name": "Was ist der schnellste Weg, einen Prüfungsort zu finden?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nutze die Stadt-Suche im Verzeichnis und vergleiche 2–3 Anbieter. Wenn du unsicher bist: über den offiziellen Finder gegenchecken."
              }
            },
            {
              "@type": "Question",
              "name": "Welche Anbieter sind typisch für telc?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Häufig sind es Volkshochschulen (VHS) sowie private Sprachschulen und Institute – je nach Stadt."
              }
            },
            {
              "@type": "Question",
              "name": "Welche Anbieter sind typisch für TestDaF?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "In vielen Uni-Städten spielen Universitäts-Sprachzentren und Testzentren eine große Rolle. Auch Institute können TestDaF anbieten (je nach Standort)."
              }
            },
            {
              "@type": "Question",
              "name": "Was soll ich üben, sobald mein Termin feststeht?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Am meisten Zeit kosten in der Prüfung oft kleine Grammatik-Entscheidungen (Kasus/Präpositionen, Satzbau, Konnektoren). Kurze tägliche Lückentext-Sets sind dafür sehr effizient."
              }
            }
          ]
        })}
      </script>

      {/* Structured Data - ItemList Schema for Directory */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "telc und TestDaF Prüfungszentren in Deutschland",
          "description": "Verzeichnis von Prüfungszentren für telc und TestDaF in Deutschland",
          "numberOfItems": examCenters.length,
          "itemListElement": examCenters.slice(0, 20).map((center, index) => ({
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
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base md:text-xl font-bold">Prüfungszentren</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="shrink-0">
              Grammatik üben
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            telc & TestDaF Prüfungszentren in Deutschland finden
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Suche nach Stadt und finde passende Prüfungsanbieter wie Volkshochschulen (VHS),
            Universitäts-Sprachzentren und große Institute.
          </p>

          {/* Quick Links */}
          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Schnell zum offiziellen Finder
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.telc.net/sprachpruefungen/pruefungszentrum-finden/', '_blank')}
              >
                telc Testzentrum-Finder öffnen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.testdaf.de/de/testzentren/der-testdaf-an-ihrem-testzentrum/die-testzentren-von-gast/', '_blank')}
              >
                TestDaF Testzentrum-Finder öffnen
              </Button>
            </div>
          </Card>

          {/* Note Box */}
          <Card className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                  💡 Tipp: Wenn du keinen Termin findest, prüfe 2–3 nahe Städte – viele Prüfungen sind regional gebündelt.
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Hinweis: Termine und Verfügbarkeit ändern sich häufig. Bitte prüfe die finalen Infos immer direkt beim Anbieter.
                </p>
              </div>
            </div>
          </Card>

          {/* Search and Filter */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Stadt</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="z.B. Berlin, Köln, Leipzig..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bundesland</label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Bundesländer</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Anbieter-Typ</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Typen</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prüfung</label>
                <Select value={filterExam} onValueChange={setFilterExam}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Prüfungen</SelectItem>
                    <SelectItem value="telc">telc</SelectItem>
                    <SelectItem value="testdaf">TestDaF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Organisation durchsuchen</label>
              <Input
                type="text"
                placeholder="Suche im Namen der Organisation..."
                value={searchOrg}
                onChange={(e) => setSearchOrg(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Directory */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Verzeichnis: Prüfungszentren nach Stadt
          </h2>
          <p className="text-muted-foreground mb-6">
            Dieses Verzeichnis sammelt häufig genutzte Anlaufstellen für telc- und TestDaF-Prüfungen
            in Deutschland – sortierbar nach Stadt und Anbieter-Typ. Perfekt, wenn du schon weißt,
            wo du schreiben willst, oder wenn du in deiner Region schnell Optionen vergleichen möchtest.
          </p>

          <div className="text-sm text-muted-foreground mb-4">
            {filteredCenters.length} {filteredCenters.length === 1 ? 'Zentrum' : 'Zentren'} gefunden
          </div>

          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-3 font-semibold">Stadt</th>
                  <th className="text-left p-3 font-semibold">Organisation</th>
                  <th className="text-left p-3 font-semibold">Typ</th>
                  <th className="text-left p-3 font-semibold">Prüfungen</th>
                  <th className="text-left p-3 font-semibold">Website</th>
                </tr>
              </thead>
              <tbody>
                {filteredCenters.map((center, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{center.city}</td>
                    <td className="p-3">{center.organization}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                        {center.type}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{center.examsOffered}</td>
                    <td className="p-3">
                      <a
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="md:hidden space-y-4">
            {filteredCenters.map((center, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{center.organization}</h3>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                    {center.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{center.city}</p>
                <p className="text-sm mb-3">{center.examsOffered}</p>
                <a
                  href={center.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  Website besuchen <ExternalLink className="h-3 w-3" />
                </a>
              </Card>
            ))}
          </div>

          {filteredCenters.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Keine Zentren gefunden. Versuche, die Filter anzupassen.
              </p>
            </Card>
          )}
        </div>

        {/* How to Choose Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            So findest du den richtigen Prüfungsort in 4 Schritten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Prüfung & Niveau klären</h3>
                  <p className="text-sm text-muted-foreground">
                    telc ist je nach Ziel auf A2–C1 verbreitet. TestDaF ist typischerweise für
                    fortgeschrittene Lernende (B2–C1).
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Stadt wählen</h3>
                  <p className="text-sm text-muted-foreground">
                    Wähle eine Stadt, in der du gut anreisen kannst (ggf. mehrere Optionen).
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Anbieter-Typ auswählen</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>VHS:</strong> oft viele Termine, je nach Standort unterschiedlich</li>
                    <li><strong>Uni-Sprachzentren:</strong> besonders relevant für studienbezogene Prüfungen/TestDaF</li>
                    <li><strong>Institute:</strong> häufig größere Standorte in Metropolen</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Termin checken & vorbereiten</h3>
                  <p className="text-sm text-muted-foreground">
                    Wenn der Termin steht, lohnt sich tägliches kurzes Training – besonders
                    Grammatik-Entscheidungen, die im Test Zeit kosten.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Block */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Bereitest du dich gerade vor?
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            Trainiere Grammatik als Lückentext – kurz, interaktiv und nach Niveau.
            Ideal für die Zeit bis zur Prüfung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/exercise?level=a2')}>
              telc A2 Grammatik üben
            </Button>
            <Button onClick={() => navigate('/exercise?level=b1')} variant="outline">
              telc B1 Grammatik üben
            </Button>
            <Button onClick={() => navigate('/exercise?level=b2')} variant="outline">
              telc B2 Grammatik üben
            </Button>
            <Button onClick={() => navigate('/exercise?level=c1')} variant="outline">
              telc C1 Grammatik üben
            </Button>
            <Button onClick={() => navigate('/exercise?level=b2')} variant="outline">
              TestDaF Grammatik üben (B2–C1)
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Ohne Anmeldung startklar. Mit Account bekommst du Statistik & Fortschritt.
          </p>
        </Card>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Häufige Fragen zu telc- und TestDaF-Prüfungszentren
          </h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Sind alle Einträge offizielle Prüfungszentren?</h3>
              <p className="text-sm text-muted-foreground">
                Die Einträge sind als Orientierung gedacht. Ob und wann Prüfungen stattfinden, hängt von
                Terminplänen und Lizenzierungen ab. Bitte bestätige Details immer auf der Website des
                Anbieters oder über den offiziellen Finder.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Warum finde ich manchmal keine Termine?</h3>
              <p className="text-sm text-muted-foreground">
                Viele Anbieter veröffentlichen Termine nur periodisch oder sind schnell ausgebucht.
                Prüfe mehrere Städte oder warte auf neue Terminfenster.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Was ist der schnellste Weg, einen Prüfungsort zu finden?</h3>
              <p className="text-sm text-muted-foreground">
                Nutze die Stadt-Suche im Verzeichnis und vergleiche 2–3 Anbieter. Wenn du unsicher bist:
                über den offiziellen Finder gegenchecken.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Welche Anbieter sind typisch für telc?</h3>
              <p className="text-sm text-muted-foreground">
                Häufig sind es Volkshochschulen (VHS) sowie private Sprachschulen und Institute – je nach Stadt.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Welche Anbieter sind typisch für TestDaF?</h3>
              <p className="text-sm text-muted-foreground">
                In vielen Uni-Städten spielen Universitäts-Sprachzentren und Testzentren eine große Rolle.
                Auch Institute können TestDaF anbieten (je nach Standort).
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Was soll ich üben, sobald mein Termin feststeht?</h3>
              <p className="text-sm text-muted-foreground">
                Am meisten Zeit kosten in der Prüfung oft „kleine" Grammatik-Entscheidungen
                (Kasus/Präpositionen, Satzbau, Konnektoren). Kurze tägliche Lückentext-Sets sind dafür
                sehr effizient.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PruefungsZentren;
