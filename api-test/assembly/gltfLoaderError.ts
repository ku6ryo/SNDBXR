import { malloc as mallocInternal, callSandbox as callSandboxInternal } from "sndbxr/interface"
import { GLTFLoader, GroupObject } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

declare function assertErrorStatus(id: i32): void

export function main(): void {
  const loader = new GLTFLoader(
    "abcd",
    (obj: GroupObject) => {
      throw new Error("Not expecting this")
    }, (loaded: i32, total: i32) => {
      throw new Error("Not expecting this")
    }, (code: i32) => {
      assertErrorStatus(code)
    })
  loader.load()
}
export function callSandbox(funcId: i32, ptr: i32): ArrayBuffer {
  return callSandboxInternal(funcId, ptr)
}