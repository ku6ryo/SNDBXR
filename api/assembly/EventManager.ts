import { EventType, } from "./EventType"
import { Object, } from "./Object"
import {
  callEngine_i_ii
} from "./gate"
import {
  SET_OBJECT_EVENT_LISTENER,
} from "./function_ids"

export class EventManager {

  objects: Map<i32, Object> = new Map()

  setListener(object: Object, type: EventType): i32  {
    this.objects.set(object.id, object)
    return callEngine_i_ii(SET_OBJECT_EVENT_LISTENER, object.id, type)[0].vi32
  }  

  onEvent(objectId: i32, type: i32): void {
    if (this.objects.has(objectId)) {
      const obj = this.objects.get(objectId)
      obj.onEvent(type)
    }
  }
}