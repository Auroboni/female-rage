/* ════════════════════════════════════════
   ACTUALIDAD.JS — #porqueahora
   Carga animaciones solo cuando la sección es visible
════════════════════════════════════════ */

let actualidadInitialized = false;

/* Ocultar elementos inicialmente */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('porqueahora');
  if (!section) return;

  const imgWrap = section.querySelector('.pqa-img-wrap');
  const subtitleEl = section.querySelector('.pqa-subtitle');
  const paras = section.querySelectorAll('.pqa-body p');

  gsap.set([imgWrap, subtitleEl, ...paras], { opacity: 0 });

  /* Intersection Observer: cargar solo cuando la sección es visible */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !actualidadInitialized) {
        window.initActualidadAnim();
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(section);
});

window.initActualidadAnim = function () {
  const section    = document.getElementById('porqueahora');
  if (!section || actualidadInitialized) return;

  actualidadInitialized = true;

  const titleEl    = section.querySelector('.pqa-title');
  const imgWrap    = section.querySelector('.pqa-img-wrap');
  const subtitleEl = section.querySelector('.pqa-subtitle');
  const paras      = section.querySelectorAll('.pqa-body p');

  /* ── Split título en letras individuales ── */
  const rawText = titleEl.textContent.trim();
  titleEl.setAttribute('aria-label', rawText);
  titleEl.innerHTML = rawText
    .split('')
    .map(ch => ch === ' '
      ? '<span class="char-space"> </span>'
      : `<span class="char-wrap"><span class="char">${ch}</span></span>`)
    .join('');
  const chars = titleEl.querySelectorAll('.char');

  /* Establecer estado inicial para animar */
  gsap.set(chars, { opacity: 0, y: 60 });
  gsap.set(imgWrap, { opacity: 0, y: 20 });
  gsap.set(subtitleEl, { opacity: 0, y: 16 });
  gsap.set(paras, { opacity: 0, y: 28 });

  /* ── Split .pqa-highlight en spans por letra para efecto selección ── */
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

  /* ── Timeline única ── */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%' },
    onComplete: () => { if (hlChars.length) startSelectionLoop(); }
  });

  /* 1. Letras del título — suben suavemente una tras otra */
  tl.to(chars, {
    y: 0,
    opacity: 1,
    duration: 1.8,
    stagger: 0.055,
    ease: 'expo.out',
  });

  /* 2. Imagen — fade con ligero movimiento vertical */
  tl.to(imgWrap, {
    opacity: 1,
    y: 0,
    duration: 2.5,
    stagger: 0.055,
    ease: 'expo.out',
  }, '+=0.2');

  /* 3. Subtítulo: typing en desktop (60ms/char), fade en mobile */
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
    }, '-=0.5');
  } else {
    tl.to(subtitleEl, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.055,
      ease: 'expo.out',
    }, '-=1.8');
  }

  /* 4. Párrafos */
  tl.to(paras, {
    opacity: 1,
    y: 0,
    duration: 1.6,
    stagger: 0.045,
    ease: 'expo.out',
  }, '+=0.3');

  /* ── Animación de selección letra a letra en loop ── */
  function startSelectionLoop() {
    function runCycle() {
      const cycleTl = gsap.timeline({
        onComplete: () => setTimeout(runCycle, 2000)
      });

      /* Seleccionar: snap instantáneo por letra, como el cursor arrastrando */
      cycleTl.to(hlChars, {
        backgroundColor: 'rgb(216, 30, 92)',
        color:'white',
        duration: 0,
        stagger: 0.04,
      });

      /* Mantener seleccionado */
      cycleTl.to({}, { duration: 0.9 });

      /* Deseleccionar: snap instantáneo, como hacer click en otro sitio */
      cycleTl.set(hlChars, { backgroundColor: 'transparent' });
    }

    setTimeout(runCycle, 600);
  }
};
