import { malloc as mallocInternal } from "sndbxr-wasm-api/interface"
import { MeshObject, Primitive, log } from "sndbxr-wasm-api"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  const o = MeshObject.createPrimitive(Primitive.CUBE)
  log("ID:" + o.id.toString())
}