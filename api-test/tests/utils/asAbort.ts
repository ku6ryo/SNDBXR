export function abort(memory: WebAssembly.Memory, mPtr: number, fPtr: number, line: number, column: number) {
  const mLen = new Uint32Array(memory.buffer)[(mPtr >> 2) - 1]
  const fLen = new Uint32Array(memory.buffer)[(fPtr >> 2) - 1]
  const decoder = new TextDecoder()
  const msg = decoder.decode((new Uint8Array(memory.buffer)).subarray(mPtr, mPtr + mLen))
  const file = decoder.decode((new Uint8Array(memory.buffer)).subarray(fPtr, fPtr + fLen))
  throw new Error(`${file} ${line}:${column} ${msg}`)
}