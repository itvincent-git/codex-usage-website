# Codex Usage Desktop website

Static, three-language website for [Codex Usage Desktop](https://github.com/itvincent-git/codex-usage-desktop). Built with Astro 7, TypeScript, Tailwind CSS, MDX, and small React navigation islands.

## Local development

Requires Node.js 24 and pnpm 11.

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

Website colors, type, breakpoints, and shared components such as `.button`, `.wrap`, and `.eyebrow` live in `tailwind.preset.mjs`. `tailwind.config.mjs` loads the preset, and `src/styles/global.css` activates that config with `@config`. Page specific layouts and sample product visuals remain in `src/styles/global.css` and `src/styles/visuals.css`.

## Deployment

The `main` branch workflow checks and deploys the static `dist/` directory with Wrangler. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets. The Cloudflare account must own `itvincent.net`. `wrangler.jsonc` defines the custom domain and has no Worker script or Astro server adapter.

Download links target fixed filenames under the desktop project's latest GitHub release. Keep those filenames in sync if its release process changes. The public screenshots are cropped from the running desktop app and contain only settings and public model pricing. Usage and session visuals use sample data. The social card is a source-controlled SVG with sample data, rendered to `public/og.png` for social previews.
