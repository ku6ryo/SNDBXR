import path from "path"
import fs from "fs"

test("proto", async () => {
  const pathToWasm = path.join(__dirname, "../../build_test/proto.wasm")
  const file = fs.readFileSync(pathToWasm)

  let callPtr = 0
  let callUnitLength = 0
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: function () {
        throw new Error()
      }
    },
    debug: {
      logInt: (value: number) => {
        expect(value).toBe(300)
      }
    },
    proto: {
      _callEngine32: (p, funcId) => {
        const headerArray = new Int32Array(memory.buffer, p, 2)
        const numArgs = headerArray[0]
        const numReturns = headerArray[1]

        callPtr = p
        callUnitLength = 2 + numArgs * 2 + numReturns * 2;
        const iArray = new Int32Array(memory.buffer, p, callUnitLength)
        const fArray = new Float32Array(memory.buffer, p, callUnitLength)
        const iTypes = iArray.slice(2, 2 + numArgs)
        const oTypes = iArray.slice(2 + numArgs, 2 + numArgs + numReturns)
        const memory32 = new Int32Array(memory.buffer)
        const outP = (p >> 2) + 2 + numArgs * 2 + numReturns
        memory32[outP] = 300

        expect(iTypes[0]).toBe(1)
        expect(iTypes[1]).toBe(2)
        expect(iTypes[2]).toBe(2)
        expect(iTypes[3]).toBe(2)
        expect(oTypes[0]).toBe(1)
        expect(iArray[2 + numArgs + numReturns]).toBe(1)
        expect(Math.round(fArray[2 + numArgs + numReturns + 1] * 1000) / 1000).toBe(33.7)
        expect(Math.round(fArray[2 + numArgs + numReturns + 2] * 1000) / 1000).toBe(2.8)
        expect(Math.round(fArray[2 + numArgs + numReturns + 3] * 1000) / 1000).toBe(789.53)
        expect(funcId).toBe(200)
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.test as any)();
})