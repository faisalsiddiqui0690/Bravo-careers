import { useEffect } from 'react';

const SEO = ({ 
  title = "Bravo Careers | UK Career and Founder Support",
  description = "Practical career and founder support, UK job-search guidance and resources from Bravo Careers.",
  keywords = "Bravo Careers, UK careers, job search support, CV guidance, founder support, career resources",
  ogImage = "/bravo-career-services.svg",
  canonical,
  structuredData
}) => {
  useEffect(() => {
    const siteUrl = window.location.origin;
    const fullUrl = canonical ? new URL(canonical, siteUrl).href : window.location.href;

    // Update title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', new URL(ogImage, siteUrl).href, true);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', fullUrl, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', new URL(ogImage, siteUrl).href, true);

    // Update canonical link
    if (canonical) {
      let canonicalElement = document.querySelector('link[rel="canonical"]');
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute('href', fullUrl);
    }

    // Add structured data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('data-dynamic', 'true');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, canonical, structuredData]);

  return null;
};

export default SEO;
