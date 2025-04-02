import { CHANGEFREQ, SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';

async function generateSitemap() {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/categories', changefreq: 'daily', priority: 1.0 },
    { url: '/profile', changefreq: 'daily', priority: 1.0 },
    { url: '/product/:productId', changefreq: 'daily', priority: 1.0 },
    { url: '/cart', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    // Add more URLs here
  ];

  const stream = new SitemapStream({ hostname: 'https://suveganow.netlify.app' });
  links.forEach(link => stream.write(link));
  stream.end();

  const sitemap = await streamToPromise(stream).then((data) => data.toString());
  fs.writeFileSync('./public/sitemap.xml', sitemap);
}

generateSitemap();