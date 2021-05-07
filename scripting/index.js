const fs = require("fs");
const loader = require("@assemblyscript/loader");

let objectId = 0;
const imports = {
  env: {
    getObjectId: (len) => {
      const nameArray = new Uint8Array(wasmModule.exports.memory.buffer.slice(0, len))
      console.log(String.fromCharCode.apply(null, nameArray))
      console.log(wasmModule.exports.memory.buffer)
      objectId += 1;
      return objectId;
    },
    getObjectPosition: (objectId) => {
      return [0, 1, 2]
    },
    setEventListener: (objectId, type) => {
    },
    log: (type) => {
      console.log(type)
    },
    getTime: () => {
      return Math.round(new Date().getTime() / 1000)
    },
  },
 };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports);
module.exports = wasmModule.exports;
