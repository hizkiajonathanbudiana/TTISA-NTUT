import { useEffect } from 'react';
import { getAppUrl, getFullUrl } from '../utils/url';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title = "TTISA NTUT - Taiwan Tech International Student Association",
    description = "Taiwan Tech International Student Association (TTISA) at National Taiwan University of Science and Technology (NTUT). Join our community of international students for events, networking, and support.",
    keywords = "TTISA, NTUT, Taiwan Tech, International Students, Student Association, National Taiwan University of Science and Technology, Taiwan, International Community, Events, Networking",
    image = getFullUrl('/ttisa-logo.png'),
    url = getAppUrl()
}: SEOProps) => {
    useEffect(() => {
        // Update title
        document.title = title;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${name}"]`);

            if (element) {
                element.setAttribute('content', content);
            } else {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                element.setAttribute('content', content);
                document.head.appendChild(element);
            }
        };

        // Basic meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph tags
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:image', image, true);
        updateMetaTag('og:url', url, true);

        // Twitter tags
        updateMetaTag('twitter:title', title, true);
        updateMetaTag('twitter:description', description, true);
        updateMetaTag('twitter:image', image, true);
        updateMetaTag('twitter:url', url, true);

        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', url);
        } else {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', url);
            document.head.appendChild(canonical);
        }
    }, [title, description, keywords, image, url]);

    return null;
};