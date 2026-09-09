import { describe, it, expect } from 'vitest';
import { buildSchema } from './SchemaMarkup';
import { ORGANIZATION_ID } from '@/lib/siteIdentity';

type JsonLdNode = Record<string, unknown>;

const build = (...args: Parameters<typeof buildSchema>) => buildSchema(...args) as JsonLdNode;

describe('buildSchema — article', () => {
  it('references the canonical organization as publisher instead of inlining one', () => {
    const schema = build('article', { headline: 'Test', url: 'https://www.infinitegrammar.de/articles/test/' });

    expect(schema.publisher).toEqual({ '@id': ORGANIZATION_ID });
    expect((schema.publisher as JsonLdNode)['@type']).toBeUndefined();
  });

  it('types a named human author as a Person with no url', () => {
    const author = build('article', { headline: 'Test', author: 'Alex' }).author as JsonLdNode;

    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Alex');
    expect('url' in author).toBe(false);
  });

  it('falls back to the organization reference when no author is given', () => {
    expect(build('article', { headline: 'Test' }).author).toEqual({ '@id': ORGANIZATION_ID });
  });

  it('treats the brand name as the organization, not a Person', () => {
    expect(build('article', { headline: 'Test', author: 'InfiniteGrammar' }).author).toEqual({
      '@id': ORGANIZATION_ID
    });
  });
});

describe('buildSchema — educational', () => {
  it('references the canonical organization as author', () => {
    const schema = build('educational', { headline: 'B1 Grammatik' });

    expect(schema['@type']).toBe('LearningResource');
    expect(schema.author).toEqual({ '@id': ORGANIZATION_ID });
  });
});

describe('buildSchema — unchanged branches', () => {
  it('emits the same BreadcrumbList shape as before the extraction', () => {
    const schema = buildSchema('breadcrumb', {
      breadcrumbs: [
        { name: 'Home', url: 'https://www.infinitegrammar.de/' },
        { name: 'Articles', url: 'https://www.infinitegrammar.de/articles/' }
      ]
    });

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.infinitegrammar.de/' },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://www.infinitegrammar.de/articles/' }
      ]
    });
  });

  it('emits the same FAQPage shape as before the extraction', () => {
    const schema = buildSchema('faq', { faqs: [{ question: 'Was ist das?', answer: 'Eine Übung.' }] });

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Was ist das?',
          acceptedAnswer: { '@type': 'Answer', text: 'Eine Übung.' }
        }
      ]
    });
  });

  it('returns null for an unknown type', () => {
    expect(buildSchema('nope' as never, {})).toBeNull();
  });
});
