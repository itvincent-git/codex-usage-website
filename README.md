# Codex Usage Desktop website

Static, four-language website (English, Simplified Chinese, Traditional Chinese, and Japanese) for [Codex Usage Desktop](https://github.com/itvincent-git/codex-usage-desktop). Built with Astro 7, TypeScript, Tailwind CSS, MDX, and small React navigation islands.

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

Run the browser regression checks against a production preview (using the port printed by Astro):

```sh
pnpm preview --host 127.0.0.1 --port 4322
# In another terminal:
playwright-cli open http://127.0.0.1:4322
playwright-cli run-code --filename scripts/verify-ui.playwright.js
```

The browser checks cover the four languages, responsive layouts, theme contrast, keyboard navigation, Mac downloads, reduced motion, and navigation with JavaScript disabled.

The build writes static files to `dist/`. Documentation lives in `src/content/docs/{en,zh,zh-tw,ja}`. Each guide needs the same slug in all four languages for language switching and alternate links.

Website colors, type, breakpoints, and shared components such as `.button`, `.wrap`, and `.eyebrow` live in `tailwind.preset.mjs`. `tailwind.config.mjs` loads the preset, and `src/styles/global.css` activates that config with `@config`. Page specific layouts and sample product visuals remain in `src/styles/global.css` and `src/styles/visuals.css`.

## UI/UX skill

[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) is installed in the development environment's global Codex skills directory, `$CODEX_HOME/skills/ui-ux-pro-max/` (default: `~/.codex/skills/ui-ux-pro-max/`). It provides UI/UX guidance and search data, including Astro recommendations. Requires Python 3; no extra Python packages are needed. The skill is no longer bundled in this repository and is optional for building the website.

Invoke it in a prompt, for example: `Use $ui-ux-pro-max to review this site's responsive layout.` To check the global search tool from any directory:

```sh
python3 "${CODEX_HOME:-$HOME/.codex}/skills/ui-ux-pro-max/scripts/search.py" "responsive layout" --stack astro
```

The installed revision and local adaptations are recorded in `UPSTREAM.md` inside the global skill directory. The [security audit](UI_UX_PRO_MAX_SECURITY_AUDIT.md) records the reviewed version and migration.

## Deployment

For local deployment, install the locked dependencies and sign in to the Cloudflare account that owns `itvincent.net`:

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm run deploy
```

`pnpm run deploy` checks the source, builds the site, verifies the generated pages, and deploys to https://codex-usage.itvincent.net. Any failed step stops the deployment. To run the same checks and validate the deployment package without publishing or requiring a login:

```sh
pnpm run deploy --dry-run
```

For non-interactive deployment, provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` through your environment instead of running `wrangler login`. Keep credentials out of Git.

The `main` branch workflow checks and deploys the static `dist/` directory with Wrangler. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets. The Cloudflare account must own `itvincent.net`. `wrangler.jsonc` defines the custom domain and has no Worker script or Astro server adapter.

Download links target fixed filenames under the desktop project's latest GitHub release. Keep those filenames in sync if its release process changes. The public screenshots are cropped from the running desktop app and contain only settings and public model pricing. Usage and session visuals use sample data. The social card is a source-controlled SVG with sample data, rendered to `public/og.png` for social previews.
