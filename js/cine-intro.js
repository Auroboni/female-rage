
/* ─── CINE — sección en scroll, iniciada desde showPage() ─── */
window.initCineIntroAnim = function () {
  const wrap    = document.querySelector('.cine-wrap');
  const section = document.getElementById('cine-intro');
  if (!wrap || !section) return;

  /* Sin ScrollTrigger — se calcula la posición directamente del DOM
     en cada frame. Inmune a ScrollTrigger.refresh() y al toggle rage. */
  gsap.ticker.add(function () {
    const progress = Math.max(0, Math.min(1, -wrap.getBoundingClientRect().top / window.innerHeight));
    gsap.set(section, { xPercent: -100 * progress });
  });
};