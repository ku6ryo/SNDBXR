export class Vector3 {
  x: f32
  y: f32
  z: f32

  constructor(x: f32, y: f32, z: f32) {
    this.x = x
    this.y = y
    this.z = z
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  setX(x: f32): void {
    this.x = x
  }

  setY(y: f32): void {
    this.y = y
  }

  setZ(z: f32): void {
    this.z = z
  }

  lengthSquared(): f32 {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  length(): f32 {
    return Math.sqrt(this.lengthSquared()) as f32
  }

  distanceToSquared(v: Vector3): f32 {
    const clone = v.clone()
    return clone.sub(this).lengthSquared();
  }

  distanceTo(v: Vector3): f32 {
    return Math.sqrt(this.distanceToSquared(v)) as f32
  }

  add(v: Vector3): Vector3 {
    return new Vector3(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z
    )
  }

  addScalar(s: f32): Vector3 {
    return new Vector3(
      this.x + s,
      this.y + s,
      this.z + s
    )
  }

  sub(v: Vector3): Vector3 {
    return new Vector3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z
    )
  }

  subScalar(s: f32): Vector3 {
    return new Vector3(
      this.x - s,
      this.y - s,
      this.z - s
    )
  }

  multiply(v: Vector3): Vector3 {
    return new Vector3(
      this.x * v.x,
      this.y * v.y,
      this.z * v.z
    )
  }

  multiplyScalar(s: f32): Vector3 {
    return new Vector3(
      this.x * s,
      this.y * s,
      this.z * s
    )
  }

  devide(v: Vector3): Vector3 {
    return new Vector3(
      this.x / v.x,
      this.y / v.y,
      this.z / v.z
    )
  }

  devideScalar(s: f32): Vector3 {
    return new Vector3(
      this.x / s,
      this.y / s,
      this.z / s
    )
  }

  dot(v: Vector3): f32 {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  normalize(): Vector3 {
    const len = this.length()
    if (len === 0) {
      return this.clone()
    } else {
      return this.devideScalar(len)
    }
  }
}