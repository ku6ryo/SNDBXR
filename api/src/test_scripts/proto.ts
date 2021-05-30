import { callEngine_i_ifff } from "../../assembly/gate"
import { logInt } from "../../assembly/debug"

export function test(): void {
  const result = callEngine_i_ifff(200, 1, 33.7, 2.8, 789.53)
  logInt(result[0].vi32)
}