import{c as l,_ as m}from"./usePageToolkits.js";import{B as d}from"./BodyBlock.js";import{_}from"./PlaceholderBlock.vue_vue_type_script_setup_true_lang.js";/* empty css                                                          */import"./useEmitter.js";import"./WaveLoading.vue_vue_type_style_index_0_scoped_df7ac771_lang.js";import{d as p,a4 as u,x as g,z as f,w as h,o as a,f as k,e as o,a as r,a3 as v,F as x,t as B}from"./vendor.js";import"./_plugin-vue_export-helper.js";const y={class:"grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-5"},w=["title"],L=["src","alt"],A={class:"inline-block p-3"},$=p({__name:"AllSpeakers",setup(C){l("pmc","i18n");const e=u([]),i=async()=>(await m(()=>import("./guests.js"),[])).people;return g(()=>{i().then(s=>{e.splice(0,e.length,...s)})}),(s,n)=>(a(),f(d,null,{default:h(()=>[k(_,{height:"20px"}),o("div",y,[(a(!0),r(x,null,v(e.sort((t,c)=>t.id.localeCompare(c.id)),t=>(a(),r("div",{key:t.id,title:t.name,class:"text-center relative cursor-pointer"},[o("img",{src:`/images/people/${t.avatar}`,alt:t.name,class:"w-24 h-24 rounded-full mx-auto"},null,8,L),o("span",A,B(t.name),1)],8,w))),128))])]),_:1}))}});export{$ as default};
