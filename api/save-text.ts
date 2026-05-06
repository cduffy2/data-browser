import type { VercelRequest, VercelResponse } from '@vercel/node';

const GIST_ID = process.env.VITE_GIST_ID!;
const TOKEN = process.env.VITE_GITHUB_TOKEN!;
const GIST_FILE = 'pathways-text.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!GIST_ID || !TOKEN) {
    return res.status(500).json({ error: 'Server misconfigured — missing Gist credentials' });
  }

  let text: Record<string, string>;
  try {
    text = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (typeof text !== 'object' || Array.isArray(text)) throw new Error();
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [GIST_FILE]: { content: JSON.stringify(text, null, 2) } },
    }),
  });

  if (!gistRes.ok) {
    const err = await gistRes.json() as { message?: string };
    return res.status(502).json({ error: `Gist update failed: ${err.message ?? gistRes.status}` });
  }

  return res.status(200).json({ ok: true });
}
