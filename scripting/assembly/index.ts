import { eventManager } from "./global"
import { EventType } from "./EventType"
import { getObjectByName, log, getTime, } from "./tool"
import { Object } from "./object"

export function main (): i32 {
  let o = getObjectByName("cube")
  if (o === null) {
    return 1
  }
  return 0
}

let i = 0;
export function update(): void {
  let o = getObjectByName("cube")
  if (o !== null) {
    o.setPosition(i * 0.1 as f32, 0, 0)
    i += 1
  }
}

export function check (): void {
  log(getTime())
  log(i)
}

export function onEvent (objectId: i32, type: EventType): void {
  eventManager.onEvent(objectId, type)
}

