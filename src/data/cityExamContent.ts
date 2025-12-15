/**
 * SEO content for individual city/exam landing pages
 */

export interface CityExamContent {
  city: string;
  citySlug: string;
  exam: 'telc' | 'testdaf';
  title: string;
  metaDescription: string;
  introText: string;
  tipsText: string;
}

export const cityExamPages: CityExamContent[] = [
  // Berlin
  {
    city: 'Berlin',
    citySlug: 'berlin',
    exam: 'telc',
    title: 'telc Prüfungszentren in Berlin – Termine & Anmeldung',
    metaDescription: 'Finde telc-Prüfungszentren in Berlin: VHS, Sprachschulen & Institute. Mit Tipps zur Anmeldung und Links zu offiziellen Terminen.',
    introText: `Berlin bietet als Hauptstadt eine breite Auswahl an telc-Prüfungszentren. Die Volkshochschule Berlin ist eine der größten Anlaufstellen und bietet telc-Prüfungen auf allen Niveaus von A1 bis C1 an. Daneben findest du private Sprachschulen wie Berlitz und Inlingua sowie das Goethe-Institut. Die Termine werden meist quartalsweise veröffentlicht – viele Zentren sind schnell ausgebucht, daher lohnt es sich, frühzeitig zu prüfen. Wenn ein Termin ausgebucht ist, lohnt der Blick auf mehrere Anbieter gleichzeitig.`,
    tipsText: `Tipp für Berlin: Die Stadt ist groß – prüfe auch Zentren in anderen Bezirken, wenn dein bevorzugter Standort ausgebucht ist. Viele Prüfungszentren liegen zentral oder sind gut mit den öffentlichen Verkehrsmitteln erreichbar.`,
  },
  {
    city: 'Berlin',
    citySlug: 'berlin',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in Berlin – Termine & Vorbereitung',
    metaDescription: 'TestDaF in Berlin ablegen: Uni-Sprachzentren, Goethe-Institut & mehr. Termine, Anmeldung und Tipps zur Vorbereitung.',
    introText: `Für den TestDaF findest du in Berlin mehrere akkreditierte Testzentren, darunter die Humboldt-Universität, das Goethe-Institut und weitere universitäre Sprachzentren. Der TestDaF wird in der Regel sechsmal jährlich angeboten, wobei die Termine bundesweit zentral koordiniert sind. Da Berlin ein beliebter Standort ist, empfiehlt es sich, die Anmeldung frühzeitig – etwa 4–6 Wochen vor dem Prüfungstermin – vorzunehmen. Die meisten Zentren liegen zentral und sind gut mit öffentlichen Verkehrsmitteln zu erreichen.`,
    tipsText: `Berlin-Tipp: Wenn die zentralen Testzentren ausgebucht sind, prüfe auch kleinere Standorte in den Außenbezirken oder erwäge einen Ausweichtermin einen Monat später. Die Vorbereitung auf den TestDaF braucht Zeit – plane mindestens 2–3 Monate intensives Training ein.`,
  },

  // München
  {
    city: 'München',
    citySlug: 'muenchen',
    exam: 'telc',
    title: 'telc Prüfungszentren in München – VHS, Berlitz & mehr',
    metaDescription: 'telc-Prüfungen in München: Finde Termine bei VHS, Berlitz, Inlingua und Goethe-Institut. Tipps zur Anmeldung und Vorbereitung.',
    introText: `München ist mit seiner großen internationalen Community ein wichtiger Standort für telc-Prüfungen. Die Münchner Volkshochschule (MVHS) gehört zu den größten Anbietern und bietet regelmäßig Prüfungen auf allen telc-Niveaus an. Auch private Sprachschulen wie Berlitz und Inlingua sowie das Goethe-Institut München sind lizenzierte Prüfungszentren. Die Nachfrage ist hoch, daher sind Termine oft mehrere Wochen im Voraus ausgebucht. Ein Blick auf mehrere Anbieter parallel erhöht deine Chancen auf einen passenden Termin.`,
    tipsText: `München-Tipp: Die Stadt ist gut vernetzt – wenn die zentralen Standorte voll sind, prüfe auch Prüfungszentren im Münchner Umland (z.B. Freising, Starnberg). Viele bieten ebenfalls telc-Prüfungen an und sind mit der S-Bahn gut erreichbar.`,
  },
  {
    city: 'München',
    citySlug: 'muenchen',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in München – Uni & Institute',
    metaDescription: 'TestDaF in München: LMU, TU München, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für deine TestDaF-Prüfung.',
    introText: `München bietet mehrere renommierte Testzentren für den TestDaF, darunter die LMU München, die TU München und das Goethe-Institut. Der TestDaF findet etwa sechsmal jährlich statt, wobei die Plätze oft schnell vergeben sind. Besonders die universitären Testzentren sind bei Studienbewerber:innen sehr beliebt. Die Anmeldung erfolgt online über das offizielle TestDaF-Portal – wir empfehlen, dich mindestens 6 Wochen vor dem Wunschtermin anzumelden. München ist ein Hochschulstandort mit großer internationaler Nachfrage, daher gilt: Je früher, desto besser.`,
    tipsText: `München-Tipp: Falls die Münchner Testzentren ausgebucht sind, prüfe auch Standorte in Augsburg oder Regensburg – beide sind mit der Bahn in etwa einer Stunde erreichbar. Plane für die TestDaF-Vorbereitung mindestens 8–12 Wochen ein, besonders wenn du auf B2/C1-Niveau arbeiten möchtest.`,
  },

  // Hamburg
  {
    city: 'Hamburg',
    citySlug: 'hamburg',
    exam: 'telc',
    title: 'telc Prüfungszentren in Hamburg – VHS & Sprachschulen',
    metaDescription: 'telc-Prüfungen in Hamburg: VHS Hamburg, Berlitz, Goethe-Institut. Termine finden, anmelden und optimal vorbereiten.',
    introText: `Hamburg als Hafenstadt und internationaler Wirtschaftsstandort bietet zahlreiche telc-Prüfungszentren. Die Hamburger Volkshochschule ist einer der größten Anbieter und führt regelmäßig telc-Prüfungen auf allen Niveaustufen durch. Daneben findest du lizenzierte Prüfungszentren bei Berlitz, dem Goethe-Institut und weiteren privaten Sprachschulen. Die Nachfrage ist besonders bei B1 und B2 hoch, da viele Teilnehmer:innen diese Zertifikate für Visumsanträge oder Einbürgerung benötigen. Termine werden meist quartalsweise veröffentlicht – frühe Anmeldung lohnt sich.`,
    tipsText: `Hamburg-Tipp: Die Stadt ist großflächig – wenn dein bevorzugter Standort voll ist, prüfe auch Zentren in anderen Stadtteilen wie Altona, Wandsbek oder Harburg. Die meisten sind gut mit HVV erreichbar.`,
  },
  {
    city: 'Hamburg',
    citySlug: 'hamburg',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in Hamburg – Uni & Institute',
    metaDescription: 'TestDaF in Hamburg ablegen: Universität Hamburg, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    introText: `Für den TestDaF stehen in Hamburg mehrere akkreditierte Testzentren zur Verfügung, darunter die Universität Hamburg und das Goethe-Institut. Der TestDaF wird etwa sechsmal pro Jahr angeboten und ist besonders bei internationalen Studierenden beliebt, die sich an deutschen Hochschulen bewerben möchten. Hamburg ist ein großer Hochschulstandort, daher sind die Plätze oft früh ausgebucht. Die Anmeldung erfolgt zentral über das TestDaF-Institut – plane etwa 4–8 Wochen Vorlaufzeit ein. Die Testzentren liegen meist zentral und sind gut mit öffentlichen Verkehrsmitteln zu erreichen.`,
    tipsText: `Hamburg-Tipp: Wenn die Hamburger Termine ausgebucht sind, erwäge Testzentren in Lübeck oder Bremen – beide sind mit dem Zug in unter einer Stunde erreichbar. Für die TestDaF-Vorbereitung solltest du mindestens 10–12 Wochen intensives Training einplanen, besonders für die schriftlichen und mündlichen Prüfungsteile.`,
  },

  // Köln
  {
    city: 'Köln',
    citySlug: 'koeln',
    exam: 'telc',
    title: 'telc Prüfungszentren in Köln – VHS & mehr',
    metaDescription: 'telc-Prüfungen in Köln: VHS, Sprachschulen, Goethe-Institut. Termine, Anmeldung und Tipps für deine telc-Vorbereitung.',
    introText: `Köln ist ein wichtiger Standort für telc-Prüfungen im Rheinland. Die Volkshochschule Köln bietet regelmäßig telc-Prüfungen auf allen Niveaustufen an und gehört zu den größten Prüfungszentren der Region. Zusätzlich findest du das Goethe-Institut Köln sowie mehrere private Sprachschulen. Die Nachfrage ist konstant hoch, besonders bei B1 für Einbürgerung und B2 für berufliche Zwecke. Termine werden meist quartalsweise veröffentlicht. Wenn ein Termin ausgebucht ist, lohnt sich der Blick auf benachbarte Städte wie Bonn oder Düsseldorf.`,
    tipsText: `Köln-Tipp: Die Stadt ist gut an das regionale Verkehrsnetz angebunden. Wenn Köln ausgebucht ist, sind Düsseldorf und Bonn jeweils nur 20–30 Minuten mit der Bahn entfernt und bieten ebenfalls viele telc-Termine an.`,
  },
  {
    city: 'Köln',
    citySlug: 'koeln',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in Köln – Uni & Institute',
    metaDescription: 'TestDaF in Köln: Universität zu Köln, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und gezielter Vorbereitung.',
    introText: `Köln bietet mehrere akkreditierte TestDaF-Testzentren, darunter die Universität zu Köln und das Goethe-Institut. Der TestDaF wird etwa sechsmal jährlich angeboten und ist besonders bei internationalen Studierenden gefragt, die sich für ein Studium in Deutschland qualifizieren möchten. Die Testzentren in Köln sind oft früh ausgebucht, daher empfiehlt sich eine Anmeldung 6–8 Wochen im Voraus. Die zentrale Lage macht Köln zu einem beliebten Prüfungsort für das gesamte Rheinland. Die Anmeldung erfolgt über das offizielle TestDaF-Portal.`,
    tipsText: `Köln-Tipp: Falls Köln ausgebucht ist, prüfe auch Testzentren in Bonn, Düsseldorf oder Aachen – alle sind mit dem Regionalverkehr in unter einer Stunde erreichbar. Für eine erfolgreiche TestDaF-Vorbereitung plane mindestens 8–12 Wochen ein und trainiere besonders die Prüfungsteile Leseverstehen und mündlicher Ausdruck.`,
  },

  // Frankfurt
  {
    city: 'Frankfurt am Main',
    citySlug: 'frankfurt',
    exam: 'telc',
    title: 'telc Prüfungszentren in Frankfurt – VHS & Goethe-Institut',
    metaDescription: 'telc-Prüfungen in Frankfurt: VHS, Goethe-Institut und Sprachschulen. Termine finden, anmelden und vorbereiten.',
    introText: `Frankfurt am Main ist als internationale Finanz- und Wirtschaftsmetropole ein wichtiger Standort für telc-Prüfungen. Die Volkshochschule Frankfurt bietet regelmäßig telc-Prüfungen auf allen Niveaus an, ebenso das Goethe-Institut Frankfurt. Die hohe internationale Nachfrage führt dazu, dass Termine oft mehrere Wochen im Voraus ausgebucht sind. Frankfurt ist auch gut an das regionale Verkehrsnetz angebunden, sodass Teilnehmer:innen aus dem gesamten Rhein-Main-Gebiet hierher kommen. Wenn Frankfurt ausgebucht ist, sind Wiesbaden, Darmstadt oder Mainz ebenfalls gute Optionen.`,
    tipsText: `Frankfurt-Tipp: Die Stadt ist zentraler Verkehrsknotenpunkt – wenn die Frankfurter Zentren voll sind, prüfe auch Angebote in Offenbach, Wiesbaden oder Darmstadt. Alle sind mit S-Bahn oder Regionalzug in 15–30 Minuten erreichbar.`,
  },
  {
    city: 'Frankfurt am Main',
    citySlug: 'frankfurt',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in Frankfurt – Goethe-Universität & mehr',
    metaDescription: 'TestDaF in Frankfurt: Goethe-Universität, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für den TestDaF.',
    introText: `Frankfurt bietet mehrere renommierte TestDaF-Testzentren, darunter die Goethe-Universität Frankfurt und das Goethe-Institut. Der TestDaF wird etwa sechsmal jährlich angeboten und ist besonders bei internationalen Studierenden beliebt. Frankfurt ist ein wichtiger Hochschulstandort und zieht Teilnehmer:innen aus dem gesamten Rhein-Main-Gebiet an. Die Anmeldung erfolgt zentral über das TestDaF-Institut – wir empfehlen, dich mindestens 6–8 Wochen vor dem Wunschtermin anzumelden, da die Plätze oft schnell vergeben sind. Die Testzentren liegen zentral und sind gut erreichbar.`,
    tipsText: `Frankfurt-Tipp: Wenn Frankfurt ausgebucht ist, erwäge Testzentren in Darmstadt, Mainz oder Gießen – alle sind mit dem Regionalverkehr in 30–60 Minuten erreichbar. Für die TestDaF-Vorbereitung solltest du mindestens 10–12 Wochen intensives Training einplanen.`,
  },

  // Stuttgart
  {
    city: 'Stuttgart',
    citySlug: 'stuttgart',
    exam: 'telc',
    title: 'telc Prüfungszentren in Stuttgart – VHS, Berlitz & mehr',
    metaDescription: 'telc-Prüfungen in Stuttgart: VHS, Berlitz, Inlingua, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps.',
    introText: `Stuttgart ist die Landeshauptstadt Baden-Württembergs und bietet zahlreiche telc-Prüfungszentren. Die Volkshochschule Stuttgart ist einer der größten Anbieter und führt regelmäßig telc-Prüfungen auf allen Niveaus durch. Daneben findest du Berlitz, Inlingua und das Goethe-Institut Stuttgart. Die Region ist wirtschaftsstark und international, daher ist die Nachfrage nach telc-Zertifikaten konstant hoch. Termine werden meist quartalsweise veröffentlicht – eine frühzeitige Anmeldung ist empfehlenswert. Wenn Stuttgart ausgebucht ist, bieten sich auch Prüfungszentren in Ludwigsburg, Esslingen oder Reutlingen an.`,
    tipsText: `Stuttgart-Tipp: Die Stadt liegt zentral in Baden-Württemberg. Wenn die Stuttgarter Zentren ausgebucht sind, prüfe auch Angebote in Heidelberg, Karlsruhe oder Tübingen – alle sind mit der Bahn in unter einer Stunde erreichbar.`,
  },
  {
    city: 'Stuttgart',
    citySlug: 'stuttgart',
    exam: 'testdaf',
    title: 'TestDaF Prüfungszentren in Stuttgart – Uni & Institute',
    metaDescription: 'TestDaF in Stuttgart: Universität Stuttgart, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
    introText: `Stuttgart bietet mehrere akkreditierte TestDaF-Testzentren, darunter die Universität Stuttgart und das Goethe-Institut. Der TestDaF wird etwa sechsmal jährlich angeboten und ist besonders bei internationalen Studierenden gefragt. Stuttgart ist ein wichtiger Hochschul- und Wirtschaftsstandort, daher sind die Plätze oft früh ausgebucht. Die Anmeldung erfolgt zentral über das TestDaF-Institut – plane etwa 6–8 Wochen Vorlaufzeit ein. Die Testzentren liegen meist zentral und sind gut mit öffentlichen Verkehrsmitteln zu erreichen. Stuttgart ist auch gut an das überregionale Verkehrsnetz angebunden.`,
    tipsText: `Stuttgart-Tipp: Wenn Stuttgart ausgebucht ist, erwäge Testzentren in Heidelberg, Tübingen oder Karlsruhe – alle sind mit Regionalverkehr in 30–60 Minuten erreichbar. Für die TestDaF-Vorbereitung plane mindestens 8–12 Wochen ein und fokussiere dich besonders auf die schriftlichen Prüfungsteile.`,
  },
];

/**
 * Get content for a specific city and exam combination
 */
export function getCityExamContent(citySlug: string, exam: 'telc' | 'testdaf'): CityExamContent | undefined {
  return cityExamPages.find(page => page.citySlug === citySlug && page.exam === exam);
}

/**
 * Get all available city/exam page slugs for routing
 */
export function getAllCityExamSlugs(): Array<{ exam: 'telc' | 'testdaf', citySlug: string }> {
  return cityExamPages.map(page => ({
    exam: page.exam,
    citySlug: page.citySlug,
  }));
}
