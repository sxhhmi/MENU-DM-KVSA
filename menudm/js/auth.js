"use strict";
/* Log masuk berasaskan pelayar. Kata laluan disimpan sebagai hash SHA-256 dan sesi hanya hidup selagi tab dibuka.
   PERHATIAN: tanpa pelayan, ini bukan keselamatan sebenar. Sesiapa yang mahir boleh memintasnya melalui konsol pelayar.
   Akaun asal: admin / admin123 (tukar segera melalui menu Pengurusan). */
const Auth={
  user:null,fail:0,lock:0,
  get admin(){return !!this.user},
  async hash(u,p){
    const t=new TextEncoder().encode("menuAsrama|"+u.toLowerCase()+"|"+p);
    if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest("SHA-256",t);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
    let h=5381;for(const c of t)h=((h<<5)+h+c)>>>0;return"d"+h;
  },
  async init(){
    let a=Store.read("auth");
    if(!a){a={user:"admin",h:await this.hash("admin","admin123")};Store.write("auth",a)}
    const s=Store.read("session",true);
    this.user=s&&s.u===a.user?a.user:null;
  },
  async login(u,p){
    if(Date.now()<this.lock)return"lock";
    const a=Store.read("auth");
    if(a&&u.trim().toLowerCase()===a.user&&await this.hash(a.user,p)===a.h){this.fail=0;this.user=a.user;Store.write("session",{u:a.user},true);return"ok"}
    if(++this.fail>=5){this.lock=Date.now()+30000;this.fail=0}
    return"bad";
  },
  logout(){this.user=null;Store.del("session",true)},
  async change(p){const a=Store.read("auth");a.h=await this.hash(a.user,p);Store.write("auth",a)}
};
