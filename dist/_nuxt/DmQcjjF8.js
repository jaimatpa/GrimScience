import{b as w}from"./Be2iH8Rx.js";import{d as S,j,l as B,r as a,m as C,o as E,c as F,h as e,f as o,g as l,p as J,w as u,F as U,s as I}from"./RPcYXXev.js";import{b as R}from"./Crp9aCmO.js";import{L as T,u as A}from"./BqkbertX.js";const D={class:"vl-parent"},L={class:"w-full flex flex-col"},N={class:"w-full mt-5"},z=e("div",null,null,-1),G={class:"flex"},H={class:"mt-5 ml-4"},V={class:"mt-5 ml-4"},$=S({__name:"PartsList",props:{selectedJob:{type:[String,Number,null],required:!0}},emits:["close","save"],setup(d,{emit:_}){const m=_,r=d;j(),B();const t=a(!1),c=a(!0),b=C({}),p=a({JobID:[r.selectedJob]}),f=async()=>{t.value=!0,await A("/api/jobs/details",{method:"GET",params:{...p.value},onResponse({response:s}){s.status===200&&(c.value=!0,console.log("response._data.body",s._data.body))},onResponseError({}){c.value=!1}}),t.value=!1},v=s=>[],y=async s=>{m("save")},g=a([{key:"serial",label:"Stock #"},{key:"date_serialized",label:"Desc"},{key:"material_cost",label:"Qty"},{key:"material_cost",label:"Inv. Unit"},{key:"material_cost",label:"Inv. Cost"},{key:"material_cost",label:"Total"},{key:"material_cost",label:"Sub Ass Hrs"}]);return r.selectedJob!==null&&f(),(s,n)=>{const h=w,i=I,k=R;return E(),F(U,null,[e("div",D,[o(l(T),{active:l(t),"onUpdate:active":n[0]||(n[0]=x=>J(t)?t.value=x:null),"is-full-page":!0,color:"#000000",backgroundColor:"#1B2533",loader:"dots"},null,8,["active"])]),o(k,{validate:v,"validate-on":["submit"],state:l(b),class:"space-y-4",onSubmit:y},{default:u(()=>[e("div",L,[e("div",N,[o(h,{columns:l(g),ui:{wrapper:"h-96 border-2 border-gray-300 dark:border-gray-700",th:{base:"sticky top-0 z-10",color:"bg-white dark:text-gray dark:bg-[#111827]",padding:"p-1"}}},{"empty-state":u(()=>[z]),_:1},8,["columns"])]),e("div",G,[e("div",H,[o(i,{variant:"outline",color:"green",label:"Generate Excel",ui:{base:"w-fit",truncate:"flex justify-center w-full"},truncate:""})]),e("div",V,[o(i,{icon:"i-heroicons-chat-bubble-oval-left-ellipsis",variant:"outline",color:"green",label:"Show Sub Assembly Hours",ui:{base:"w-fit",truncate:"flex justify-center w-full"},truncate:""})])])])]),_:1},8,["state"])],64)}}});export{$ as _};
