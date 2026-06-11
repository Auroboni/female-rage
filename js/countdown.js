/* ════════════════════════════════════════
   COUNTDOWN.JS — Secuencia intro de cine

   ARQUITECTURA:
   - buildPerfs(): genera la tira de película
   - setRing(): anima círculo SVG
   - runCountdown(): secuencia 5-0
   - Salida: enlaza a showFemaleRageIntro()
   - Detecta #catalogo en URL para no cargar de nuevo
════════════════════════════════════════ */

/* PERFORACIONES: genera agujeros del film */
(function buildPerfs() {
  ['fs-left', 'fs-right'].forEach(id => {
    const strip = document.getElementById(id);
    if (!strip) return;
    const count = Math.ceil(window.innerHeight / 36) + 2;
    for (let i = 0; i < count; i++) {
      const perf = document.createElement('div');
      perf.className = 'perf';
      strip.appendChild(perf);
    }
  });
})();

/* SVG RING: círculo animado que se vacía progresivamente */
const CIRC   = 616;
const cdProg = document.getElementById('cd-prog');
function setRing(pct) {
  if (cdProg) cdProg.setAttribute('stroke-dashoffset', CIRC * pct);
}
setRing(0);  


/* COUNTDOWN: secuencia 5→0 con animaciones */
let cdRunning = false; 

function runCountdown() {
  if (cdRunning) return;
  cdRunning = true;

  const numEl   = document.getElementById('cd-num');
  const overlay = document.getElementById('countdown');
  const landing = document.getElementById('landing');

  /* TRANSICIÓN: fade in countdown, fade out landing */
  gsap.to(overlay, {
    opacity: 1, duration: .3, ease: 'power2.inOut',
    onStart: () => { overlay.style.pointerEvents = 'all'; }
  });
  gsap.to(landing, { opacity: 0, duration: .25, delay: .1 });

  /* TICK RECURSIVO: cada número y su animación del ring */
  function tick(n) {
  
    if (n < 0) {
      gsap.to(overlay, {
        opacity: 0, duration: .5, ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
          overlay.style.display = 'none';
          landing.style.display = 'none';
          window.showFemaleRageIntro();  /* Siguiente sección */
        }
      });
      return;
    }

    if (numEl) numEl.textContent = n;

    gsap.fromTo({ v: 0 }, { v: 1 }, {
      duration: .6, ease: 'none',
      onUpdate: function() { setRing(this.targets()[0].v); }
    });

    setTimeout(() => tick(n - 1), 650);
  }

  setTimeout(() => tick(5), 200);
}

/* Botón Play dispara countdown */
const playBtn = document.getElementById('playBtn');
if (playBtn) playBtn.addEventListener('click', runCountdown);

/* SMART EXIT: si vuelves desde ficha.html#catalogo
   Salta landing y countdown, va directo a cartelera */
if (window.location.hash === '#catalogo') {
  const landing = document.getElementById('landing');
  const overlay = document.getElementById('countdown');

  /* Oculta landing y countdown */
  if (landing) {
    landing.style.opacity = '0';
    landing.style.pointerEvents = 'none';
  }
  if (overlay) {
    overlay.style.display = 'none';
  }

  if (window.showPage) window.showPage();
  
  requestAnimationFrame(() => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'instant' });
  });
}
