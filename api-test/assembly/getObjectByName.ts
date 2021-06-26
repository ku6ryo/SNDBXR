import { malloc as mallocInternal } from "sndbxr/interface"
import { ObjectUtil } from "sndbxr/objects/ObjectUtil"
import { log } from "sndbxr"

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

export function main(): void {
  const non = ObjectUtil.getObjectByName("non-existent")
  log("non-existent:" + (non === null).toString())
  const obj = ObjectUtil.getObjectByName("existent")
  if (obj) {
    log("ID:" + obj.id.toString())
    log("TYPE:" + obj.type.toString())
  } else {
    throw new Error("Unexpected null object")
  }
}