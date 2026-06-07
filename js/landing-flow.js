(function () {
  const origShowPage = window.showPage;
  let femaleRageShown = false;

  window.showFemaleRageIntro = function () {
    const femaleRageIntro = document.getElementById('female-rage-intro');
    if (femaleRageIntro && !femaleRageShown && !window.skipIntro) {
      femaleRageIntro.style.display = 'block';
      femaleRageIntro.classList.add('visible');
      femaleRageShown = true;
    }
  };

  window.showPage = function () {
    const femaleRageIntro = document.getElementById('female-rage-intro');

    // Si skipIntro está activo, saltar todos los intros
    if (window.skipIntro) {
      if (origShowPage) origShowPage();
      return;
    }

    // Primera llamada desde countdown: mostrar female-rage-intro
    if (!femaleRageShown && femaleRageIntro) {
      window.showFemaleRageIntro();
      return;
    }

    // Llamadas posteriores: continuar con el flujo normal
    if (origShowPage) origShowPage();
  };
})();
