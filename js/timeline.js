/* ════════════════════════════════════════
   TIMELINE.JS — scroll horizontal

   Implementa scroll horizontal en desktop
   usando GSAP ScrollTrigger (Lenis en main.js).

   ARQUITECTURA:
   - ScrollTrigger: sincroniza animaciones con scroll
   - Panel animations: staggered, basado en viewport
   - Toggle: intercambia clean ↔ rage + rebuild
   - Dots: navegación visual por panel
════════════════════════════════════════ */


/* Referencias al DOM */
let track     = null;  /* .panel container que se anima horizontalmente */
let pin       = null;  /* #tl-pin que contiene el track */
let panels    = [];    /* Array de .panel (excepto .p-intro) */
let dots      = null;  /* NodeList de .dot (navegación) */
let dotNav    = null;  /* #dot-nav (contenedor de dots) */

/* Estado */
let isRage    = false;              /* Bandera: está en rage mode */
let hST       = null;               /* ScrollTrigger principal (pin horizontal) */
let hTween    = null;               /* GSAP tween que anima track x */
let panelSTs  = [];                 /* Array de ScrollTriggers per panel */
let rebuilding = false;             /* Flag: bloquea toggle durante rebuild */
let _wasMobile = window.innerWidth <= 768;  /* Para detectar resize */

/* Utilidad: detecta si es mobile */
function isMobile() { return window.innerWidth <= 768; }


/* PASO 1: cachear referencias al DOM
   Obtiene todos los elementos que se animan */
function initRefs() {
  track  = document.getElementById('tl-track');  /* Container horizontal que se mueve */
  pin    = document.getElementById('tl-pin');    /* Wrapper que se "pichea" */
  panels = Array.from(document.querySelectorAll('.panel:not(.p-intro)'));  /* Excepto intro */
  dots   = document.querySelectorAll('.dot');    /* Indicadores de navegación */
  dotNav = document.getElementById('dot-nav');   /* Contenedor de dots */
}


/* PASO 2: prepara paneles con estado inicial invisible
   Todos los elementos dentro de cada panel se preparan
   para ser animados cuando entren en viewport */
function initPanels() {
  panels.forEach(panel => {
    /* Elementos que se animan dentro de cada panel */
    const els = panel.querySelectorAll(
      '.tl-eyebrow, .tl-h2, .tl-h3, ' +
      '.tl-body, .tl-quote, .tl-cols, .tl-year-display'
    );
    /* Estado inicial: invisibles, desplazados hacia abajo */
    gsap.set(Array.from(els), { opacity: 0, y: 24 });
  });
}


/* PASO 3: configura scroll horizontal (desktop) o vertical (mobile)

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

  /* Reset: limpia propiedades X previas */
  gsap.set(track, { clearProps: 'x,transform' });

  /* MOBILE: no hay scroll horizontal */
  if (isMobile()) {
    buildPanelAnimations();
    return;
  }

  /* DESKTOP: crea el tween de movimiento horizontal
     Mueve el track hacia la izquierda (-X) según el ancho total */
  hTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    paused: true  /* ScrollTrigger controla el play */
  });

  /* ScrollTrigger: convierte scroll vertical en horizontal */
  hST = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,  /* Dinámico según contenido */
    pin: true,  /* Mantiene pin fijo mientras scrollea */
    anticipatePin: 1,  /* Mejora performance */
    scrub: 1,  /* Smooth scrub de 1s */
    invalidateOnRefresh: true,
    animation: hTween,
    onUpdate: self => {
      /* FILL: barra de progreso del track */
      const fill = document.getElementById('tlFill');
      if (fill) fill.style.width = (self.progress * 100) + '%';

      /* DOTS: actualiza cuál dot está activo */
      const idx = Math.round(self.progress * (dots.length - 1));
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));

      /* DOT NAV: visible entre 1% y 99% del scroll */
      dotNav.classList.toggle(
        'vis',
        self.progress > .01 && self.progress < .99
      );
    }
  });

  buildPanelAnimations();
}


