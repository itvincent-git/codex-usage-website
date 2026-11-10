import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: pnpm run deploy [--dry-run]\n\nCheck, build, verify, and deploy to https://codex-usage.itvincent.net.\nUse --dry-run to validate without publishing.');
  process.exit(0);
}

if (args.some((arg) => arg !== '--dry-run')) {
  console.error('Unknown option. Usage: pnpm run deploy [--dry-run]');
  process.exit(1);
}

// Reuse the package manager running this script, including its pinned version.
const pnpm = process.env.npm_execpath;
if (!pnpm) {
  console.error('Run this script with: pnpm run deploy [--dry-run]');
  process.exit(1);
}

for (const command of [
  ['run', 'check'],
  ['run', 'build'],
  ['run', 'verify'],
  ['exec', 'wrangler', 'deploy', ...args],
]) {
  console.log(`\n> pnpm ${command.join(' ')}`);
  const result = spawnSync(process.execPath, [pnpm, ...command], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(args.includes('--dry-run')
  ? '\nDeployment dry run passed. Nothing was published.'
  : '\nDeployed to https://codex-usage.itvincent.net');
