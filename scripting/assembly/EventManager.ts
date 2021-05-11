import { EventType, } from "./EventType"
import { Object, } from "./object"
import { execIII } from "./env"
import { SET_OBJECT_EVENT_LISTENER } from "./exec"

export class EventManager {

  objects: Map<i32, Object> = new Map()

  setListener(object: Object, type: EventType): i32  {
    this.objects.set(object.id, object)
    return execIII(SET_OBJECT_EVENT_LISTENER, object.id, type)
  }  

  onEvent(objectId: i32, type: i32): void {
    if (this.objects.has(objectId)) {
      const obj = this.objects.get(objectId)
      obj.onEvent(type)
    }
  }
}