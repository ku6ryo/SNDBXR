import path from "path"
import fs from "fs"
import { encode, decodeMulti } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("callEngine", async () => {
  const pathToWasm = path.join(__dirname, "../build/callEngine.wasm")
  const file = fs.readFileSync(pathToWasm)
  const source = await WebAssembly.instantiate(file, {
    callEngine: {
      assertInt: (i: number) => {
        expect(i).toBe(1234)
      },
      assertFloat: (f: number) => {
        expect(Math.floor(f * 100) / 100).toBe(12.34)
      },
      assertString: (ptr: number, len: number) => {
        const decoder = new TextDecoder()
        const data = (new Uint8Array(memory.buffer)).subarray(ptr, ptr + len)
        const s = decoder.decode(data)
        expect(s).toBe("1234")
      }
    },
    env: {
      abort: (mPtr: number, fPtr: number, line: number, column: number) => abort(memory, mPtr, fPtr, line, column)
    },
    interface: {
      callEngineImport: (funcId: number, ptr: number) => {
        expect(funcId).toBe(9999)
        const aLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
        const aData = new Uint8Array(memory.buffer).subarray(ptr, ptr + aLen)
        const data = [1234, 12.34, "1234"]
        const entryArray = []
        const entries = decodeMulti(aData)
        for (const entry of entries) {
          entryArray.push(entry)
        }
        expect(entryArray[0]).toBe(data[0])
        expect(Math.floor(entryArray[1] * 100) / 100).toBe(data[1])
        expect(entryArray[2]).toBe(data[2])
        const encoded = encode(data)
        const rPtr = (instance.exports.malloc as (len: number) => number)(encoded.byteLength - 1)
        ;(new Uint8Array(memory.buffer)).set(encoded.subarray(1), rPtr) 
        return rPtr
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.main as () => void)()
  expect.assertions(7)
})