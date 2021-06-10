export function malloc(len: i32): usize {
  return heap.alloc(len)
}

export function free(ptr: i32): void {
  heap.free(ptr)
}

declare function callEngineImport(funcId: i32, buf: ArrayBuffer): i32

export function callEngine(funcId: i32, buf: ArrayBuffer): ArrayBuffer {
  const returnPtr = callEngineImport(funcId, buf)
  const len = load<i32>(returnPtr - 4)
  const returnData = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    returnData[i] = load<u8>(returnPtr + i)
  }
  return returnData.buffer
}

const callSandboxFuncMap = new Map<i32, (data: ArrayBuffer) => ArrayBuffer>()

export function registerFuncToCallSandboxFuncMap(funcId: i32, func: (data: ArrayBuffer) => ArrayBuffer): void {
  if (callSandboxFuncMap.has(funcId)) {
    throw new Error("Already exits cannot register the same function. funcId: " + funcId.toString())
  } else {
    callSandboxFuncMap.set(funcId, func)
  }
}

export function callSandbox(funcId: i32, ptr: i32): ArrayBuffer {
  const len = load<i32>(ptr - 4)
  const argData = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    argData[i] = load<u8>(ptr + i)
  }
  const func = callSandboxFuncMap.get(funcId)
  if (func) {
    return func(argData.buffer)
  } else {
    throw new Error("Unknown funcId: " + funcId.toString())
  }
}