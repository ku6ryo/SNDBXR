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
  SET_OBJECT_QUATERNION,
} from "../function_ids"
import { Vector3 } from "../Vector3"
import { ObjectType } from "./ObjectType"
import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 
import { callEngine } from "../interface"
import { Quaternion } from "../Quaternion"

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
    sizer.writeFloat32(v.x)
    sizer.writeFloat32(v.y)
    sizer.writeFloat32(v.z)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeFloat32(v.x)
    encoder.writeFloat32(v.y)
    encoder.writeFloat32(v.z)
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
    sizer.writeFloat32(v.x)
    sizer.writeFloat32(v.y)
    sizer.writeFloat32(v.z)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeFloat32(v.x)
    encoder.writeFloat32(v.y)
    encoder.writeFloat32(v.z)
    callEngine(SET_OBJECT_SCALE, buf)
  }

  getQuaternion(): Quaternion {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    const res = callEngine(SET_OBJECT_QUATERNION, buf)
    const decoder = new Decoder(res)
    const x = decoder.readFloat32()
    const y = decoder.readFloat32()
    const z = decoder.readFloat32()
    const w = decoder.readFloat32()
    return new Quaternion(x, y, z, w)
  }

  setQuaternion(q: Quaternion): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeFloat32(q.x)
    sizer.writeFloat32(q.y)
    sizer.writeFloat32(q.z)
    sizer.writeFloat32(q.w)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeFloat32(q.x)
    encoder.writeFloat32(q.y)
    encoder.writeFloat32(q.z)
    encoder.writeFloat32(q.w)
    callEngine(SET_OBJECT_QUATERNION, buf)
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