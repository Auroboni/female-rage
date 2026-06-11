/* ════════════════════════════════════════
   RAGE-INTRO.JS — Demostración clean↔rage

   Pantalla  que muestra al usuario
  la transición entre clean y rage mode.
════════════════════════════════════════ */

(function () {
  const origShowPage = window.showPage;
  let rageIntroShown = false;             /* Ejecuta una sola vez */

  /* Intercepta showPage para insertar esta pantalla */
  window.showPage = function () {
    const intro  = document.getElementById('rage-intro');
    const phrase = document.getElementById('ri-phrase');

    if (!intro || !phrase || !origShowPage || window.skipIntro || rageIntroShown) {
      if (origShowPage) origShowPage();
      return;
    }

    rageIntroShown = true;

    intro.classList.add('ri-visible');

    setTimeout(() => phrase.classList.add('ri-phrase-in'), 700);

    /* Toggle ON — cambia a rage
       El fondo se oscurece, la frase se ilumina con efectos */
    setTimeout(() => intro.classList.add('is-rage'), 1600);

    /* Toggle OFF — vuelve a clean
       Este timeout simplemente remueve la clase, volviendo al estado original */
    setTimeout(() => intro.classList.remove('is-rage'), 4400);

    /* Mientras rage-intro se desvanece, story-intro entra */
    setTimeout(() => {
      intro.classList.remove('ri-visible');
      origShowPage();
    }, 4400);
  };

})();
