import type { Context } from "@netlify/edge-functions";

// Canonical routes that must have trailing slashes.
// Generated from scripts/prerender.js PAGES array (excluding "/" which needs no redirect).
const CANONICAL_ROUTES = new Set([
  "/deutsche-grammatik/",
  "/pruefungszentren/",
  "/articles/",
  "/articles/why-infinitegrammar-focuses-on-exam-grammar/",
  "/articles/gap-fill-quality-distractor-problem/",
  "/articles/batch-processing-exercise-generation/",
  "/articles/measuring-exercise-diversity/",
  "/articles/similarity-calculation-vast-ai/",
  "/articles/reordering-exercises-product-problem/",
  "/articles/email-campaigns-learning-system/",
  "/articles/tech-stack-content-heavy-language-product/",
  "/articles/react-spa-seo-postmortem/",
  "/articles/generation-checker-analysis/",
  "/pruefungszentren/telc-berlin/",
  "/pruefungszentren/testdaf-berlin/",
  "/pruefungszentren/telc-muenchen/",
  "/pruefungszentren/testdaf-muenchen/",
  "/pruefungszentren/telc-hamburg/",
  "/pruefungszentren/testdaf-hamburg/",
  "/pruefungszentren/telc-koeln/",
  "/pruefungszentren/testdaf-koeln/",
  "/pruefungszentren/telc-frankfurt/",
  "/pruefungszentren/testdaf-frankfurt/",
  "/pruefungszentren/telc-stuttgart/",
  "/pruefungszentren/testdaf-stuttgart/",
  "/deutsche-grammatik/a1-niveau-lernen/",
  "/deutsche-grammatik/a2-niveau-lernen/",
  "/deutsche-grammatik/b1-niveau-lernen/",
  "/deutsche-grammatik/b2-niveau-lernen/",
  "/deutsche-grammatik/c1-niveau-lernen/",
  "/deutsche-grammatik/thema/satzbau/",
  "/deutsche-grammatik/thema/zeiten/",
  "/deutsche-grammatik/thema/verben/",
  "/deutsche-grammatik/thema/nomen/",
  "/deutsche-grammatik/thema/kasus/",
  "/deutsche-grammatik/thema/adjektive/",
  "/deutsche-grammatik/thema/passiv/",
  "/deutsche-grammatik/thema/genitiv/",
  "/deutsche-grammatik/a1-niveau-lernen/wortstellung-regeln-lernen/",
  "/deutsche-grammatik/a1-niveau-lernen/praesens-gegenwart-deutsch/",
  "/deutsche-grammatik/a1-niveau-lernen/imperativ-befehlsform-deutsch/",
  "/deutsche-grammatik/a1-niveau-lernen/artikel-nominativ-der-die-das/",
  "/deutsche-grammatik/a1-niveau-lernen/personalpronomen-nominativ-ich-du-er/",
  "/deutsche-grammatik/a1-niveau-lernen/pluralbildung-plural-deutsch-lernen/",
  "/deutsche-grammatik/a1-niveau-lernen/lokale-praepositionen-ort-deutsch/",
  "/deutsche-grammatik/a1-niveau-lernen/temporale-praepositionen-zeit-deutsch/",
  "/deutsche-grammatik/a1-niveau-lernen/adjektive-grundform-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/komplexe-saetze-nebensaetze-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/perfekt-praeteritum-vergangenheit-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/modalverben-koennen-muessen-wollen-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/trennbare-verben-aufstehen-einkaufen/",
  "/deutsche-grammatik/a2-niveau-lernen/pronomen-akkusativ-dativ-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/artikel-kasus-vier-faelle-deutsch/",
  "/deutsche-grammatik/a2-niveau-lernen/praepositionen-ort-richtung-wo-wohin/",
  "/deutsche-grammatik/a2-niveau-lernen/adjektivdeklination-einstieg-endungen/",
  "/deutsche-grammatik/a2-niveau-lernen/komparativ-superlativ-steigerung-adjektive/",
  "/deutsche-grammatik/b1-niveau-lernen/nebensaetze-konjunktionen-weil-dass-obwohl/",
  "/deutsche-grammatik/b1-niveau-lernen/relativsaetze-relativpronomen-deutsch/",
  "/deutsche-grammatik/b1-niveau-lernen/indirekte-fragen-ob-wann-wo-wie/",
  "/deutsche-grammatik/b1-niveau-lernen/futur-1-zukunft-deutsch-werden/",
  "/deutsche-grammatik/b1-niveau-lernen/modalverben-praeteritum-konnte-musste/",
  "/deutsche-grammatik/b1-niveau-lernen/konjunktiv-2-wuensche-hoeflichkeit/",
  "/deutsche-grammatik/b1-niveau-lernen/reflexive-verben-sich-freuen-erinnern/",
  "/deutsche-grammatik/b1-niveau-lernen/verben-mit-praeposition-warten-auf-denken-an/",
  "/deutsche-grammatik/b1-niveau-lernen/wechselpraepositionen-wo-wohin-dativ-akkusativ/",
  "/deutsche-grammatik/b1-niveau-lernen/praepositionen-ort-zeit-kombiniert/",
  "/deutsche-grammatik/b1-niveau-lernen/adjektivdeklination-nominativ-akkusativ-b1/",
  "/deutsche-grammatik/b1-niveau-lernen/passiv-einstieg-vorgangspassiv-werden/",
  "/deutsche-grammatik/b2-niveau-lernen/infinitivsaetze-um-zu-ohne-zu/",
  "/deutsche-grammatik/b2-niveau-lernen/konjunktiv-2-irreale-bedingungen-wenn/",
  "/deutsche-grammatik/b2-niveau-lernen/indirekte-rede-konjunktiv-1-2/",
  "/deutsche-grammatik/b2-niveau-lernen/nomen-verb-verbindungen-funktionsverben/",
  "/deutsche-grammatik/b2-niveau-lernen/feste-praepositionen-rektion-verben-nomen/",
  "/deutsche-grammatik/b2-niveau-lernen/adjektivdeklination-komplett-alle-faelle/",
  "/deutsche-grammatik/b2-niveau-lernen/passiv-vertieft-zustandspassiv-modalverben/",
  "/deutsche-grammatik/b2-niveau-lernen/nominalisierung-nominalphrasen-verben-adjektive/",
  "/deutsche-grammatik/b2-niveau-lernen/genitiv-erweiterung-genitivattribute/",
  "/deutsche-grammatik/c1-niveau-lernen/komplexer-satzbau-mehrfache-einbettung/",
  "/deutsche-grammatik/c1-niveau-lernen/konjunktiv-1-berichtssprache-journalismus/",
  "/deutsche-grammatik/c1-niveau-lernen/funktionsverbgefuege-gehobene-sprache/",
  "/deutsche-grammatik/c1-niveau-lernen/feste-verbindungen-idiome-kollokationen/",
  "/deutsche-grammatik/c1-niveau-lernen/verben-mit-praeposition-fortgeschritten-c1/",
  "/deutsche-grammatik/c1-niveau-lernen/komplexe-praepositionsausdruecke-mehrteilig/",
  "/deutsche-grammatik/c1-niveau-lernen/adjektivdeklination-komplex-nominalgruppen/",
  "/deutsche-grammatik/c1-niveau-lernen/passiv-komplex-ersatzformen-unpersoenlich/",
  "/deutsche-grammatik/c1-niveau-lernen/nominalstil-informationsverdichtung/",
  "/deutsche-grammatik/c1-niveau-lernen/partizipialkonstruktionen-erweiterte-attribute/",
  "/deutsche-grammatik/c1-niveau-lernen/genitiv-gehobene-sprache-genitivketten/",
]);

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Already has trailing slash — pass through
  if (pathname.endsWith("/")) {
    return context.next();
  }

  // Only redirect if adding a slash produces a known canonical route
  const withSlash = pathname + "/";
  if (CANONICAL_ROUTES.has(withSlash)) {
    const target = new URL(url);
    target.pathname = withSlash;
    return Response.redirect(target.toString(), 301);
  }

  // Not a canonical route — pass through (assets, API, app routes, etc.)
  return context.next();
};
