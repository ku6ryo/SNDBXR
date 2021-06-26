import { malloc as mallocInternal } from "sndbxr/interface"
import { MeshObject, Primitive } from "sndbxr"
import { log } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  const obj = MeshObject.createPrimitive(Primitive.Cube)
  obj.setName("meshObj")
  const name = obj.getName()
  log(name)
}