/** Single source of truth for the InfiniteGrammar brand entity in structured data.
 *
 *  Every schema block that needs to name the publisher/author organisation must
 *  reference `organizationRef` instead of inlining a fresh `Organization` node,
 *  so crawlers resolve one canonical entity per page rather than several
 *  anonymous ones with divergent properties. */

export const SITE_URL = 'https://www.infinitegrammar.de';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORGANIZATION_NAME = 'InfiniteGrammar';

/** Logo URL must stay byte-identical to the one SD-009 (PR #187) pinned to a
 *  real asset — changing it silently regresses that fix. */
export const ORGANIZATION_LOGO_URL = `${SITE_URL}/og-image.png`;

/** The reference every other schema node uses in place of an inline org node. */
export const organizationRef = { '@id': ORGANIZATION_ID };

export const organizationNode = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: ORGANIZATION_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: ORGANIZATION_LOGO_URL
  }
};

export const webSiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: ORGANIZATION_NAME,
  url: SITE_URL,
  inLanguage: 'de',
  publisher: organizationRef
};

/** The canonical identity graph, emitted once per page by SiteIdentitySchema. */
export const siteIdentityGraph = {
  '@context': 'https://schema.org',
  '@graph': [organizationNode, webSiteNode]
};
