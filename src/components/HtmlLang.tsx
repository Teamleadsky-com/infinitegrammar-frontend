import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Route prefixes whose content is German. Pages outside these prefixes keep
// whatever <html lang> they declare themselves (Articles/ArticleContent: "en",
// LevelSelection/ExerciseStats: i18n-derived) or none, unchanged.
const GERMAN_ROUTE_PREFIX = /^\/(deutsche-grammatik|pruefungszentren)(\/|$)/;

export function HtmlLang() {
  const { pathname } = useLocation();

  if (!GERMAN_ROUTE_PREFIX.test(pathname)) {
    return null;
  }

  return (
    <Helmet>
      <html lang="de" />
    </Helmet>
  );
}
