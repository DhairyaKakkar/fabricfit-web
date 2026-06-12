export interface PostFaq {
  q: string;
  a: string;
}

export interface PostSection {
  /** H2 heading for the section */
  h2: string;
  /** Section body as HTML — may contain <h3>, <p>, <ul>, <ol>, <li>, <strong>, <a> */
  html: string;
}

export interface Post {
  /** URL slug, kebab-case */
  slug: string;
  /** H1 shown on the page */
  title: string;
  /** SEO title, <= 60 chars (brand is appended by the layout template) */
  metaTitle: string;
  /** SEO description, <= 155 chars */
  metaDescription: string;
  keywords: string[];
  /** ISO date, e.g. '2026-06-11' */
  date: string;
  category: string;
  /** Funnel stage this post targets */
  funnel: 'top' | 'middle' | 'bottom';
  /** Card teaser, 1–2 sentences */
  excerpt: string;
  /** Opening paragraphs as HTML (no heading) */
  intro: string;
  sections: PostSection[];
  /** Optional — rendered as an FAQ block with FAQPage JSON-LD */
  faq?: PostFaq[];
}
