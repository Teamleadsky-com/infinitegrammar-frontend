import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { articles, getArticleBySlug } from '@/data/articles';
import { SchemaMarkup } from '@/components/SchemaMarkup';
import { Footer } from '@/components/Footer';

const ArticleContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = getArticleBySlug(slug || '');

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <button
            onClick={() => navigate('/articles/')}
            className="text-primary underline"
          >
            Back to articles
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = `${article.title} | InfiniteGrammar`;
  const pageUrl = `https://www.infinitegrammar.de/articles/${article.slug}/`;

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.infinitegrammar.de/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={article.excerpt} />
      </Helmet>

      <SchemaMarkup
        type="article"
        data={{
          headline: article.title,
          description: article.excerpt,
          url: pageUrl,
          author: 'Alex',
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          keywords: ['InfiniteGrammar', 'German grammar', 'EdTech', 'LLM', 'exercise generation']
        }}
      />
      <SchemaMarkup
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: 'Home', url: 'https://www.infinitegrammar.de/' },
            { name: 'Articles', url: 'https://www.infinitegrammar.de/articles/' },
            { name: article.title, url: pageUrl }
          ]
        }}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href="/articles/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/articles/');
            }}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <span className="font-semibold text-lg truncate">Articles</span>
        </div>
      </div>

      {/* Article */}
      <div className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3">
            <img
              src="/images/author-alex.jpg"
              alt="Alex"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <a
                href="https://www.linkedin.com/in/aleksandrz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Alex
              </a>
              <p className="text-xs text-muted-foreground">Building InfiniteGrammar.de</p>
            </div>
          </div>
        </header>

        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />

        {/* Next article */}
        {(() => {
          const currentIndex = articles.findIndex(a => a.slug === article.slug);
          const nextArticle = currentIndex >= 0 && currentIndex < articles.length - 1
            ? articles[currentIndex + 1]
            : null;
          if (!nextArticle) return null;
          return (
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-2">Next article</p>
              <a
                href={`/articles/${nextArticle.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/articles/${nextArticle.slug}/`);
                }}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {nextArticle.title} &rarr;
              </a>
            </div>
          );
        })()}
      </div>

      <Footer />
    </div>
  );
};

export default ArticleContent;
