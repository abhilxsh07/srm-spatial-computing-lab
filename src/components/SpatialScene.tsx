import { useRef } from 'react';

// An original spatial coordinate diagram: SVG stays crisp and does not require WebGL.
export default function SpatialScene({ compact = false }: { compact?: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  return <div ref={scene} className={`spatial-scene ${compact ? 'compact-scene' : ''}`} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty('--scene-x', `${(event.clientX - bounds.left - bounds.width / 2) / 70}deg`);
    scene.current?.style.setProperty('--scene-y', `${-(event.clientY - bounds.top - bounds.height / 2) / 90}deg`);
  }} onPointerLeave={() => { scene.current?.style.setProperty('--scene-x', '0deg'); scene.current?.style.setProperty('--scene-y', '0deg'); }}>
    <svg className="scene-svg" viewBox="0 0 700 560" role="img" aria-labelledby={compact ? 'compact-scene-title' : 'scene-title'}>
      <title id={compact ? 'compact-scene-title' : 'scene-title'}>An abstract mapped room with a point cloud, coordinate axes, and wireframe objects</title>
      <defs>
        <radialGradient id="scene-glow"><stop stopColor="#006b65" stopOpacity=".27"/><stop offset="1" stopColor="#006b65" stopOpacity="0"/></radialGradient>
        <linearGradient id="cube-fill" x2="1" y2="1"><stop stopColor="#b9f3df" stopOpacity=".16"/><stop offset="1" stopColor="#b9f3df" stopOpacity=".01"/></linearGradient>
      </defs>
      <ellipse cx="370" cy="320" rx="300" ry="235" fill="url(#scene-glow)"/>
      <g fill="none" stroke="#769b91" strokeWidth=".7" opacity=".23">
        {Array.from({length: 13}, (_, i) => <path key={`x${i}`} d={`M${78+i*24} ${332+i*11}L${380+i*24} ${185+i*11}`} />)}
        {Array.from({length: 13}, (_, i) => <path key={`y${i}`} d={`M${78+i*25.2} ${332-i*12.2}L${366+i*25.2} ${464-i*12.2}`} />)}
      </g>
      <g fill="none" stroke="#92c6b6" strokeWidth="1" opacity=".48">
        <path d="M110 324V140l253-116 247 117v189L363 449zM110 140l253 121 247-120M363 261v188M363 24v183"/>
        <path d="M110 324l253-117 247 123" strokeDasharray="4 7"/>
        <path d="M140 290v-91l52 25v41M510 235v-49l54-26v91" opacity=".6"/>
      </g>
      <g fill="#b9f3df">
        {Array.from({length: 255}, (_, i) => {
          const x = 154 + ((i * 83 + Math.sin(i * 6) * 80) % 414 + 414) % 414;
          const y = 120 + ((i * 37) % 229) + Math.sin(x / 61) * 32;
          return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 1.8 : .9} opacity={.14 + (i % 6) * .09} />;
        })}
      </g>
      <g stroke="#b9f3df" strokeWidth="1.35" fill="url(#cube-fill)">
        <path d="m301 223 77-38 75 37-76 39zM301 223v87l76 39v-88M377 349l76-38v-89"/>
        <path d="m301 267 76 39 76-39M339 204v126M415 204v126" opacity=".45"/>
      </g>
      <g fill="none" stroke="#9eccc0" strokeWidth=".85" opacity=".75">
        <ellipse cx="237" cy="332" rx="44" ry="21"/><ellipse cx="237" cy="306" rx="44" ry="21"/><path d="M193 306v26M281 306v26M211 288v60M237 285v68M263 289v59"/>
        <path d="m474 302 48-25 46 24-47 24zM474 302v42l47 25 47-25v-43M521 325v44"/>
      </g>
      <g strokeWidth="1.4" fill="none"><path d="M363 449v-54" stroke="#b9f3df"/><path d="m363 449 65 29" stroke="#c5b490"/><path d="m363 449-60 29" stroke="#719fb2"/></g>
      <g fontFamily="monospace" fontSize="11"><text x="358" y="385" fill="#b9f3df">Z</text><text x="437" y="485" fill="#c5b490">X</text><text x="284" y="486" fill="#719fb2">Y</text></g>
      <g fill="#b9f3df"><circle cx="110" cy="140" r="3"/><circle cx="610" cy="330" r="3"/><circle cx="363" cy="24" r="3"/><circle cx="377" cy="261" r="4"/></g>
      <g fill="none" stroke="#9ac8b9" strokeWidth=".65" opacity=".55"><path d="M453 222h66l28-40h94M237 353l-58 52H73"/></g>
      <g fill="#9eb3ab" fontFamily="monospace" fontSize="10" letterSpacing="1"><text x="546" y="172">SPATIAL ANCHOR</text><text x="72" y="423">MAPPED GEOMETRY</text></g>
    </svg>
    {!compact && <div className="scene-caption"><span className="crosshair">＋</span> PHYSICAL SPACE. DIGITAL POSSIBILITY.<span>FIG. 01</span></div>}
  </div>;
}
