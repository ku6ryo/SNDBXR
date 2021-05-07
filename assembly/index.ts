import { eventManager } from "./global"
import { EventType } from "./EventType"
import { getObjectByName, log, } from "./tool"

let i = 0

export function main (): i32 {
  const o = getObjectByName("cube")
  log(100)
  if (o === null) {
    return 1
  }
  const o2 = getObjectByName("hoge")
  if (o2 === null) {
    return 1
  }
  o.listen(EventType.TOUCH, () => {
    i = 1
  })
  o2.listen(EventType.TOUCH, () => {
    i += 1
  })
  return 0
}

export function check (): void {
  log(i)
}

export function onEvent (objectId: i32, type: EventType): void {
  eventManager.onEvent(objectId, type)
}

