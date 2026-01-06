import { Helmet } from 'react-helmet-async';

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

export const SchemaMarkup = ({ type, data }: SchemaMarkupProps) => {
  const getSchema = () => {
    switch (type) {
      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.description,
          author: {
            '@type': 'Organization',
            name: data.author || 'InfiniteGrammar',
            url: 'https://www.infinitegrammar.de'
          },
          publisher: {
            '@type': 'Organization',
            name: 'InfiniteGrammar',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.infinitegrammar.de/logo.png'
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          image: data.image || 'https://www.infinitegrammar.de/og-image.png'
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
          author: {
            '@type': 'Organization',
            name: 'InfiniteGrammar'
          }
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

  const schema = getSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
