// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
import { useState } from 'react';
import TugScene from './TugScene';
import { BACKGROUNDS, OPERATION_OPTIONS } from '../lib/game';

const STEPS = ['Tiempo', 'Operaciones', 'Números', 'Equipos'];
const DURATIONS = [
  { value: 60, label: '1 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
  { value: 0, label: 'Sin límite' },
];

export default function Setup({ settings, setSettings, onStart }) {
  const [step, setStep] = useState(0);
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const toggleOperation = (value) => {
    setSettings((prev) => {
      const selected = prev.operations.includes(value)
        ? prev.operations.filter((item) => item !== value)
        : [...prev.operations, value];
      return selected.length ? { ...prev, operations: selected } : prev;
    });
  };
  const updateTeam = (index, value) => {
    setSettings((prev) => {
      const teams = [...prev.teams];
      teams[index] = value;
      return { ...prev, teams };
    });
  };

  return (
    <main className="tira-setup-layout" aria-label="Preparación de Tira Tira">
      <section className="tira-preview" aria-label="Vista previa del juego">
        <span className="tira-preview-kicker">DOS EQUIPOS · UNA CUERDA</span>
        <h2>¡A tirar de la cuerda!</h2>
        <p>Resuelve operaciones con tu equipo y consigue más tirones que el rival.</p>
        <div className="tira-preview-scene"><TugScene progress={0} playing={false} event={null} /></div>
        <div className="tira-preview-legend"><span><i className="preview-dot preview-blue"/>Equipo azul</span><span>✳ Cada acierto cuenta</span><span><i className="preview-dot preview-pink"/>Equipo rosa</span></div>
      </section>
      <section className="setup-wrap" aria-label="Opciones de partida">
        <h2 className="visually-hidden">Preparar partida de Tira Tira</h2>
        <div className="setup-card">
        <div className="stepper" aria-label="Pasos de configuración">
          {STEPS.map((name, index) => (
            <button
              key={name}
              type="button"
              className={`step ${index === step ? 'current' : ''} ${index < step ? 'completed' : ''}`}
              onClick={() => setStep(index)}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="step-no">{index < step ? '✓' : index + 1}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="setup-content">
          {step === 0 && (
            <section aria-labelledby="setup-time">
              <div className="setup-section-icon blue-icon">⏱</div>
              <h3 id="setup-time">¿Cuánto durará la partida?</h3>
              <p className="section-hint">Elige un tiempo. También podéis jugar sin límite.</p>
              <div className="choice-grid duration-grid">
                {DURATIONS.map(({ value, label }) => (
                  <button key={value} className={`choice ${settings.duration === value ? 'active' : ''}`} onClick={() => update('duration', value)} type="button" aria-pressed={settings.duration === value}>
                    <strong>{value === 0 ? '∞' : value / 60}</strong><span>{label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {step === 1 && (
            <section aria-labelledby="setup-operations">
              <div className="setup-section-icon orange-icon">✏️</div>
              <h3 id="setup-operations">Elige las operaciones</h3>
              <p className="section-hint">Puedes combinar varias. Las preguntas cambiarán para cada equipo.</p>
              <div className="choice-grid operation-grid">
                {OPERATION_OPTIONS.map(({ value, label, symbol, subtitle }) => (
                  <button key={value} className={`operation-choice ${settings.operations.includes(value) ? 'active' : ''}`} onClick={() => toggleOperation(value)} type="button" aria-pressed={settings.operations.includes(value)}>
                    <span className="operation-symbol">{symbol}</span>
                    <span className="operation-description"><strong>{label}</strong><small>{subtitle}</small></span>
                    <span className="check-dot">{settings.operations.includes(value) ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {step === 2 && (
            <section aria-labelledby="setup-digits">
              <div className="setup-section-icon purple-icon">123</div>
              <h3 id="setup-digits">¿Con cuántas cifras jugamos?</h3>
              <p className="section-hint">Elige el tamaño de los números que aparecerán en las preguntas.</p>
              <div className="choice-grid digit-grid">
                {[
                  { value: 1, nums: '0 – 9', label: '1 cifra', example: '4 + 5 = ?' },
                  { value: 2, nums: '10 – 99', label: '2 cifras', example: '27 + 34 = ?' },
                  { value: 3, nums: '100 – 999', label: '3 cifras', example: '128 + 245 = ?' },
                ].map(({ value, nums, label, example }) => (
                  <button key={value} className={`digit-choice ${settings.digits === value ? 'active' : ''}`} type="button" onClick={() => update('digits', value)} aria-pressed={settings.digits === value}>
                    <span className="digit-numbers">{nums}</span><strong>{label}</strong><small>{example}</small>
                  </button>
                ))}
              </div>
            </section>
          )}
          {step === 3 && (
            <section aria-labelledby="setup-teams">
              <div className="setup-section-icon green-icon">👥</div>
              <h3 id="setup-teams">Pon nombre a tus equipos</h3>
              <p className="section-hint">Los dos equipos contestarán a la vez, cada uno en su panel.</p>
              <div className="team-inputs">
                <label className="team-input blue-input"><span>🔵 Equipo azul</span><input maxLength={24} value={settings.teams[0]} onChange={(e) => updateTeam(0, e.target.value)} placeholder="Equipo azul" /></label>
                <span className="vs-chip">VS</span>
                <label className="team-input red-input"><span>🩷 Equipo rosa</span><input maxLength={24} value={settings.teams[1]} onChange={(e) => updateTeam(1, e.target.value)} placeholder="Equipo rosa" /></label>
              </div>
              <h4 className="background-title">Fondo de pantalla</h4>
              <div className="background-options" aria-label="Seleccionar fondo">
                {BACKGROUNDS.map(({ value, label, color }) => (
                  <button key={value} className={`background-pick ${settings.background === value ? 'selected' : ''}`} type="button" onClick={() => update('background', value)} aria-pressed={settings.background === value}>
                    <span className="background-color" style={{ background: color }}></span><span>{label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="setup-footer">
          <span className="step-caption">Paso {step + 1} de 4</span>
          <div className="setup-actions">
            {step > 0 && <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => s - 1)}>← Atrás</button>}
            {step < 3
              ? <button className="btn btn-primary" type="button" onClick={() => setStep((s) => s + 1)}>Siguiente →</button>
              : <button className="btn btn-primary btn-start" type="button" onClick={onStart}>▶ Empezar a jugar</button>}
          </div>
        </div>
      </div>
      <p className="setup-bottom-note">Dos equipos · Una pantalla · Pizarra digital</p>
      </section>
    </main>
  );
}

