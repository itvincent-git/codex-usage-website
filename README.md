# Codex Usage Desktop website

Static, three-language website for [Codex Usage Desktop](https://github.com/itvincent-git/codex-usage-desktop). Built with Astro 6, TypeScript, Tailwind CSS, MDX, and small React navigation islands.

## Local development

Requires Node.js 24 and pnpm 10.

```sh
pnpm install
pnpm dev
```

Check the source and generated site:

```sh
pnpm check
pnpm build
pnpm verify
```

The build writes static files to `dist/`. Documentation lives in `src/content/docs/{en,zh,ja}`. Each guide needs the same slug in all three languages for language switching and alternate links.

## Deployment

The `main` branch workflow checks and deploys the static `dist/` directory with Wrangler. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets. The Cloudflare account must own `itvincent.net`. `wrangler.jsonc` defines the custom domain and has no Worker script or Astro server adapter.

Download links target fixed filenames under the desktop project's latest GitHub release. Keep those filenames in sync if its release process changes. Screenshots and the icon are copied from the desktop repository; `scripts/generate-og.py` creates the share image from them.
