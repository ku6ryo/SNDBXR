import path from "path"
import fs from "fs"

;(async () => {
  const pathToWasm = path.join(__dirname, "../build_test/measure.wasm")
  const file = fs.readFileSync(pathToWasm)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: function () {
        throw new Error()
      }
    },
    proto: {
      _callEngine32: (p, outP, unitLength, funcId) => {
        const memory32 = new Int32Array(memory.buffer)
        memory32[outP >> 2] = 300
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  const iterations = 100000
  const start = (new Date()).getTime()
  ;(instance.exports.test as any)(iterations)
  const end = (new Date()).getTime()
  console.log(`${iterations} iterations: ${(end - start) / 1000} sec`)
})()