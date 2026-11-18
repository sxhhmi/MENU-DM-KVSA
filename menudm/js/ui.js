"use strict";
/* Paparan: hero + garis masa, kad hidangan, jadual mingguan */
function hero(){
  const{sel,td}=S,it=isToday(),{n,h,a,st}=service(),A=it?a:-1,P=x=>(x-R0)/(R1-R0)*100;
  const dt=n.toLocaleDateString("ms-MY",{day:"numeric",month:"long",year:"numeric"});
  $("#hd").innerHTML=`<div><p class="date">${it?"Hari ini, "+dt:"Menu Minggu "+(sel.w+1)}</p><h1>${DAYS[sel.d]}</h1><p class="wkn">Minggu ${sel.w+1} daripada 4, jumlah ${fmt(TOT[sel.w][sel.d])} kcal sehari</p>${it?'<p class="cdn"><b id="cdv"></b><span id="cdl"></span></p>':""}</div><div><div class="days" role="group" aria-label="Pilih hari">${DAYS.map((x,i)=>`<button class="${sel.w===td.w&&i===td.d?"td":""}" data-d="${i}" aria-pressed="${i===sel.d}">${x}</button>`).join("")}</div><button class="back" id="bk" ${it?"hidden":""}>Kembali ke hari ini</button></div><div class="trk"><div class="rail">${MEALS.map((m,i)=>`<i class="${i===A?"a":""}" style="left:${P(m[2])}%;width:${P(m[3])-P(m[2])}%"></i>`).join("")}${it&&h>=R0&&h<=R1?`<b style="left:${P(h)}%"><span>${clock(n)}</span></b>`:""}</div><div class="lg">${MEALS.map((m,i)=>`<button class="lb ${i===A?"a":""}" data-i="${i}" data-p="${P(m[2])}" title="${m[0]}, ${m[1]} hingga ${t12(m[3])}">${m[0]}<small>${m[1]} – ${t12(m[3])}</small></button>`).join("")}</div></div>`;
  $$(".days button").forEach(b=>b.onclick=()=>go(sel.w,+b.dataset.d));
  $("#bk").onclick=()=>go(td.w,td.d);
  $$(".lg button").forEach(b=>b.onclick=()=>{const c=$(`.cd[data-i="${b.dataset.i}"]`),t=$("#tl");t.scrollTo({left:c.offsetLeft-4,behavior:"smooth"});t.scrollIntoView({block:"center",behavior:"smooth"})});
  layoutLegend();updateCd();
}
/* Letak label tepat di bawah permulaan segmen. Setiap label boleh berada di kiri atau kanan garisnya,
   dan turun ke baris lain jika perlu. Dicari dengan backtracking supaya tiada label bertindih
   dan tiada garis penyambung yang melintasi teks label lain. */
