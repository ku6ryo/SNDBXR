import path from "path"
import fs from "fs"
import { encode, decode } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("createPrimitive", async () => {
  const pathToWasm = path.join(__dirname, "../build/createStandardMaterial.wasm")
  const file = fs.readFileSync(pathToWasm)
  const log = (buf: Uint8Array) => {
    expect(decode(buf)).toBe("ID:100")
    return new Uint8Array(1)
  }
  const createMaterial = (buf: Uint8Array) => {
    const type = decode(buf)
    expect(type).toBe(1)
    return encode(100)
  }
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: (mPtr: number, fPtr: number, line: number, column: number) => abort(memory, mPtr, fPtr, line, column)
    },
    interface: {
      callEngineImport: (funcId: number, ptr: number) => {
        const aLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
        const aData = new Uint8Array(memory.buffer).subarray(ptr, ptr + aLen)
        let rData: Uint8Array | null = null
        if (funcId === 100) {
          rData = log(aData)
        } else if (funcId === 2001) {
          rData = createMaterial(aData)
        } else {
          throw new Error("Unknown funcId")
        }
        if (!rData) {
          throw new Error("rData is null")
        }
        const rPtr = (instance.exports.malloc as (len: number) => number)(rData.byteLength)
        ;(new Uint8Array(memory.buffer)).set(rData, rPtr)
        return rPtr
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.main as () => void)()
  expect.assertions(2)
})