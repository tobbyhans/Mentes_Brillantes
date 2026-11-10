export default function CakeMascot({eating=false}:{eating?:boolean}) {
  return <svg className={`cake-mascot ${eating?'cake-mascot-eating':''}`} viewBox="0 0 165 180" role="img" aria-label="Pequeño pastelero que celebra cada acierto">
    <ellipse cx="83" cy="169" rx="55" ry="9" fill="#c8bbaa" opacity=".45"/>
    <path d="M51 119Q39 128 39 153h87q1-27-17-34" fill="#497d98" stroke="#303934" strokeWidth="3"/>
    <path d="M71 117v34M95 117v34" stroke="#fffaf0" strokeWidth="4" strokeLinecap="round"/>
    <path d="M44 136Q28 131 25 112M121 137q20-8 27-29" fill="none" stroke="#efba91" strokeWidth="11" strokeLinecap="round"/>
    <circle cx="25" cy="112" r="8" fill="#efba91"/>
    <circle cx="148" cy="108" r="8" fill="#efba91"/>
    <path d="M39 58q-4-20 16-27-2-23 20-20 15-18 32-3 22-8 26 15 22 7 12 32Z" fill="#fffefa" stroke="#303934" strokeWidth="3"/>
    <path d="M52 55h78" stroke="#d7b981" strokeWidth="5"/>
    <circle cx="87" cy="88" r="45" fill="#efba91" stroke="#303934" strokeWidth="3"/>
    <path d="M51 83q-7-40 21-32m43 0q22 10 18 34" stroke="#6b4d37" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <circle cx="70" cy="91" r="5" fill="#303934"/><circle cx="103" cy="91" r="5" fill="#303934"/>
    <ellipse cx="57" cy="102" rx="8" ry="5" fill="#d95580" opacity=".5"/><ellipse cx="115" cy="102" rx="8" ry="5" fill="#d95580" opacity=".5"/>
    <path className="cake-mascot-mouth" d={eating?'M79 109q8 17 17 0Z':'M73 110q14 17 28 0'} fill={eating?'#a94e54':'none'} stroke="#693e39" strokeWidth="3" strokeLinecap="round"/>
    <path d="M76 122 86 134 98 121" fill="#d95580"/>
    <g className="cake-mascot-fork"><path d="M146 103 139 57m-6-13 3 16m2-18 3 17m3-18 2 16" stroke="#575d57" strokeWidth="3" strokeLinecap="round"/></g>
    {eating&&<><path d="m131 83 10-9m-9 16 17-2M37 90l-15-9" stroke="#e3b64f" strokeWidth="4" strokeLinecap="round"/><text x="138" y="32" fontSize="17" fill="#d95580" fontWeight="900">¡Ñam!</text></>}
  </svg>;
}
