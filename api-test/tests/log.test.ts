import path from "path"
import fs from "fs"
import { decode } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("log", async () => {
  const pathToWasm = path.join(__dirname, "../build/log.wasm")
  const file = fs.readFileSync(pathToWasm)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: (mPtr: number, fPtr: number, line: number, column: number) => abort(memory, mPtr, fPtr, line, column)
    },
    interface: {
      callEngineImport: (funcId: number, ptr: number) => {
        expect(funcId).toBe(100)
        const aLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
        const aData = new Uint8Array(memory.buffer).subarray(ptr, ptr + aLen)
        const message = decode(aData)
        expect(message).toBe("Hello SNDBXR")
        const rPtr = (instance.exports.malloc as (len: number) => number)(1)
        return rPtr
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.main as () => void)()
  expect.assertions(2)
})