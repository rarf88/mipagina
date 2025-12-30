
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.hamburger, .menu-toggle, [aria-controls="mobile-menu"]');
  const nav = document.querySelector('.nav-links, nav ul, .navbar-menu, #mobile-menu');
  if (!btn || !nav) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.toggle('menu-open');
    nav.classList.toggle('open');
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> {
      document.body.classList.remove('menu-open');
      nav.classList.remove('open');
    });
  });
});
