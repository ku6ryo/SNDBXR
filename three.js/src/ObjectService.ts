import {
  Mesh,
  Scene,
  SphereGeometry,
  MeshStandardMaterial,
  BoxGeometry,
  Group,
} from "three"

export enum Primitive {
  CUBE = 0,
  SPHERE = 1,
}

export class ObjectService {

  nextObjectId = 0
  objectMap = new Map<number, Mesh>()

  group: Group

  constructor(scene: Group) {
    this.group = scene
  }

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
    const material = new MeshStandardMaterial({ color: 0xffffff })
    const obj = new Mesh(geometry, material)
    this.group.add(obj)
    const id = this.nextObjectId
    this.objectMap.set(id, obj)
    this.nextObjectId += 1
    return [id]
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
}