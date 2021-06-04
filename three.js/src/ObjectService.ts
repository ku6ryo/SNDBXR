import {
  Mesh,
  Scene,
  SphereGeometry,
  MeshStandardMaterial,
  BoxGeometry,
  Group,
  MeshPhysicalMaterial,
  Material,
} from "three"
import { MaterialService } from "./MaterialService"

export enum Primitive {
  CUBE = 0,
  SPHERE = 1,
}

export class ObjectService {

  private materialService: MaterialService
  private nextObjectId = 0
  private objectMap = new Map<number, Mesh>()
  private container: Group

  /**
   * @param container Container to add objects in.
   * @param meterialService 
   */
  constructor(
    container: Group,
    meterialService: MaterialService
  ) {
    this.container = container
    this.materialService = meterialService
  }

  /**
   * Creates a primitive.
   * @param type Type of primitive
   * @returns Id of object.
   */
  createPrimitive(type: number) {
    let geometry = null
    if (type === Primitive.CUBE) {
      geometry = new BoxGeometry(1, 1)
    } else if (type === Primitive.SPHERE) {
      geometry = new SphereGeometry(0.5, 30, 30)
    }
    if (!geometry) {
      throw new Error("Unknown primitive")
    }
    const [materialId] = this.materialService.createMaterial()
    const material = this.materialService.getMaterial(materialId)
    const obj = new Mesh(geometry, material)
    this.container.add(obj)
    const id = this.nextObjectId
    this.objectMap.set(id, obj)
    this.nextObjectId += 1
    return [id]
  }

  getObject(objectId: number) {
    if (!this.objectMap.has(objectId)) {
      throw new Error("No object ID: " + objectId)
    } else {
      const object = this.objectMap.get(objectId)
      return object!
    }
  }

  setObjectPosition(objectId: number, x: number, y: number, z: number) {
    if (!this.objectMap.has(objectId)) {
      return [1]
    } else {
      const obj = this.objectMap.get(objectId)
      obj?.position.set(x, y, z)
      return [0]
    }
  }

  setObjectScale(objectId: number, x: number, y: number, z: number) {
    if (!this.objectMap.has(objectId)) {
      return [1]
    } else {
      const obj = this.objectMap.get(objectId)
      obj?.scale.set(x, y, z)
      return [0]
    }
  }

  getObjectPosition(objectId: number) {
    if (!this.objectMap.has(objectId)) {
      return [1]
    } else {
      const obj = this.objectMap.get(objectId)
      const pos = obj!.position
      return [pos.x, pos.y, pos.z]
    }
  }

  getMaterial(objectId: number) {
    const object = this.getObject(objectId)
    if (Array.isArray(object.material)) {
      return this.materialService.getMaterialId(object.material[0])
    } else {
      return this.materialService.getMaterialId(object.material)
    }
  }
}