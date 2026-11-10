# Upstream source

- Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Revision: `9b675f0b13c9c28dec445e8ce4633c18c39b6467`
- Source directory: `.claude/skills/ui-ux-pro-max/`
- Project installation: `.agents/skills/ui-ux-pro-max/` (upstream Codex layout)
- License: MIT; see `LICENSE`.

Installed with the Codex skill-installer helper using an explicit project destination and pinned revision. Scripts, datasets, references, and upstream tests are copied from the source directory; whitespace-only lines in `scripts/design_system.py` are normalized for Git whitespace checks.

Local adaptations: `SKILL.md` resolves script paths from this installed skill directory instead of the Claude plugin environment variable. This provenance file, the upstream license, and a Python cache ignore file are added locally. No website runtime dependency is added.

When updating, install the chosen upstream revision into a temporary destination, review its changes, and preserve the project path adaptation and license. From the project root, check the installation with:

```sh
python3 .agents/skills/ui-ux-pro-max/scripts/validate_data.py
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack astro
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "developer tool dashboard" --design-system
```

Some bundled upstream tests require the full upstream repository; run those in an upstream checkout rather than treating this installed skill as that repository.
