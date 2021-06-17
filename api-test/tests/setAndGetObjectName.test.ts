import path from "path"
import fs from "fs"
import { encode, decode, decodeMulti } from "@msgpack/msgpack"
import { abort } from "./utils/asAbort"

test("getObjectByName", async () => {
  const pathToWasm = path.join(__dirname, "../build/setAndGetObjectName.wasm")
  const file = fs.readFileSync(pathToWasm)
  const logCheck = jest.fn()
  const log = (buf: Uint8Array) => {
    logCheck(decode(buf))
    return new Uint8Array(1)
  }
  const createPrimitive = (buf: Uint8Array) => {
    const type = decode(buf)
    expect(type).toBe(0)
    return encode(1)
  }
  const setObjectName = (buf: Uint8Array) => {
    const decoded = decodeMulti(buf)
    const id = decoded.next().value
    const name = decoded.next().value
    expect(id).toBe(1)
    expect(name).toBe("meshObj")
    return encode(0)
  }
  const getObjectName = (buf: Uint8Array) => {
    const id = decode(buf)
    expect(id).toBe(1)
    return encode("meshObj")
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
        } else if (funcId === 1001) {
          rData = createPrimitive(aData)
        } else if (funcId === 1130) {
          rData = setObjectName(aData)
        } else if (funcId === 1131) {
          rData = getObjectName(aData)
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
  expect(logCheck).toHaveBeenNthCalledWith(1, "meshObj")
})