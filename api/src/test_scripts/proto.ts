import { callEngine_i_ff } from "../../assembly/proto"
import { logInt } from "../../assembly/debug"

export function test(): void {
  const result = callEngine_i_ff(33.7, 2.8, 200)
  logInt(result[0])
}