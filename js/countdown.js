/* ════════════════════════════════════════
   COUNTDOWN.JS
   · Perforaciones del film strip
   · Ring SVG 5→0
   · Llamar window.showPage() al terminar
════════════════════════════════════════ */

/* ── PERFORACIONES ── */
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

/* ── SVG RING ── */
const CIRC   = 616;
const cdProg = document.getElementById('cd-prog');

function setRing(pct) {
  if (cdProg) cdProg.setAttribute('stroke-dashoffset', CIRC * pct);
}
setRing(0);

/* ── LABELS ── */
const CD_LABELS = { 5:'FADE IN', 4:'SLATE', 3:'ROLL', 2:'SYNC', 1:'FADE OUT', 0:'ACTION' };

/* ── COUNTDOWN ── */
let cdRunning = false;

function runCountdown() {
  if (cdRunning) return;
  cdRunning = true;

  const numEl   = document.getElementById('cd-num');
  const subEl   = document.getElementById('cd-sub');
  const overlay = document.getElementById('countdown');
  const landing = document.getElementById('landing');

  gsap.to(overlay, {
    opacity: 1, duration: .3, ease: 'power2.inOut',
    onStart: () => { overlay.style.pointerEvents = 'all'; }
  });
  gsap.to(landing, { opacity: 0, duration: .25, delay: .1 });

  function tick(n) {
    if (n < 0) {
      gsap.to(overlay, {
        opacity: 0, duration: .5, ease: 'power2.inOut',
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
          overlay.style.display = 'none';
          landing.style.display = 'none';
          window.showFemaleRageIntro();
        }
      });
      return;
    }

    if (numEl) numEl.textContent = n;
    if (subEl) subEl.textContent = CD_LABELS[n] || '';

    gsap.fromTo({ v: 0 }, { v: 1 }, {
      duration: .6, ease: 'none',
      onUpdate: function() { setRing(this.targets()[0].v); }
    });

    setTimeout(() => tick(n - 1), 650);
  }

  setTimeout(() => tick(5), 200);
}

/* ── BOTÓN PLAY ── */
const playBtn = document.getElementById('playBtn');
if (playBtn) playBtn.addEventListener('click', runCountdown);

/* ── RETORNO DESDE FICHA ──
   Si la URL incluye #catalogo, saltamos el landing/countdown
   y vamos directo a la sección. ── */
if (window.location.hash === '#catalogo') {
  const landing = document.getElementById('landing');
  const overlay = document.getElementById('countdown');
  if (landing) { landing.style.opacity = '0'; landing.style.pointerEvents = 'none'; }
  if (overlay) { overlay.style.display = 'none'; }

  if (window.showPage) window.showPage();

  /* requestAnimationFrame espera a que ScrollTrigger haya añadido
     el pin-spacer al DOM antes de calcular la posición de #catalogo */
  requestAnimationFrame(() => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'instant' });
  });
}
