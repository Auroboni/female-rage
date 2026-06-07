/* ════════════════════════════════════════
   HEADER.JS
   Navegación principal
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const menuBtn = document.getElementById('header-menu-btn');
  const mobileMenu = document.getElementById('header-mobile-menu');
  const navLinks = document.querySelectorAll('.header-nav a, .header-mobile-menu a');

  if (!header) return;

  /* ── Toggle menú mobile ── */
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  /* ── Cerrar menú mobile al hacer click en link ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
});
