"use strict";
/* Permulaan: acara, kongsi, papan kekunci, jam hidup, PWA */
function renderAll(){range();hero();cards();tabs();charts();weekly()}
function renderLive(){hero();cards()}
chrome();renderAll();
Auth.init().then(()=>{chrome();renderAll()});
let lastMin=new Date().getMinutes();
setInterval(()=>{
  const n=new Date();
  if(dayKey(n)!==S.td.key){S.td=today();S.sel={w:S.td.w,d:S.td.d};S.tab=S.td.w;S.scroll=true;renderAll();return}
  if(n.getMinutes()!==lastMin){lastMin=n.getMinutes();if(!document.querySelector("dialog[open]"))renderLive()}
  updateCd();
},1000);
/* Susun semula label garis masa bila saiz skrin atau fon berubah */
addEventListener("resize",()=>{clearTimeout(layoutLegend.t);layoutLegend.t=setTimeout(layoutLegend,120)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layoutLegend);
/* Carian */
$("#sbtn").onclick=openSearch;
$("#q").oninput=paint;
$("#q").onkeydown=e=>{if(e.key==="ArrowDown"){e.preventDefault();mark(1)}else if(e.key==="ArrowUp"){e.preventDefault();mark(-1)}else if(e.key==="Enter"){e.preventDefault();pick(S.ri)}};
/* Dialog: butang Batal/Tutup dan klik pada latar */
document.addEventListener("click",e=>{
  if(e.target.matches("[data-close]"))e.target.closest("dialog").close();
  else if(e.target.tagName==="DIALOG")e.target.close();
});
/* Kongsi menu */
$("#share").onclick=async()=>{
  const{w,d}=S.sel,m=W[w][d],t=`Menu Dewan Makan Asrama\n${DAYS[d]}, Minggu ${w+1}${isToday()?" (hari ini)":""}\n\n`+MEALS.map((x,i)=>`${x[0]} (${x[1]})\n- ${m.m[i].join("\n- ")}`).join("\n\n")+`\n\nJumlah ${TOT[w][d]} kcal`;
  try{if(navigator.share){await navigator.share({title:"Menu Dewan Makan",text:t});return}await navigator.clipboard.writeText(t);toast("Menu disalin, boleh tampal di WhatsApp")}
  catch(e){if(e.name!=="AbortError")toast("Tidak dapat berkongsi menu")}
};
/* Papan kekunci */
addEventListener("keydown",e=>{
  if(e.metaKey||e.ctrlKey||e.altKey||document.querySelector("dialog[open]")||e.target.matches("input,textarea"))return;
  const k=e.key.toLowerCase();
  if(k.startsWith("arrow")&&e.target!==document.body)return;
  if(k==="arrowright")step(1);else if(k==="arrowleft")step(-1);
  else if(k==="t")go(S.td.w,S.td.d);
  else if(k==="/"){e.preventDefault();openSearch()}
});
/* PWA: boleh dipasang dan berfungsi tanpa internet */
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
