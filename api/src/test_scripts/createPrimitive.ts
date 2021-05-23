import { logInt } from "../../assembly/debug"
import { createPrimitive, PrimitiveType } from "../../assembly/Object"

export function start(): void {
  logInt(createPrimitive(PrimitiveType.CUBE).id)
}