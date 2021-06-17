import { PlainObject } from "./PlainObject";
import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 
import { callEngine } from "../interface";
import { CREATE_PRIMITIVE_OBJECT } from "../function_ids";
import { objectEventManager } from "../global";
import { ObjectType } from "./ObjectType";

/**
 * Types of primitives.
 */
export enum Primitive {
  Cube = 0,
  Sphere = 1,
}

export class MeshObject extends PlainObject {
  /**
   * Creates a primitive MeshObject. 
   * @param type Type of primitive
   * @returns Created object 
   */
  static createPrimitive(type: Primitive): MeshObject {
    const sizer = new Sizer()
    sizer.writeInt32(type)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(type)
    const res = callEngine(CREATE_PRIMITIVE_OBJECT, buf)
    const decoder = new Decoder(res)
    const id = decoder.readInt32()
    return new MeshObject(id, ObjectType.Mesh, objectEventManager)
  }
}