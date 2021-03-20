(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{203:function(e,t,r){"use strict";r.r(t);r(14),r(10),r(124),r(27);var n=r(4),o=(r(66),r(5)),m={middleware:["has-verify-token","not-auth"],head:function(){return{title:"".concat(this.$t("pages.fresh.title")," - Meters"),htmlAttrs:{lang:this.$store.state.locale},meta:[{hid:"description",name:"description",content:this.$t("pages.fresh.description")}]}},data:function(){return{verifyToken:null,resetting:!1,rememberMe:!1}},mounted:function(){this.verifyToken=this.$route.query.verify_token,this.rememberMe=this.$route.query.hasOwnProperty("remember-me")},watch:{rememberMe:function(e,t){if(e!==t){var r={query:{verify_token:this.verifyToken}};e&&(r.query["remember-me"]=null),this.$router.replace(r).catch(o.A)}}},methods:{reset:function(e){var t=this;return Object(n.a)(regeneratorRuntime.mark((function r(){var n,m,c,l,f,d;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return e.preventDefault(),t.resetting=!0,n=e.target[0].value,m=e.target[1].value,c=e.target[2].checked,t.$store.dispatch("hideMessage"),r.prev=6,r.next=9,t.$post("/reset",{verify_token:t.verifyToken,password:n,password_confirmation:m,remember_me:Boolean(c)});case 9:return l=r.sent,r.next=12,l.json();case 12:if(f=r.sent,l.ok){r.next=17;break}return e.target[0].focus(),f.errors?(d=Object.values(f.errors)[0][0],t.$store.dispatch("showMessage",{message:d,isError:!0})):(t.$store.dispatch("showMessage",{message:f.message,isError:!0}),t.$router.push("/reset").catch(o.A)),r.abrupt("return");case 17:c&&t.$store.commit("SET_REMEMBER_ME",{rememberMe:c}),localStorage.setItem("hasConnected",!0),t.$store.commit("SET_API_TOKEN",{apiToken:f.api_token}),t.$router.push("/").catch(o.A),r.next=27;break;case 23:r.prev=23,r.t0=r.catch(6),console.error("Error getting response",r.t0),t.$store.dispatch("showMessage",{message:t.$t("error.unknown"),isError:!0});case 27:return r.prev=27,t.resetting=!1,r.finish(27);case 30:case"end":return r.stop()}}),r,null,[[6,23,27,30]])})))()}}},c=r(13),component=Object(c.a)(m,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"mt-4 lg:mt-16 flex flex-col items-center"},[r("section",{staticClass:"flex flex-col items-center"},[r("img",{staticClass:"w-16 sm:mb-2 md:w-32",attrs:{src:"/images/naito-900.svg",alt:e.$t("alt.naito_one_logo")}}),e._v(" "),r("h1",{staticClass:"font-heading text-2xl text-center",domProps:{textContent:e._s(e.$t("pages.fresh.title"))}})]),e._v(" "),r("form",{staticClass:"my-8 flex flex-col items-center w-full sm:w-100 bg-gray-100 rounded-md px-4 py-8 font-medium",attrs:{action:"#"},on:{submit:e.reset}},[r("p",{staticClass:"text-center text-gray-800 mb-4",domProps:{textContent:e._s(e.$t("pages.fresh.form.explain"))}}),e._v(" "),r("label",{staticClass:"w-full",attrs:{for:"password-input"},domProps:{textContent:e._s(e.$t("pages.login.form.password"))}}),e._v(" "),r("input",{staticClass:"w-full px-4 py-2 mb-8 transparent-input",attrs:{disabled:e.resetting,type:"password",name:"password-input",id:"password-input",required:""}}),e._v(" "),r("label",{staticClass:"w-full",attrs:{for:"confirm-input"},domProps:{textContent:e._s(e.$t("pages.fresh.form.confirm"))}}),e._v(" "),r("input",{staticClass:"w-full px-4 py-2 transparent-input",attrs:{disabled:e.resetting,type:"password",name:"confirm-input",id:"confirm-input",required:""}}),e._v(" "),r("div",{staticClass:"w-full py-2 flex justify-end items-center"},[r("label",{staticClass:"select-none",attrs:{for:"remember-me-input"},domProps:{textContent:e._s(e.$t("pages.login.form.remember_me"))}}),e._v(" "),r("label",{staticClass:"material-checkbox text-naito-green-200",attrs:{for:"remember-me-input"}},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.rememberMe,expression:"rememberMe"}],attrs:{disabled:e.resetting,type:"checkbox",name:"remember-me-input",id:"remember-me-input"},domProps:{checked:Array.isArray(e.rememberMe)?e._i(e.rememberMe,null)>-1:e.rememberMe},on:{change:function(t){var r=e.rememberMe,n=t.target,o=!!n.checked;if(Array.isArray(r)){var m=e._i(r,null);n.checked?m<0&&(e.rememberMe=r.concat([null])):m>-1&&(e.rememberMe=r.slice(0,m).concat(r.slice(m+1)))}else e.rememberMe=o}}}),e._v(" "),r("div",{staticClass:"material-checkbox-fake material-checkbox-fake__large"})])]),e._v(" "),r("input",{staticClass:"text-center action w-full bg-naito-green-200 text-gray-100",attrs:{disabled:e.resetting,type:"submit"},domProps:{value:e.$t("pages.fresh.form.submit")}})])])}),[],!1,null,null,null);t.default=component.exports}}]);