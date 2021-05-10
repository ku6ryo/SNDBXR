import { eventManager } from "./global"
import { Object } from "./object"
import {
  log as importedLog,
  getTime as importedGetTime,
  getObjectId,
} from "./env"

const OBJECT_NOT_FOUND_ID = -1

function allocString(str: string): i32 {
  const ptr = heap.alloc(str.length) as i32;
  for (let i = 0; i < str.length; i++) {
    store<u8>(ptr + i, str.charCodeAt(i))
  }
  return ptr
}

export function getObjectByName(name: string): Object | null {
  const ptr = allocString(name)
  const id = getObjectId(ptr, name.length)
  heap.free(ptr)
  if (id === OBJECT_NOT_FOUND_ID) {
    return null
  } 
  return new Object(id, eventManager)
}

export function log(type: i32): void {
  importedLog(type)
}

export function getTime(): i32 {
  return importedGetTime()
}