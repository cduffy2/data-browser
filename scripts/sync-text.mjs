#!/usr/bin/env node
// Pushes the current DEFAULTS from WelcomePage.tsx to the shared Gist.
// Runs automatically as a git pre-push hook.

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually — avoids dotenvx interfering with file reads
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

// Extract DEFAULTS from source
const src = readFileSync(TARGET, 'utf8');
const obj = {};
const lineRe = /^\s*'([^']+)':\s*'((?:[^'\\]|\\.)*)',?$/gm;
let m;
while ((m = lineRe.exec(src)) !== null) {
  obj[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

if (Object.keys(obj).length === 0) {
  console.error('Could not extract any keys from DEFAULTS in WelcomePage.tsx');
  process.exit(1);
}

// Push to Gist
const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  method: 'PATCH',
  headers: {
    Authorization: `token ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    files: { 'pathways-text.json': { content: JSON.stringify(obj, null, 2) } },
  }),
});

if (!res.ok) {
  const err = await res.json();
  console.error(`Failed to push to Gist: ${res.status} ${err.message}`);
  process.exit(1);
}

console.log(`✓ Gist updated with ${Object.keys(obj).length} keys from DEFAULTS`);
