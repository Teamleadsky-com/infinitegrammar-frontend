/**
 * German Language Exam Centers Directory
 * Data source: German_Language_Exam_Centers_Directory.csv
 */

export interface ExamCenter {
  state: string;
  city: string;
  organization: string;
  type: 'VHS' | 'Universität' | 'Privatschule' | 'Institut';
  examsOffered: string;
  website: string;
}

export const examCenters: ExamCenter[] = [
  // Baden-Württemberg
  { state: 'Baden-Württemberg', city: 'Stuttgart', organization: 'Volkshochschule (VHS) Stuttgart', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-stuttgart.de' },
  { state: 'Baden-Württemberg', city: 'Stuttgart', organization: 'Universität Stuttgart / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-stuttgart.de' },
  { state: 'Baden-Württemberg', city: 'Stuttgart', organization: 'Berlitz Stuttgart', type: 'Privatschule', examsOffered: 'telc, TestDaF', website: 'https://www.berlitz.com' },
  { state: 'Baden-Württemberg', city: 'Stuttgart', organization: 'Inlingua Stuttgart', type: 'Privatschule', examsOffered: 'telc', website: 'https://www.inlingua-stuttgart.de' },
  { state: 'Baden-Württemberg', city: 'Stuttgart', organization: 'Goethe-Institut Stuttgart', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },
  { state: 'Baden-Württemberg', city: 'Heidelberg', organization: 'Volkshochschule (VHS) Heidelberg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-heidelberg.de' },
  { state: 'Baden-Württemberg', city: 'Heidelberg', organization: 'Universität Heidelberg / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-heidelberg.de' },
  { state: 'Baden-Württemberg', city: 'Mannheim', organization: 'Volkshochschule (VHS) Mannheim', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-mannheim.de' },
  { state: 'Baden-Württemberg', city: 'Karlsruhe', organization: 'Volkshochschule (VHS) Karlsruhe', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-karlsruhe.de' },
  { state: 'Baden-Württemberg', city: 'Karlsruhe', organization: 'Universität Karlsruhe / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.kit.edu' },
  { state: 'Baden-Württemberg', city: 'Freiburg', organization: 'Volkshochschule (VHS) Freiburg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-freiburg.de' },
  { state: 'Baden-Württemberg', city: 'Freiburg', organization: 'Universität Freiburg / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-freiburg.de' },
  { state: 'Baden-Württemberg', city: 'Ulm', organization: 'Volkshochschule (VHS) Ulm', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-ulm.de' },
  { state: 'Baden-Württemberg', city: 'Tübingen', organization: 'Volkshochschule (VHS) Tübingen', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-tuebingen.de' },
  { state: 'Baden-Württemberg', city: 'Tübingen', organization: 'Universität Tübingen / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-tuebingen.de' },

  // Bayern
  { state: 'Bayern', city: 'München', organization: 'Volkshochschule (VHS) München', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.mvhs.de' },
  { state: 'Bayern', city: 'München', organization: 'Universität München / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.lmu.de' },
  { state: 'Bayern', city: 'München', organization: 'Berlitz München', type: 'Privatschule', examsOffered: 'telc, TestDaF', website: 'https://www.berlitz.com' },
  { state: 'Bayern', city: 'München', organization: 'Inlingua München', type: 'Privatschule', examsOffered: 'telc', website: 'https://www.inlingua-muenchen.de' },
  { state: 'Bayern', city: 'München', organization: 'Goethe-Institut München', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },
  { state: 'Bayern', city: 'Nürnberg', organization: 'Volkshochschule (VHS) Nürnberg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-nuernberg.de' },
  { state: 'Bayern', city: 'Nürnberg', organization: 'Berlitz Nürnberg', type: 'Privatschule', examsOffered: 'telc, TestDaF', website: 'https://www.berlitz.com' },
  { state: 'Bayern', city: 'Augsburg', organization: 'Volkshochschule (VHS) Augsburg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-augsburg.de' },
  { state: 'Bayern', city: 'Würzburg', organization: 'Volkshochschule (VHS) Würzburg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-wuerzburg.de' },
  { state: 'Bayern', city: 'Würzburg', organization: 'Universität Würzburg / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-wuerzburg.de' },

  // Berlin
  { state: 'Berlin', city: 'Berlin', organization: 'Volkshochschule (VHS) Berlin', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs.berlin.de' },
  { state: 'Berlin', city: 'Berlin', organization: 'Humboldt-Universität / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.hu-berlin.de' },
  { state: 'Berlin', city: 'Berlin', organization: 'Berlitz Berlin', type: 'Privatschule', examsOffered: 'telc, TestDaF', website: 'https://www.berlitz.com' },
  { state: 'Berlin', city: 'Berlin', organization: 'Inlingua Berlin', type: 'Privatschule', examsOffered: 'telc', website: 'https://www.inlingua-berlin.de' },
  { state: 'Berlin', city: 'Berlin', organization: 'Goethe-Institut Berlin', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },

  // Hamburg
  { state: 'Hamburg', city: 'Hamburg', organization: 'Volkshochschule (VHS) Hamburg', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-hamburg.de' },
  { state: 'Hamburg', city: 'Hamburg', organization: 'Universität Hamburg / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-hamburg.de' },
  { state: 'Hamburg', city: 'Hamburg', organization: 'Berlitz Hamburg', type: 'Privatschule', examsOffered: 'telc, TestDaF', website: 'https://www.berlitz.com' },
  { state: 'Hamburg', city: 'Hamburg', organization: 'Goethe-Institut Hamburg', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },

  // Nordrhein-Westfalen
  { state: 'Nordrhein-Westfalen', city: 'Köln', organization: 'Volkshochschule (VHS) Köln', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-koeln.de' },
  { state: 'Nordrhein-Westfalen', city: 'Köln', organization: 'Universität Köln / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-koeln.de' },
  { state: 'Nordrhein-Westfalen', city: 'Köln', organization: 'Goethe-Institut Köln', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },
  { state: 'Nordrhein-Westfalen', city: 'Düsseldorf', organization: 'Volkshochschule (VHS) Düsseldorf', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-duesseldorf.de' },
  { state: 'Nordrhein-Westfalen', city: 'Düsseldorf', organization: 'Universität Düsseldorf / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.hhu.de' },
  { state: 'Nordrhein-Westfalen', city: 'Dortmund', organization: 'Volkshochschule (VHS) Dortmund', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-dortmund.de' },
  { state: 'Nordrhein-Westfalen', city: 'Essen', organization: 'Volkshochschule (VHS) Essen', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-essen.de' },
  { state: 'Nordrhein-Westfalen', city: 'Bonn', organization: 'Volkshochschule (VHS) Bonn', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-bonn.de' },
  { state: 'Nordrhein-Westfalen', city: 'Bonn', organization: 'Universität Bonn / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-bonn.de' },
  { state: 'Nordrhein-Westfalen', city: 'Münster', organization: 'Volkshochschule (VHS) Münster', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-muenster.de' },
  { state: 'Nordrhein-Westfalen', city: 'Münster', organization: 'Universität Münster / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-muenster.de' },
  { state: 'Nordrhein-Westfalen', city: 'Aachen', organization: 'Volkshochschule (VHS) Aachen', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-aachen.de' },
  { state: 'Nordrhein-Westfalen', city: 'Aachen', organization: 'RWTH Aachen / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.rwth-aachen.de' },

  // Hessen
  { state: 'Hessen', city: 'Frankfurt am Main', organization: 'Volkshochschule (VHS) Frankfurt', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs.frankfurt.de' },
  { state: 'Hessen', city: 'Frankfurt am Main', organization: 'Goethe-Universität / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-frankfurt.de' },
  { state: 'Hessen', city: 'Frankfurt am Main', organization: 'Goethe-Institut Frankfurt', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },

  // Sachsen
  { state: 'Sachsen', city: 'Leipzig', organization: 'Volkshochschule (VHS) Leipzig', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-leipzig.de' },
  { state: 'Sachsen', city: 'Leipzig', organization: 'Universität Leipzig / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.uni-leipzig.de' },
  { state: 'Sachsen', city: 'Leipzig', organization: 'Goethe-Institut Leipzig', type: 'Institut', examsOffered: 'TestDaF, Goethe-Zertifikat', website: 'https://www.goethe.de' },
  { state: 'Sachsen', city: 'Dresden', organization: 'Volkshochschule (VHS) Dresden', type: 'VHS', examsOffered: 'telc (A1-C1)', website: 'https://www.vhs-dresden.de' },
  { state: 'Sachsen', city: 'Dresden', organization: 'TU Dresden / Studienkolleg', type: 'Universität', examsOffered: 'TestDaF, DSH, telc C1 Hochschule', website: 'https://www.tu-dresden.de' },
];

export const uniqueStates = Array.from(new Set(examCenters.map(c => c.state))).sort();
export const uniqueCities = Array.from(new Set(examCenters.map(c => c.city))).sort();
export const uniqueTypes = ['VHS', 'Universität', 'Privatschule', 'Institut'] as const;
