const $=(q,e=document)=>e.querySelector(q);
const $$=(q,e=document)=>Array.from(e.querySelectorAll(q));

function initNav(){
  const b=$('#burger'); const m=$('#mobileMenu');
  if(!b||!m) return;
  b.addEventListener('click',()=>{
    const open = m.style.display==='block';
    m.style.display = open ? 'none' : 'block';
    b.setAttribute('aria-expanded',(!open).toString());
  });
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{
    m.style.display='none'; b.setAttribute('aria-expanded','false');
  }));
}

function initReveal(){
  const els=$$('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(el=>el.classList.add('show'));return;}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
    });
  },{threshold:.12});
  els.forEach(el=>io.observe(el));
}

function animateCount(el){
  const to=Number(el.getAttribute('data-to')||'0');
  const from=Number(el.getAttribute('data-from')||'0');
  const dur=Number(el.getAttribute('data-dur')||'1100');
  const suffix=el.getAttribute('data-suffix')||'';
  const start=performance.now();
  function tick(t){
    const p=Math.min(1,(t-start)/dur);
    const v=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));
    el.textContent=v.toLocaleString('es-CO')+suffix;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function initCounters(){
  const cs=$$('.count'); if(!cs.length) return;
  if(!('IntersectionObserver' in window)){cs.forEach(animateCount);return;}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animateCount(e.target); io.unobserve(e.target); }
    });
  },{threshold:.35});
  cs.forEach(c=>io.observe(c));
}

function sparkline(points){
  const w=260,h=46,p=6;
  const minY=Math.min(...points),maxY=Math.max(...points);
  const sx=i=>p+(w-p*2)*(i/(points.length-1));
  const sy=y=>{ if(maxY===minY) return h/2; const n=(y-minY)/(maxY-minY); return (h-p)-n*(h-p*2); };
  let d='';
  points.forEach((y,i)=>{ const x=sx(i),yy=sy(y); d+=(i===0?`M${x},${yy}`:` L${x},${yy}`); });
  const area=d+` L${w-p},${h-p} L${p},${h-p} Z`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(25,196,198,1)"/>
        <stop offset="1" stop-color="rgba(71,242,161,1)"/>
      </linearGradient>
      <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(25,196,198,.28)"/>
        <stop offset="1" stop-color="rgba(25,196,198,0)"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#a)"/>
    <path d="${d}" fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

// IDs internos (rf01-rf04) se conservan para no romper la lógica;
// nombres visibles se vuelven comerciales y entendibles para clientes.
const rfData={
  rf01:{titleEs:"Inventario inteligente",titleEn:"Smart inventory",metrics:[
    {k:"Ítems críticos",v:"7",s:"bajo stock mínimo"},
    {k:"Alertas hoy",v:"18",s:"eventos_rf (evidencia)"},
    {k:"Tiempo a aviso",v:"< 10 min",s:"ejecución → notificación"},
    {k:"Antispam",v:"OK",s:"deduplicación por lote"},
  ],spark:[6,7,6,8,7,7,6,7]},
  rf02:{titleEs:"Cartera y recaudo",titleEn:"Accounts receivable",metrics:[
    {k:"Vencidas",v:"12",s:"clasificación automática"},
    {k:"Por vencer",v:"21",s:"ventana 7 días"},
    {k:"Notifs",v:"9",s:"con evidencia (payload)"},
    {k:"Seguimiento",v:"OK",s:"estado por cliente"},
  ],spark:[18,16,14,13,12,12,11,12]},
  rf03:{titleEs:"Marketing y leads",titleEn:"Marketing & leads",metrics:[
    {k:"Nunca vendidos",v:"4",s:"detección histórica"},
    {k:"Rotación lenta",v:"9",s:"umbral configurable"},
    {k:"Campañas",v:"5",s:"segmentación por tipo"},
    {k:"Anti-repetición",v:"OK",s:"registro envíos"},
  ],spark:[3,3,4,4,5,5,4,5]},
  rf04:{titleEs:"Ventas y SLA",titleEn:"Sales & SLA",metrics:[
    {k:"Ventas activas",v:"26",s:"evaluadas por cron"},
    {k:"En riesgo",v:"6",s:"≥ 70% consumo SLA"},
    {k:"Críticas",v:"2",s:"≥ 90% consumo SLA"},
    {k:"Anti-spam",v:"OK",s:"1 alerta/día por venta"},
  ],spark:[18,19,20,21,22,23,24,26]}
};

function initTabs(){
  const w=$('[data-tabs]'); if(!w) return;
  const lang=document.documentElement.lang||'es';
  const tabs=$$('[role="tab"]',w);
  const title=$('[data-tab-title]',w);
  const cards=$$('[data-metric]',w);
  const chart=$('[data-spark]',w);

  function render(k){
    const d=rfData[k];
    tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.key===k?'true':'false'));
    if(title) title.textContent=(lang.startsWith('en')?d.titleEn:d.titleEs);
    cards.forEach((el,i)=>{
      const m=d.metrics[i];
      el.querySelector('b').textContent=m.v;
      el.querySelector('span').innerHTML=`<span style="opacity:.95">${m.k}</span><br/><span style="opacity:.75">${m.s}</span>`;
    });
    if(chart) chart.innerHTML=sparkline(d.spark);
  }

  tabs.forEach(t=>t.addEventListener('click',()=>render(t.dataset.key)));
  render('rf04');
}

