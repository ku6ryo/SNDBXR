import path from "path"
import fs from "fs"
import { abort } from "./utils/asAbort"
import { encode, decodeMulti } from "@msgpack/msgpack"

test("callSandbox", async () => {
  const pathToWasm = path.join(__dirname, "../build/callSandbox.wasm")
  const file = fs.readFileSync(pathToWasm)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: (mPtr: number, fPtr: number, line: number, column: number) => abort(memory, mPtr, fPtr, line, column)
    },
  })
  const instance = source.instance
  const memory = instance.exports.memory as WebAssembly.Memory
  const data = [1234, 12.34, "1234"]
  const encoded = encode(data)
  const ptr = (instance.exports.main as (len: number) => number)(encoded.byteLength - 1)
  ;(new Uint8Array(memory.buffer)).set(encoded.subarray(1), ptr) 
  const rPtr = (instance.exports.callSandbox as (funcId: number, ptr: number) => number)(1234, ptr)
  const rLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
  const rData = new Uint8Array(memory.buffer).subarray(rPtr, rPtr + rLen)
  const entries = decodeMulti(rData)
  const entryArray = []
  for (const entry of entries) {
    entryArray.push(entry)
  }
  expect(entryArray[0]).toBe(data[0])
  expect(Math.floor(entryArray[1] * 100) / 100).toBe(data[1])
  expect(entryArray[2]).toBe(data[2])
})