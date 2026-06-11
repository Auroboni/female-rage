/* ════════════════════════════════════════
   MAIN.JS — Home y cursor personalizado

   Maneja:
   - Cursor: sigue movimiento + agranda en interactivos
   - Landing animation: entrada suave del contenido
   - Lenis: smooth scroll
════════════════════════════════════════ */

/* CURSOR: sigue el movimiento del ratón */
const cur = document.getElementById('cur');

document.addEventListener('mousemove', e => {
  gsap.to(cur, {
    x: e.clientX,
    y: e.clientY,
    duration: .1,
    ease: 'power2.out'
  });
});

/* CURSOR BIG: agranda al pasar sobre a/button */
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button')) cur.classList.add('big');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('a, button')) cur.classList.remove('big');
});

/* HOME ANIMATION: entrada suave del contenido
   Tiempo: eyebrow → título → botón */
gsap.set('.l-title', { y: 30 });

gsap.timeline({ delay: .4 })
  .to('.l-eyebrow', { opacity: 1, duration: .7,  ease: 'power3.out' })
  .to('.l-title',   { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=.3')
  .to('.l-btn',     { opacity: 1, duration: .6,  ease: 'power2.out' }, '-=.4');

/* LENIS: smooth scroll global
   Integrado con GSAP ScrollTrigger */
const lenis = new Lenis({
  duration: 1.8,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

ScrollTrigger.addEventListener('refresh', () => lenis.resize());
window.lenis = lenis;

/* Progress bar: refleja scroll */
lenis.on('scroll', ({ scroll, limit }) => {
  const pct = limit > 0 ? (scroll / limit) * 100 : 0;
  const prog = document.getElementById('prog');
  if (prog) prog.style.width = pct + '%';
});
