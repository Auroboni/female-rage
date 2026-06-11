/* ════════════════════════════════════════
   CINE-INTRO.JS — sección de transición

   Efecto: mientras hace scroll, la palabra se
   desliza horizontalmente (slide-out)

   ARQUITECTURA:
   - ScrollTrigger: vinculado al scroll
   - scrub: true — anima en sincronía con scroll
   - xPercent: desliza horizontalmente (-100% = salida)
════════════════════════════════════════ */

window.initCineIntroAnim = function () {
  const wrap    = document.querySelector('.cine-wrap');
  const section = document.getElementById('cine-intro');
  if (!wrap || !section) return;

  gsap.to(section, {
    xPercent: -100,
    opacity: 0,
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      markers: false
    }
  });
};