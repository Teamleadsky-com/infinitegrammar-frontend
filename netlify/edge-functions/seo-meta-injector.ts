import type { Context } from "@netlify/edge-functions";

// List of bot user agents that need server-rendered meta tags
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Pinterest',
  'Discordbot',
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
];

// SEO content for each city/exam page
const CITY_CONTENT: Record<string, { title: string; description: string }> = {
  'telc-berlin': {
    title: 'telc Prüfungszentren in Berlin – Termine & Anmeldung',
    description: 'Finde telc-Prüfungszentren in Berlin: VHS, Sprachschulen & Institute. Mit Tipps zur Anmeldung und Links zu offiziellen Terminen.',
  },
  'testdaf-berlin': {
    title: 'TestDaF Prüfungszentren in Berlin – Termine & Vorbereitung',
    description: 'TestDaF in Berlin ablegen: Uni-Sprachzentren, Goethe-Institut & mehr. Termine, Anmeldung und Tipps zur Vorbereitung.',
  },
  'telc-muenchen': {
    title: 'telc Prüfungszentren in München – VHS, Berlitz & mehr',
    description: 'telc-Prüfungen in München: Finde Termine bei VHS, Berlitz, Inlingua und Goethe-Institut. Tipps zur Anmeldung und Vorbereitung.',
  },
  'testdaf-muenchen': {
    title: 'TestDaF Prüfungszentren in München – Uni & Institute',
    description: 'TestDaF in München: LMU, TU München, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für deine TestDaF-Prüfung.',
  },
  'telc-hamburg': {
    title: 'telc Prüfungszentren in Hamburg – VHS & Sprachschulen',
    description: 'telc-Prüfungen in Hamburg: VHS Hamburg, Berlitz, Goethe-Institut. Termine finden, anmelden und optimal vorbereiten.',
  },
  'testdaf-hamburg': {
    title: 'TestDaF Prüfungszentren in Hamburg – Uni & Institute',
    description: 'TestDaF in Hamburg ablegen: Universität Hamburg, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
  },
  'telc-koeln': {
    title: 'telc Prüfungszentren in Köln – VHS & mehr',
    description: 'telc-Prüfungen in Köln: VHS, Sprachschulen, Goethe-Institut. Termine, Anmeldung und Tipps für deine telc-Vorbereitung.',
  },
  'testdaf-koeln': {
    title: 'TestDaF Prüfungszentren in Köln – Uni & Institute',
    description: 'TestDaF in Köln: Universität zu Köln, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und gezielter Vorbereitung.',
  },
  'telc-frankfurt': {
    title: 'telc Prüfungszentren in Frankfurt – VHS & Goethe-Institut',
    description: 'telc-Prüfungen in Frankfurt: VHS, Goethe-Institut und Sprachschulen. Termine finden, anmelden und vorbereiten.',
  },
  'testdaf-frankfurt': {
    title: 'TestDaF Prüfungszentren in Frankfurt – Goethe-Universität & mehr',
    description: 'TestDaF in Frankfurt: Goethe-Universität, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps für den TestDaF.',
  },
  'telc-stuttgart': {
    title: 'telc Prüfungszentren in Stuttgart – VHS, Berlitz & mehr',
    description: 'telc-Prüfungen in Stuttgart: VHS, Berlitz, Inlingua, Goethe-Institut. Termine, Anmeldung und Vorbereitungstipps.',
  },
  'testdaf-stuttgart': {
    title: 'TestDaF Prüfungszentren in Stuttgart – Uni & Institute',
    description: 'TestDaF in Stuttgart: Universität Stuttgart, Goethe-Institut. Alle Infos zu Terminen, Anmeldung und Vorbereitung.',
  },
};

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function getCityPageMeta(pathname: string) {
  // Match /pruefungszentren/telc-berlin pattern
  const match = pathname.match(/^\/pruefungszentren\/(telc|testdaf)-(berlin|muenchen|hamburg|koeln|frankfurt|stuttgart)$/);

  if (match) {
    const key = `${match[1]}-${match[2]}`;
    const content = CITY_CONTENT[key];

    if (content) {
      return {
        title: `${content.title} | Infinite Grammar`,
        description: content.description,
        url: `https://www.infinitegrammar.de${pathname}`,
      };
    }
  }

  // Main pruefungszentren page
  if (pathname === '/pruefungszentren') {
    return {
      title: 'telc & TestDaF Prüfungszentren finden (VHS, Unis, Institute) | Infinite Grammar',
      description: 'Finde telc- und TestDaF-Prüfungszentren in Deutschland: VHS, Uni-Sprachzentren, Goethe-Institut & mehr. Mit Links, Tipps zur Anmeldung und Vorbereitung.',
      url: 'https://www.infinitegrammar.de/pruefungszentren',
    };
  }

  return null;
}

function injectMetaTags(html: string, meta: { title: string; description: string; url: string }): string {
  // Escape HTML in meta content
  const escapeHtml = (str: string) => str.replace(/"/g, '&quot;');

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(meta.description)}"`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}"`
  );

  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}"`
  );

  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${escapeHtml(meta.url)}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}"`
  );

  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}"`
  );

  return html;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = url.pathname;

  console.log('Edge function called for:', pathname);
  console.log('User-Agent:', userAgent);

  // Check if this is an SEO page first
  const meta = getCityPageMeta(pathname);

  if (!meta) {
    console.log('Not an SEO page, passing through');
    return context.next();
  }

  // Only process crawler requests for SEO pages
  const isCrawlerRequest = isCrawler(userAgent);
  console.log('Is crawler:', isCrawlerRequest);

  if (!isCrawlerRequest) {
    console.log('Not a crawler, serving normal SPA');
    return context.next();
  }

  console.log('Processing crawler request with meta:', meta);

  // Get the original HTML response
  const response = await context.next();
  const html = await response.text();

  console.log('Original HTML length:', html.length);

  // Inject the correct meta tags
  const modifiedHtml = injectMetaTags(html, meta);

  console.log('Modified HTML length:', modifiedHtml.length);
  console.log('Injected meta tags for:', pathname);

  // Return modified HTML
  return new Response(modifiedHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate', // Don't cache for debugging
      'x-seo-injected': 'true',
    },
  });
};
