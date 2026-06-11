/* ════════════════════════════════════════
   LANDING-FLOW.JS

   Orquesta el flujo:
   Countdown → Female Rage Intro → Timeline
════════════════════════════════════════ */

const origShowPage = window.showPage;

/* Countdown termina y llama a esta función */
window.showFemaleRageIntro = function () {
  const femaleRageIntro = document.getElementById('female-rage-intro');
  if (femaleRageIntro) {
    femaleRageIntro.style.display = 'block';
    femaleRageIntro.classList.add('visible');
  }
};

/* El botón de female-rage-intro llama a showPage */
window.showPage = function () {
  if (origShowPage) origShowPage();
};
