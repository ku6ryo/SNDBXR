import { logInt } from "../../assembly/debug"
import { createPrimitive, PrimitiveType } from "../../assembly/Object"

export function start(): void {
  const o = createPrimitive(PrimitiveType.CUBE)
  const m = o.getMaterial()
  if (m) {
    logInt(m.id)
  }
}