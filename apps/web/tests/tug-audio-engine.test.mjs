import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioDirector } from '../src/games/tug/lib/audio.ts';

const param = (value = 0) => ({
  value,
  targets: [],
  setTargetAtTime(value) { this.value = value; this.targets.push(value); },
  setValueAtTime() {},
  exponentialRampToValueAtTime() {},
});
const node = () => ({
  gain: param(), threshold: param(), ratio: param(), delayTime: param(),
  frequency: param(), Q: param(), pan: param(),
  connect() {}, start() {}, stop() {},
});
class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  destination = node();
  createGain() { return node(); }
  createDynamicsCompressor() { return node(); }
  createDelay() { return node(); }
  createOscillator() { return node(); }
  createBiquadFilter() { return node(); }
  createStereoPanner() { return node(); }
  close() { return Promise.resolve(); }
}

test('música y sonidos son canales independientes incluso durante el juego y la pausa', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { AudioContext: FakeAudioContext };
  const director = new AudioDirector();
  try {
    director.startMatch();
    assert.equal(director.playing, true);
    director.setPreferences({ musicOn: false });
    assert.equal(director.musicBus.gain.targets.at(-1), 0);
    assert.equal(director.sfxBus.gain.targets.at(-1), director.sfxVolume);
    director.setPreferences({ musicOn: true, sfxOn: false });
    assert.equal(director.musicBus.gain.targets.at(-1), director.musicVolume);
    assert.equal(director.sfxBus.gain.targets.at(-1), 0);
    director.pauseMatch();
    assert.equal(director.musicBus.gain.targets.at(-1), 0);
    director.resumeMatch();
    assert.equal(director.musicBus.gain.targets.at(-1), director.musicVolume);
    assert.equal(director.sfxBus.gain.targets.at(-1), 0);
  } finally {
    director.dispose();
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
