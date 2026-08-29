import { useNavigate } from 'react-router-dom';
import { SchemaMarkup } from '@/components/SchemaMarkup';

export interface SeoBreadcrumbItem {
  name: string;
  path: string; // site-relative, e.g. '/deutsche-grammatik/'
}

const SITE = 'https://www.infinitegrammar.de';

/** Renders a crawlable breadcrumb trail and the matching BreadcrumbList JSON-LD
 *  from one source of truth. The last item is the current page (not linked). */
export const SeoBreadcrumb = ({ items }: { items: SeoBreadcrumbItem[] }) => {
  const navigate = useNavigate();
  const last = items.length - 1;

  return (
    <>
      <SchemaMarkup
        type="breadcrumb"
        data={{ breadcrumbs: items.map((i) => ({ name: i.name, url: `${SITE}${i.path}` })) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-4 md:mb-6 animate-fade-in text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">→</span>}
              {index === last ? (
                <span className="text-foreground" aria-current="page">{item.name}</span>
              ) : (
                <a
                  href={item.path}
                  className="hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
