#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const src = path.join(repoRoot, 'news-reports');

// Target: --target=public (default) or --target=out (legacy static-export path).
// `public/` is the canonical Next.js static-asset root and works on both
// GitHub Pages (output: 'export') and Vercel — files placed there before
// `next build` are baked into the deploy. `out/` is kept for backward
// compatibility but should not be the primary path.
const targetArg = process.argv.find((a) => a.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'public';
const dest = path.join(repoRoot, target, 'news-reports');

if (!fs.existsSync(src)) {
  console.warn(`[copy-news-reports] source not found, skipping: ${src}`);
  process.exit(0);
}
const targetRoot = path.join(repoRoot, target);
if (!fs.existsSync(targetRoot)) {
  fs.mkdirSync(targetRoot, { recursive: true });
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`[copy-news-reports] copied ${src} -> ${dest}`);

// Build a manifest of historical snapshots so the React page can render a picker.
const htmlRoot = path.join(dest, 'html');
const manifest = { latest: null, dates: [] };

if (fs.existsSync(htmlRoot)) {
  const dateDirRe = /^\d{4}-\d{2}-\d{2}$/;
  const timeFileRe = /^(\d{2}-\d{2})\.html$/;

  const entries = fs
    .readdirSync(htmlRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  if (entries.some((e) => e.name === 'latest')) {
    const latestFile = path.join(htmlRoot, 'latest', 'current.html');
    if (fs.existsSync(latestFile)) {
      manifest.latest = 'html/latest/current.html';
    }
  }

  const dates = entries
    .filter((e) => dateDirRe.test(e.name))
    .map((e) => e.name)
    .sort()
    .reverse();

  for (const date of dates) {
    const dir = path.join(htmlRoot, date);
    const snapshots = fs
      .readdirSync(dir)
      .map((f) => f.match(timeFileRe))
      .filter(Boolean)
      .map((m) => ({
        time: m[1].replace('-', ':'),
        path: `html/${date}/${m[0]}`,
      }))
      .sort((a, b) => b.time.localeCompare(a.time));

    if (snapshots.length > 0) {
      manifest.dates.push({ date, snapshots });
    }
  }
}

fs.writeFileSync(
  path.join(dest, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
);
console.log(
  `[copy-news-reports] wrote manifest.json (${manifest.dates.length} dates, latest=${!!manifest.latest})`,
);
