import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SiteIdentitySchema } from './SiteIdentitySchema';
import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/siteIdentity';

type JsonLdNode = Record<string, unknown>;

const renderGraph = async (): Promise<JsonLdNode[]> => {
  render(
    <HelmetProvider>
      <SiteIdentitySchema />
    </HelmetProvider>
  );

  return waitFor(() => {
    const scripts = Array.from(
      document.head.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(scripts.length).toBeGreaterThan(0);
    return JSON.parse(scripts[0].textContent || '{}')['@graph'] as JsonLdNode[];
  });
};

const nodeOfType = (graph: JsonLdNode[], type: string) =>
  graph.find((node) => node['@type'] === type) as JsonLdNode;

describe('SiteIdentitySchema', () => {
  it('emits exactly one Organization and one WebSite node', async () => {
    const types = (await renderGraph()).map((node) => node['@type']);

    expect(types.filter((type) => type === 'Organization')).toHaveLength(1);
    expect(types.filter((type) => type === 'WebSite')).toHaveLength(1);
  });

  it('gives the Organization the canonical @id referenced by page schema', async () => {
    const org = nodeOfType(await renderGraph(), 'Organization');

    expect(org['@id']).toBe(ORGANIZATION_ID);
    expect(org.name).toBe('InfiniteGrammar');
    expect(org.url).toBe('https://www.infinitegrammar.de');
  });

  // SD-009 regression guard: the publisher logo must keep pointing at a real asset.
  it('keeps the Organization logo URL byte-identical to the SD-009 fix', async () => {
    const org = nodeOfType(await renderGraph(), 'Organization');

    expect(org.logo).toEqual({
      '@type': 'ImageObject',
      url: 'https://www.infinitegrammar.de/og-image.png'
    });
  });

  it('links the WebSite to the same Organization entity', async () => {
    const site = nodeOfType(await renderGraph(), 'WebSite');

    expect(site['@id']).toBe(WEBSITE_ID);
    expect(site.publisher).toEqual({ '@id': ORGANIZATION_ID });
    expect(site.inLanguage).toBe('de');
  });
});
