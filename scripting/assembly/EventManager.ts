import { EventType, } from "./EventType"
import { Object, } from "./object"
import { setEventListener, } from "./env"

export class EventManager {

  objects: Map<i32, Object> = new Map()

  setListener(object: Object, type: EventType): void  {
    this.objects.set(object.id, object)
    setEventListener(object.id, type)
  }  

  onEvent(objectId: i32, type: i32): void {
    if (this.objects.has(objectId)) {
      const obj = this.objects.get(objectId)
      obj.onEvent(type)
    }
  }
}