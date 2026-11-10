// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
/**
 * Motor de sonido original (Web Audio API). Sin muestras, archivos de audio ni dependencias.
 * Música de inspiración barroca, 4/4 a 60 BPM. Cada acierto usa un aviso tonal
 * original inspirado en la sonoridad de las campanillas de aeropuertos.
 */
export const MUSIC_BPM = 60;
export const MUSIC_METER = '4/4';
export const EIGHTH_SECONDS = 60 / MUSIC_BPM / 2;

// 8 compases de armonía en re menor; el cierre triunfal usa la tercera de picardía.
export const HARMONY = [
  [50, 57, 62, 65], // Dm
  [45, 52, 55, 61], // A7
  [50, 57, 62, 65], // Dm
  [43, 50, 58, 62], // Gm
  [48, 55, 60, 64], // C
  [41, 48, 57, 60], // F
  [45, 52, 55, 61], // A7
  [50, 57, 62, 65], // Dm
];
export const MELODY = [
  [74, 77, 81, 77], [76, 73, 76, 69],
  [77, 76, 74, 69], [70, 74, 79, 77],
  [76, 79, 76, 72], [69, 72, 77, 76],
  [76, 73, 71, 73], [74, 69, 65, 74],
];

export function noteFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export class AudioDirector {
  constructor() {
    this.context = null;
    this.master = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.playing = false;
    this.musicOn = true;
    this.sfxOn = true;
    this.musicVolume = 0.36;
    this.sfxVolume = 0.66;
    this.timer = null;
    this.nextTickAt = 0;
    this.tick = 0;
    this.unsupported = false;
  }

  init() {
    if (this.context) {
      if (this.context.state === 'suspended') this.context.resume().catch(() => {});
      return true;
    }
    const BrowserAudioContext = typeof window === 'undefined' ? null : (window.AudioContext || window.webkitAudioContext);
    if (!BrowserAudioContext) {
      this.unsupported = true;
      return false;
    }
    try {
      const ctx = new BrowserAudioContext();
      this.context = ctx;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 3;
      compressor.connect(ctx.destination);
      this.master = ctx.createGain();
      this.master.gain.value = 0.83;
      this.master.connect(compressor);
      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = this.musicOn ? this.musicVolume : 0;
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = this.sfxOn ? this.sfxVolume : 0;
      this.musicBus.connect(this.master);
      this.sfxBus.connect(this.master);
      // Eco de cámara muy sutil en la música (sin audios externos).
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = 0.17;
      const echo = ctx.createGain();
      echo.gain.value = 0.075;
      this.musicBus.connect(delay);
      delay.connect(echo);
      echo.connect(this.master);
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return true;
    } catch {
      this.unsupported = true;
      return false;
    }
  }

  setPreferences({ musicOn, sfxOn, musicVolume, sfxVolume }) {
    if (typeof musicOn === 'boolean') this.musicOn = musicOn;
    if (typeof sfxOn === 'boolean') this.sfxOn = sfxOn;
    if (typeof musicVolume === 'number') this.musicVolume = clamp(musicVolume, 0, 1);
    if (typeof sfxVolume === 'number') this.sfxVolume = clamp(sfxVolume, 0, 1);
    if (this.context) {
      const at = this.context.currentTime;
      this.musicBus.gain.setTargetAtTime(this.musicOn && this.playing ? this.musicVolume : 0, at, 0.035);
      this.sfxBus.gain.setTargetAtTime(this.sfxOn ? this.sfxVolume : 0, at, 0.035);
    }
    this.syncScheduler();
  }

  startMatch() {
    this.init(); // Esta llamada sucede dentro del clic de Empezar.
    this.stopScheduler();
    this.tick = 0;
    this.playing = true;
    this.syncScheduler();
  }

  pauseMatch() {
    this.playing = false;
    this.syncScheduler();
  }

  resumeMatch() {
    this.init(); // Esta llamada sucede dentro del clic de Continuar.
    this.playing = true;
    this.syncScheduler();
  }

  endMatch() {
    this.playing = false;
    this.syncScheduler();
  }

  stopScheduler() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  syncScheduler() {
    if (!this.context) return;
    const shouldPlay = this.playing && this.musicOn && this.musicVolume > 0;
    const at = this.context.currentTime;
    this.musicBus.gain.setTargetAtTime(shouldPlay ? this.musicVolume : 0, at, 0.035);
    if (!shouldPlay) {
      this.stopScheduler();
      return;
    }
    if (this.timer !== null) return;
    this.nextTickAt = at + 0.08;
    this.scheduleAhead();
    this.timer = setInterval(() => this.scheduleAhead(), 85);
  }

  scheduleAhead() {
    const ctx = this.context;
    if (!ctx || !this.playing || !this.musicOn) return;
    // Si el navegador durmió la pestaña, retomamos sin intentar tocar notas atrasadas.
    if (this.nextTickAt < ctx.currentTime - 0.5) this.nextTickAt = ctx.currentTime + 0.06;
    // Mira hasta 350 ms hacia adelante para evitar clics y saltos en los compases.
    while (this.nextTickAt < ctx.currentTime + 0.35) {
      this.scheduleTick(this.tick, this.nextTickAt);
      this.tick += 1;
      this.nextTickAt += EIGHTH_SECONDS;
    }
  }

  tone(midi, at, duration, { voice = 'harpsi', gain = 0.06, bus = 'music', pan = 0 } = {}) {
    const ctx = this.context;
    if (!ctx) return;
    const start = Math.max(at, ctx.currentTime + 0.001);
    const isBell = voice === 'bell';
    const attack = isBell ? 0.008 : voice === 'strings' ? 0.07 : 0.004;
    const end = start + Math.max(duration, attack + 0.04);
    const output = ctx.createGain();
    output.gain.setValueAtTime(0.0001, start);
    output.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + attack);
    if (voice === 'strings') {
      output.gain.setValueAtTime(gain * 0.5, end - 0.09);
      output.gain.exponentialRampToValueAtTime(0.0001, end);
    } else {
      output.gain.exponentialRampToValueAtTime(0.0001, end);
    }
    if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      output.connect(panner);
      panner.connect(bus === 'sfx' ? this.sfxBus : this.musicBus);
    } else {
      output.connect(bus === 'sfx' ? this.sfxBus : this.musicBus);
    }
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = isBell ? 7200 : voice === 'bass' ? 740 : voice === 'strings' ? 1250 : 2400;
    filter.Q.value = 0.4;
    filter.connect(output);
    const osc = ctx.createOscillator();
    osc.type = isBell ? 'sine' : voice === 'strings' ? 'sawtooth' : 'triangle';
    osc.frequency.value = noteFrequency(midi);
    osc.connect(filter);
    osc.start(start);
    osc.stop(end + 0.025);
    if (isBell) {
      // Sobretono metálico pequeño: parecido a un carillón de aviso de terminal.
      const harmonic = ctx.createOscillator();
      harmonic.type = 'sine';
      harmonic.frequency.value = noteFrequency(midi) * 2.01;
      const harmonicGain = ctx.createGain();
      harmonicGain.gain.value = 0.17;
      harmonic.connect(harmonicGain);
      harmonicGain.connect(filter);
      harmonic.start(start);
      harmonic.stop(end + 0.025);
    }
  }

  scheduleTick(tick, at) {
    const position = tick % 64;
    const bar = Math.floor(position / 8);
    const step = position % 8;
    const chord = HARMONY[bar];
    const arpeggio = [1, 2, 3, 2, 1, 2, 3, 2][step];
    this.tone(chord[arpeggio] + 12, at, 0.36, { gain: 0.065, voice: 'harpsi' });
    if (step % 2 === 0) {
      this.tone(chord[0] - (step === 4 ? 5 : 0), at, 0.52, { gain: 0.085, voice: 'bass' });
      this.tone(MELODY[bar][step / 2], at + 0.01, 0.74, { gain: 0.045, voice: 'strings' });
    }
  }

  playCorrect(team) {
    if (!this.context || !this.sfxOn) return;
    const at = this.context.currentTime + 0.015;
    const pan = team === 0 ? -0.32 : 0.32;
    // Dos tonos limpio-descendentes, como aviso previo a una megafonía.
    this.tone(79, at, 0.36, { voice: 'bell', gain: 0.12, bus: 'sfx', pan });
    this.tone(76, at + 0.19, 0.51, { voice: 'bell', gain: 0.13, bus: 'sfx', pan });
    this.tone(72, at + 0.38, 0.48, { voice: 'bell', gain: 0.082, bus: 'sfx', pan });
  }

  playWrong() {
    // Aviso leve, sin reproducir una alarma que distraiga al alumnado.
    if (!this.context || !this.sfxOn) return;
    const at = this.context.currentTime + 0.01;
    this.tone(53, at, 0.12, { voice: 'bass', gain: 0.027, bus: 'sfx' });
  }

  playVictory(team) {
    if (!this.context || !this.sfxOn) return;
    const at = this.context.currentTime + 0.035;
    const pan = team === 0 ? -0.23 : team === 1 ? 0.23 : 0;
    // Llamada de aeropuerto + cadencia barroca triunfal original.
    [74, 78, 81, 86].forEach((note, i) => {
      this.tone(note, at + i * 0.22, 1.03, { voice: 'bell', gain: 0.12, bus: 'sfx', pan });
    });
    [62, 66, 69, 74].forEach((note) => {
      this.tone(note, at + 0.98, 1.55, { voice: 'strings', gain: 0.055, bus: 'sfx', pan });
    });
  }

  dispose() {
    this.stopScheduler();
    this.playing = false;
    if (this.context) this.context.close().catch(() => {});
    this.context = null;
  }
}
