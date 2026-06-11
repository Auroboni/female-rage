/* ════════════════════════════════════════
   CATARSIS.JS

   Animaciones scroll-triggered para:
   - Encabezado (eyebrow + título + intro): fade in secuencial
   - Columnas: fade in con stagger
   - Testimonio: fade in simple

   ARQUITECTURA:
   - ScrollTrigger: anima cuando entra en viewport
   - once: true — ejecuta una sola vez
════════════════════════════════════════ */

window.initCatarsisAnim = function () {
  const section = document.getElementById('catarsis');
  if (!section) return;

  /* ENCABEZADO: eyebrow, título, introducción */
  const eyebrow = section.querySelector('.cas-eyebrow');
  const title = section.querySelector('.cas-title');
  const intro = section.querySelector('.cas-intro');

  /* Estado inicial: invisibles, desplazados hacia abajo */
  gsap.set([eyebrow, title, intro], { opacity: 0, y: 20 });

  /* TRIGGER 1: Encabezado — dispara cuando entra al 75% del viewport */
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    onEnter: () => {
      gsap.timeline()
        .to(eyebrow, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 0)
        .to(title, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .15)
        .to(intro, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, .3);
    },
    once: true  /* Ejecuta una sola vez */
  });

  /* COLUMNAS: 3 columnas que aparecen con stagger */
  const cols = section.querySelectorAll('.cas-col');
  gsap.set(cols, { opacity: 0, y: 24 });

  /* TRIGGER 2: Columnas — dispara cuando entra al 65% del viewport */
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

  /* TESTIMONIO: Fade in simple */
  const testimonialSection = document.getElementById('testimonial-section');
  const testimonialText = document.querySelector('.testimonial-text');

  if (testimonialText && testimonialSection) {
    gsap.set(testimonialText, { opacity: 0 });

    /* TRIGGER 3: Testimonio — fade in cuando entra al 70% */
    ScrollTrigger.create({
      trigger: testimonialSection,
      start: 'top 70%',
      onEnter: () => {
        gsap.to(testimonialText, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        });
      },
      once: true
    });
  }

  ScrollTrigger.refresh();
};

let catarsisDoneOnce = false;

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

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const section = document.getElementById('catarsis');
    if (section && !catarsisDoneOnce) {
      catarsisDoneOnce = true;
      if (window.initCatarsisAnim) window.initCatarsisAnim();
    }
  }, 100);
});