function layoutLegend(){
  const lg=$(".lg");if(!lg)return;const W0=lg.clientWidth;
  const bs=$$(".lb",lg).map(b=>{b.classList.remove("r");return{b,x:parseFloat(b.dataset.p)/100*W0,w:b.offsetWidth}});
  const fits=(c,lv,r,P)=>{
    const l=r?c.x-c.w:c.x,e=l+c.w;
    if(l<-1||e>W0+1)return false;
    return P.every(o=>o.lv===lv?(e+10<=o.l||l>=o.e+10):o.lv<lv?(c.x<o.l-3||c.x>o.e+3):(o.c.x<l-3||o.c.x>e+3));
  };
  const solve=(i,P,mx)=>{
    if(i===bs.length)return P;
    const c=bs[i];
    for(let lv=0;lv<=mx;lv++)for(const r of[false,true]){
      if(!fits(c,lv,r,P))continue;
      const l=r?c.x-c.w:c.x,res=solve(i+1,[...P,{c,lv,r,l,e:l+c.w}],mx);
      if(res)return res;
    }
    return null;
  };
  let res=null;
  for(let mx=0;mx<4&&!res;mx++)res=solve(0,[],mx);
  if(!res)res=bs.map((c,i)=>({c,lv:i,r:false}));
  const rows=Math.max(...res.map(o=>o.lv))+1;
  res.forEach(o=>{const b=o.c.b;b.classList.toggle("r",o.r);b.style.left=o.c.x+"px";b.style.top=o.lv*48+"px";b.style.setProperty("--up",(o.lv*48+14)+"px")});
  lg.style.height=rows*48+"px";
}
function updateCd(){
  const e=$("#cdv");if(!e)return;const{h,a,st}=service();let t,l;
  if(a<0){t=(24-h+MEALS[0][2])*3600;l="sehingga "+MEALS[0][0].toLowerCase()+" esok ("+MEALS[0][1]+")"}
  else if(st==="on"){t=(MEALS[a][3]-h)*3600;l="sebelum "+MEALS[a][0]+" tamat"}
  else{t=(MEALS[a][2]-h)*3600;l="sebelum "+MEALS[a][0]+" bermula"}
  e.textContent=dur(t);$("#cdl").textContent=l;
}
function cards(){
  const{sel}=S,d=W[sel.w][sel.d],it=isToday(),{a,st}=service(),A=it?a:-1,tl=$("#tl"),p=tl.scrollLeft,f=S.flash;S.flash=-1;
  $("#sb").textContent=it?(A<0?"Semua hidangan hari ini telah selesai.":(st==="on"?"Sedang dihidangkan: ":"Seterusnya: ")+MEALS[A][0]+"."):"Menu hari "+DAYS[sel.d]+", Minggu "+(sel.w+1)+".";
  tl.innerHTML=MEALS.map((m,i)=>`<article tabindex="0" class="cd ${i===A?"a":""} ${i===f?"fl":""}" data-i="${i}"><div class="ch"><h3>${m[0]}</h3><span>${m[1]}</span></div>${i===A?`<p class="bd">${st==="on"?"Sedang dihidangkan":"Hidangan seterusnya"}</p>`:""}<ul class="it">${li(d.m[i])}</ul><div class="cf"><span>${d.k[i]} kcal</span>${Auth.admin?'<button class="edbtn" type="button">Ubah</button>':""}</div></article>`).join("");
  if(S.scroll){const e=$(".fl",tl)||$(".a",tl);tl.scrollLeft=e?Math.max(0,e.offsetLeft-4):0;S.scroll=false}else tl.scrollLeft=p;
  $$(".cd",tl).forEach(c=>{const i=+c.dataset.i;c.onmouseenter=c.onfocus=()=>hlDonut(i);c.onmouseleave=c.onblur=()=>hlDonut(-1)});
  $$(".edbtn",tl).forEach(b=>b.onclick=e=>{e.stopPropagation();openEditor(sel.w,sel.d,+b.closest(".cd").dataset.i)});
}
function tabs(){
  $$(".tabs").forEach(el=>{el.innerHTML=[0,1,2,3].map(i=>`<button role="tab" aria-selected="${i===S.tab}" data-w="${i}">Minggu ${i+1}</button>`).join("");
    $$("button",el).forEach(b=>b.onclick=()=>{S.tab=+b.dataset.w;tabs();charts();weekly()})});
}
const FIL={Semua:null,Ayam:/ayam/i,Ikan:/ikan|tenggiri|fish|talapia|bawal|sardin/i,Daging:/daging|rendang/i,Udang:/udang/i,Sotong:/sotong/i,Telur:/telur|egg/i};
function weekly(){
  const rx=FIL[S.filter]||null,wk=W[S.tab],c=i=>S.tab===S.td.w&&i===S.td.d?"t":"";let n=0;
  $("#chips").innerHTML=Object.keys(FIL).map(k=>`<button aria-pressed="${(S.filter||"Semua")===k}" data-f="${k}">${k}</button>`).join("");
  $$("#chips button").forEach(b=>b.onclick=()=>{S.filter=b.dataset.f==="Semua"?"":b.dataset.f;weekly()});
  const cell=(d,r,i)=>{const hit=rx&&d.m[r].some(x=>rx.test(x));if(hit)n++;return `<td data-d="${i}" data-r="${r}" class="${c(i)} ${rx&&!hit?"dim":""}"><ul>${d.m[r].map(x=>`<li class="${x==="Nasi Putih"?"nasi":""} ${rx&&rx.test(x)?"hit":""}">${x}</li>`).join("")}</ul><small>${d.k[r]} kcal</small></td>`};
  $("#tb").innerHTML=`<thead><tr><th scope="col">Waktu makan</th>${DAYS.map((x,i)=>`<th scope="col" class="${c(i)}"><button data-d="${i}">${x}</button></th>`).join("")}</tr></thead><tbody>${MEALS.map((m,r)=>`<tr><th scope="row">${m[0]}<small>${m[1]}</small></th>${wk.map((d,i)=>cell(d,r,i)).join("")}</tr>`).join("")}<tr class="tot"><th scope="row">Jumlah sehari</th>${wk.map((d,i)=>`<td class="${c(i)}"><b>${fmt(TOT[S.tab][i])}</b> kcal<div class="bar"><i style="width:${TOT[S.tab][i]/2800*100}%"></i></div></td>`).join("")}</tr></tbody>`;
  $("#fc").textContent=rx?`${S.filter} dihidangkan dalam ${n} daripada 35 waktu makan pada Minggu ${S.tab+1}.`:"Tapis ikut lauk untuk lihat bila hidangan kegemaran dihidangkan.";
  $$("#tb td[data-r]").forEach(t=>t.onclick=()=>{if(Auth.admin)openEditor(S.tab,+t.dataset.d,+t.dataset.r)});
  $$("#tb th button").forEach(b=>b.onclick=()=>{go(S.tab,+b.dataset.d);$("#hari").scrollIntoView()});
}