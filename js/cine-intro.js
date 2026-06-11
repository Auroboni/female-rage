/* ════════════════════════════════════════
   CINE-INTRO.JS — sección de transición

   Detección basada en scroll sin ScrollTrigger
════════════════════════════════════════ */

let cineAnimated = false;

window.initCineIntroAnim = function () {
  const wrap = document.querySelector('.cine-wrap');
  const section = document.getElementById('cine-intro');
  if (!wrap || !section) return;

  if (cineAnimated) return;
  cineAnimated = true;

  /* Anima basado en scroll dentro del wrap */
  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
      const rect = wrap.getBoundingClientRect();
      const wrapTop = scroll + rect.top;
      const scrollPercent = Math.max(0, Math.min(1, (scroll - wrapTop) / window.innerHeight));

      gsap.set(section, {
        xPercent: -100 * scrollPercent,
        opacity: 1 - scrollPercent
      });
    });
  }
};

/* Ejecuta cuando Lenis esté listo */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lenis) {
    window.initCineIntroAnim();
  } else {
    /* Espera a que Lenis se cargue (desde main.js) */
    setTimeout(window.initCineIntroAnim, 500);
  }
});