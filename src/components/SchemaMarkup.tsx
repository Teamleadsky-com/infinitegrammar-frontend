import { Helmet } from 'react-helmet-async';
import { ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, organizationRef } from '@/lib/siteIdentity';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SchemaMarkupProps {
  type: 'article' | 'educational' | 'breadcrumb' | 'faq';
  data: {
    // Article/Educational schema
    headline?: string;
    description?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    url?: string;
    image?: string;
    keywords?: string[];
    educationalLevel?: string;
    learningResourceType?: string;

    // Breadcrumb schema
    breadcrumbs?: BreadcrumbItem[];

    // FAQ schema
    faqs?: FAQItem[];
  };
}

/** A named author who is not the brand itself is a Person, not the Organization.
 *  Everything else resolves to the one canonical org entity by reference. */
const buildAuthor = (author?: string) => {
  if (!author || author === ORGANIZATION_NAME) return organizationRef;

  return {
    '@type': 'Person',
    name: author
  };
};

export const buildSchema = (type: SchemaMarkupProps['type'], data: SchemaMarkupProps['data']) => {
  switch (type) {
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        author: buildAuthor(data.author),
        publisher: organizationRef,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        },
        image: data.image || ORGANIZATION_LOGO_URL
      };

    case 'educational':
      return {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: data.headline,
        description: data.description,
        educationalLevel: data.educationalLevel || 'Beginner',
        learningResourceType: data.learningResourceType || 'Grammar Guide',
        inLanguage: 'de',
        about: {
          '@type': 'Thing',
          name: 'German Grammar'
        },
        teaches: data.keywords?.join(', '),
        isAccessibleForFree: true,
        url: data.url,
        author: organizationRef
      };

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.breadcrumbs?.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs?.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };

    default:
      return null;
  }
};

export const SchemaMarkup = ({ type, data }: SchemaMarkupProps) => {
  const schema = buildSchema(type, data);

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
