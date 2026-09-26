import { readFile, stat } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const base = 'https://codex-usage.itvincent.net';
const languages = ['en', 'zh', 'ja'];
const features = ['usage-tracking', 'quota-monitoring', 'cost-analysis', 'session-analysis'];
const guides = ['getting-started', 'dashboard', 'quota', 'projects-and-models', 'sessions', 'resets', 'export', 'privacy', 'windows-wsl', 'advanced-settings', 'troubleshooting'];
const sections = ['', 'download', ...features, 'docs', ...guides.map((slug) => `docs/${slug}`)];
const downloadAssets = ['codex-usage-desktop-windows-x64-setup.exe', 'codex-usage-desktop-macos-arm64.dmg', 'codex-usage-desktop-macos-x64.dmg'];
const pathFor = (lang, section = '') => `${lang === 'en' ? '/' : `/${lang}/`}${section ? `${section}/` : ''}`;
const read = (path) => readFile(new URL(path, root), 'utf8');
const errors = [];
const htmlByPath = new Map();

for (const lang of languages) {
  for (const section of sections) {
    const path = pathFor(lang, section);
    const html = await read(`${path.slice(1)}index.html`);
    htmlByPath.set(path, html);
    const canonical = `${base}${path}`;
    if (!html.includes(`<link rel="canonical" href="${canonical}"`)) errors.push(`canonical: ${path}`);
    for (const alternative of languages) {
      const href = `${base}${pathFor(alternative, section)}`;
      const code = alternative === 'zh' ? 'zh-CN' : alternative;
      if (!html.includes(`hreflang="${code}" href="${href}"`)) errors.push(`hreflang ${code}: ${path}`);
    }
    if (!html.includes('property="og:image"')) errors.push(`social image: ${path}`);
    if (!html.includes('application/ld+json')) errors.push(`structured data: ${path}`);
  }
}

for (const [path, html] of htmlByPath) {
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.split(/[?#]/)[0];
    if (target.endsWith('/')) {
      if (!htmlByPath.has(target) && target !== '/404/') errors.push(`broken page link ${path} → ${target}`);
    } else {
      try { await stat(new URL(target.slice(1), root)); }
      catch { errors.push(`missing asset ${path} → ${target}`); }
    }
  }
}

const sitemapIndex = await read('sitemap-index.xml');
const sitemap = await read('sitemap-0.xml');
if (!sitemapIndex.includes('sitemap-0.xml')) errors.push('sitemap index');
for (const path of htmlByPath.keys()) if (!sitemap.includes(`${base}${path}`)) errors.push(`sitemap: ${path}`);
const robots = await read('robots.txt');
if (!robots.includes(`${base}/sitemap-index.xml`)) errors.push('robots sitemap');
const downloadPage = htmlByPath.get('/download/');
for (const asset of downloadAssets) if (!downloadPage.includes(`/releases/latest/download/${asset}`)) errors.push(`download: ${asset}`);
for (const lang of languages) if (!htmlByPath.get(pathFor(lang)).includes(`href="${pathFor(lang, 'download')}" data-primary-download`)) errors.push(`no-JS download: ${lang}`);
for (const lang of languages) {
  const home = htmlByPath.get(pathFor(lang));
  if (!home.includes('workflow-step') || !home.includes('visual-note')) errors.push(`product journey or sample-data note: ${lang}`);
}
for (const privateAsset of ['images/dashboard.jpg', 'images/menubar.jpg', 'images/project-usage-detail.jpg', 'images/session-detail.jpg']) {
  try { await stat(new URL(privateAsset, root)); errors.push(`old personal screenshot still published: ${privateAsset}`); }
  catch { /* Removed assets must remain absent from the published output. */ }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlByPath.size} localized pages, internal assets, metadata, sitemap, and downloads.`);
}
