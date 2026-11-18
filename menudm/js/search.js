"use strict";
/* Carian hidangan merentas 4 minggu, disusun ikut tarikh paling dekat */
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const when=o=>o===0?"hari ini":o===1?"esok":"dalam "+o+" hari";
function find(q){
  q=norm(q.trim());if(q.length<2)return[];const r=[];
  W.forEach((wk,w)=>wk.forEach((day,d)=>day.m.forEach((items,mi)=>{
    const hit=items.find(x=>norm(x).includes(q));
    if(hit){let off=((w-S.td.w+4)%4)*7+(d-S.td.d);if(off<0)off+=28;r.push({w,d,mi,hit,off})}
  })));
  return r.sort((a,b)=>a.off-b.off||a.mi-b.mi).slice(0,40);
}
function paint(){
  const v=$("#q").value.trim();S.res=find(v);S.ri=0;
  $("#rs").innerHTML=S.res.length?S.res.map((x,i)=>`<li><button type="button" data-i="${i}" class="${i?"":"on"}"><span>${x.hit}</span><small>${DAYS[x.d]}, Minggu ${x.w+1}, ${MEALS[x.mi][0]}, ${when(x.off)}</small></button></li>`).join(""):`<li class="hint">${v.length<2?"Taip sekurang-kurangnya 2 huruf.":"Tiada hidangan sepadan."}</li>`;
  $$("#rs button").forEach(b=>b.onclick=()=>pick(+b.dataset.i));
}
function pick(i){
  const x=S.res[i];if(!x)return;
  $("#srch").close();S.flash=x.mi;go(x.w,x.d);$("#tl").scrollIntoView({block:"center"});
}
function openSearch(){const d=$("#srch");if(d.open)return;d.showModal();$("#q").value="";paint();$("#q").focus()}
function mark(n){const b=$$("#rs button");if(!b.length)return;S.ri=(S.ri+n+b.length)%b.length;b.forEach((e,i)=>e.classList.toggle("on",i===S.ri));b[S.ri].scrollIntoView({block:"nearest"})}
