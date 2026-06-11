/* ════════════════════════════════════════
   HEADER.JS 

   Maneja el menú hamburguesa en mobile:
   - Toggle: click en botón abre/cierra
   - Auto-cierre: al hacer click en enlace
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const menuBtn = document.getElementById('header-menu-btn');
  const mobileMenu = document.getElementById('header-mobile-menu');
  const navLinks = document.querySelectorAll('.header-nav a, .header-mobile-menu a');

  if (!header) return;

  /* TOGGLE: click en hamburguesa abre/cierra menú */
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  /* AUTO-CIERRE: al hacer click en cualquier enlace, cierra el menú */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
});
