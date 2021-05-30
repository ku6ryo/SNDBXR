import {
  Mesh,
  Scene,
  SphereGeometry,
  MeshStandardMaterial,
} from "three"
import {
  UNIT_SIZE
} from "./constants"

export class ObjectService {

  nextObjectId = 0
  objectMap = new Map<number, Mesh>()

  scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  createPrimitive(type: number) {
    const geometry = new SphereGeometry(UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
    const material = new MeshStandardMaterial({ color: 0xffffff });
    const obj = new Mesh(geometry, material);
    this.scene.add(obj)
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
      obj?.position.set(x * UNIT_SIZE, y * UNIT_SIZE, z * UNIT_SIZE)
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
}