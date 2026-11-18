"use strict";
/* Carta: donat pecahan kalori (hari dipilih) dan bar kalori mingguan */
function charts(){
  const{w,d}=S.sel,k=W[w][d].k,T=k.reduce((a,b)=>a+b,0),R=70,C=2*Math.PI*R;let o=0;
  const avg=Math.round(TOT[S.tab].reduce((a,b)=>a+b,0)/7);
  $("#ksub").textContent=`Pecahan hari ${DAYS[d]} (Minggu ${w+1}). Purata Minggu ${S.tab+1}: ${fmt(avg)} kcal sehari.`;
  $("#dn").innerHTML=`<svg class="dn" viewBox="0 0 200 200" role="img" aria-label="Pecahan kalori sehari"><g transform="rotate(-90 100 100)">${k.map((v,i)=>{const l=v/T*C,s=`<circle data-i="${i}" tabindex="0" cx="100" cy="100" r="${R}" fill="none" stroke="${COL[i]}" stroke-width="22" stroke-dasharray="${l-2} ${C-l+2}" stroke-dashoffset="${-o}"><title>${MEALS[i][0]}: ${v} kcal (${Math.round(v/T*100)}%)</title></circle>`;o+=l;return s}).join("")}</g><text x="100" y="98" text-anchor="middle" class="dn-v" id="dnv">${fmt(TOT[w][d])}</text><text x="100" y="118" text-anchor="middle" class="dn-l" id="dnl">kcal sehari</text></svg><ul class="dnl">${MEALS.map((m,i)=>`<li data-i="${i}"><span><i style="background:${COL[i]}"></i>${m[0]}</span><b>${k[i]} kcal</b></li>`).join("")}</ul>`;
  $$("#dn circle,#dn li").forEach(e=>{const i=+e.dataset.i;e.onmouseenter=e.onfocus=()=>hlDonut(i);e.onmouseleave=e.onblur=()=>hlDonut(-1)});
  $("#br").innerHTML=`<div class="bars">${TOT[S.tab].map((v,i)=>`<button class="bc ${S.tab===w&&i===d?"on":""}" data-d="${i}" aria-label="${DAYS[i]}, ${v} kcal"><span class="bv">${fmt(v)}</span><i style="--h:${Math.round(v/2800*190)}px"></i><em>${DAYS[i].slice(0,3)}</em></button>`).join("")}</div>`;
  $$(".bc").forEach(b=>b.onclick=()=>{go(S.tab,+b.dataset.d);$("#hari").scrollIntoView()});
}
function hlDonut(i){
  const s=$(".dn");if(!s)return;const{w,d}=S.sel;
  s.classList.toggle("hv",i>=0);
  $$("circle",s).forEach(c=>c.classList.toggle("hl",+c.dataset.i===i));
  $$(".dnl li").forEach(l=>l.classList.toggle("on",+l.dataset.i===i));
  $("#dnv").textContent=i<0?fmt(TOT[w][d]):W[w][d].k[i];
  $("#dnl").textContent=i<0?"kcal sehari":MEALS[i][0];
}
