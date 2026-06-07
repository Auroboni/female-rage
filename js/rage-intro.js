/* ════════════════════════════════════════
   RAGE-INTRO.JS
   Pantalla minimalista post-countdown.
   Se carga entre timeline.js y countdown.js,
   envuelve window.showPage().
════════════════════════════════════════ */

(function () {
  const origShowPage = window.showPage;
  let rageIntroShown = false;

  window.showPage = function () {
    const intro  = document.getElementById('rage-intro');
    const phrase = document.getElementById('ri-phrase');

    if (!intro || !phrase || !origShowPage || window.skipIntro || rageIntroShown) {
      if (origShowPage) origShowPage();
      return;
    }

    rageIntroShown = true;

    // 1 — Fade in del fondo
    intro.classList.add('ri-visible');

    // 2 — Aparece la frase
    setTimeout(() => phrase.classList.add('ri-phrase-in'), 700);

    // 3 — Toggle se activa: rage ON
    //     El fondo cambia, la frase se ilumina, el toggle salta
    setTimeout(() => intro.classList.add('is-rage'), 1600);

    // 4 — Toggle se desactiva: vuelve a clean
    setTimeout(() => intro.classList.remove('is-rage'), 4400);

    // 5 — Fade out e iniciar siguiente fase al mismo tiempo
    //     story-intro cubre el fondo mientras rage-intro se desvanece
    setTimeout(() => {
      intro.classList.remove('ri-visible');
      origShowPage();
    }, 4400);
  };

})();
