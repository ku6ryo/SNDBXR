import path from "path"
import fs from "fs"
import { encode, decode } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("getObjectByName", async () => {
  const pathToWasm = path.join(__dirname, "../build/getObjectByName.wasm")
  const file = fs.readFileSync(pathToWasm)
  const logCheck = jest.fn()
  const log = (buf: Uint8Array) => {
    logCheck(decode(buf))
    return new Uint8Array(1)
  }
  const getObjectByName = (buf: Uint8Array) => {
    const name = decode(buf)
    if (name === "non-existent") {
      return encode([-1, -1])
    } else if (name === "existent") {
      return encode([99, 2])
    } else {
      throw new Error("Unexpected name")
    }
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
        } else if (funcId === 1000) {
          rData = getObjectByName(aData)
        } else {
          throw new Error("Unknown funcId")
        }
        if (!rData) {
          throw new Error("rData is null")
        }
        const rPtr = (instance.exports.malloc as (len: number) => number)(rData.byteLength - 1)
        ;(new Uint8Array(memory.buffer)).set(rData.subarray(1), rPtr)
        return rPtr
      }
    }
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  (instance.exports.main as () => void)()
  expect(logCheck).toHaveBeenNthCalledWith(1, "non-existent:true")
  expect(logCheck).toHaveBeenNthCalledWith(2, "ID:99")
  expect(logCheck).toHaveBeenNthCalledWith(3, "TYPE:2")
})