import { malloc as mallocInternal } from "sndbxr-wasm-api/interface"
import { log } from "sndbxr-wasm-api"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  log("Hello SNDBXR")
}