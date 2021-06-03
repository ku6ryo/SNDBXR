(()=>{"use strict";var t,n={996:function(t,n,e){var r=this&&this.__awaiter||function(t,n,e,r){return new(e||(e=Promise))((function(o,i){function s(t){try{u(r.next(t))}catch(t){i(t)}}function a(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(s,a)}u((r=r.apply(t,n||[])).next())}))},o=this&&this.__generator||function(t,n){var e,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;s;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!((o=(o=s.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=n.call(t,s)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};n.__esModule=!0,n.UnityConnector=void 0;var i=e(845),s=function(){function t(t,n){this.runnerMap=new Map,this.unityInstance=t,this.unityPointers=n}return t.prototype.registerRunner=function(t,n){this.runnerMap.set(t,n)},t.prototype.unregisterRunner=function(t){this.runnerMap.delete(t)},t.prototype.getRunner=function(t){if(!this.runnerMap.has(t))throw new Error("get does not exist for sandbox: "+t);return this.runnerMap.get(t)},t.prototype.onStart=function(t){console.log(t),this.getRunner(t).onStart()},t.prototype.onUpdate=function(t){this.getRunner(t).onUpdate()},t.prototype.load=function(t,n){return r(this,void 0,void 0,(function(){var e,r,s;return o(this,(function(o){switch(o.label){case 0:return o.trys.push([0,5,,6]),[4,fetch(n)];case 1:return[4,o.sent().blob()];case 2:return[4,o.sent().arrayBuffer()];case 3:return e=o.sent(),[4,(r=new i.WasmRunner(this,t)).createWasm(e)];case 4:return o.sent(),this.registerRunner(t,r),this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted,t,0),[3,6];case 5:return s=o.sent(),console.log(s),this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted,t,1),[3,6];case 6:return[2]}}))}))},t.prototype.requestLoad=function(t){var n=(new TextEncoder).encode(t+String.fromCharCode(0)),e=this.unityInstance.Module._malloc(n.length);this.unityInstance.Module.HEAP8.set(n,e),this.unityInstance.Module.dynCall_vi(this.unityPointers.onLoadRequested,e)},t.prototype.requestDelete=function(t){this.unityInstance.Module.dynCall_vi(this.unityPointers.onDeleteRequested,t),this.unregisterRunner(t)},t.prototype.requestDeleteAll=function(){var t=this;this.runnerMap.forEach((function(n,e){t.requestDelete(e)}))},t}();n.UnityConnector=s},845:function(t,n){var e=this&&this.__assign||function(){return(e=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t}).apply(this,arguments)},r=this&&this.__awaiter||function(t,n,e,r){return new(e||(e=Promise))((function(o,i){function s(t){try{u(r.next(t))}catch(t){i(t)}}function a(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(s,a)}u((r=r.apply(t,n||[])).next())}))},o=this&&this.__generator||function(t,n){var e,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;s;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!((o=(o=s.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=n.call(t,s)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};n.__esModule=!0,n.WasmRunner=void 0;var i=function(){function t(t,n){this.wasmInstance=null,this.wasmMemory=null,this.time=0,this.connector=t,this.sandboxId=n}return t.prototype.createWasm=function(t){return r(this,void 0,void 0,(function(){var n;return o(this,(function(r){switch(r.label){case 0:return[4,WebAssembly.instantiate(t,e({},this.createImports()))];case 1:return n=r.sent(),this.setWasmInstance(n.instance),[2]}}))}))},t.prototype.setWasmInstance=function(t){this.wasmInstance=t},t.prototype.getWasmInstance=function(){if(this.wasmInstance)return this.wasmInstance;throw new Error("WASM instance is not set yet.")},t.prototype.getWasmMemory=function(){var t=this.getWasmInstance();if(t.exports.memory)return t.exports.memory;throw new Error("No memory export.")},t.prototype.getUnityInstance=function(){return this.connector.unityInstance},t.prototype.getUnityModule=function(){return this.getUnityInstance().Module},t.prototype.getUnityPointers=function(){return this.connector.unityPointers},t.prototype.onStart=function(){this.getWasmInstance().exports.start()},t.prototype.onUpdate=function(){var t=(new Date).getTime();console.log("f: "+(t-this.time)),this.time=t,this.getWasmInstance().exports.update()},t.prototype.onAbort=function(t,n,e,r){console.log("aborted")},t.prototype.createImports=function(){return{env:{abort:this.onAbort.bind(this)},proto:{_callEngine32:this._callEngine32.bind(this)}}},t.prototype._callEngine32=function(t,n){(new Date).getTime();var e=this.getUnityModule(),r=new Uint32Array(this.getWasmMemory().buffer.slice(t,t+8)),o=4*(2+2*r[0]+2*r[1]),i=e._malloc(o),s=new Uint8Array(this.getWasmMemory().buffer.slice(t,t+o));this.getUnityModule().HEAPU8.set(s,i),e.dynCall_viii(this.getUnityPointers().callEngine32,i,n,this.sandboxId)},t.prototype.passStringFromWasmToUnity=function(t,n){var e=new Uint8Array(this.getWasmMemory().buffer.slice(t,t+n)),r=this.getUnityModule()._malloc(n);return this.getUnityModule().HEAP8.set(e,r),r},t}();n.WasmRunner=i}},e={};t=function t(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={exports:{}};return n[r].call(i.exports,i,i.exports,t),i.exports}(996),window.Connector=t.UnityConnector})();