(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{181:function(t,e,n){"use strict";var r=n(5),o={props:{title:String,description:String,back:{type:Boolean,default:!0},url:{type:String,default:"/"}},methods:{goBack:function(t){t.preventDefault(),this.$router.push(this.url).catch(r.A)}}},l=n(13),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{staticClass:"w-full flex items-center justify-center h-18"},[t.back?n("button",{staticClass:"z-20 clickable material-icons focus:shadow-outline hover:lighten-10 active:darken-10 absolute left-0 top-0 min-w-10 min-h-10 px-5 py-4 text-2xl",attrs:{title:t.$t("global.back")},on:{click:t.goBack}},[t._v("\n    arrow_back\n  ")]):n("img",{staticClass:"z-20 absolute left-0 top-0 w-10 mx-5 my-4 select-none",attrs:{src:"/images/naito-900.svg",alt:t.$t("alt.naito_one_logo")}}),t._v(" "),n("h1",{staticClass:"font-heading text-2xl",attrs:{title:t.description},domProps:{textContent:t._s(t.title)}})])}),[],!1,null,null,null);e.a=component.exports},182:function(t,e,n){"use strict";var r=n(7),o=n(30),l=n(39),c=n(123),d=n(67),m=n(17),f=n(53).f,h=n(68).f,v=n(15).f,w=n(183).trim,x=r.Number,C=x,_=x.prototype,y="Number"==l(n(90)(_)),k="trim"in String.prototype,S=function(t){var e=d(t,!1);if("string"==typeof e&&e.length>2){var n,r,o,l=(e=k?e.trim():w(e,3)).charCodeAt(0);if(43===l||45===l){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===l){switch(e.charCodeAt(1)){case 66:case 98:r=2,o=49;break;case 79:case 111:r=8,o=55;break;default:return+e}for(var code,c=e.slice(2),i=0,m=c.length;i<m;i++)if((code=c.charCodeAt(i))<48||code>o)return NaN;return parseInt(c,r)}}return+e};if(!x(" 0o1")||!x("0b1")||x("+0x1")){x=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof x&&(y?m((function(){_.valueOf.call(n)})):"Number"!=l(n))?c(new C(S(e)),n,x):S(e)};for(var $,O=n(12)?f(C):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),I=0;O.length>I;I++)o(C,$=O[I])&&!o(x,$)&&v(x,$,h(C,$));x.prototype=_,_.constructor=x,n(18)(r,"Number",x)}},183:function(t,e,n){var r=n(8),o=n(40),l=n(17),c=n(184),d="["+c+"]",m=RegExp("^"+d+d+"*"),f=RegExp(d+d+"*$"),h=function(t,e,n){var o={},d=l((function(){return!!c[t]()||"​"!="​"[t]()})),m=o[t]=d?e(v):c[t];n&&(o[n]=m),r(r.P+r.F*d,"String",o)},v=h.trim=function(t,e){return t=String(o(t)),1&e&&(t=t.replace(m,"")),2&e&&(t=t.replace(f,"")),t};t.exports=h},184:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},185:function(t,e,n){"use strict";n(14),n(38),n(20),n(36),n(37),n(28),n(29),n(10),n(122),n(65),n(19),n(182);var r=n(5);function o(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,d=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return c=t.done,t},e:function(t){d=!0,o=t},f:function(){try{c||null==n.return||n.return()}finally{if(d)throw o}}}}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var c={name:"SearchSelect",props:{name:{type:String,required:!0},placeholder:{type:String,default:""},options:{type:Array,default:function(){return[]}},value:{type:Number,default:-1},top:{type:Boolean,default:!1},single:{type:Boolean,default:!1}},data:function(){return{searchString:"",showOptions:!1,currentValue:-1,supposedSearchString:"",mousedownListener:null}},watch:{value:function(t){if(t!==this.currentValue){var option=this.getOptionById(t);this.searchString=option?option.value:"",this.supposedSearchString=this.searchString,this.showOptions=!1,this.currentValue=t}},options:function(t,e){if(0!==e.length){if(t.length===e.length&&-1!==this.currentValue)return this.searchString=this.getOptionById(this.currentValue).value,void(this.supposedSearchString=this.searchString);this.searchString="",this.supposedSearchString=this.searchString,this.currentValue=-1,this.$emit("input",-1)}}},mounted:function(){var t=this;this.mousedownListener=function(){t.showOptions&&(t.showOptions=!1,t.searchString=t.supposedSearchString)},document.addEventListener("mousedown",this.mousedownListener,{passive:!0})},beforeDestroy:function(){this.mousedownListener&&document.removeEventListener("mousedown",this.mousedownListener)},methods:{getOptionById:function(t){var e,n=o(this.options);try{for(n.s();!(e=n.n()).done;){var option=e.value;if(option.id===t)return option}}catch(t){n.e(t)}finally{n.f()}return null},keepShown:function(t){this.showOptions&&t.stopPropagation()},show:function(t){this.showOptions||(this.showOptions=!0,this.top&&Object(r.O)(this.$refs.scrollDiv))},checkForTab:function(t){var e=this;9===t.keyCode&&setTimeout((function(){e.$refs.focusRoot.contains(document.activeElement)||(e.showOptions=!1,e.searchString=e.supposedSearchString)}),0)},clear:function(){this.searchString="",this.supposedSearchString=this.searchString,this.currentValue=-1,this.$emit("input",-1),this.$refs.focusRoot.getElementsByTagName("input")[0].focus()},clickedOption:function(option){this.searchString=option.value,this.supposedSearchString=this.searchString,this.showOptions=!1,this.currentValue=option.id,this.$emit("input",option.id)}},computed:{inputName:function(){return"search-select-"+this.name},filteredOptions:function(){var t=this;return""===this.searchString?this.options.sort((function(a,b){return a.value.localeCompare(b.value)})):this.options.filter((function(option){return-1!==option.value.search(new RegExp(t.searchString,"gi"))})).sort((function(a,b){return a.value.localeCompare(b.value)}))},optionsClasses:function(){return["absolute","bg-gray-200","shadow-md","w-full","transition-opacity-100","flex"].concat(this.showOptions?["opacity-1","pointer-events-auto"]:["opacity-0","pointer-events-none"]).concat(this.top?["flex-col-reverse","bottom-full","rounded-t-md"]:["flex-col","rounded-b-md"])},optionsUlClasses:function(){return["flex"].concat(this.top?["flex-col-reverse"]:["flex-col"])}}},d=n(13),component=Object(d.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"focusRoot",staticClass:"relative z-10",on:{mousedown:t.keepShown}},[n("div",{class:"w-full flex items-center text-gray-900 relative "+(t.single?"wrapped-single-transparent-input":"wrapped-transparent-input")},[n("label",{staticClass:"material-icons py-2 pl-2 clickable",attrs:{for:t.inputName}},[t._v("search")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.searchString,expression:"searchString"}],staticClass:"flex-grow px-4 py-2",attrs:{placeholder:t.placeholder,type:"text",name:t.inputName,id:t.inputName},domProps:{value:t.searchString},on:{focus:t.show,keydown:t.checkForTab,input:function(e){e.target.composing||(t.searchString=e.target.value)}}}),t._v(" "),""!==t.searchString?n("i",{staticClass:"material-icons py-2 pr-2 clickable text-gray-800",on:{click:t.clear}},[t._v("backspace")]):t._e(),t._v(" "),n("div",{staticClass:"wrapped-style top-0 left-0 w-full h-full pointer-events-none absolute"})]),t._v(" "),n("div",{class:t.optionsClasses},[n("div",{ref:"scrollDiv",staticClass:"max-h-32 lg:max-h-64 overflow-y-auto"},[n("ul",{class:t.optionsUlClasses},[t._l(t.filteredOptions,(function(option){return n("li",{key:option.id,staticClass:"flex-grow flex"},[n("button",{staticClass:"p-4 w-full hover:bg-gray-100",attrs:{tabindex:t.showOptions?0:-1},domProps:{textContent:t._s(option.value)},on:{click:function(e){return t.clickedOption(option)},keydown:t.checkForTab}})])})),t._v(" "),0===t.filteredOptions.length?n("li",{staticClass:"flex-grow p-4",domProps:{textContent:t._s(t.$t("global.no_results"))}}):t._e()],2)])])])}),[],!1,null,null,null);e.a=component.exports},197:function(t,e,n){"use strict";n.r(e);n(19),n(66),n(14),n(10),n(36),n(27);var r=n(4),o=n(11),l=n(181),c=n(5),d=n(185),m=n(91),f={name:"ObjectivePopup",components:{SearchSelect:d.a,LanguageSelector:m.a},props:{show:Boolean,mode:String,current:Object},data:function(){return{name:"",email:"",password:"",passwordConfirmation:"",isDisabled:!1,locale:"en",clientId:-1}},watch:{show:function(t){t&&(Object(c.P)(this.$refs.scrollZone),this.editMode?(this.name=this.current.name,this.email=this.current.email,this.isDisabled=this.current.is_disabled,this.locale=this.current.locale,this.clientId=this.current.client_id):(this.name="",this.email="",this.password="",this.passwordConfirmation="",this.isDisabled=!1,this.locale=this.$store.getters.userLocale,this.clientId=1===this.formattedClients.length?this.formattedClients[0].id:-1))}},methods:{setLocale:function(t){this.locale=t.locale},cancelOnBack:function(t){t.target===this.$refs.back&&this.$emit("cancel")},cancel:function(){this.$emit("cancel")},confirm:function(){var t={name:this.name,email:this.email,password:this.password,password_confirmation:this.passwordConfirmation,is_disabled:this.isDisabled,locale:this.locale,client_id:this.clientId};(this.editMode||""===this.password)&&(delete t.password,delete t.password_confirmation),this.editMode&&(t.id=this.current.id),this.$emit("confirm",t)}},mounted:function(){var t=this;this.escHandler=function(e){27===e.keyCode&&t.show&&t.$emit("cancel")},document.addEventListener("keyup",this.escHandler,{passive:!0})},beforeDestroy:function(){document.removeEventListener("keyup",this.escHandler)},computed:{backClasses:function(){return["fixed","top-0","left-0","right-0","w-screen","h-screen","bg-gray-darken","transition-opacity-100","z-20"].concat(this.show?["pointer-events-auto","opacity-1"]:["pointer-events-none","opacity-0"])},parentClasses:function(){return["fixed","top-0","left-0","right-0","flex","justify-center","p-4","md:pt-16","h-auto","max-h-screen","pointer-events-none"]},sectionClasses:function(){return["w-full","sm:w-120","bg-gray-100","rounded-md","p-4","shadow-lg","flex","flex-col","justify-between"].concat(this.show?["pointer-events-auto"]:[])},editMode:function(){return"edit"===this.mode},locales:function(){return this.$store.state.locales},formattedClients:function(){return this.$store.getters.clients.map((function(t){return{id:t.id,value:"".concat(t.number," - ").concat(t.name)}}))},isDataComplete:function(){return""!==this.name&&""!==this.email&&-1!==this.clientId&&this.password===this.passwordConfirmation}}},h=n(13),v=Object(h.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"back",class:t.backClasses,on:{click:t.cancelOnBack}},[n("div",{class:t.parentClasses},[n("section",{class:t.sectionClasses},[n("div",{ref:"scrollZone",staticClass:"overflow-y-auto max-h-full px-4 sm:px-6"},[n("h2",{staticClass:"text-center font-heading text-2xl my-3",domProps:{textContent:t._s(t.$t("pages.admin.modes."+t.mode))}}),t._v(" "),n("label",{staticClass:"block font-bold text-lg mb-2",domProps:{textContent:t._s(t.$t("pages.admin.form.client"))}}),t._v(" "),n("search-select",{attrs:{name:"resource",placeholder:t.$t("pages.admin.form.find_client"),options:t.formattedClients},model:{value:t.clientId,callback:function(e){t.clientId=e},expression:"clientId"}}),t._v(" "),n("label",{staticClass:"block font-bold text-lg mt-4",attrs:{for:"name-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.name"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"w-full px-4 py-2 transparent-input",attrs:{type:"string",name:"name-input",id:"name-input"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),t._v(" "),n("label",{staticClass:"block font-bold text-lg mt-4",attrs:{for:"email-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.email"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"w-full px-4 py-2 transparent-input",attrs:{type:"email",name:"email-input",id:"email-input"},domProps:{value:t.email},on:{input:function(e){e.target.composing||(t.email=e.target.value)}}}),t._v(" "),t.editMode?t._e():n("div",[n("label",{staticClass:"block font-bold text-lg mt-4",attrs:{for:"password-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.password"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"w-full px-4 py-2 transparent-input",attrs:{type:"password",name:"password-input",id:"password-input"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}}),t._v(" "),n("label",{staticClass:"block font-bold text-lg mt-4",attrs:{for:"password-confirmation-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.password_confirmation"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.passwordConfirmation,expression:"passwordConfirmation"}],staticClass:"w-full px-4 py-2 transparent-input",attrs:{type:"password",name:"password-confirmation-input",id:"password-confirmation-input"},domProps:{value:t.passwordConfirmation},on:{input:function(e){e.target.composing||(t.passwordConfirmation=e.target.value)}}})]),t._v(" "),n("div",{staticClass:"w-full py-2 flex items-center"},[n("label",{staticClass:"material-checkbox text-naito-green-200",attrs:{for:"is-disabled-input"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.isDisabled,expression:"isDisabled"}],attrs:{type:"checkbox",name:"is-disabled-input",id:"is-disabled-input"},domProps:{checked:Array.isArray(t.isDisabled)?t._i(t.isDisabled,null)>-1:t.isDisabled},on:{change:function(e){var n=t.isDisabled,r=e.target,o=!!r.checked;if(Array.isArray(n)){var l=t._i(n,null);r.checked?l<0&&(t.isDisabled=n.concat([null])):l>-1&&(t.isDisabled=n.slice(0,l).concat(n.slice(l+1)))}else t.isDisabled=o}}}),t._v(" "),n("div",{staticClass:"material-checkbox-fake material-checkbox-fake__large"})]),t._v(" "),n("label",{staticClass:"block select-none",attrs:{for:"is-disabled-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.is_disabled"))}})]),t._v(" "),n("label",{staticClass:"block font-bold text-lg mt-4",attrs:{for:"locale-input"},domProps:{textContent:t._s(t.$t("pages.admin.form.locale"))}}),t._v(" "),n("div",{staticClass:"flex mb-4"},[n("language-selector",{attrs:{locale:t.locale,locales:t.locales,label:"global.set_locale",name:"locale-input"},on:{change:t.setLocale}})],1)],1),t._v(" "),n("div",{staticClass:"flex mb-3"},[n("button",{staticClass:"flex-grow mr-3 action bg-gray-600 text-gray-100 text-center",domProps:{textContent:t._s(t.$t("global.cancel"))},on:{click:t.cancel}}),t._v(" "),n("button",{staticClass:"flex-grow ml-3 action bg-naito-green-200 text-gray-100 text-center",attrs:{disabled:!t.isDataComplete,title:t.isDataComplete?"":t.$t("pages.admin.form.incomplete_data")},domProps:{textContent:t._s(t.$t("global.confirm"))},on:{click:t.confirm}})])])])])}),[],!1,null,null,null).exports,w={middleware:"needs-auth",head:function(){return{title:"".concat(this.$t("pages.admin.title")," - Meters"),htmlAttrs:{lang:this.$store.state.locale},meta:[{hid:"description",name:"description",content:this.$t("pages.admin.description")}]}},components:{AppHeader:l.a,AdminUserPopup:v},mounted:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([t.$getUser(),t.$getUsers(),t.$getClients()]);case 2:t.isAdmin||t.$router.replace("/").catch(c.A);case 3:case"end":return e.stop()}}),e)})))()},data:function(){return{mode:"create",id:-1,show:!1}},watch:{$route:function(t){!t.query.hasOwnProperty("popup")&&this.show&&(this.show=!1)}},methods:{navPopup:function(){this.$router.push({query:{popup:null}}).catch(c.A)},create:function(){this.$store.dispatch("hideMessage"),this.mode="create",this.show=!0,this.navPopup()},update:function(t){this.$store.dispatch("hideMessage"),this.mode="edit",this.id=t,this.show=!0,this.navPopup()},del:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e.$store.dispatch("hideMessage"),n.prev=1,n.next=4,e.$delUser({id:t});case 4:n.next=8;break;case 6:n.prev=6,n.t0=n.catch(1);case 8:e.$getUsers(!0);case 9:case"end":return n.stop()}}),n,null,[[1,6]])})))()},confirmDelete:function(t,e){"false"===t.currentTarget.dataset.popupShow?t.currentTarget.dataset.popupShow="true":(t.currentTarget.dataset.popupShow="false",this.del(e.id))},popupCancel:function(){this.show=!1,this.$router.go(-1)},popupConfirm:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e.show=!1,e.$router.go(-1),void 0===t.id){n.next=12;break}return n.prev=3,n.next=6,e.$putUser(t);case 6:n.next=10;break;case 8:n.prev=8,n.t0=n.catch(3);case 10:n.next=19;break;case 12:return n.prev=12,n.next=15,e.$postUser(t);case 15:n.next=19;break;case 17:n.prev=17,n.t1=n.catch(12);case 19:e.$getUsers(!0);case 20:case"end":return n.stop()}}),n,null,[[3,8],[12,17]])})))()}},computed:{isAdmin:function(){return this.$store.getters.isAdmin},users:function(){var t=this;return this.$store.getters.users.map((function(e){var n=t.$store.getters.client(e);return{id:e.id,name:e.name,email:e.email,created_at:o.DateTime.fromISO(e.created_at).setLocale(t.$dateLocale()).toLocaleString(o.DateTime.DATE_FULL),client:n?n.name:e.client_id}}))}}},x=Object(h.a)(w,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.isAdmin?n("div",[n("app-header",{attrs:{title:t.$t("pages.admin.title"),description:t.$t("pages.admin.description"),back:!0}}),t._v(" "),n("p",{staticClass:"font-medium text-center mb-6",domProps:{textContent:t._s(t.$t("pages.admin.info"))}}),t._v(" "),n("ul",{staticClass:"flex flex-col items-center"},t._l(t.users,(function(e,i){return n("li",{key:i,staticClass:"w-full lg:w-200 my-1 flex justify-between bg-gray-100 rounded-md hover:shadow-lg"},[n("button",{staticClass:"font-bold flex-grow py-4 pl-4 clickable focus:shadow-outline flex items-center",attrs:{title:t.$t("pages.admin.modes.edit")},on:{click:function(){return t.update(e.id)}}},[n("span",{staticClass:"flex-grow",domProps:{textContent:t._s(e.name+", "+e.client)}}),t._v(" "),n("i",{staticClass:"material-icons text-naito-blue-300 text-lg px-5"},[t._v("edit")])]),t._v(" "),n("button",{staticClass:"flex items-center text-naito-blue-300 text-lg py-4 px-5 clickable focus:shadow-outline popup confirmable",attrs:{"data-popup-show":"false","data-popup-text":t.$t("global.no_undoing"),title:t.$t("pages.admin.modes.delete")},on:{click:function(n){return t.confirmDelete(n,e)},blur:function(t){t.currentTarget.dataset.popupShow="false"}}},[n("i",{staticClass:"material-icons"},[t._v("delete")])])])})),0),t._v(" "),n("div",{staticClass:"mt-4 mb-24 md:mt-8 flex justify-center"},[n("button",{staticClass:"w-full lg:w-200 action bg-naito-blue-300 text-gray-100 text-center relative",on:{click:t.create}},[n("i",{staticClass:"material-icons absolute left-0 m-4 top-0"},[t._v("add")]),t._v(" "),n("span",{domProps:{textContent:t._s(t.$t("pages.admin.modes.create"))}})])]),t._v(" "),n("admin-user-popup",{attrs:{show:t.show,mode:t.mode,current:-1===t.id?null:t.$store.getters.user({user_id:t.id})},on:{cancel:t.popupCancel,confirm:t.popupConfirm}})],1):t._e()}),[],!1,null,null,null);e.default=x.exports}}]);