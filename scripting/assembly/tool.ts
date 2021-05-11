import { eventManager } from "./global"
import { Object } from "./object"
import {
  log as importedLog,
  getTime as importedGetTime,
  getObjectId,
} from "./env"

export function log(type: i32): void {
  importedLog(type)
}

export function getTime(): i32 {
  return importedGetTime()
}