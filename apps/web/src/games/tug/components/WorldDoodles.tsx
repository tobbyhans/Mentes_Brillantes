// @ts-nocheck — interfaz preexistente migrada a TSX, conservada sin alterar las reglas del juego.
/**
 * Ilustraciones vectoriales originales, inspiradas en cuadernos escolares:
 * mapas, barcos, vehículos simples y escenas polares. Sin imágenes externas.
 * No son elementos interactivos y permanecen detrás de la acción.
 */
export function WorldBackdrop() {
  return (
    <g aria-hidden="true" className="world-backdrop">
      <defs>
        <linearGradient id="world-sky" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#eaf7f5" />
          <stop offset=".6" stopColor="#fff8e7" />
          <stop offset="1" stopColor="#f9efe0" />
        </linearGradient>
        <linearGradient id="world-sea" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#b5e6eb" />
          <stop offset="1" stopColor="#dff3ee" />
        </linearGradient>
        <pattern id="world-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="1" fill="#718b96" opacity=".17" />
        </pattern>
      </defs>
      <path d="M0 0H840V430H0Z" fill="url(#world-sky)" />
      <path d="M0 0H840V430H0Z" fill="url(#world-dots)" />
      <g fill="none" stroke="#78919b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".75">
        <path d="M44 76Q55 59 72 68Q85 45 101 67Q118 64 124 79" />
        <path d="M610 70Q623 52 639 63Q646 40 665 57Q679 53 687 70" />
        <path d="M140 112Q230 62 316 111" strokeDasharray="4 12" strokeWidth="2" />
        <path d="M540 113Q620 150 712 108" strokeDasharray="4 12" strokeWidth="2" />
      </g>
      <circle cx="420" cy="100" r="37" fill="#ffdf75" stroke="#eab65d" strokeWidth="2" strokeDasharray="6 4" opacity=".72" />
      <g opacity=".66" stroke="#668997" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M0 260L80 165L151 241L235 135L322 251L396 180L460 252L536 156L617 243L693 176L768 241L840 190V355H0Z" fill="#cfe7db" />
        <path d="M0 300L110 213L184 277L251 222L331 293L443 212L517 281L631 221L711 290L840 243V377H0Z" fill="#a8ccbb" stroke="#86b6a7" />
        <path d="M54 209L80 165L113 205L93 195L80 181L70 198Z" fill="#fffdf3" stroke="none" />
        <path d="M210 183L235 135L270 180L247 169L235 150L229 168Z" fill="#fffdf3" stroke="none" />
        <path d="M515 193L536 156L565 194L546 185L537 170L526 185Z" fill="#fffdf3" stroke="none" />
      </g>
      {/* Un barco dibujado con rotulador sobre el mar, inspirado en viajes escolares. */}
      <g transform="translate(622 175)" fill="none" stroke="#486777" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".7">
        <path d="M0 48L146 48L126 69L18 69Z" fill="#2f97ae" />
        <path d="M32 29H115V48H32Z" fill="#fffaf0" />
        <path d="M50 10H99V29H50Z" fill="#fff7df" />
        <path d="M62 10V-2M82 10V-4" />
        <path d="M64 -10C56 -17 66 -23 56 -31M85 -11C78 -16 89 -22 80 -30" stroke="#e78462" />
        <path d="M16 77Q30 70 44 77T72 77T100 77T128 77" stroke="#419bac" strokeWidth="2" />
        <circle cx="53" cy="38" r="3" fill="#f2c864" /><circle cx="76" cy="38" r="3" fill="#f2c864" /><circle cx="98" cy="38" r="3" fill="#f2c864" />
      </g>
      {/* Tren escolar de trazo simple. */}
      <g transform="translate(58 242)" opacity=".67" stroke="#546c73" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M10 19H111V62H10Z" fill="#fff7e5" />
        <path d="M21 30H44V46H21ZM56 30H79V46H56ZM90 30H104V46H90Z" fill="#9ccee3" />
        <path d="M5 64H120" fill="none" />
        {[24,59,94].map((x) => <circle key={x} cx={x} cy="67" r="8" fill="#384f5d" stroke="#fff8df" strokeWidth="3" />)}
        <path d="M120 40L133 30L140 62H120Z" fill="#f39a75" />
      </g>
      {/* Dos iglús como guiño al paisaje del primer dibujo. */}
      <g transform="translate(742 283)" stroke="#647d84" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="#e6f1ed" opacity=".67">
        <path d="M0 46Q7 -2 52 0Q92 3 100 46Z" />
        <path d="M33 46V32Q51 12 67 32V46Z" fill="#7babbc" />
        <path d="M10 24H89M28 10L36 25M62 9L65 24M24 36H9M82 36H95" fill="none" />
      </g>
      {/* Rastro de avioneta; figura original dibujada con líneas. */}
      <g transform="translate(177 102) rotate(-10)" stroke="#bc6a50" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M-26 0H24L34 -7L41 -5L36 4L23 6L7 12L-15 12L-7 5H-29Z" fill="#e8775b" />
        <path d="M1 1L10 -11L29 -14L22 1M-17 1L-21 -10L-27 -10L-23 1" fill="#f8d579" />
      </g>
      <path d="M0 364Q180 349 390 360Q600 347 840 360V430H0Z" fill="url(#world-sea)" stroke="#86b8b2" strokeWidth="3" />
      <g fill="none" stroke="#64adb3" strokeWidth="2.5" strokeLinecap="round" opacity=".42">
        <path d="M7 392Q24 383 41 391T76 391T111 391" /><path d="M202 408Q220 399 237 407T272 407T307 407" />
        <path d="M486 396Q503 388 521 396T557 396T593 396" /><path d="M683 405Q702 396 720 405T756 405T792 405" />
      </g>
      <path d="M420 51V371" stroke="#385875" strokeDasharray="7 10" strokeWidth="2.7" opacity=".5" />
      <g transform="translate(420 355)" stroke="#4a6b77" strokeWidth="2" strokeLinejoin="round">
        <path d="M0 -12V22" /><path d="M0 -12L23 -4L0 4Z" fill="#ef6f85" stroke="#e84e72" />
      </g>
    </g>
  );
}

