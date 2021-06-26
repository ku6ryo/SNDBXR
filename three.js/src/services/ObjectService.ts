import {
  Mesh,
  SphereGeometry,
  BoxGeometry,
  Group,
  Object3D,
} from "three"
import { MaterialService, MaterialType } from "./MaterialService"

export enum Primitive {
  Cube = 0,
  Sphere = 1,
}

export class ObjectService {

  private materialService: MaterialService
  private nextObjectId = 0
  private objectMap = new Map<number, Object3D>()
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

  checkIfKnown(object: Object3D) {
    let knownId = -1
    this.objectMap.forEach((v, k) => {
      if (v === object) {
        knownId = k
      }
    })
    return knownId
  }

  registerObject(object: Object3D) {
    const existingId = this.checkIfKnown(object)
    if (existingId === -1) {
      const id = this.nextObjectId
      this.objectMap.set(id, object)
      this.nextObjectId += 1
      return id
    } else {
      return existingId
    }
  }

  /**
   * Creates a primitive.
   * @param type Type of primitive
   * @returns Id of object.
   */
  createPrimitive(type: Primitive) {
    let geometry = null
    if (type === Primitive.Cube) {
      geometry = new BoxGeometry(1, 1)
    } else if (type === Primitive.Sphere) {
      geometry = new SphereGeometry(0.5, 30, 30)
    }
    if (!geometry) {
      throw new Error("Unknown primitive")
    }
    const matId = this.materialService.createMaterial(MaterialType.Standard)
    const mat = this.materialService.getMaterialById(matId)
    const obj = new Mesh(geometry, mat)
    this.container.add(obj)
    const id = this.registerObject(obj)
    return id
  }

  getByName(name: string) {
    const obj = this.container.getObjectByName(name)
    if (obj) {
      const id = this.registerObject(obj)
      return id
    } else {
      return null
    }
  }

  getName(objectId: number) {
    const obj = this.getObject(objectId)
    return obj.name
  }

  setName(objectId: number, name: string) {
    const obj = this.getObject(objectId)
    obj.name = name
  }

  getObject(objectId: number) {
    if (!this.objectMap.has(objectId)) {
      throw new Error("No object ID: " + objectId)
    } else {
      const object = this.objectMap.get(objectId)
      return object!
    }
  }

  getPosition(objectId: number) {
    const obj = this.getObject(objectId)
    return obj.position
  }

  setPosition(objectId: number, x: number, y: number, z: number) {
    const obj = this.getObject(objectId)
    obj.position.set(x, y, z)
  }

  getScale(objectId: number) {
    const obj = this.getObject(objectId)
    return obj.scale
  }

  setScale(objectId: number, x: number, y: number, z: number) {
    const obj = this.getObject(objectId)
    obj.scale.set(x, y, z)
  }

  getMaterial(objectId: number) {
    const object = this.getObject(objectId)
    if (object instanceof Mesh) {
      if (Array.isArray(object.material)) {
        return this.materialService.getMaterialId(object.material[0])
      } else {
        return this.materialService.getMaterialId(object.material)
      }
    } else {
      return null
    }
  }

  setMaterial(objectId: number, materialId: number) {
    const obj = this.getObject(objectId)
    const mat = this.materialService.getMaterialById(materialId)  
    if (obj.type !== "Mesh") {
      throw new Error("Cannot set material to non mesh object")
    }
    (obj as Mesh).material = mat
  }
}