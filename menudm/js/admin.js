"use strict";
/* Antara muka admin: log masuk, ubah hidangan, ubah waktu makan, kata laluan, sandaran data */
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const hm=h=>String(Math.floor(h)).padStart(2,"0")+":"+String(Math.round((h%1)*60)).padStart(2,"0");
const hv=v=>{const[a,b]=v.split(":");return+a+ +b/60};
function chrome(){
  document.body.classList.toggle("admin",Auth.admin);
  $("#au").innerHTML=Auth.admin?'<span class="who">Admin</span><button class="tbtn" id="adm" type="button">Pengurusan</button><button class="tbtn" id="lo" type="button">Log keluar</button>':'<button class="tbtn" id="lin" type="button">Log masuk</button>';
  if(Auth.admin){$("#adm").onclick=openPanel;$("#lo").onclick=()=>{Auth.logout();chrome();renderAll();toast("Telah log keluar")}}
  else $("#lin").onclick=()=>{$("#le").textContent="";$("#lp").value="";$("#lgd").showModal();$("#lu").focus()};
}
$("#lgf").onsubmit=async e=>{
  e.preventDefault();
  const r=await Auth.login($("#lu").value,$("#lp").value);
  if(r==="ok"){$("#lgd").close();chrome();renderAll();toast("Log masuk berjaya")}
  else $("#le").textContent=r==="lock"?"Terlalu banyak percubaan. Cuba lagi selepas 30 saat.":"Nama pengguna atau kata laluan salah.";
};
function openEditor(w,d,i){
  if(!Auth.admin)return;
  S.ed={w,d,i};$("#edt").textContent=`${MEALS[i][0]}, ${DAYS[d]} Minggu ${w+1}`;
  $("#edi").value=W[w][d].m[i].join("\n");$("#edk").value=W[w][d].k[i];$("#ede").textContent="";
  $("#edd").showModal();$("#edi").focus();
}
$("#edf").onsubmit=e=>{
  e.preventDefault();if(!Auth.admin)return;
  const{w,d,i}=S.ed,items=$("#edi").value.split("\n").map(clean).filter(Boolean),k=Math.round(+$("#edk").value),x=W[w][d];
  if(!items.length)return void($("#ede").textContent="Masukkan sekurang-kurangnya satu hidangan.");
  if(!(k>=0&&k<=3000))return void($("#ede").textContent="Kalori mesti antara 0 dan 3000.");
  TOT[w][d]+=k-x.k[i];x.m[i]=items;x.k[i]=k;persist();$("#edd").close();renderAll();toast("Menu dikemas kini");
};
function openPanel(){
  if(!Auth.admin)return;
  $("#pnb").innerHTML=`<h3>Pengurusan</h3>
<fieldset class="fs"><legend>Waktu makan</legend>${MEALS.map((m,i)=>`<div class="mrow"><input aria-label="Nama waktu makan" value="${esc(m[0])}" data-n="${i}"><input type="time" aria-label="Mula" value="${hm(m[2])}" data-s="${i}"><input type="time" aria-label="Tamat" value="${hm(m[3])}" data-e="${i}"></div>`).join("")}<p class="err" id="pe1"></p><button class="tbtn pri" id="pst" type="button">Simpan waktu</button></fieldset>
<fieldset class="fs"><legend>Kata laluan admin</legend><label>Kata laluan baharu (sekurang-kurangnya 6 aksara)<input type="password" id="pnw" autocomplete="new-password"></label><p class="err" id="pe2"></p><button class="tbtn pri" id="ppw" type="button">Tukar kata laluan</button></fieldset>
<fieldset class="fs"><legend>Sandaran data</legend><div class="row" style="justify-content:flex-start"><button class="tbtn alt" id="pex" type="button">Eksport JSON</button><button class="tbtn alt" id="pim" type="button">Import JSON</button><button class="tbtn alt" id="prs" type="button">Set semula ke asal</button></div></fieldset>
<div class="row"><button class="tbtn alt" type="button" data-close>Tutup</button></div>`;
  $("#pst").onclick=()=>{
    const m=MEALS.map((x,i)=>[clean($(`[data-n="${i}"]`).value)||x[0],$(`[data-s="${i}"]`).value,$(`[data-e="${i}"]`).value]);
    if(m.some(x=>!x[1]||!x[2]))return void($("#pe1").textContent="Isi semua waktu mula dan tamat.");
    const t=m.map(x=>[x[0],hv(x[1]),hv(x[2])]);
    if(t.some((x,i)=>x[1]>=x[2]||(i&&x[1]<t[i-1][2])))return void($("#pe1").textContent="Waktu mesti menaik, mula sebelum tamat dan tidak bertindih.");
    t.forEach((x,i)=>{MEALS[i][0]=x[0];MEALS[i][2]=x[1];MEALS[i][3]=x[2];MEALS[i][1]=t12(x[1])});
    persist();$("#pnd").close();renderAll();toast("Waktu makan dikemas kini");
  };
  $("#ppw").onclick=async()=>{
    const p=$("#pnw").value;
    if(p.length<6)return void($("#pe2").textContent="Kata laluan terlalu pendek.");
    await Auth.change(p);$("#pnw").value="";$("#pe2").textContent="";toast("Kata laluan ditukar");
  };
  $("#pex").onclick=()=>{
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify({W,TOT,MEALS:MEALS.map(m=>[m[0],m[1],m[2],m[3]])})],{type:"application/json"}));a.download="menu-asrama.json";a.click();
  };
  $("#pim").onclick=()=>{
    const f=document.createElement("input");f.type="file";f.accept=".json,application/json";
    f.onchange=async()=>{try{const o=JSON.parse(await f.files[0].text());if(!valid(o))throw 0;Store.write("data",sanitize(o));location.reload()}catch(e){toast("Fail JSON tidak sah")}};f.click();
  };
  $("#prs").onclick=()=>{if(confirm("Padam semua perubahan dan kembali ke menu asal?")){Store.del("data");location.reload()}};
  $("#pnd").showModal();
}
