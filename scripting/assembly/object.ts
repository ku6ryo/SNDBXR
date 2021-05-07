import {
  getObjectId,
  setObjectPosition,
} from "./env"
import {
    EventType,
} from "./EventType"
import { EventManager } from "./EventManager"

export class Object {
    id: i32
    eventManger: EventManager

    listeners: Map<EventType, () => void> = new Map()

    constructor(id: i32, eventManager: EventManager) {
        this.id = id
        this.eventManger = eventManager
    }

    setPosition(x: f32, y: f32, z: f32): void {
        setObjectPosition(this.id, x, y, z)
    }

    listen(type: EventType, callback: () => void): i32 {
        this.listeners.set(type, callback)
        this.eventManger.setListener(this, type)
        return 0
    }
    
    onEvent(type: i32): void {
        if (this.listeners.has(type)) {
            const listener = this.listeners.get(type)
            listener()
        }
    }
}