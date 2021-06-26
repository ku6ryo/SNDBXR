import { malloc as mallocInternal } from "sndbxr/interface"
import { MeshObject, Primitive, log } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  const o = MeshObject.createPrimitive(Primitive.Sphere)
  log("ID:" + o.id.toString())
}