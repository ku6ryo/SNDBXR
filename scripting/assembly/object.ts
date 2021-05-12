import {
    EventType,
} from "./EventType"
import { EventManager } from "./EventManager"
import { allocString } from "./memory"
import {
  GET_OBJECT_ID_BY_NAME,
  SET_OBJECT_POSITION,
  GET_OBJECT_POSITION,
  GET_MATERIAL_OF_OBJECT,
  execI_I,
  execI_S,
  execI_IV3,
  execV3_I,
  logFloat,
} from "./env"
import { Material } from "./Material"
import { eventManager } from "./global"
import { Vector3 } from "./Vector3"

const OBJECT_NOT_FOUND_ID = -1

export function getObjectByName(name: string): Object | null {
  const ptr = allocString(name)
  const id = execI_S(GET_OBJECT_ID_BY_NAME, ptr, name.length)
  heap.free(ptr)
  if (id === OBJECT_NOT_FOUND_ID) {
    return null
  } 
  return new Object(id, eventManager)
}

export class Object {
    id: i32
    eventManger: EventManager

    listeners: Map<EventType, (obj: Object) => void> = new Map()

    constructor(id: i32, eventManager: EventManager) {
        this.id = id
        this.eventManger = eventManager
    }

    getPosition(): Vector3 {
      const ptr = execV3_I(GET_OBJECT_POSITION, this.id);
      const x = load<f32>(ptr)
      const y = load<f32>(ptr, 4)
      const z = load<f32>(ptr, 8)
      return new Vector3(x, y, z)
    }

    setPosition(x: f32, y: f32, z: f32): i32 {
      return execI_IV3(SET_OBJECT_POSITION, this.id, x, y, z)
    }

    getMaterial(): Material | null {
        const id = execI_I(GET_MATERIAL_OF_OBJECT, this.id)
        if (id === -1) {
          return null
        }
        return new Material(id)
    }

    listen(type: EventType, callback: (obj: Object) => void): i32 {
        this.listeners.set(type, callback)
        return this.eventManger.setListener(this, type)
    }
    
    onEvent(type: i32): void {
        if (this.listeners.has(type)) {
            const listener = this.listeners.get(type)
            listener(this)
        }
    }
}