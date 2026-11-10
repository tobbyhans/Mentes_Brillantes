import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/pages/Home.css', import.meta.url), 'utf8');
const home = readFileSync(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8');

test('el home comienza sin el gran margen vacío sobre el logo', () => {
  assert.match(css, /\.home-root \.shell \{[^}]*margin:0 auto 34px/);
  assert.match(css, /@media \(max-width:780px\) \{\.home-root \.shell \{[^}]*margin:0 auto 26px/);
});

test('la presentación conecta directamente con las categorías sin margen sobrante', () => {
  assert.match(css, /\.home-root \.hero \{[^}]*padding:6px 0 0/);
  assert.match(css, /\.home-root \.filters-bar \{[^}]*margin-top:0/);
  assert.match(css, /\.home-root \.hero-stage \{height:190px/);
});

test('mantiene las secciones y enlaces del catálogo', () => {
  assert.match(home, /className="header"/);
  assert.match(home, /className="hero"/);
  assert.match(home, /className="filters-bar"/);
  assert.match(home, /id="juegos"/);
  assert.match(home, /<GameCard/);
});
