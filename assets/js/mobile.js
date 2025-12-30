
document.addEventListener("DOMContentLoaded", ()=>{
  const btn = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if(!btn || !links) return;
  btn.addEventListener("click", ()=>{
    links.classList.toggle("open");
  });
});
