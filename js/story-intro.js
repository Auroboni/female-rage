/* ════════════════════════════════════════
   STORY-INTRO.JS — sección transición a timeline

   Secuencia:
   - Overlay cubre pantalla completa
   - Palabra entra con efecto "back out"
   - Pausa de lectura
   - Overlay sube (yPercent -100) mientras timeline inicia
════════════════════════════════════════ */

(function () {
  const origShowPage = window.showPage; 

  window.showPage = function () {
    const intro = document.getElementById('story-intro');
    const word  = document.querySelector('.si-word');

    if (!intro || !word || !origShowPage || window.skipIntro) {
      if (origShowPage) origShowPage();
      return;
    }

    gsap.set(intro, { opacity: 1 });

    /* ESTADO INICIAL: palabra está fuera de viewport*/
    gsap.set(word, {
      scale: 1.5,
      opacity: 0,
      filter: 'blur(32px)',
      y: 120,
      rotation: -8
    });

    gsap.timeline()
      /* FASE 1: pausa inicial 0.3s */
      .to({}, { duration: 0.3 })

      /* FASE 2: entrada dinámica */
      .to(word, {
        scale:    1,
        opacity:  1,
        filter:   'blur(0px)',
        y:        0,
        rotation: 0,
        duration: 1.2,
        ease:     'back.out(1.2)'
      })

      /* FASE 3: pausa*/
      .to({}, { duration: 1.5 })

      /* FASE 4: iniciar página principal */
      .call(origShowPage)

      /* FASE 5: overlay sube mientras timeline entra */
      .to(intro, { yPercent: -100, duration: 1.5, ease: 'power2.inOut' });
  };
})();
