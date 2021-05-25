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
    gate: {
      logInt: (value: number) => {
        expect(value).toBe(300)
      }
    },
    proto: {
      _callEngine32: (p, outP, unitLength, funcId) => {
        callPtr = p
        callUnitLength = unitLength
        const iArray = new Int32Array(memory.buffer, p, unitLength)
        const fArray = new Float32Array(memory.buffer, p, unitLength)
        const ni = iArray[0]
        const no = iArray[1]
        const iTypes = iArray.slice(2, 2 + ni)
        const oTypes = iArray.slice(2 + ni, 2 + ni + no)
        const memory32 = new Int32Array(memory.buffer)
        memory32[outP >> 2] = 300

        expect(iTypes[0]).toBe(2)
        expect(iTypes[1]).toBe(2)
        expect(oTypes[0]).toBe(1)
        expect(Math.round(fArray[2 + ni + no] * 1000) / 1000).toBe(33.7)
        expect(Math.round(fArray[2 + ni + no + 1] * 1000) / 1000).toBe(2.8)
        expect(funcId).toBe(200)
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.test as any)();
})