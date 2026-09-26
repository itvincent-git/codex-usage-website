import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://codex-usage.itvincent.net',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rolldownOptions: {
        onLog(level, log, defaultHandler) {
          // Astro adds this internal directive to content asset propagation modules.
          if (
            level === 'warn' &&
            log.code === 'MODULE_LEVEL_DIRECTIVE' &&
            log.id?.includes('?astroPropagatedAssets') &&
            log.message.includes('"use astro:head-inject"')
          ) {
            return;
          }
          defaultHandler(level, log);
        },
      },
    },
  },
});
