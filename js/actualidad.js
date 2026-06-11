/* ════════════════════════════════════════
   ACTUALIDAD.JS

   Animaciones rápidas cuando entra en viewport
   - Título: split text animado
   - Imagen: fade rápido
   - Subtítulo: typing effect
   - Párrafos: fade con stagger
════════════════════════════════════════ */

let actualidadInitialized = false;

const actualidadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target.id === 'actualidad' && entry.isIntersecting && !actualidadInitialized) {
      actualidadInitialized = true;
      window.initActualidadAnim();
      actualidadObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

window.initActualidadAnim = function () {
  const section = document.getElementById('actualidad');
  if (!section) return;

  const titleEl = section.querySelector('.pqa-title');
  const imgWrap = section.querySelector('.pqa-img-wrap');
  const subtitleEl = section.querySelector('.pqa-subtitle');
  const paras = section.querySelectorAll('.pqa-body p');
  const highlightEl = section.querySelector('.pqa-highlight');

  /* SPLIT TÍTULO */
  const rawText = titleEl.textContent.trim();
  titleEl.setAttribute('aria-label', rawText);
  titleEl.innerHTML = rawText
    .split('')
    .map(ch => ch === ' '
      ? '<span class="char-space"> </span>'
      : `<span class="char-wrap"><span class="char">${ch}</span></span>`)
    .join('');
  const chars = titleEl.querySelectorAll('.char');

  /* SPLIT HIGHLIGHT */
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

  const tl = gsap.timeline({ onComplete: () => { if (hlChars.length) startSelectionLoop(); } });

  /* Título — rápido */
  tl.fromTo(chars,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.03, ease: 'power2.out' }
  );

  /* Imagen — muy rápido */
  tl.fromTo(imgWrap,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  );

  /* Subtítulo — typing rápido */
  if (window.innerWidth > 768) {
    const fullText = subtitleEl.textContent.trim();
    subtitleEl.textContent = '';
    subtitleEl.setAttribute('aria-label', fullText);
    tl.add(() => {
      let i = 0;
      const tick = setInterval(() => {
        subtitleEl.textContent = fullText.slice(0, ++i);
        if (i >= fullText.length) clearInterval(tick);
      }, 35);
    });
  } else {
    tl.fromTo(subtitleEl,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }

  /* Párrafos — rápido */
  tl.fromTo(paras,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
    '-=0.2'
  );

  function startSelectionLoop() {
    function runCycle() {
      const cycleTl = gsap.timeline({ onComplete: () => setTimeout(runCycle, 2000) });
      cycleTl.to(hlChars, { backgroundColor: 'rgb(216, 30, 92)', color: 'white', duration: 0, stagger: 0.02 });
      cycleTl.to({}, { duration: 0.7 });
      cycleTl.set(hlChars, { backgroundColor: 'transparent' });
    }
    setTimeout(runCycle, 400);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('actualidad');
  if (section) actualidadObserver.observe(section);
});
