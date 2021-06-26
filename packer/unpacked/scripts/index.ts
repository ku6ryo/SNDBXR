import {
  malloc as mallocInternal,
  free as freeInternal,
  callSandbox as callSandboxInternal
} from "sndbxr/interface"
import { start as userStart, update as userUpdate } from "./main"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function free(ptr: i32): void {
  freeInternal(ptr)
}

export function start(): i32 {
  userStart()
  return 0
}

export function update(): void {
  userUpdate()
}

export function callSandbox(funcId: i32, ptr: i32): ArrayBuffer {
  return callSandboxInternal(funcId, ptr)
}