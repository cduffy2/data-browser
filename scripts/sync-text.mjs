#!/usr/bin/env node
// Fetches latest text from the shared Gist and updates DEFAULTS in WelcomePage.tsx.
// Run before committing: npm run sync-text

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually to avoid dotenvx interfering with readFileSync
const envPath = join(__dirname, '../.env');
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim().replace(/^["']|["']$/g, '')]; })
);

const GIST_ID = envVars.VITE_GIST_ID;
const TOKEN = envVars.VITE_GITHUB_TOKEN;
const TARGET = join(__dirname, '../src/pages/WelcomePage/WelcomePage.tsx');

if (!GIST_ID || !TOKEN) {
  console.error('Missing VITE_GIST_ID or VITE_GITHUB_TOKEN in .env');
  process.exit(1);
}

const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  headers: { Authorization: `token ${TOKEN}` },
});

if (!res.ok) {
  console.error(`Failed to fetch Gist: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const data = await res.json();
const content = data.files?.['pathways-text.json']?.content;
if (!content) {
  console.error('pathways-text.json not found in Gist');
  process.exit(1);
}

const remote = JSON.parse(content);

// Build the new DEFAULTS block
const lines = Object.entries(remote)
  .map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`)
  .join('\n');
const newDefaults = `const DEFAULTS: Record<string, string> = {\n${lines}\n};`;

// Replace existing DEFAULTS block in the source file
const src = readFileSync(TARGET, 'utf8');
const updated = src.replace(
  /const DEFAULTS: Record<string, string> = \{[\s\S]*?\n\};/,
  newDefaults
);

const hasMatch = /const DEFAULTS: Record<string, string> = \{[\s\S]*?\n\};/.test(src);
if (!hasMatch) {
  console.error('Could not find DEFAULTS block to replace in WelcomePage.tsx');
  process.exit(1);
}

if (updated === src) {
  console.log(`✓ DEFAULTS already up to date (${Object.keys(remote).length} keys)`);
} else {
  writeFileSync(TARGET, updated, 'utf8');
  console.log(`✓ DEFAULTS updated with ${Object.keys(remote).length} keys from Gist`);
}
