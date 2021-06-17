import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 
import { callEngine } from "../interface";
import { PlainObject } from "./PlainObject";
import { GET_OBJECT_ID_BY_NAME } from "../function_ids";
import { objectEventManager } from "../global";

const OBJECT_NOT_FOUND_ID = -1

export class ObjectUtil {
  static getObjectByName(name: string): PlainObject | null {
    const sizer = new Sizer()
    sizer.writeString(name)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeString(name)
    const res = callEngine(GET_OBJECT_ID_BY_NAME, buf)
    const decoder = new Decoder(res)
    const id = decoder.readInt32()
    if (id === OBJECT_NOT_FOUND_ID) {
      return null
    }
    const type = decoder.readInt32()
    return new PlainObject(id, type, objectEventManager)
  }
}