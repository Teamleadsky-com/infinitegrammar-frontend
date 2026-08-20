import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SchemaMarkup } from './SchemaMarkup';

const renderSchema = async (props: Parameters<typeof SchemaMarkup>[0]) => {
  // Helmet appends to the shared <head>; drop leftovers so we read this render only.
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach(tag => tag.remove());

  render(
    <HelmetProvider>
      <SchemaMarkup {...props} />
    </HelmetProvider>
  );

  return waitFor(() => {
    // Helmet appends to <head>; the most recent render is the last matching tag.
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    const script = scripts[scripts.length - 1];
    expect(script).toBeDefined();
    return JSON.parse(script.textContent || '');
  });
};

describe('SchemaMarkup', () => {
  it('emits a valid Article JSON-LD block for the article branch', async () => {
    const schema = await renderSchema({
      type: 'article',
      data: {
        headline: 'Deutsche Grammatik lernen',
        description: 'Ein Leitfaden zur deutschen Grammatik.',
        datePublished: '2024-01-01',
        dateModified: '2024-02-01',
        url: 'https://www.infinitegrammar.de/artikel/grammatik',
      },
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Deutsche Grammatik lernen');
    expect(schema.author['@type']).toBe('Organization');
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.logo['@type']).toBe('ImageObject');
    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://www.infinitegrammar.de/artikel/grammatik',
    });
  });

  it('keeps the other branches on their existing schema types', async () => {
    const educational = await renderSchema({
      type: 'educational',
      data: { headline: 'Artikel und Präpositionen' },
    });
    expect(educational['@type']).toBe('LearningResource');

    const breadcrumb = await renderSchema({
      type: 'breadcrumb',
      data: { breadcrumbs: [{ name: 'Start', url: 'https://www.infinitegrammar.de' }] },
    });
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Start',
      item: 'https://www.infinitegrammar.de',
    });

    const faq = await renderSchema({
      type: 'faq',
      data: { faqs: [{ question: 'Was ist das?', answer: 'Eine Übung.' }] },
    });
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity[0]['@type']).toBe('Question');
    expect(faq.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });
});
