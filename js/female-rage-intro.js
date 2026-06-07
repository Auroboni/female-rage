(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('female-rage-btn');
    const section = document.getElementById('female-rage-intro');

    if (btn) {
      btn.addEventListener('click', () => {
        section.classList.remove('visible');
        section.style.display = 'none';
        section.style.pointerEvents = 'none';
        if (window.showPage) {
          window.showPage();
        }
      });
    }
  });
})();
