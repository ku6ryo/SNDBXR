import { malloc as mallocInternal } from "sndbxr/interface"
import { StandardMaterial, log } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  const m = StandardMaterial.create()
  log("ID:" + m.id.toString())
}