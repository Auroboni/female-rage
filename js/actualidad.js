/* ════════════════════════════════════════
   ACTUALIDAD.JS 

   Lazy loading: solo ejecuta animaciones cuando
   la sección entra en viewport (daba error al activar/desactivar rage).

   ARQUITECTURA:
   - Split text: título dividido en letras
   - Typing effect: solo en desktop
   - Selection loop: efecto de selección flotante
   - Timeline: GSAP + ScrollTrigger
════════════════════════════════════════ */

let actualidadInitialized = false;

/* LAZY LOAD: Espera a que la sección sea visible */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('actualidad');
  if (!section) return;

  const imgWrap = section.querySelector('.pqa-img-wrap');
  const subtitleEl = section.querySelector('.pqa-subtitle');
  const paras = section.querySelectorAll('.pqa-body p');

  /* Estado inicial: todos los elementos invisibles */
  gsap.set([imgWrap, subtitleEl, ...paras], { opacity: 0 });

  /* Intersection Observer: ejecuta cuando entra en viewport */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !actualidadInitialized) {
        window.initActualidadAnim();
        observer.unobserve(section);  // Ejecuta una sola vez
      }
    });
  }, { threshold: 0.1 });  /* Dispara cuando 10% es visible */

  observer.observe(section);
});

/* INICIALIZACIÓN: Se ejecuta al entrar en viewport */
window.initActualidadAnim = function () {
  const section    = document.getElementById('actualidad');
  if (!section || actualidadInitialized) return;

  actualidadInitialized = true;

  const titleEl    = section.querySelector('.pqa-title');
  const imgWrap    = section.querySelector('.pqa-img-wrap');
  const subtitleEl = section.querySelector('.pqa-subtitle');
  const paras      = section.querySelectorAll('.pqa-body p');

  /* SPLIT TÍTULO: cada letra en su propio <span> */
  const rawText = titleEl.textContent.trim();
  titleEl.setAttribute('aria-label', rawText); 
  titleEl.innerHTML = rawText
    .split('')
    .map(ch => ch === ' '
      ? '<span class="char-space"> </span>'
      : `<span class="char-wrap"><span class="char">${ch}</span></span>`)
    .join('');
  const chars = titleEl.querySelectorAll('.char');

  /* ESTADO INICIAL: elementos invisibles, desplazados hacia abajo */
  gsap.set(chars, { opacity: 0, y: 60 });      // Letras del título
  gsap.set(imgWrap, { opacity: 0, y: 20 });    // Imagen
  gsap.set(subtitleEl, { opacity: 0, y: 16 }); // Subtítulo
  gsap.set(paras, { opacity: 0, y: 28 });      // Párrafos

  /* SPLIT HIGHLIGHT: efecto selección del mouse para resaltar el texto */
  const highlightEl = section.querySelector('.pqa-highlight');
  const hlChars = [];
  if (highlightEl) {
    [...highlightEl.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach(ch => {
          const s = document.createElement('span');
          s.textContent = ch;
          highlightEl.insertBefore(s, node);
          hlChars.push(s);
        });
        node.textContent = '';
      }
    });
  }

  /* TIMELINE: secuencia de animaciones sincronizadas con scroll */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%' },
    onComplete: () => { if (hlChars.length) startSelectionLoop(); }
  });

  /* FASE 1: Letras del título — suben con stagger */
  tl.to(chars, {
    y: 0,
    opacity: 1,
    duration: 1.8,
    stagger: 0.055,  /* Retraso de 55ms entre letra y letra */
    ease: 'expo.out',
  });

  /* FASE 2: Imagen — fade + movimiento vertical suave */
  tl.to(imgWrap, {
    opacity: 1,
    y: 0,
    duration: 2.5,
    stagger: 0.055,
    ease: 'expo.out',
  }, '+=0.2');

  /* FASE 3: Subtítulo — responsive
     Desktop: efecto de typing (60ms/char)
     Mobile: fade normal */
  if (window.innerWidth > 768) {
    const fullText = subtitleEl.textContent.trim();
    subtitleEl.textContent = '';
    subtitleEl.setAttribute('aria-label', fullText);

    tl.to(subtitleEl, { opacity: 1, duration: 0.5 }, '-=1.8');
    tl.add(() => {
      let i = 0;
      const tick = setInterval(() => {
        subtitleEl.textContent = fullText.slice(0, ++i);
        if (i >= fullText.length) clearInterval(tick);
      }, 60);
    }, '-=0.3');
  } else {
    tl.to(subtitleEl, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.055,
      ease: 'expo.out',
    }, '-=1.8');
  }

  /* FASE 4: Párrafos — fade con stagger */
  tl.to(paras, {
    opacity: 1,
    y: 0,
    duration: 1.6,
    stagger: 0.045,
    ease: 'expo.out',
  }, '+=0.2');

  /* SELECTION LOOP: loop del efecto highlight */
  function startSelectionLoop() {
    function runCycle() {
      const cycleTl = gsap.timeline({
        onComplete: () => setTimeout(runCycle, 2000)  /* Repite cada 2s */
      });

      cycleTl.to(hlChars, {
        backgroundColor: 'rgb(216, 30, 92)',
        color: 'white',
        duration: 0,
        stagger: 0.04,
      });

      cycleTl.to({}, { duration: 0.9 });

      cycleTl.set(hlChars, { backgroundColor: 'transparent' });
    }

    setTimeout(runCycle, 600);
  }
};
