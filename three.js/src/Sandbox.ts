import {
  Group,
  Scene,
} from "three"
import { Sandbox as SandboxBase } from "./SandboxBase"
import { ObjectService } from "./ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  GET_OBJECT_POSITION,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
} from "./function_ids"

export class Sandbox extends SandboxBase {

  id: number
  objectService: ObjectService
  group: Group

  constructor(id: number, group: Group) {
    super()
    this.id = id
    this.group = group
    this.objectService = new ObjectService(group)

    this.callEngine_i_i_Map.set(CREATE_PRIMITIVE_OBJECT, this.objectService.createPrimitive.bind(this.objectService))
    this.callEngine_fff_i_Map.set(GET_OBJECT_POSITION, this.objectService.getObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_POSITION, this.objectService.setObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_SCALE, this.objectService.setObjectScale.bind(this.objectService))
  }

  getContainer(): Group {
    return this.group
  }
}