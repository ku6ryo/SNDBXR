import { callEngine_i_ifff } from "../../assembly/gate"

export function test(iterations: i32): void {
  for(let i = 0; i < iterations; i++) {
    callEngine_i_ifff(200, 1, 33.7, 2.8, 876.98)
  }
}