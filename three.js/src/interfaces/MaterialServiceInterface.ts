import { decodeMulti, encode } from "@msgpack/msgpack"
import { Sandbox } from "../Sandbox"
import { MaterialService } from "../services/MaterialService"
import {
  CREATE_MATERIAL,
  SET_MATERIAL_COLOR_MAP,
} from "./function_ids"

/**
 * Material related API interfaces.
 */
export class MaterialServiceInterface {

  constructor(
    private materialService: MaterialService,
  ) {}

  registerFuncs(sandbox: Sandbox) {
    sandbox.registerFunc(CREATE_MATERIAL, this.createMaterial.bind(this))
    sandbox.registerFunc(SET_MATERIAL_COLOR_MAP, this.setColorMap.bind(this))
  }

  createMaterial(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const type = decoded.next().value as number
    const id = this.materialService.createMaterial(type)
    return encode(id)
  }

  setColorMap(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const materialId = decoded.next().value as number
    const textureId = decoded.next().value as number
    this.materialService.setColorMap(materialId, textureId)
    return encode(0)
  }
}