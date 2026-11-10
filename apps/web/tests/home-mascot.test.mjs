import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const src = new URL('../src/', import.meta.url);
const load = (p) => readFileSync(new URL(p, src), 'utf8');
test('el home usa la imagen exacta de las mascotas', () => {
  const page = load('pages/HomePage.tsx');
  assert.match(page, /import hero from '\.\.\/assets\/hero-mascotas\.png'/);
  assert.match(page, /src=\{hero\}.*className="home-hero-art"/);
  assert.ok(existsSync(new URL('assets/hero-mascotas.png', src)));
  assert.ok(!existsSync(new URL('assets/home-hero-cute.png', src)));
});
test('la imagen tiene medidas adaptables al home', () => {
  const css = load('pages/Home.css');
  assert.match(css, /hero-stage \.home-hero-art.*object-fit:contain/);
  assert.match(css, /mix-blend-mode:multiply/);
});
