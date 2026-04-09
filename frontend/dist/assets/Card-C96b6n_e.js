import{c as u,r as d,f as m,j as p,b as c}from"./index-DoWs054Z.js";import{u as F}from"./useAuth-DxPVRwz5.js";/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=u("AirVent",[["path",{d:"M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"larmp2"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12",key:"1bo8pg"}],["path",{d:"M6.6 15.6A2 2 0 1 0 10 17v-5",key:"t9h90c"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=u("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=u("Laptop",[["path",{d:"M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",key:"tarvll"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=u("Refrigerator",[["path",{d:"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z",key:"fpq118"}],["path",{d:"M5 10h14",key:"elsbfy"}],["path",{d:"M15 7v6",key:"1nx30x"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=u("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=u("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]]);/**
 * @license lucide-react v0.312.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=u("WashingMachine",[["path",{d:"M3 6h3",key:"155dbl"}],["path",{d:"M17 6h.01",key:"e2y6kg"}],["rect",{width:"18",height:"20",x:"3",y:"2",rx:"2",key:"od3kk9"}],["circle",{cx:"12",cy:"13",r:"5",key:"nlbqau"}],["path",{d:"M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5",key:"17lach"}]]);function Z(){const{isAuthenticated:e}=F(),[t,s]=d.useState([]),[n,i]=d.useState(!0),[y,l]=d.useState(null),g=d.useCallback(async()=>{if(!e)return i(!1),[];try{i(!0),l(null);const a=await m.getAllDevices(),r=Array.isArray(a)?a:Array.isArray(a==null?void 0:a.devices)?a.devices:[];return s(r),r}catch(a){return l(a.message||"Failed to fetch devices"),s([]),[]}finally{i(!1)}},[e]),x=async a=>{try{i(!0),l(null);const r=await m.createDevice(a);return s(o=>[...o,r]),r}catch(r){return l(r.message||"Failed to create device"),null}finally{i(!1)}},k=async(a,r)=>{try{i(!0),l(null);const o=await m.updateDevice(a,r);return s(D=>D.map(v=>v.id===a?o:v)),o}catch(o){return l(o.message||"Failed to update device"),null}finally{i(!1)}},b=async(a,r)=>{try{i(!0),l(null);const o=await m.addMaintenanceRecord(a,r);return s(D=>D.map(v=>v.id===a?o:v)),o}catch(o){return l(o.message||"Failed to add maintenance record"),null}finally{i(!1)}},T=async a=>{try{return i(!0),l(null),await m.deleteDevice(a),s(r=>r.filter(o=>o.id!==a)),!0}catch(r){return l(r.message||"Failed to delete device"),!1}finally{i(!1)}},j=d.useCallback(a=>t.filter(r=>r.warrantyStatus===a),[t]),q=d.useCallback(a=>t.find(r=>r.id===a),[t]);return d.useEffect(()=>{g()},[g]),{devices:t,loading:n,error:y,fetchDevices:g,createDevice:x,updateDevice:k,deleteDevice:T,addMaintenanceRecord:b,getDevicesByStatus:j,getDeviceById:q}}function M(e){var t,s,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(s=M(e[t]))&&(n&&(n+=" "),n+=s)}else for(s in e)e[s]&&(n&&(n+=" "),n+=s);return n}function h(){for(var e,t,s=0,n="",i=arguments.length;s<i;s++)(e=arguments[s])&&(t=M(e))&&(n&&(n+=" "),n+=t);return n}const w={flat:"bg-white border border-gray-200",elevated:"bg-white shadow-md",outlined:"border-2 border-gray-200"};function f({children:e,className:t="",variant:s="flat",padding:n="default",hover:i=!1,clickable:y=!1,onClick:l}){const g="rounded-lg transition-all duration-200",x={none:"",small:"p-2",default:"p-4",large:"p-6"},k=i?"hover:shadow-lg hover:-translate-y-1":"",b=y?"cursor-pointer":"";return p.jsx("div",{className:h(g,w[s],x[n],k,b,t),onClick:y?l:void 0,role:y?"button":void 0,tabIndex:y?0:void 0,children:e})}function C({children:e,className:t}){return p.jsx("div",{className:h("mb-4",t),children:e})}function A({children:e,className:t}){return p.jsx("h3",{className:h("text-lg font-semibold text-gray-900",t),children:e})}function S({children:e,className:t}){return p.jsx("p",{className:h("mt-1 text-sm text-gray-500",t),children:e})}function N({children:e,className:t}){return p.jsx("div",{className:h("text-gray-700",t),children:e})}function R({children:e,className:t}){return p.jsx("div",{className:h("mt-4 flex items-center justify-end space-x-2",t),children:e})}f.propTypes={children:c.node.isRequired,className:c.string,variant:c.oneOf(Object.keys(w)),padding:c.oneOf(["none","small","default","large"]),hover:c.bool,clickable:c.bool,onClick:c.func};C.propTypes={children:c.node.isRequired,className:c.string};A.propTypes={children:c.node.isRequired,className:c.string};S.propTypes={children:c.node.isRequired,className:c.string};N.propTypes={children:c.node.isRequired,className:c.string};R.propTypes={children:c.node.isRequired,className:c.string};f.Header=C;f.Title=A;f.Description=S;f.Content=N;f.Footer=R;export{V as A,f as C,E as D,O as L,W as R,B as S,z as T,P as W,Z as u};
