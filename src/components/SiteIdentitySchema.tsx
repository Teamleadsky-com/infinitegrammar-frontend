import { Helmet } from 'react-helmet-async';
import { siteIdentityGraph } from '@/lib/siteIdentity';

/** Emits the canonical Organization + WebSite graph. Rendered once at App level
 *  so the `@id` targets referenced by page-level schema exist on every route. */
export const SiteIdentitySchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(siteIdentityGraph)}
    </script>
  </Helmet>
);
