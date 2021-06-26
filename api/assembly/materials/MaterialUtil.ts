import { CREATE_MATERIAL } from "../function_ids"
import { callEngine } from "../interface"
import { Sizer, Encoder, Decoder } from "@wapc/as-msgpack"
import { Material } from "./Material"

export const MATERIAL_NOT_FOUND_ID = -1

export class MaterialUtil {
  static createMaterial(type: i32): i32 {
    const sizer = new Sizer()
    sizer.writeInt32(type)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(type)
    const res = callEngine(CREATE_MATERIAL, buf)
    const decoder = new Decoder(res)
    return decoder.readInt32()
  }
}