"use strict";
/* Lapisan simpanan. Kini guna localStorage (data tersimpan dalam pelayar ini sahaja).
   Untuk kegunaan sebenar, gantikan read/write/del dengan panggilan API (fetch) ke pelayan atau pangkalan data. */
const Store={
  k:"menuAsrama.",
  box(s){return s?sessionStorage:localStorage},
  read(n,s){try{const v=this.box(s).getItem(this.k+n);return v?JSON.parse(v):null}catch(e){return null}},
  write(n,v,s){try{this.box(s).setItem(this.k+n,JSON.stringify(v));return true}catch(e){return false}},
  del(n,s){try{this.box(s).removeItem(this.k+n)}catch(e){}}
};
