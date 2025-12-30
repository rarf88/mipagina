
document.addEventListener("DOMContentLoaded", ()=>{
  const btn = document.querySelector(".hamburger");
  const nav = document.querySelector(".mobile-nav");
  if(!btn || !nav) return;
  btn.addEventListener("click", ()=>{
    nav.classList.toggle("open");
  });
});
