import {
  Scene,
} from "three"
import Gate from "./Gate"
import { ObjectService } from "./ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
} from "./function_ids"

export class Sandbox extends Gate {

  id: number
  scene: Scene
  objectService: ObjectService

  callEngine_i_i_Map = new Map<number, (i0: number) => number>()
  callEngine_i_ifff_Map = new Map<number, (i0: number, f0: number, f1: number, f2: number) => number>()

  constructor(id: number, scene: Scene) {
    super()
    this.id = id
    this.scene = scene
    this.objectService = new ObjectService(scene)

    this.callEngine_i_i_Map.set(CREATE_PRIMITIVE_OBJECT, this.objectService.createPrimitive.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_POSITION, this.objectService.setObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_SCALE, this.objectService.setObjectScale.bind(this.objectService))
  }
  
  callEngine_i_ii(funcId: number, i0: number, i1: number) {
    const value = 1
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_i_i(funcId: number, i0: number) {
    const func = this.callEngine_i_i_Map.get(funcId)
    if (!func) {
      throw new Error("no function")
    }
    const value = func(i0)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  /*
  callEngine_i_s(funcId: number, ptr: number, len: number) {
  }
  */
  callEngine_i_ifff(funcId: number, i0: number, f0: number, f1: number, f2: number) {
    const func = this.callEngine_i_ifff_Map.get(funcId)
    if (!func) {
      throw new Error("no function")
    }
    const value = func(i0, f0, f1, f2)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  /*
  callEngine_i_iffff(funcId: number, i0: number, f0: number, f1: number, f2: number, f3: number) {
  }
  callEngine_fff_i(funcId: number, i0: number) {
  }
  */
}