export function JourneyMiniature() {
  return (
    <svg className="journey-mini" viewBox="0 0 290 132" aria-hidden="true">
      <path d="M4 102Q58 78 100 107T210 98T285 103" stroke="#86c2bb" strokeWidth="2" fill="none" strokeDasharray="5 7" />
      <path d="M10 96L60 36L112 96Z" fill="#e1eee7" stroke="#718f91" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 65L60 36L82 67L64 59L58 49Z" fill="#fffaf0" />
      <path d="M137 88L246 88L230 109L152 109Z" fill="#2a98b0" stroke="#426b79" strokeWidth="3" strokeLinejoin="round" />
      <rect x="163" y="66" width="52" height="22" rx="3" fill="#fff6dc" stroke="#426b79" strokeWidth="2.6" />
      <rect x="173" y="52" width="30" height="14" rx="3" fill="#f2cb69" stroke="#426b79" strokeWidth="2.4" />
      <path d="M182 52V39M196 52V39" stroke="#426b79" strokeWidth="3" />
      <path d="M178 36Q168 28 176 22M198 36Q188 28 196 20" stroke="#ee886c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M149 117Q158 111 168 117T188 117T208 117T228 117" stroke="#8ccfcf" fill="none" strokeWidth="2" />
      <g fill="#e98467"><circle cx="107" cy="37" r="3"/><circle cx="121" cy="28" r="2"/><circle cx="131" cy="42" r="2"/></g>
      <path d="M99 17L115 11L106 20L112 30Z" fill="#e98569" stroke="#b9685b" strokeWidth="2" />
    </svg>
  );
}
