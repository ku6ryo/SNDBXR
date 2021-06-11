import {
  EventType,
} from "../EventType"
import { ObjectEventManager } from "./ObjectEventManager"
import {
  SET_OBJECT_POSITION,
  GET_OBJECT_POSITION,
  GET_MATERIAL_OF_OBJECT,
  SET_OBJECT_SCALE,
  GET_OBJECT_SCALE,
} from "../function_ids"
import {
  callEngine_i_i,
  callEngine_i_ifff,
  callEngine_fff_i,
} from "../gate"
import { Material } from "../Material"
import { Vector3 } from "../Vector3"

export class BaseObject {
  id: i32
  eventManger: ObjectEventManager

  listeners: Map<EventType, (obj: Object) => void> = new Map()

  constructor(id: i32, eventManager: ObjectEventManager) {
    this.id = id
    this.eventManger = eventManager
  }

  getPosition(): Vector3 {
    const values = callEngine_fff_i(GET_OBJECT_POSITION, this.id)
    return new Vector3(values[0].vf32, values[1].vf32, values[2].vf32)
  }

  setPosition(v: Vector3): i32 {
    return callEngine_i_ifff(SET_OBJECT_POSITION, this.id, v.x, v.y, v.z)[0].vi32
  }

  getScale(v: Vector3): Vector3 {
    const values = callEngine_fff_i(GET_OBJECT_SCALE, this.id)
    return new Vector3(values[0].vf32, values[1].vf32, values[2].vf32)
  }

  setScale(v: Vector3): i32 {
    return callEngine_i_ifff(SET_OBJECT_SCALE, this.id, v.x, v.y, v.z)[0].vi32
  }

  getMaterial(): Material | null {
    const id = callEngine_i_i(GET_MATERIAL_OF_OBJECT, this.id)[0].vi32
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