/* ════════════════════════════════════════
   CATARSIS.JS

   Anima elementos cuando llega a la sección
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const catarsis = document.getElementById('catarsis');
  if (!catarsis) return;

  const catarsisObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCatarsis(catarsis);
        catarsisObserver.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  catarsisObserver.observe(catarsis);
});

function animateCatarsis(section) {
  const eyebrow = section.querySelector('.cas-eyebrow');
  const title = section.querySelector('.cas-title');
  const intro = section.querySelector('.cas-intro');
  const cols = section.querySelectorAll('.cas-col');
  const testimonialText = section.querySelector('.testimonial-text');

  gsap.fromTo([eyebrow, title, intro],
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' }
  );

  gsap.fromTo(cols,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
  );

  if (testimonialText) {
    gsap.fromTo(testimonialText,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.6 }
    );
  }
}
