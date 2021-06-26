import { malloc as mallocInternal } from "sndbxr/interface"
import { log } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  log("Hello SNDBXR")
}