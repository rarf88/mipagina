
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;
  btn.addEventListener('click', function(){
    menu.classList.toggle('open');
  });
});
