/* ════════════════════════════════════════
   MAIN.JS
   · Cursor: follow, hover big, rage spray
   · Animación de entrada del landing
════════════════════════════════════════ */

/* ── CURSOR FOLLOW ── */
const cur = document.getElementById('cur');

document.addEventListener('mousemove', e => {
  gsap.to(cur, {
    x: e.clientX,
    y: e.clientY,
    duration: .1,
    ease: 'power2.out'
  });
});

/* ── CURSOR BIG ON HOVER ── */
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button')) cur.classList.add('big');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button')) cur.classList.remove('big');
});

/* ── RAGE SPRAY ──
   Partículas pequeñas que salen disparadas
   alrededor del cursor alternando los 4 colores
   rage. Throttle a ~25 fps para no saturar el DOM.
── */
const _SPRAY = ['#D81E5B', '#D4FF00', '#02E1FF', '#454ADE'];
let _si = 0, _st = 0;

function _spray(x, y) {
  const now = performance.now();
  if (now - _st < 40) return;
  _st = now;

  for (let i = 0; i < 3; i++) {
    const el    = document.createElement('div');
    const color = _SPRAY[_si++ % 4];
    const angle = Math.random() * Math.PI * 2;
    const r     = 5 + Math.random() * 10;
    const s     = 2 + Math.random() * 2.5;

    Object.assign(el.style, {
      position:      'fixed',
      width:         s + 'px',
      height:        s + 'px',
      borderRadius:  '50%',
      pointerEvents: 'none',
      zIndex:        '9998',
      background:    color,
      boxShadow:     `0 0 ${Math.round(s * 2)}px ${color}`,
      left:          (x + Math.cos(angle) * r - s / 2) + 'px',
      top:           (y + Math.sin(angle) * r - s / 2) + 'px',
    });
    document.body.appendChild(el);

    gsap.to(el, {
      opacity: 0,
      x: Math.cos(angle) * (6 + Math.random() * 10),
      y: Math.sin(angle) * (6 + Math.random() * 10),
      scale: 0,
      duration: .3 + Math.random() * .15,
      ease: 'power2.out',
      onComplete() { el.remove(); }
    });
  }
}

/* ── ANIMACIÓN DE ENTRADA DEL LANDING ── */
gsap.set('.l-title', { y: 30 });

gsap.timeline({ delay: .4 })
  .to('.l-eyebrow', { opacity: 1, duration: .7,  ease: 'power3.out' })
  .to('.l-title',   { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=.3')
  .to('.l-btn',     { opacity: 1, duration: .6,  ease: 'power2.out' }, '-=.4');
