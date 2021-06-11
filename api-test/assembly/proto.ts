import { callEngine_i_ifff } from "sndbxr-wasm-api/gate"
import { malloc as mallocInternal } from "sndbxr-wasm-api/interface"
import { log } from "sndbxr-wasm-api"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function test(): void {
  const result = callEngine_i_ifff(200, 1, 33.7, 2.8, 789.53)
  log(result[0].vi32.toString())
}