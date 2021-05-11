import {
  execIS,
  execIIV3,
} from "./env"
import {
    EventType,
} from "./EventType"
import { EventManager } from "./EventManager"
import { allocString } from "./memory"
import {
    GET_OBJECT_ID_BY_NAME,
    SET_OBJECT_POSITION,
} from "./exec"
import {
    logInt,
} from "./env"
import { eventManager } from "./global"

const OBJECT_NOT_FOUND_ID = -1

export function getObjectByName(name: string): Object | null {
    logInt(10);
  const ptr = allocString(name)
    logInt(11);
    logInt(ptr);
  const id = execIS(GET_OBJECT_ID_BY_NAME, ptr)
    logInt(12);
  heap.free(ptr)
    logInt(13);
  if (id === OBJECT_NOT_FOUND_ID) {
    return null
  } 
    logInt(14);
  return new Object(id, eventManager)
}

export class Object {
    id: i32
    eventManger: EventManager

    listeners: Map<EventType, () => void> = new Map()

    constructor(id: i32, eventManager: EventManager) {
        logInt(20);
        this.id = id
        logInt(21);
        this.eventManger = eventManager
        logInt(22);
    }

    setPosition(x: f32, y: f32, z: f32): i32 {
        return execIIV3(SET_OBJECT_POSITION, this.id, x, y, z)
    }

    listen(type: EventType, callback: () => void): i32 {
        this.listeners.set(type, callback)
        return this.eventManger.setListener(this, type)
    }
    
    onEvent(type: i32): void {
        if (this.listeners.has(type)) {
            const listener = this.listeners.get(type)
            listener()
        }
    }
}