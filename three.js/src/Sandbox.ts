import {
  Scene,
} from "three"
import { Sandbox as SandboxBase } from "./SandboxBase"
import { ObjectService } from "./ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
} from "./function_ids"

export class Sandbox extends SandboxBase {

  id: number
  scene: Scene
  objectService: ObjectService

  constructor(id: number, scene: Scene) {
    super()
    this.id = id
    this.scene = scene
    this.objectService = new ObjectService(scene)

    this.callEngine_i_i_Map.set(CREATE_PRIMITIVE_OBJECT, this.objectService.createPrimitive.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_POSITION, this.objectService.setObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_SCALE, this.objectService.setObjectScale.bind(this.objectService))
  }
}