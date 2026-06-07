/* STORY-INTRO
   Pantalla de transición post-countdown
   Overlay fijo que cubre antes de mostrar el timeline
*/

/* ─── HISTORIA — overlay fijo, envuelve showPage ─── */
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

    /* Texto empieza rotado, escalado, desenfocado, transparente y desplazado */
    gsap.set(word, {
      scale: 1.5,
      opacity: 0,
      filter: 'blur(32px)',
      y: 120,
      rotation: -8
    });

    gsap.timeline()
      /* Pausa mínima */
      .to({}, { duration: 0.3 })

      /* Entrada dinámica: sube, desrotaciona, enfoca y aparece */
      .to(word, {
        scale:    1,
        opacity:  1,
        filter:   'blur(0px)',
        y:        0,
        rotation: 0,
        duration: 1.2,
        ease:     'back.out(1.2)'
      })

      /* Pausa de lectura */
      .to({}, { duration: 1.5 })

      .call(origShowPage)
      .to(intro, { yPercent: -100, duration: 1.5, ease: 'power2.inOut' });
  };
})();
