/* ════════════════════════════════════════
   TIMELINE.JS
   Scroll horizontal con GSAP ScrollTrigger
   + Lenis smooth scroll.

   NO ejecuta nada al cargarse.
   Todo arranca desde showPage() que llama
   countdown.js cuando termina el contador.

   Expone: window.showPage(), window.lenis
════════════════════════════════════════ */

/* ────────────────────────────────────
   LENIS — smooth scroll
   Integrado con ScrollTrigger via ticker.
──────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* Cuando ScrollTrigger crea/actualiza el pin spacer, relanza el cálculo
   de scroll limit de Lenis para que ambos estén sincronizados. */
ScrollTrigger.addEventListener('refresh', () => lenis.resize());

window.lenis = lenis;

/* ── BARRA DE PROGRESO ── */
lenis.on('scroll', ({ scroll, limit }) => {
  const pct = limit > 0 ? (scroll / limit) * 100 : 0;
  document.getElementById('prog').style.width = pct + '%';
});


/* ────────────────────────────────────
   ESTADO DEL MÓDULO
──────────────────────────────────── */
let track     = null;
let pin       = null;
let panels    = [];
let dots      = null;
let dotNav    = null;

let isRage    = false;
let hST       = null;   /* ScrollTrigger principal (pin) */
let hTween    = null;   /* tween que mueve el track */
let panelSTs  = [];     /* ScrollTriggers por panel */
let rebuilding = false; /* bloquea toggle durante rebuild */
let _wasMobile = window.innerWidth <= 768;

function isMobile() { return window.innerWidth <= 768; }


/* ────────────────────────────────────
   PASO 1 — initRefs()
──────────────────────────────────── */
function initRefs() {
  track  = document.getElementById('tl-track');
  pin    = document.getElementById('tl-pin');
  panels = Array.from(document.querySelectorAll('.panel:not(.p-intro)'));
  dots   = document.querySelectorAll('.dot');
  dotNav = document.getElementById('dot-nav');
}


/* ────────────────────────────────────
   PASO 2 — initPanels()
──────────────────────────────────── */
function initPanels() {
  panels.forEach(panel => {
    const els = panel.querySelectorAll(
      '.tl-eyebrow, .tl-rule, .tl-h2, .tl-h3, ' +
      '.tl-body, .tl-quote, .tl-cols, .tl-year-display'
    );
    gsap.set(Array.from(els), { opacity: 0, y: 24 });

    const rule = panel.querySelector('.tl-rule');
    if (rule) gsap.set(rule, { scaleX: 0, opacity: 0 });
  });
}


/* ────────────────────────────────────
   PASO 3 — buildScroll()
──────────────────────────────────── */
function buildScroll() {
  if (hST)   { hST.kill();   hST   = null; }
  if (hTween){ hTween.kill(); hTween = null; }
  panelSTs.forEach(st => st.kill());
  panelSTs = [];

  gsap.set(track, { clearProps: 'x,transform' });

  if (isMobile()) {
    buildPanelAnimations();
    return;
  }

  hTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    paused: true
  });

  hST = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    pin: true,
    anticipatePin: 1,
    scrub: 1,
    invalidateOnRefresh: true,
    animation: hTween,
    onUpdate: self => {
      const fill = document.getElementById('tlFill');
      if (fill) fill.style.width = (self.progress * 100) + '%';

      const idx = Math.round(self.progress * (dots.length - 1));
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));

      dotNav.classList.toggle(
        'vis',
        self.progress > .01 && self.progress < .99
      );
    }
  });

  buildPanelAnimations();
}


