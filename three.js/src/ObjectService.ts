import {
  Mesh,
  SphereGeometry,
  BoxGeometry,
  Group,
  Object3D,
} from "three"
import { MaterialService } from "./MaterialService"
import { decode, decodeMulti, encode } from "@msgpack/msgpack"

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
  createPrimitive(ua: Uint8Array) {
    const type = decode(ua) as number
    let geometry = null
    if (type === Primitive.Cube) {
      geometry = new BoxGeometry(1, 1)
    } else if (type === Primitive.Sphere) {
      geometry = new SphereGeometry(0.5, 30, 30)
    }
    if (!geometry) {
      throw new Error("Unknown primitive")
    }
    const [materialId] = this.materialService.createMaterial()
    const material = this.materialService.getMaterial(materialId)
    const obj = new Mesh(geometry, material)
    this.container.add(obj)
    const id = this.registerObject(obj)
    return encode(id)
  }

  getObjectByName(ua: Uint8Array) {
    const name = decode(ua) as string
    const obj = this.container.getObjectByName(name)
    if (obj) {
      const id = this.registerObject(obj)
      return encode([id, 0]).subarray(1)
    } else {
      return encode([-1, 0]).subarray(1)
    }
  }

  getObjectName(ua: Uint8Array) {
    const objectId = decode(ua) as number
    const obj = this.getObject(objectId)
    return encode(obj.name)
  }

  setObjectName(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const name = decoded.next().value as string
    const obj = this.getObject(objectId)
    obj.name = name
    return encode(0)
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
    if (object instanceof Mesh) {
      if (Array.isArray(object.material)) {
        return this.materialService.getMaterialId(object.material[0])
      } else {
        return this.materialService.getMaterialId(object.material)
      }
    } else {
      return [-1]
    }
  }
}