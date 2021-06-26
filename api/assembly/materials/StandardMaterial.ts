import { Material } from "./Material"
import { Color } from "../Color"
import {
  SET_MATERIAL_COLOR, SET_MATERIAL_COLOR_MAP,
} from "../function_ids"
import { MaterialType } from "./MaterialType"
import { Texture } from "../Texture"
import { callEngine } from "../interface"
import { Sizer, Encoder } from "@wapc/as-msgpack"

export class StandardMaterial extends Material {
  constructor(id: i32) {
    super(id, MaterialType.Standard)
  }

  setColor(color: Color): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeFloat32(color.r)
    sizer.writeFloat32(color.g)
    sizer.writeFloat32(color.b)
    sizer.writeFloat32(color.a)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeFloat32(color.r)
    encoder.writeFloat32(color.g)
    encoder.writeFloat32(color.b)
    encoder.writeFloat32(color.a)
    callEngine(SET_MATERIAL_COLOR, buf)
  }

  setColorMap(texture: Texture): void {
    const sizer = new Sizer()
    sizer.writeInt32(this.id)
    sizer.writeInt32(texture.id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeInt32(this.id)
    encoder.writeInt32(texture.id)
    callEngine(SET_MATERIAL_COLOR_MAP, buf)
  }
}