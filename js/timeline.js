/* ════════════════════════════════════════
   TIMELINE.JS — scroll horizontal

  Scroll horizontal en desktop vs Scroll vertical en responsive

   ARQUITECTURA:
   - ScrollTrigger: sincroniza animaciones con scroll
   - Panel animations: staggered, basado en viewport
   - Toggle: intercambia clean ↔ rage 
   - Dots: navegación visual por panel
════════════════════════════════════════ */


/* VARIABLES */
let track     = null;  /* .panel container que se anima horizontalmente */
let pin       = null;  /* #tl-pin que contiene el track */
let panels    = [];    /* Array de .panel (excepto .p-intro) */
let dots      = null;  /* Puntos de navegación */
let dotNav    = null;  /* #dot-nav (contenedor de dots) */

/* Estado */
let isRage    = false;              /* Bandera: está en rage mode */
let hST       = null;               /* ScrollTrigger principal (pin horizontal) */
let hTween    = null;               /* GSAP tween que anima track x */
let panelSTs  = [];                 /* Array de ScrollTriggers per panel */
let rebuilding = false;             /* Flag: bloquea toggle durante rebuild */
let _wasMobile = window.innerWidth <= 768;  /* Para detectar resize */

/* Detecta si es mobile */
function isMobile() { return window.innerWidth <= 768; }


/* PASO 1: Todos los elementos que se animan */
function initRefs() {
  track  = document.getElementById('tl-track');  
  pin    = document.getElementById('tl-pin');    
  panels = Array.from(document.querySelectorAll('.panel:not(.p-intro)'));  /* Excepto intro */
  dots   = document.querySelectorAll('.dot');
  dotNav = document.getElementById('dot-nav');
}


/* PASO 2: configura scroll horizontal (desktop) o vertical (mobile)

   Desktop:
   - Crea tween que mueve track en -X
   - ScrollTrigger sincroniza: scroll vertical → movimiento horizontal
   - Pin: mantiene la sección fija mientras scrollea

   Mobile:
   - Salta scroll horizontal, usa animaciones normales */
function buildScroll() {
  /* Limpia animaciones previas */
  if (hST)    { hST.kill();    hST    = null; }
  if (hTween) { hTween.kill();  hTween = null; }
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
      /* PROGRESS BAR - se anima en funciñón del scroll*/
      const fill = document.getElementById('tlFill');
      if (fill) fill.style.width = (self.progress * 100) + '%';

      /* DOTS: actualiza cuál dot está activo */
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


/* PASO 3: anima elementos dentro de cada panel*/
function buildPanelAnimations() {
  panelSTs.forEach(st => st.kill());
  panelSTs = [];

  panels.forEach(panel => {
    const eyebrow  = panel.querySelector('.tl-eyebrow');
    const h2       = panel.querySelector('.tl-h2');
    const h3       = panel.querySelector('.tl-h3');
    const cols     = panel.querySelector('.tl-cols');
    const body     = panel.querySelector('.tl-body');
    const quote    = panel.querySelector('.tl-quote');
    const yearDisp = panel.querySelector('.tl-year-display');

    const allEls = [eyebrow, h2, h3, cols, body, quote, yearDisp]
      .filter(Boolean);

    /* Reset */
    gsap.killTweensOf(allEls);
    gsap.set(allEls, { opacity: 0, y: 24 });

    const tl = gsap.timeline({ paused: true });

    /* Cada elemento aparece con delay */
    if (eyebrow)  tl.to(eyebrow,  { opacity:1, y:0, ease:'power2.out', duration:1   }, 0);
    if (h2)       tl.to(h2,       { opacity:1, y:0, ease:'power2.out', duration:1.1 }, .4);
    if (h3)       tl.to(h3,       { opacity:1, y:0, ease:'power2.out', duration:.9  }, .55);
    if (cols)     tl.to(cols,     { opacity:1, y:0, ease:'power2.out', duration:1   }, .65);
    if (body)     tl.to(body,     { opacity:1, y:0, ease:'power2.out', duration:1   }, .65);
    if (quote)    tl.to(quote,    { opacity:1, y:0, ease:'power2.out', duration:.9  }, .85);
    if (yearDisp) tl.to(yearDisp, { opacity:1, y:0, ease:'power2.out', duration:1   }, .9);

    /* ScrollTrigger: responsivo según device */
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


/* PASO 4: toggle clean ↔ rage
Reconstruye al cambiar de interfaz, no vuelve a animar 
elementos que ya estaban cargados, en cambio si no se
han cargado los anima */
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

      /* Restaura posición original */
      window.scrollTo(0, savedScrollY);

      rebuilding = false;
    }, 300);
  });
}


/* PASO 5: navegación por dots (indicadores)

   Click en dot - scroll a esa posición */
function initDots() {
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      if (!hST || rebuilding) return;
      const total  = track.scrollWidth - window.innerWidth;
      const pinTop = pin.getBoundingClientRect().top + window.scrollY;
      /* Calcula posición basado en índice del dot */
      lenis.scrollTo(pinTop + (i / (dots.length - 1)) * total);
    });
  });
}


/* PASO 6: PUNTO DE ENTRADA ÚNICO
   Llamado desde story-intro.js */
function showPage() {
  lenis.scrollTo(0, { immediate: true });

  document.getElementById('page').classList.add('ready');
  document.getElementById('toggle-wrap').classList.add('vis');
  document.getElementById('main-header').classList.add('active');

  initRefs();

  /* Marca el primer dot como activo */
  dots.forEach((d, i) => d.classList.toggle('on', i === 0));

  buildScroll();
  ScrollTrigger.refresh();  /* Recalcula pin spacer → lenis.resize() */
  if (window.initCineIntroAnim)   window.initCineIntroAnim();
  initToggle();
  initDots();
}

window.showPage = showPage;


/* PASO 7: RESIZE */
window.addEventListener('resize', () => {
  if (rebuilding) return;
  const nowMobile = isMobile();
  if (nowMobile !== _wasMobile) {
    _wasMobile = nowMobile;
    buildScroll(); 
  }
  ScrollTrigger.refresh();
});
