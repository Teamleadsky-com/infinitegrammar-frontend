import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { articles } from '@/data/articles';
import { SchemaMarkup } from '@/components/SchemaMarkup';
import { Footer } from '@/components/Footer';

const Articles = () => {
  const navigate = useNavigate();

  const pageTitle = 'Articles: Building a German Grammar Platform | InfiniteGrammar';
  const pageDescription = 'Technical articles about building InfiniteGrammar.de \u2014 LLM-powered exercise generation, similarity analysis, batch processing, and EdTech product decisions.';
  const pageUrl = 'https://www.infinitegrammar.de/articles/';

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.infinitegrammar.de/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      <SchemaMarkup
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: 'Home', url: 'https://www.infinitegrammar.de/' },
            { name: 'Articles', url: pageUrl }
          ]
        }}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-lg">Infinite Grammar</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3">Building InfiniteGrammar.de</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Technical articles about the product decisions, generation pipelines, and infrastructure behind a German grammar learning platform.
          </p>
        </div>

        <div className="grid gap-6">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/articles/${article.slug}/`);
              }}
              className="block group"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
                <span className="inline-block mt-3 text-sm text-primary font-medium">
                  Read article &rarr;
                </span>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Articles;
