import path from "path"
import fs from "fs"
import { encode, decodeMulti } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("TextureLoader", async () => {
  const pathToWasm = path.join(__dirname, "../build/textureLoader.wasm")
  const file = fs.readFileSync(pathToWasm)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: (mPtr: number, fPtr: number, line: number, column: number) => abort(memory, mPtr, fPtr, line, column)
    },
    textureLoader: {
      assertObjectId: (id: number) => {
        expect(id).toBe(3)
      },
      assertProgressLoaded: (loaded: number) => {
        expect(loaded).toBe(999)
      },
      assertProgressTotal: (total: number) => {
        expect(total).toBe(1000)
      },
    },
    interface: {
      callEngineImport: (funcId: number, ptr: number) => {
        expect(funcId).toBe(5000)
        const aLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
        const aData = new Uint8Array(memory.buffer).subarray(ptr, ptr + aLen)
        const argsItr = decodeMulti(aData)
        expect(argsItr.next().value).toBe("abcd")
        expect(argsItr.next().value).toBe(1)
        const rData = encode(200)
        const rPtr = (instance.exports.malloc as (len: number) => number)(rData.byteLength)
        ;(new Uint8Array(memory.buffer)).set(rData, rPtr)
        return rPtr
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.main as () => void)()
  const progress = encode([200, 999, 1000])
  const progressPtr = (instance.exports.malloc as (len: number) => number)(progress.byteLength - 1)
  ;(new Uint8Array(memory.buffer)).set(progress.subarray(1), progressPtr)
  ;(instance.exports.callSandbox as (funcId: number, ptr: number) => number)(5001, progressPtr)
  const complete = encode([200, 0, 3])
  const completePtr = (instance.exports.malloc as (len: number) => number)(complete.byteLength - 1)
  ;(new Uint8Array(memory.buffer)).set(complete.subarray(1), completePtr)
  ;(instance.exports.callSandbox as (funcId: number, ptr: number) => number)(5002, completePtr)
  expect.assertions(6)
})