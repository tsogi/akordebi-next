import db from '@/services/db';
var builder = require('xmlbuilder');

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const generateSitemapXml = (records) => {
  const urlset = builder.create('urlset', { encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    
    urlset
        .ele('url')
        .ele('loc', `https://${domain}`)
        .up()
        .ele('changefreq', 'daily')
        .up()
        .ele('priority', 1)
        .up();

    urlset
        .ele('url')
        .ele('loc', `https://${domain}/createSong`)
        .up()
        .ele('changefreq', 'weekly')
        .up()
        .ele('priority', 0.95)
        .up();

  let priority = (0.800).toFixed(3);
  records.forEach((record) => {
    urlset
      .ele('url')
      .ele('loc', `https://${domain}/chord/${record.url}`)
      .up()
      .ele('changefreq', 'monthly')
      .up()
      .ele('priority', priority)
      .up();

    priority = (priority - 0.0001).toFixed(3);
  });

  return urlset.end({ pretty: true });
};

export default async (req, res) => {
  try {
    let results = await db.getAllSongsSorted();

    const sitemapXml = generateSitemapXml(results);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename=sitemap.xml');
    res.status(200).send(sitemapXml);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the MySQL database.' });
  }
};