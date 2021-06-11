import { malloc as mallocInternal, callSandbox as callSandboxInternal } from "sndbxr-wasm-api/interface"
import { log, GLTFLoader, GroupObject, LoadError } from "sndbxr-wasm-api"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

declare function assertObjectId(id: i32): void
declare function assertProgressLoaded(loaded: i32): void
declare function assertProgressTotal(total: i32): void

export function main(): void {
  const loader = new GLTFLoader(
    "abcd",
    (obj: GroupObject) => {
      assertObjectId(obj.id)
    }, (loaded: i32, total: i32) => {
      assertProgressLoaded(loaded)
      assertProgressTotal(total)
    }, (status: LoadError) => {
    })
  loader.load()
}
export function callSandbox(funcId: i32, ptr: i32): ArrayBuffer {
  return callSandboxInternal(funcId, ptr)
}