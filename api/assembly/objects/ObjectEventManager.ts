import { EventType, } from "../EventType"
import { PlainObject } from "./PlainObject"

export class ObjectEventManager {

  objects: Map<i32, PlainObject> = new Map()

  setListener(object: PlainObject, type: EventType): i32 {
    this.objects.set(object.id, object)
    // return callEngine_i_ii(SET_OBJECT_EVENT_LISTENER, object.id, type)[0].vi32
  }  

  onEvent(objectId: i32, type: i32): void {
    if (this.objects.has(objectId)) {
      const obj = this.objects.get(objectId)
      obj.onEvent(type)
    }
  }
}