#!/usr/bin/env node

/**
 * Generate static files with dynamic URLs based on environment variables
 * This script runs during the build process to ensure static files use the correct URL
 */

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Get the app URL from environment variables
const getAppUrl = () => {
    const url = process.env.VITE_APP_URL || 'https://ttisa-ntut.vercel.app';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const APP_URL = getAppUrl();

console.log(`🔄 Generating static files with URL: ${APP_URL}`);

// Generate robots.txt
const generateRobotsTxt = () => {
    const content = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${APP_URL}/sitemap.xml

# Allow crawling of all content
Crawl-delay: 1
`;

    writeFileSync(join(projectRoot, 'public', 'robots.txt'), content);
    console.log('✅ Generated robots.txt');
};

// Generate sitemap.xml
const generateSitemap = () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${APP_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${APP_URL}/events</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${APP_URL}/posts</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${APP_URL}/teams</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${APP_URL}/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;

    writeFileSync(join(projectRoot, 'public', 'sitemap.xml'), content);
    console.log('✅ Generated sitemap.xml');
};

// Generate dynamic index.html
const generateIndexHtml = () => {
    try {
        // Read the template index.html
        const templatePath = join(projectRoot, 'index.html');
        let content = readFileSync(templatePath, 'utf8');

        // Replace all instances of the hardcoded URL
        content = content.replace(/https:\/\/ttisa-ntut\.vercel\.app/g, APP_URL);

        // Write the updated content back
        writeFileSync(templatePath, content);
        console.log('✅ Updated index.html URLs');
    } catch (error) {
        console.error('❌ Error updating index.html:', error.message);
    }
};

// Run all generators
const main = () => {
    try {
        generateRobotsTxt();
        generateSitemap();
        generateIndexHtml();
        console.log('🎉 All static files generated successfully!');
    } catch (error) {
        console.error('❌ Error generating static files:', error);
        process.exit(1);
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { generateRobotsTxt, generateSitemap, generateIndexHtml };