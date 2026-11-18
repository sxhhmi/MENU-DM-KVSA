"use strict";
/* Teras: pembantu, penghuraian data, keadaan (state) dan logik masa */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>n.toLocaleString("en-US");
const W=RAW.map(w=>w.map(d=>{const[a,b]=d.split("#");return{m:a.split(";").map(x=>x.split("|").map(i=>DR[i]||i)),k:b.split(" ").map(Number)}}));
const t12=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);return(H%12||12)+":"+String(M).padStart(2,"0")+(H%24<12?" AM":" PM")};
const clean=s=>String(s).replace(/[<>]/g,"").trim().slice(0,120);
const valid=o=>{try{return o.W.length===4&&o.W.every(w=>w.length===7&&w.every(d=>d.m.length===5&&d.m.every(a=>Array.isArray(a)&&a.every(x=>typeof x==="string"))&&d.k.length===5&&d.k.every(Number.isFinite)))&&o.TOT.length===4&&o.TOT.every(t=>t.length===7&&t.every(Number.isFinite))&&o.MEALS.length===5&&o.MEALS.every(m=>typeof m[0]==="string"&&Number.isFinite(m[2])&&Number.isFinite(m[3])&&m[2]<m[3]&&m[3]<=24)}catch(e){return false}};
const sanitize=o=>({W:o.W.map(w=>w.map(d=>({m:d.m.map(a=>a.map(clean).filter(Boolean)),k:d.k}))),TOT:o.TOT,MEALS:o.MEALS.map(m=>[clean(m[0]),"",m[2],m[3]])});
/* Data yang disimpan admin (jika ada) menggantikan data asal */
const sv=Store.read("data");
if(valid(sv)){const c=sanitize(sv);W.splice(0,W.length,...c.W);c.TOT.forEach((t,i)=>TOT[i]=t);c.MEALS.forEach((m,i)=>{MEALS[i][0]=m[0];MEALS[i][2]=m[2];MEALS[i][3]=m[3]})}
MEALS.forEach(m=>m[1]=t12(m[2]));
let R0=7,R1=24;
function range(){R0=Math.floor(Math.min(...MEALS.map(m=>m[2])));R1=Math.min(24,Math.ceil(Math.max(...MEALS.map(m=>m[3]))))}
range();
function persist(){Store.write("data",{W,TOT,MEALS:MEALS.map(m=>[m[0],m[1],m[2],m[3]])})}
const COL=["#cfae67","#7e9bc9","#3f6aa8","#a98a45","#9fb6d8"];
const dayKey=n=>n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate();
function today(){const n=new Date(),df=Math.round((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-ANCHOR)/864e5);return{w:(((Math.floor(df/7))%4)+4)%4,d:(n.getDay()+6)%7,key:dayKey(n)}}
const S={td:today(),sel:null,tab:0,scroll:true,filter:"",flash:-1,res:[],ri:0};
S.sel={w:S.td.w,d:S.td.d};S.tab=S.td.w;
const isToday=()=>S.sel.w===S.td.w&&S.sel.d===S.td.d;
const clock=n=>(n.getHours()%12||12)+":"+String(n.getMinutes()).padStart(2,"0")+(n.getHours()<12?" AM":" PM");
function service(){const n=new Date(),h=n.getHours()+n.getMinutes()/60+n.getSeconds()/3600;let a=MEALS.findIndex(m=>h>=m[2]&&h<m[3]),st="on";if(a<0){a=MEALS.findIndex(m=>h<m[2]);st="nx"}return{n,h,a,st}}
const dur=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),c=s%60;return(h?h+"j ":"")+String(m).padStart(h?2:1,"0")+"m "+String(c).padStart(2,"0")+"s"};
const li=a=>{let f=0;return a.map(i=>`<li class="${i==="Nasi Putih"?"nasi":(f++?"":"m")}">${i}</li>`).join("")};
function go(w,d){S.sel={w,d};S.tab=w;S.scroll=true;renderAll()}
function step(n){let{w,d}=S.sel;d+=n;if(d>6){d=0;w=(w+1)%4}if(d<0){d=6;w=(w+3)%4}go(w,d)}
function toast(m){const t=$("#ts");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),2400)}
