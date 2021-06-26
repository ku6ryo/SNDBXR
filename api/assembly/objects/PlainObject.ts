import {
  EventType,
} from "../EventType"
import { ObjectEventManager } from "./ObjectEventManager"
import {
  SET_OBJECT_POSITION,
  GET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
  GET_OBJECT_SCALE,
  GET_OBJECT_NAME,
  SET_OBJECT_NAME,
} from "../function_ids"
import { Vector3 } from "../Vector3"
import { ObjectType } from "./ObjectType"
import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 
import { callEngine } from "../interface"

/**
 * The base object class.
 * Every object class extends this class.
 */
export class PlainObject {
  id: i32
  type: ObjectType
  eventManger: ObjectEventManager

  listeners: Map<EventType, (obj: Object) => void> = new Map()

  constructor(
    id: i32,
    type: ObjectType,
    eventManager: ObjectEventManager
  ) {
    this.id = id
    this.type = type
    this.eventManger = eventManager
  }

  setName(name: string): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeString(name)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeString(name)
    callEngine(SET_OBJECT_NAME, buf)
  }

  getName(): string {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    const res = callEngine(GET_OBJECT_NAME, buf)
    const decoder = new Decoder(res)
    return decoder.readString()
  }

  getPosition(): Vector3 {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    const res = callEngine(GET_OBJECT_POSITION, buf)
    const decoder = new Decoder(res)
    const x = decoder.readFloat32()
    const y = decoder.readFloat32()
    const z = decoder.readFloat32()
    return new Vector3(x, y, z)
  }

  setPosition(v: Vector3): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeInt32(v.x)
    sizer.writeInt32(v.y)
    sizer.writeInt32(v.z)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeInt32(v.x)
    encoder.writeInt32(v.y)
    encoder.writeInt32(v.z)
    callEngine(SET_OBJECT_POSITION, buf)
  }

  getScale(): Vector3 {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    const res = callEngine(GET_OBJECT_SCALE, buf)
    const decoder = new Decoder(res)
    const x = decoder.readFloat32()
    const y = decoder.readFloat32()
    const z = decoder.readFloat32()
    return new Vector3(x, y, z)
  }

  setScale(v: Vector3): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeInt32(v.x)
    sizer.writeInt32(v.y)
    sizer.writeInt32(v.z)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeInt32(v.x)
    encoder.writeInt32(v.y)
    encoder.writeInt32(v.z)
    callEngine(SET_OBJECT_SCALE, buf)
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