/* ────────────────────────────────────
   PASO 4 — buildPanelAnimations()
──────────────────────────────────── */
function buildPanelAnimations() {
  panelSTs.forEach(st => st.kill());
  panelSTs = [];

  panels.forEach(panel => {
    const eyebrow  = panel.querySelector('.tl-eyebrow');
    const rule     = panel.querySelector('.tl-rule');
    const h2       = panel.querySelector('.tl-h2');
    const h3       = panel.querySelector('.tl-h3');
    const cols     = panel.querySelector('.tl-cols');
    const body     = panel.querySelector('.tl-body');
    const quote    = panel.querySelector('.tl-quote');
    const yearDisp = panel.querySelector('.tl-year-display');

    const allEls = [eyebrow, rule, h2, h3, cols, body, quote, yearDisp]
      .filter(Boolean);

    gsap.killTweensOf(allEls);
    gsap.set(allEls, { opacity: 0, y: 24 });
    if (rule) gsap.set(rule, { scaleX: 0, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    if (eyebrow)  tl.to(eyebrow,  { opacity:1, y:0, ease:'power2.out', duration:1   }, 0);
    if (rule)     tl.to(rule,     { opacity:1, scaleX:1, ease:'power2.out', duration:.8  }, .3);
    if (h2)       tl.to(h2,       { opacity:1, y:0, ease:'power2.out', duration:1.1 }, .4);
    if (h3)       tl.to(h3,       { opacity:1, y:0, ease:'power2.out', duration:.9  }, .55);
    if (cols)     tl.to(cols,     { opacity:1, y:0, ease:'power2.out', duration:1   }, .65);
    if (body)     tl.to(body,     { opacity:1, y:0, ease:'power2.out', duration:1   }, .65);
    if (quote)    tl.to(quote,    { opacity:1, y:0, ease:'power2.out', duration:.9  }, .85);
    if (yearDisp) tl.to(yearDisp, { opacity:1, y:0, ease:'power2.out', duration:1   }, .9);

    const mobile = isMobile();
    const st = ScrollTrigger.create({
      trigger: panel,
      ...(mobile ? {} : { containerAnimation: hTween }),
      start: mobile ? 'top 85%' : 'left 95%',
      end:   mobile ? 'top 40%' : 'left 50%',
      animation: tl,
      scrub: mobile ? false : true,
      toggleActions: mobile ? 'play none none none' : undefined,
      onEnter:     () => { panel._in = true;  },
      onLeaveBack: () => { panel._in = false; }
    });
    panelSTs.push(st);
  });
}


/* ────────────────────────────────────
   PASO 5 — initToggle()
──────────────────────────────────── */
function initToggle() {
  const btn = document.getElementById('toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (rebuilding) return;
    rebuilding = true;

    const savedScrollY = window.scrollY;

    isRage = !isRage;
    document.body.classList.toggle('clean', !isRage);
    document.body.classList.toggle('rage',   isRage);

    panels.forEach(p => { p._in = false; });

    setTimeout(() => {
      buildScroll();
      ScrollTrigger.refresh();

      /* Restaurar posición después del refresh */
      window.scrollTo(0, savedScrollY);

      rebuilding = false;
    }, 300);
  });
}


/* ────────────────────────────────────
   PASO 6 — initDots()
──────────────────────────────────── */
function initDots() {
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      if (!hST || rebuilding) return;
      const total  = track.scrollWidth - window.innerWidth;
      const pinTop = pin.getBoundingClientRect().top + window.scrollY;
      lenis.scrollTo(pinTop + (i / (dots.length - 1)) * total);
    });
  });
}


/* ────────────────────────────────────
   PASO 7 — showPage()
   Punto de entrada único desde countdown.js
──────────────────────────────────── */
function showPage() {
  lenis.scrollTo(0, { immediate: true });

  document.getElementById('page').classList.add('ready');
  document.getElementById('toggle-wrap').classList.add('vis');
  document.getElementById('main-header').classList.add('active');

  initRefs();

  dots.forEach((d, i) => d.classList.toggle('on', i === 0));

  initPanels();
  buildScroll();
  ScrollTrigger.refresh(); /* recalcula pin spacer → dispara 'refresh' → lenis.resize() */
  if (window.initCineIntroAnim)   window.initCineIntroAnim();
  initToggle();
  initDots();
}

window.showPage = showPage;


/* ────────────────────────────────────
   PASO 8 — Resize
──────────────────────────────────── */
window.addEventListener('resize', () => {
  if (rebuilding) return;
  const nowMobile = isMobile();
  if (nowMobile !== _wasMobile) {
    _wasMobile = nowMobile;
    buildScroll();
  }
  ScrollTrigger.refresh();
});