/* PASO 4: anima elementos dentro de cada panel
   Responsivo: desktop tiene scroll horizontal,
   mobile tiene scroll vertical normal

   Cada panel tiene una timeline staggered:
   - eyebrow: opacity, y
   - h2, h3: opacity, y
   - body, cols: opacity, y
   - quote: opacity, y
   - yearDisplay: opacity, y
*/
function buildPanelAnimations() {
  /* Limpia previos */
  panelSTs.forEach(st => st.kill());
  panelSTs = [];

  panels.forEach(panel => {
    /* Obtiene elementos dentro del panel */
    const eyebrow  = panel.querySelector('.tl-eyebrow');
    const h2       = panel.querySelector('.tl-h2');
    const h3       = panel.querySelector('.tl-h3');
    const cols     = panel.querySelector('.tl-cols');
    const body     = panel.querySelector('.tl-body');
    const quote    = panel.querySelector('.tl-quote');
    const yearDisp = panel.querySelector('.tl-year-display');

    const allEls = [eyebrow, h2, h3, cols, body, quote, yearDisp]
      .filter(Boolean);  /* Filtra nulls */

    /* Reset */
    gsap.killTweensOf(allEls);
    gsap.set(allEls, { opacity: 0, y: 24 });

    /* Timeline paused: ScrollTrigger la controlará */
    const tl = gsap.timeline({ paused: true });

    /* Staggered animation: cada elemento aparece con delay */
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
      /* containerAnimation: en desktop, relatico al hTween (scroll horizontal) */
      ...(mobile ? {} : { containerAnimation: hTween }),
      /* start/end: diferentes para desktop vs mobile */
      start: mobile ? 'top 85%' : 'left 95%',  /* "cuando entra en viewport" */
      end:   mobile ? 'top 40%' : 'left 50%',  /* "cuando está a mitad" */
      animation: tl,
      scrub: mobile ? false : true,  /* Smooth scrub solo en desktop */
      toggleActions: mobile ? 'play none none none' : undefined,  /* Play on enter, mobile only */
      onEnter:     () => { panel._in = true;  },  /* Flag para lazy loading */
      onLeaveBack: () => { panel._in = false; }
    });
    panelSTs.push(st);
  });
}


/* PASO 5: toggle clean ↔ rage

   En la página principal (timeline), el toggle
   necesita reconstruir TODO porque los ScrollTriggers
   y animaciones cambian significativamente. */
function initToggle() {
  const btn = document.getElementById('toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (rebuilding) return;  /* Previene clicks durante rebuild */
    rebuilding = true;

    const savedScrollY = window.scrollY;

    isRage = !isRage;
    document.body.classList.toggle('clean', !isRage);
    document.body.classList.toggle('rage',   isRage);

    /* Marca todos los paneles como "no vistos" para re-animar */
    panels.forEach(p => { p._in = false; });

    /* Pequeño delay para que CSS transiciones terminen */
    setTimeout(() => {
      buildScroll();  /* Reconstruye todo */
      ScrollTrigger.refresh();

      /* Restaura posición original */
      window.scrollTo(0, savedScrollY);

      rebuilding = false;
    }, 300);
  });
}


/* PASO 6: navegación por dots (indicadores)

   Click en dot → scroll a esa posición */
function initDots() {
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      if (!hST || rebuilding) return;  /* Solo en desktop + cuando no está rebuilding */
      const total  = track.scrollWidth - window.innerWidth;
      const pinTop = pin.getBoundingClientRect().top + window.scrollY;
      /* Calcula posición basado en índice del dot */
      lenis.scrollTo(pinTop + (i / (dots.length - 1)) * total);
    });
  });
}


/* PASO 7: PUNTO DE ENTRADA ÚNICO

   Llamado desde countdown.js después del countdown.
   Inicia todo el sistema: timeline, scroll, animaciones. */
function showPage() {
  lenis.scrollTo(0, { immediate: true });

  document.getElementById('page').classList.add('ready');
  document.getElementById('toggle-wrap').classList.add('vis');
  document.getElementById('main-header').classList.add('active');

  initRefs();

  /* Marca el primer dot como activo */
  dots.forEach((d, i) => d.classList.toggle('on', i === 0));

  initPanels();
  buildScroll();
  ScrollTrigger.refresh();  /* Recalcula pin spacer → lenis.resize() */
  if (window.initCineIntroAnim)   window.initCineIntroAnim();
  initToggle();
  initDots();
}

window.showPage = showPage;


/* PASO 8: RESIZE DETECTOR

   Si cambia entre mobile/desktop, reconstruye */
window.addEventListener('resize', () => {
  if (rebuilding) return;
  const nowMobile = isMobile();
  if (nowMobile !== _wasMobile) {
    _wasMobile = nowMobile;
    buildScroll();  /* Reconstruye para nuevo breakpoint */
  }
  ScrollTrigger.refresh();
});
