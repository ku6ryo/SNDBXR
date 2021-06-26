import { Vector3 } from "./Vector3"

export class Quaternion {
  /**
   * @param v  Vector of an axis
   * @param angle Rotation around the axis in radian
   */
  static fromAxisAngle(v: Vector3, angle: f32): Quaternion {
    const halfAngle = angle / 2
    const sin = Mathf.sin(halfAngle)
    const n = v.normalize()
    return new Quaternion(n.x * sin , n.y * sin, n.z * sin, Mathf.cos(halfAngle))
  }

  x: f32
  y: f32
  z: f32
  w: f32
  constructor(x: f32, y: f32, z: f32, w: f32) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
}