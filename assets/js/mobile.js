
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("hamburger");
  const nav = document.querySelector(".nav-links");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
});
