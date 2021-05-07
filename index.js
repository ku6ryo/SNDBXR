const fs = require("fs");
const loader = require("@assemblyscript/loader");
const memory = new WebAssembly.Memory({ initial: 1 })
const imports = {
  env: {
    getObjectId: (len) => {
      const nameArray = new Uint8Array(wasmModule.exports.memory.buffer.slice(0, len))
      console.log(String.fromCharCode.apply(null, nameArray))
      return 10;
    },
    getObjectPosition: (objectId) => {
      return [0, 1, 2]
    },
    setEventListener: (objectId, type) => {
    },
    log: (type) => {
      console.log(type)
    }
  },
  memory,
 };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports);
module.exports = wasmModule.exports;
