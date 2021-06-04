import {
  Group,
} from "three"
import { Sandbox as SandboxBase } from "./SandboxBase"
import { ObjectService } from "./ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  GET_MATERIAL_OF_OBJECT,
  GET_OBJECT_POSITION,
  SET_MATERIAL_COLOR,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
} from "./function_ids"
import { MaterialService } from "./MaterialService"

export class Sandbox extends SandboxBase {

  id: number
  container: Group
  objectService: ObjectService
  materialService: MaterialService

  constructor(id: number, container: Group) {
    super()
    this.id = id
    this.container = container

    this.materialService = new MaterialService()
    this.objectService = new ObjectService(this.container, this.materialService)

    this.callEngine_i_i_Map.set(CREATE_PRIMITIVE_OBJECT, this.objectService.createPrimitive.bind(this.objectService))
    this.callEngine_i_i_Map.set(GET_MATERIAL_OF_OBJECT, this.objectService.getMaterial.bind(this.objectService))
    this.callEngine_fff_i_Map.set(GET_OBJECT_POSITION, this.objectService.getObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_POSITION, this.objectService.setObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_SCALE, this.objectService.setObjectScale.bind(this.objectService))
    this.callEngine_i_iffff_Map.set(SET_MATERIAL_COLOR, this.materialService.setColor.bind(this.materialService))
  }

  getContainer(): Group {
    return this.container
  }
}