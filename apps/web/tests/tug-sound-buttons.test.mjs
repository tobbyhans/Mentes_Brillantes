import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('Música y Sonidos se controlan con dos botones de estado independientes', () => {
  const controls = read('src/games/tug/components/AudioButtons.tsx');
  assert.match(controls, /<span>Música<\/span>/);
  assert.match(controls, /<span>Sonidos<\/span>/);
  assert.match(controls, /onChange\(\{ musicOn: !settings\.musicOn \}\)/);
  assert.match(controls, /onChange\(\{ sfxOn: !settings\.sfxOn \}\)/);
  assert.match(controls, /aria-pressed=\{settings\.musicOn\}/);
  assert.match(controls, /aria-pressed=\{settings\.sfxOn\}/);
  assert.equal(existsSync(new URL('../src/games/tug/components/SoundControls.tsx', import.meta.url)), false);
});

test('los botones modifican los canales del mismo motor Web Audio, incluso con partida empezada', () => {
  const app = read('src/games/tug/App.tsx');
  const audio = read('src/games/tug/lib/audio.ts');
  assert.match(app, /withAudio\(director => director\.setPreferences\(next\)\)/);
  assert.match(app, /director\.setPreferences\(audioSettings\);\s*director\.startMatch\(\)/);
  assert.match(app, /audio\.current = null/);
  assert.match(audio, /this\.musicBus\.gain\.setTargetAtTime/);
  assert.match(audio, /this\.sfxBus\.gain\.setTargetAtTime/);
  assert.match(audio, /this\.playing && this\.musicOn/);
  assert.match(app, /director\.pauseMatch\(\)/);
  assert.match(app, /director\.resumeMatch\(\)/);
});

test('botones adaptados al estilo del catálogo sin menú antiguo', () => {
  const styles = read('src/games/tug/compact-layout.css');
  assert.match(styles, /\.tug-audio-buttons \.sound-btn\.enabled/);
  assert.match(styles, /border-radius: 999px/);
  for (const file of ['styles.css','mentes-theme.css','world-theme.css']) {
    assert.doesNotMatch(read(`src/games/tug/${file}`), /sound-popover|sound-controls/);
  }
});
