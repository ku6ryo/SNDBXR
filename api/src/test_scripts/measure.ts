import { callEngine_i_ff } from "../../assembly/proto"

export function test(iterations: i32): void {
  for(let i = 0; i < iterations; i++) {
    callEngine_i_ff(33.7, 2.8, 200)
  }
}