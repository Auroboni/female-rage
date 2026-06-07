/* ════════════════════════════════════════
   CATARSIS.JS
   Animaciones de entrada para la sección final
════════════════════════════════════════ */

window.initCatarsisAnim = function () {
  const section = document.getElementById('catarsis');
  if (!section) return;

  /* Header */
  const eyebrow = section.querySelector('.cas-eyebrow');
  const title = section.querySelector('.cas-title');
  const intro = section.querySelector('.cas-intro');

  gsap.set([eyebrow, title, intro], { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    onEnter: () => {
      gsap.timeline()
        .to(eyebrow, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 0)
        .to(title, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .15)
        .to(intro, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, .3);
    },
    once: true
  });

  /* Columnas */
  const cols = section.querySelectorAll('.cas-col');
  gsap.set(cols, { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: section.querySelector('.cas-cols-wrap'),
    start: 'top 65%',
    onEnter: () => {
      cols.forEach((col, i) => {
        gsap.to(col, {
          opacity: 1,
          y: 0,
          duration: .7,
          ease: 'power2.out',
          delay: i * .12
        });
      });
    },
    once: true
  });

  /* Testimonio - Typing Animation */
  const testimonialText = section.querySelector('.testimonial-text');
  if (testimonialText && window.SplitText) {
    try {
      const split = new SplitText(testimonialText, { type: 'chars' });
      gsap.set(split.chars, { opacity: 0 });

      ScrollTrigger.create({
        trigger: section.querySelector('#testimonial-section'),
        start: 'top 70%',
        onEnter: () => {
          gsap.to(split.chars, {
            opacity: 1,
            duration: 0.05,
            stagger: 0.05,
            ease: 'power1.out'
          });
        },
        once: true
      });
    } catch (e) {
      console.warn('SplitText animation failed:', e);
    }
  }
};

/* Flag para evitar ejecutar dos veces */
let catarsisDoneOnce = false;

/* Ejecutar cuando showPage esté listo */
if (window.showPage) {
  const origShowPage = window.showPage;
  window.showPage = function () {
    origShowPage();
    if (window.initCatarsisAnim && !catarsisDoneOnce) {
      catarsisDoneOnce = true;
      window.initCatarsisAnim();
    }
  };
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.initCatarsisAnim && !catarsisDoneOnce) {
      catarsisDoneOnce = true;
      window.initCatarsisAnim();
    }
  });
}

/* Ejecutar también cuando la sección sea visible (para casos como volver de ficha) */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const section = document.getElementById('catarsis');
    if (section && !catarsisDoneOnce) {
      catarsisDoneOnce = true;
      if (window.initCatarsisAnim) window.initCatarsisAnim();
    }
  }, 100);
});
