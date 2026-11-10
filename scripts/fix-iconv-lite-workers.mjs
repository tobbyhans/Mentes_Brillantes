// Work around the Wrangler / iconv-lite browser-map interaction.
// https://github.com/cloudflare/workers-sdk/issues/9309
//
// Some versions of iconv-lite mark their streams implementation as "false"
// for browser bundles. When running with nodejs_compat, iconv-lite executes
// that module at startup, leading to require_streams(...) is not a function.
// Remove only those browser replacements from installed dependencies.
// This file runs after "npm run build", before Wrangler bundles the Worker.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const candidates = [
  'node_modules/iconv-lite/package.json',
  'node_modules/body-parser/node_modules/iconv-lite/package.json',
  'node_modules/raw-body/node_modules/iconv-lite/package.json',
  'apps/api/node_modules/iconv-lite/package.json',
];

let installed = 0;
let patched = 0;

for (const candidate of candidates) {
  const file = join(root, candidate);
  let content;
  try {
    content = await readFile(file, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') continue;
    throw error;
  }

  installed++;
  const pkg = JSON.parse(content);
  const browser = pkg.browser;
  if (browser && typeof browser === 'object' && !Array.isArray(browser) &&
      (browser['./lib/streams'] === false || browser['./lib/extend-node'] === false)) {
    delete browser['./lib/streams'];
    delete browser['./lib/extend-node'];
    if (Object.keys(browser).length === 0) delete pkg.browser;
    await writeFile(file, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    patched++;
    console.log('[Cloudflare] Ajustado ' + candidate + ' para nodejs_compat');
  }
}

if (installed === 0) {
  throw new Error('iconv-lite no está instalado. Ejecuta npm ci antes de compilar.');
}
console.log('[Cloudflare] iconv-lite encontrado: ' + installed + ', ajustado: ' + patched);
