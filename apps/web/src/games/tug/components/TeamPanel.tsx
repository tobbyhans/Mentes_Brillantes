// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.

const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function TeamPanel({ index, name, score, question, input, feedback, feedbackKind, isRunning, onDigit, onBackspace, onSubmit, onSelectKeyboard, isKeyboardActive }) {
  const isBlue = index === 0;
  const color = isBlue ? 'blue' : 'red';
  const isCompare = question.compare;
  const action = (key) => {
    if (isCompare) onDigit(index, key);
    else onDigit(index, key);
  };
  return (
    <section className={`team-panel ${color}`} aria-label={`Panel de ${name}`}>
      <div className="team-panel-head">
        <div className="team-heading"><span className="team-indicator" aria-hidden="true">{isBlue ? '🔵' : '🩷'}</span><h2 title={name}>{name}</h2></div>
        <span className="team-score-pill" aria-label={`${score} aciertos`}>{score}</span>
      </div>
      <div className="team-body">
        <div className="question-label">RESUELVE LA OPERACIÓN</div>
        <div className="question" aria-live="polite">{question.label}</div>
        <div className={`answer-box ${feedbackKind === 'wrong' ? 'answer-wrong' : ''}`} aria-label={`Respuesta de ${name}`}>
          {input || <span className="placeholder">{isCompare ? '<  =  >' : 'Tu respuesta...'}</span>}
        </div>
        <div className="panel-divider" />
        {isCompare ? (
          <div className="compare-grid" aria-label={`Comparaciones de ${name}`}>
            {['<', '=', '>'].map((key) => <button type="button" className="compare-key" key={key} disabled={!isRunning} onClick={() => action(key)} aria-label={`Responder ${key}`}>{key}</button>)}
          </div>
        ) : (
          <div className="keypad" aria-label={`Teclado de ${name}`}>
            {NUMBER_KEYS.map((key) => <button type="button" key={key} disabled={!isRunning} onClick={() => action(key)}>{key}</button>)}
            <button type="button" className="key-delete" disabled={!isRunning} onClick={() => onBackspace(index)} aria-label="Borrar último dígito">⌫</button>
            <button type="button" disabled={!isRunning} onClick={() => action('0')}>0</button>
            <button type="button" className="key-enter" disabled={!isRunning || input.length === 0} onClick={() => onSubmit(index)} aria-label="Comprobar respuesta">✓</button>
          </div>
        )}
        <div className={`team-feedback ${feedbackKind || ''}`} role="status" aria-live="polite">{feedback || 'Cada acierto tira de la cuerda'}</div>
        <button className={`keyboard-select ${isKeyboardActive ? 'keyboard-active' : ''}`} type="button" onClick={() => onSelectKeyboard(index)} aria-pressed={isKeyboardActive}>
          <span aria-hidden="true">⌨</span> Teclado físico: {isKeyboardActive ? 'activo' : 'usar aquí'}
        </button>
      </div>
    </section>
  );
}