function initCopy(){
  $$('.copy').forEach(btn=>btn.addEventListener('click',async()=>{
    const text=btn.getAttribute('data-copy')||'';
    try{
      await navigator.clipboard.writeText(text);
      showToast("Copiado", text);
    }catch(e){
      showToast("Copia manual", text);
      alert(text);
    }
  }));
}

function showToast(title, msg){
  const t=$("#toast");
  if(!t) return;
  t.querySelector("b").textContent=title;
  t.querySelector("span").textContent=msg;
  t.style.display="block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.style.display="none",2200);
}


function initForms(){
  const cfg = window.RF_CONFIG || {};
  const webhook = (cfg.WEBHOOK_URL || "").trim();

  $$("form[data-rf-webhook]").forEach(form=>{
    form.addEventListener("submit", async (e)=>{
      const isEn = location.pathname.includes("/en/");
      const success = form.getAttribute("data-success") || (isEn ? "thanks.html" : "gracias.html");

      // Always prevent default so the experience is consistent even when opened as static files
      e.preventDefault();

      const fd = new FormData(form);
      // include metadata
      fd.append("page", location.pathname);
      fd.append("ts", new Date().toISOString());
      fd.append("ua", navigator.userAgent);

      // If webhook is not configured, fallback to mailto (works everywhere)
      if(!webhook || webhook.includes("TU_N8N_DOMINIO")){
        const email = cfg.EMAIL || "rarf_88@hotmail.com";
        const subject = encodeURIComponent(isEn ? "Contact — RF Automation Studio" : "Contacto — RF Automation Studio");
        const lines = [];
        fd.forEach((v,k)=>{ if(k!=="ua") lines.push(`${k}: ${v}`); });
        const body = encodeURIComponent(lines.join("\n"));
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        showToast(isEn ? "Email draft opened" : "Se abrió tu correo", isEn ? "Configure the webhook to send automatically" : "Configura el webhook para envío automático");
        return;
      }

      try{
        const res = await fetch(webhook,{method:"POST",body:fd});
        if(!res.ok) throw new Error("HTTP "+res.status);
        window.location.href = success;
      }catch(err){
        showToast(isEn ? "Couldn't send" : "No se pudo enviar", isEn ? "Check the webhook in config.js" : "Revisa el webhook en config.js");
      }
    });
  });
}


document.addEventListener('DOMContentLoaded',()=>{
  // hydrate contact links from config
  const cfg=window.RF_CONFIG||{};
  $$("[data-email]").forEach(el=>{ el.textContent=cfg.EMAIL||el.textContent; el.href="mailto:"+(cfg.EMAIL||""); });
  $$("[data-wa]").forEach(el=>{ el.href="https://wa.me/"+(cfg.WHATSAPP||""); });
  $$("[data-brand]").forEach(el=>{ el.textContent=cfg.BRAND||el.textContent; });

  initNav(); initReveal(); initCounters(); initTabs(); initCopy(); initForms();
});

// ==== MOBILE MENU (robust) ====
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.querySelector('#hamburgerBtn, .hamburger, [data-burger]');
  const menu = document.querySelector('#navMenu, #mobileMenu, .nav-menu, .mobile-menu');
  if(!btn || !menu) return;
  btn.addEventListener('click', ()=>{
    menu.classList.toggle('open');
    menu.style.display = menu.classList.contains('open') ? 'block' : '';
  });
});
