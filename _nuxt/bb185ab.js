(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{181:function(t,e,n){"use strict";var r=n(5),o={props:{title:String,description:String,back:{type:Boolean,default:!0},url:{type:String,default:"/"}},methods:{goBack:function(t){t.preventDefault(),this.$router.push(this.url).catch(r.A)}}},c=n(13),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{staticClass:"w-full flex items-center justify-center h-18"},[t.back?n("button",{staticClass:"z-20 clickable material-icons focus:shadow-outline hover:lighten-10 active:darken-10 absolute left-0 top-0 min-w-10 min-h-10 px-5 py-4 text-2xl",attrs:{title:t.$t("global.back")},on:{click:t.goBack}},[t._v("\n    arrow_back\n  ")]):n("img",{staticClass:"z-20 absolute left-0 top-0 w-10 mx-5 my-4 select-none",attrs:{src:"/images/naito-900.svg",alt:t.$t("alt.naito_one_logo")}}),t._v(" "),n("h1",{staticClass:"font-heading text-2xl",attrs:{title:t.description},domProps:{textContent:t._s(t.title)}})])}),[],!1,null,null,null);e.a=component.exports},182:function(t,e,n){"use strict";var r=n(7),o=n(30),c=n(39),l=n(123),d=n(67),m=n(17),f=n(53).f,h=n(68).f,v=n(15).f,x=n(183).trim,w=r.Number,_=w,C=w.prototype,y="Number"==c(n(90)(C)),$="trim"in String.prototype,S=function(t){var e=d(t,!1);if("string"==typeof e&&e.length>2){var n,r,o,c=(e=$?e.trim():x(e,3)).charCodeAt(0);if(43===c||45===c){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===c){switch(e.charCodeAt(1)){case 66:case 98:r=2,o=49;break;case 79:case 111:r=8,o=55;break;default:return+e}for(var code,l=e.slice(2),i=0,m=l.length;i<m;i++)if((code=l.charCodeAt(i))<48||code>o)return NaN;return parseInt(l,r)}}return+e};if(!w(" 0o1")||!w("0b1")||w("+0x1")){w=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof w&&(y?m((function(){C.valueOf.call(n)})):"Number"!=c(n))?l(new _(S(e)),n,w):S(e)};for(var k,O=n(12)?f(_):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),P=0;O.length>P;P++)o(_,k=O[P])&&!o(w,k)&&v(w,k,h(_,k));w.prototype=C,C.constructor=w,n(18)(r,"Number",w)}},183:function(t,e,n){var r=n(8),o=n(40),c=n(17),l=n(184),d="["+l+"]",m=RegExp("^"+d+d+"*"),f=RegExp(d+d+"*$"),h=function(t,e,n){var o={},d=c((function(){return!!l[t]()||"​"!="​"[t]()})),m=o[t]=d?e(v):l[t];n&&(o[n]=m),r(r.P+r.F*d,"String",o)},v=h.trim=function(t,e){return t=String(o(t)),1&e&&(t=t.replace(m,"")),2&e&&(t=t.replace(f,"")),t};t.exports=h},184:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},185:function(t,e,n){"use strict";n(14),n(38),n(20),n(36),n(37),n(28),n(29),n(10),n(122),n(65),n(19),n(182);var r=n(5);function o(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,d=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return l=t.done,t},e:function(t){d=!0,o=t},f:function(){try{l||null==n.return||n.return()}finally{if(d)throw o}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var l={name:"SearchSelect",props:{name:{type:String,required:!0},placeholder:{type:String,default:""},options:{type:Array,default:function(){return[]}},value:{type:Number,default:-1},top:{type:Boolean,default:!1},single:{type:Boolean,default:!1}},data:function(){return{searchString:"",showOptions:!1,currentValue:-1,supposedSearchString:"",mousedownListener:null}},watch:{value:function(t){if(t!==this.currentValue){var option=this.getOptionById(t);this.searchString=option?option.value:"",this.supposedSearchString=this.searchString,this.showOptions=!1,this.currentValue=t}},options:function(t,e){if(0!==e.length){if(t.length===e.length&&-1!==this.currentValue)return this.searchString=this.getOptionById(this.currentValue).value,void(this.supposedSearchString=this.searchString);this.searchString="",this.supposedSearchString=this.searchString,this.currentValue=-1,this.$emit("input",-1)}}},mounted:function(){var t=this;this.mousedownListener=function(){t.showOptions&&(t.showOptions=!1,t.searchString=t.supposedSearchString)},document.addEventListener("mousedown",this.mousedownListener,{passive:!0})},beforeDestroy:function(){this.mousedownListener&&document.removeEventListener("mousedown",this.mousedownListener)},methods:{getOptionById:function(t){var e,n=o(this.options);try{for(n.s();!(e=n.n()).done;){var option=e.value;if(option.id===t)return option}}catch(t){n.e(t)}finally{n.f()}return null},keepShown:function(t){this.showOptions&&t.stopPropagation()},show:function(t){this.showOptions||(this.showOptions=!0,this.top&&Object(r.O)(this.$refs.scrollDiv))},checkForTab:function(t){var e=this;9===t.keyCode&&setTimeout((function(){e.$refs.focusRoot.contains(document.activeElement)||(e.showOptions=!1,e.searchString=e.supposedSearchString)}),0)},clear:function(){this.searchString="",this.supposedSearchString=this.searchString,this.currentValue=-1,this.$emit("input",-1),this.$refs.focusRoot.getElementsByTagName("input")[0].focus()},clickedOption:function(option){this.searchString=option.value,this.supposedSearchString=this.searchString,this.showOptions=!1,this.currentValue=option.id,this.$emit("input",option.id)}},computed:{inputName:function(){return"search-select-"+this.name},filteredOptions:function(){var t=this;return""===this.searchString?this.options.sort((function(a,b){return a.value.localeCompare(b.value)})):this.options.filter((function(option){return-1!==option.value.search(new RegExp(t.searchString,"gi"))})).sort((function(a,b){return a.value.localeCompare(b.value)}))},optionsClasses:function(){return["absolute","bg-gray-200","shadow-md","w-full","transition-opacity-100","flex"].concat(this.showOptions?["opacity-1","pointer-events-auto"]:["opacity-0","pointer-events-none"]).concat(this.top?["flex-col-reverse","bottom-full","rounded-t-md"]:["flex-col","rounded-b-md"])},optionsUlClasses:function(){return["flex"].concat(this.top?["flex-col-reverse"]:["flex-col"])}}},d=n(13),component=Object(d.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"focusRoot",staticClass:"relative z-10",on:{mousedown:t.keepShown}},[n("div",{class:"w-full flex items-center text-gray-900 relative "+(t.single?"wrapped-single-transparent-input":"wrapped-transparent-input")},[n("label",{staticClass:"material-icons py-2 pl-2 clickable",attrs:{for:t.inputName}},[t._v("search")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.searchString,expression:"searchString"}],staticClass:"flex-grow px-4 py-2",attrs:{placeholder:t.placeholder,type:"text",name:t.inputName,id:t.inputName},domProps:{value:t.searchString},on:{focus:t.show,keydown:t.checkForTab,input:function(e){e.target.composing||(t.searchString=e.target.value)}}}),t._v(" "),""!==t.searchString?n("i",{staticClass:"material-icons py-2 pr-2 clickable text-gray-800",on:{click:t.clear}},[t._v("backspace")]):t._e(),t._v(" "),n("div",{staticClass:"wrapped-style top-0 left-0 w-full h-full pointer-events-none absolute"})]),t._v(" "),n("div",{class:t.optionsClasses},[n("div",{ref:"scrollDiv",staticClass:"max-h-32 lg:max-h-64 overflow-y-auto"},[n("ul",{class:t.optionsUlClasses},[t._l(t.filteredOptions,(function(option){return n("li",{key:option.id,staticClass:"flex-grow flex"},[n("button",{staticClass:"p-4 w-full hover:bg-gray-100",attrs:{tabindex:t.showOptions?0:-1},domProps:{textContent:t._s(option.value)},on:{click:function(e){return t.clickedOption(option)},keydown:t.checkForTab}})])})),t._v(" "),0===t.filteredOptions.length?n("li",{staticClass:"flex-grow p-4",domProps:{textContent:t._s(t.$t("global.no_results"))}}):t._e()],2)])])])}),[],!1,null,null,null);e.a=component.exports},198:function(t,e,n){"use strict";n.r(e);n(14),n(10),n(36),n(27);var r=n(4),o=n(5),c=n(181),l=(n(19),{name:"AlertPopup",components:{SearchSelect:n(185).a},props:{show:Boolean,mode:String,current:Object},data:function(){return{min:0,max:30,toleranceRadio:"none",tolerance:1,resource_id:-1}},watch:{show:function(t){t&&(Object(o.P)(this.$refs.scrollZone),this.editMode?(this.min=this.current.min,this.max=this.current.max,this.resource_id=this.current.resource_id,0===this.current.tolerance?(this.toleranceRadio="none",this.tolerance=1):(this.toleranceRadio="custom",this.tolerance=this.current.tolerance)):(this.min=0,this.max=30,this.toleranceRadio="none",this.tolerance=1,this.resource_id=-1))}},methods:{cancelOnBack:function(t){t.target===this.$refs.back&&this.$emit("cancel")},cancel:function(){this.$emit("cancel")},confirm:function(){var t={min:parseFloat(this.min),max:parseFloat(this.max),tolerance:this.isCustomTolerance?parseInt(this.tolerance):0,resource_id:this.resource_id};this.editMode&&(t.id=this.current.id),this.$emit("confirm",t)}},mounted:function(){var t=this;this.escHandler=function(e){27===e.keyCode&&t.show&&t.$emit("cancel")},document.addEventListener("keyup",this.escHandler,{passive:!0})},beforeDestroy:function(){document.removeEventListener("keyup",this.escHandler)},computed:{isCustomTolerance:function(){return"custom"===this.toleranceRadio},grayedIfNotCustomClasses:function(){return this.isCustomTolerance?["text-gray-900"]:["text-gray-500"]},backClasses:function(){return["fixed","top-0","left-0","right-0","w-screen","h-screen","bg-gray-darken","transition-opacity-100","z-20"].concat(this.show?["pointer-events-auto","opacity-1"]:["pointer-events-none","opacity-0"])},parentClasses:function(){return["fixed","top-0","left-0","right-0","flex","justify-center","p-4","md:pt-16","h-auto","max-h-screen","pointer-events-none"]},sectionClasses:function(){return["w-full","sm:w-120","bg-gray-100","rounded-md","p-4","shadow-lg","flex","flex-col","justify-between"].concat(this.show?["pointer-events-auto"]:[])},resource:function(){return this.$store.getters.resource({resource_id:this.resource_id})},editMode:function(){return"edit"===this.mode},allResources:function(){var t=this;return this.$store.getters.resources.filter((function(e){var n=t.$store.getters.resourceType(e);return n&&"Temperature"===n.name}))},formattedResources:function(){var t=this;return this.allResources.map((function(e){var n=null;if(t.$store.getters.numSites>1){var r=t.$store.getters.sensor(e);n=t.$store.getters.site(r)}return{id:e.id,value:Object(o.u)(t.$i18n,e,null,n)}}))}}}),d=n(13),m=Object(d.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"back",class:t.backClasses,on:{click:t.cancelOnBack}},[n("div",{class:t.parentClasses},[n("section",{class:t.sectionClasses},[n("div",{ref:"scrollZone",staticClass:"overflow-y-auto max-h-full px-4 sm:px-6"},[n("h2",{staticClass:"text-center font-heading text-2xl my-3",domProps:{textContent:t._s(t.$t("pages.alerts.modes."+t.mode))}}),t._v(" "),n("div",{staticClass:"mb-8"},[n("h3",{staticClass:"font-bold text-lg mb-2",domProps:{textContent:t._s(t.$t("pages.alerts.form.resource"))}}),t._v(" "),n("search-select",{attrs:{name:"resource",placeholder:t.$t("pages.objectives.form.find_resource"),options:t.formattedResources},model:{value:t.resource_id,callback:function(e){t.resource_id=e},expression:"resource_id"}})],1),t._v(" "),n("div",{staticClass:"flex flex-col mb-8"},[n("h3",{staticClass:"font-bold text-lg",domProps:{textContent:t._s(t.$t("pages.alerts.form.range"))}}),t._v(" "),n("p",{staticClass:"mb-2 text-gray-800",domProps:{textContent:t._s(t.$t("pages.alerts.form.range_note"))}}),t._v(" "),n("div",{staticClass:"flex items-center"},[n("label",{staticClass:"w-1/2 select-none",attrs:{for:"min-input"},domProps:{textContent:t._s(t.$t("pages.alerts.form.min"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.min,expression:"min"}],staticClass:"w-0 text-right flex-grow mx-2 py-2 transparent-input",attrs:{type:"number",min:"-99",max:"99",step:"0.5",name:"min-input",id:"min-input"},domProps:{value:t.min},on:{input:function(e){e.target.composing||(t.min=e.target.value)}}}),t._v(" "),n("span",[t._v("°C")])]),t._v(" "),n("div",{staticClass:"flex items-center"},[n("label",{staticClass:"w-1/2 select-none",attrs:{for:"max-input"},domProps:{textContent:t._s(t.$t("pages.alerts.form.max"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.max,expression:"max"}],staticClass:"w-0 text-right flex-grow mx-2 py-2 transparent-input",attrs:{type:"number",min:"-99",max:"99",step:"0.5",name:"max-input",id:"max-input"},domProps:{value:t.max},on:{input:function(e){e.target.composing||(t.max=e.target.value)}}}),t._v(" "),n("span",[t._v("°C")])])]),t._v(" "),n("div",{staticClass:"flex flex-col mb-12"},[n("h3",{staticClass:"font-bold text-lg",domProps:{textContent:t._s(t.$t("pages.alerts.form.tolerance"))}}),t._v(" "),n("p",{staticClass:"mb-2 text-gray-800",domProps:{textContent:t._s(t.$t("pages.alerts.form.tolerance_note"))}}),t._v(" "),n("div",{staticClass:"flex items-center"},[n("label",{staticClass:"material-radio text-naito-green-200",attrs:{for:"tolerance-none-input-radio"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.toleranceRadio,expression:"toleranceRadio"}],attrs:{type:"radio",id:"tolerance-none-input-radio",value:"none",name:"tolerance-input-radio"},domProps:{checked:t._q(t.toleranceRadio,"none")},on:{change:function(e){t.toleranceRadio="none"}}}),t._v(" "),n("div",{staticClass:"material-radio-fake"})]),t._v(" "),n("label",{staticClass:"flex-grow select-none",attrs:{for:"tolerance-none-input-radio"},domProps:{textContent:t._s(t.$t("pages.alerts.form.tolerance_none"))}})]),t._v(" "),n("div",{staticClass:"flex items-center"},[n("label",{staticClass:"material-radio text-naito-green-200",attrs:{for:"tolerance-custom-input-radio"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.toleranceRadio,expression:"toleranceRadio"}],attrs:{type:"radio",id:"tolerance-custom-input-radio",value:"custom",name:"tolerance-input-radio"},domProps:{checked:t._q(t.toleranceRadio,"custom")},on:{change:function(e){t.toleranceRadio="custom"}}}),t._v(" "),n("div",{staticClass:"material-radio-fake"})]),t._v(" "),n("label",{staticClass:"flex-grow flex items-center select-none",attrs:{for:"tolerance-custom-input-radio"}},[n("span",{domProps:{textContent:t._s(t.$t("pages.alerts.form.tolerance_custom"))}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.tolerance,expression:"tolerance"}],staticClass:"w-0 text-right flex-grow mx-2 py-2 transparent-input",attrs:{type:"number",disabled:!t.isCustomTolerance,min:"1",max:"12",name:"tolerance-input",id:"tolerance-input"},domProps:{value:t.tolerance},on:{input:function(e){e.target.composing||(t.tolerance=e.target.value)}}}),t._v(" "),n("span",{class:t.grayedIfNotCustomClasses,domProps:{textContent:t._s(t.$tc("pages.alerts.form.hours",t.tolerance))}})])])])]),t._v(" "),n("div",{staticClass:"flex mb-3"},[n("button",{staticClass:"flex-grow mr-3 action bg-gray-600 text-gray-100 text-center",domProps:{textContent:t._s(t.$t("global.cancel"))},on:{click:t.cancel}}),t._v(" "),n("button",{staticClass:"flex-grow ml-3 action bg-naito-green-200 text-gray-100 text-center",attrs:{disabled:-1===t.resource_id,title:-1===t.resource_id?t.$t("pages.objectives.form.missing_resource"):""},domProps:{textContent:t._s(t.$t("global.confirm"))},on:{click:t.confirm}})])])])])}),[],!1,null,null,null).exports,f={middleware:"needs-auth",head:function(){return{title:"".concat(this.$t("pages.alerts.title")," - Meters"),htmlAttrs:{lang:this.$store.state.locale},meta:[{hid:"description",name:"description",content:this.$t("pages.alerts.description")}]}},components:{AppHeader:c.a,AlertPopup:m},mounted:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([t.$getResources(),t.$getAlerts(),t.$getResourceTypes(),t.$getSensors(),t.$getSites()]);case 2:case"end":return e.stop()}}),e)})))()},data:function(){return{mode:"create",id:-1,show:!1}},watch:{$route:function(t){!t.query.hasOwnProperty("popup")&&this.show&&(this.show=!1)}},methods:{navPopup:function(){this.$router.push({query:{popup:null}}).catch(o.A)},create:function(){this.$store.dispatch("hideMessage"),this.mode="create",this.show=!0,this.navPopup()},update:function(t){this.$store.dispatch("hideMessage"),this.mode="edit",this.id=t,this.show=!0,this.navPopup()},del:function(t){this.$store.dispatch("hideMessage"),this.$delAlert({id:t})},confirmDelete:function(t,e){"false"===t.currentTarget.dataset.popupShow?t.currentTarget.dataset.popupShow="true":(t.currentTarget.dataset.popupShow="false",this.del(e.id))},popupCancel:function(){this.show=!1,this.$router.go(-1)},popupConfirm:function(t){this.show=!1,this.$router.go(-1),void 0!==t.id?this.$putAlert(t):this.$postAlert(t)}},computed:{alerts:function(){var t=this,e=this.$numberLocale();return this.$store.getters.alerts.map((function(n){var r={id:n.id,value:""},c=t.$store.getters.resource(n);if(null===c)return r;var l=Object(o.u)(t.$i18n,c);return r.value="".concat(l,", ").concat(n.min.toLocaleString(e)," — ").concat(n.max.toLocaleString(e)," °C"),n.tolerance>0&&(r.value+=", ".concat(n.tolerance,"h")),r}))}}},h=Object(d.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("app-header",{attrs:{title:t.$t("pages.alerts.title"),description:t.$t("pages.alerts.description"),back:!0}}),t._v(" "),n("p",{staticClass:"font-medium text-center mb-6",domProps:{textContent:t._s(t.$t("pages.alerts.info"))}}),t._v(" "),n("ul",{staticClass:"flex flex-col items-center"},t._l(t.alerts,(function(e,i){return n("li",{key:i,staticClass:"w-full lg:w-200 my-1 flex justify-between bg-gray-100 rounded-md hover:shadow-lg"},[n("button",{staticClass:"font-bold flex-grow py-4 pl-4 clickable focus:shadow-outline flex items-center",attrs:{title:t.$t("pages.alerts.modes.edit")},on:{click:function(n){return t.update(e.id)}}},[n("span",{staticClass:"flex-grow",domProps:{textContent:t._s(e.value)}}),t._v(" "),n("i",{staticClass:"material-icons text-naito-blue-300 text-lg px-5"},[t._v("edit")])]),t._v(" "),n("button",{staticClass:"flex items-center text-naito-blue-300 text-lg py-4 px-5 clickable focus:shadow-outline popup confirmable",attrs:{"data-popup-show":"false","data-popup-text":t.$t("global.no_undoing"),title:t.$t("pages.alerts.modes.delete")},on:{click:function(n){return t.confirmDelete(n,e)},blur:function(t){t.currentTarget.dataset.popupShow="false"}}},[n("i",{staticClass:"material-icons"},[t._v("delete")])])])})),0),t._v(" "),n("div",{staticClass:"mt-4 mb-24 md:mt-8 flex justify-center"},[n("button",{staticClass:"w-full lg:w-200 action bg-naito-blue-300 text-gray-100 text-center relative",on:{click:t.create}},[n("i",{staticClass:"material-icons absolute left-0 m-4 top-0"},[t._v("add")]),t._v(" "),n("span",{domProps:{textContent:t._s(t.$t("pages.alerts.modes.create"))}})])]),t._v(" "),n("alert-popup",{attrs:{show:t.show,mode:t.mode,current:t.$store.getters.alert({alert_id:t.id})},on:{cancel:t.popupCancel,confirm:t.popupConfirm}})],1)}),[],!1,null,null,null);e.default=h.exports}}]);