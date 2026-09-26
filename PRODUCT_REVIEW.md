# Website product review — 2026-09-26

## App walkthrough

I opened the installed Codex Usage Desktop 3.6.1 on macOS and inspected its Dashboard, Sessions, Model, Daily, Monthly, Project, Settings, and Logs views. I also opened the menu bar controls, the Model pricing catalog, and the Menu Bar / System Tray settings. The live app confirmed these capabilities:

- Dashboard combines token and estimated cost trends with cost drivers, 5-hour and weekly limits, reset timing, and available reset forecasts.
- Sessions gives a chronological, command-by-command view. Daily, Monthly, Project, and Model views provide different ways to trace usage.
- Model contains both usage analysis and a searchable pricing catalog. Settings controls which metrics appear in the menu bar or tray and how countdowns are formatted.
- The app offers local log rescanning and export from usage views.
- The limit card separates a read-only quota check from starting a new 5-hour window; the latter sends a minimal Codex request and consumes a small amount of quota. The three quota guides now explain this distinction.

## Website improvement plan and execution

1. **Explain the user journey.** Add a three-step flow from checking available quota to locating usage and reviewing or exporting a session. Done on all three localized homepages.
2. **Make the product visible at useful scale.** Replace the small full-window hero image with a legible dashboard illustration modeled on the current UI. Use focused visuals in feature cards and detail pages. Done.
3. **Show verified, distinctive controls.** Publish cropped screenshots of the live menu bar settings and public pricing catalog. Done.
4. **Protect private usage data.** Remove earlier screenshots and the old social card because they retained real totals, project names, log snippets, or other personal context. Keep only public-interface screenshots; render usage and sessions with explicit sample data. Done.
5. **Validate.** Astro check, build, and site verification pass. Browser review covered 1440px desktop and 390px mobile pages, including the Japanese homepage, dark mode, image loading, horizontal overflow, console errors, and the mobile menu. The changes are committed locally.

## Screenshot policy

`public/images/menu-bar-settings.png` and `public/images/pricing-catalog.png` were captured from the running app with screen-region capture. Their crops exclude the macOS menu bar, account information, personal usage, local paths, and session contents. Pricing rows are public catalog data and may change. The dashboard, session, and social visuals use synthetic data; the site labels them as illustrative. Do not copy live usage screenshots into `public/` without a new privacy review.

Both published screenshots were also reviewed with OCR on 2026-09-26. Extracted text contains only interface labels, the menu bar format template, model names, provider names, and public catalog prices; it contains no email address, local path, project title, or session content.

## Download check

On 2026-09-26, the latest GitHub release was `app-v3.6.1`. Its assets include the exact three installer filenames linked by the website: `codex-usage-desktop-windows-x64-setup.exe`, `codex-usage-desktop-macos-arm64.dmg`, and `codex-usage-desktop-macos-x64.dmg`.
