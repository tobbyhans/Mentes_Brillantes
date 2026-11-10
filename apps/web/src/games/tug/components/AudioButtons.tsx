import type { FC } from 'react';

export interface SoundSettings {
  musicOn: boolean;
  sfxOn: boolean;
  musicVolume: number;
  sfxVolume: number;
}

interface AudioButtonsProps {
  settings: SoundSettings;
  onChange: (changes: Partial<SoundSettings>) => void;
}

// Misma interacción y estado accesible que los dos botones de Serpientes y Escaleras.
const AudioButtons: FC<AudioButtonsProps> = ({ settings, onChange }) => (
  <div className="tug-audio-buttons" role="group" aria-label="Controles de audio">
    <button
      type="button"
      className={`sound-btn ${settings.musicOn ? 'enabled' : ''}`}
      aria-pressed={settings.musicOn}
      aria-label={settings.musicOn ? 'Desactivar música' : 'Activar música'}
      onClick={() => onChange({ musicOn: !settings.musicOn })}
    >
      <span aria-hidden="true">♫</span><span>Música</span>
    </button>
    <button
      type="button"
      className={`sound-btn ${settings.sfxOn ? 'enabled' : ''}`}
      aria-pressed={settings.sfxOn}
      aria-label={settings.sfxOn ? 'Desactivar sonidos' : 'Activar sonidos'}
      onClick={() => onChange({ sfxOn: !settings.sfxOn })}
    >
      <span aria-hidden="true">♬</span><span>Sonidos</span>
    </button>
  </div>
);

export default AudioButtons;
