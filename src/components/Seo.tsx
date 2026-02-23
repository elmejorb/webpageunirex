import React, { useEffect } from 'react';

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
};

const upsertMeta = (selectorAttr: 'name' | 'property', key: string, content: string) => {
  const selector = `meta[${selectorAttr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute('content', content);
  } else {
    el = document.createElement('meta');
    el.setAttribute(selectorAttr, key);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }
};

const setCanonical = (url?: string) => {
  if (!url) return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (link) link.href = url;
  else {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }
};

const Seo: React.FC<SeoProps> = ({ title, description, image, canonical }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta('name', 'description', description);
    if (canonical) setCanonical(canonical);

    // Open Graph
    if (title) upsertMeta('property', 'og:title', title);
    if (description) upsertMeta('property', 'og:description', description);
    if (image) upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', 'es_CO');

    // Twitter
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) upsertMeta('name', 'twitter:image', image);
  }, [title, description, image, canonical]);

  return null;
};

export default Seo;
