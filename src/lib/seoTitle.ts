/**
 * Single source of truth for the brand suffix in page titles.
 *
 * Every page used to hard-code `"<something> | InfiniteGrammar"`, which made the
 * brand segment the dominant shared boilerplate across the whole site and pushed
 * several titles past the length Google actually renders. The helper appends the
 * suffix only when the finished title still fits in the SERP title budget, so the
 * brand is kept where it is visible and dropped where it would be truncated away.
 */

export const BRAND_NAME = 'InfiniteGrammar';
export const BRAND_SUFFIX = ` | ${BRAND_NAME}`;

/** Titles above this length are truncated in SERPs, so the brand suffix adds no value. */
export const MAX_TITLE_WITH_BRAND = 65;

export interface BuildPageTitleOptions {
  /** Append the brand suffix even when the result exceeds MAX_TITLE_WITH_BRAND. */
  forceBrand?: boolean;
}

export function buildPageTitle(baseTitle: string, options: BuildPageTitleOptions = {}): string {
  const base = (baseTitle ?? '').trim();

  if (!base) return BRAND_NAME;
  if (base.endsWith(BRAND_SUFFIX)) return base;
  if (options.forceBrand) return `${base}${BRAND_SUFFIX}`;

  return base.length + BRAND_SUFFIX.length <= MAX_TITLE_WITH_BRAND
    ? `${base}${BRAND_SUFFIX}`
    : base;
}
