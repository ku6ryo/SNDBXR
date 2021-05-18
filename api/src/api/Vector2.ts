export class Vector2 {
  x: f32
  y: f32
  constructor(x: f32, y: f32) {
    this.x = x
    this.y = y
  }

  setX(x: f32): void {
    this.x = x
  }

  setY(y: f32): void {
    this.y = y
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  length(): f32 {
    return Math.sqrt(this.lengthSquared()) as f32
  }

  lengthSquared(): f32 {
    return (Math.pow(this.x, 2) + Math.pow(this.y, 2)) as f32
  }

  add(v: Vector2): Vector2 {
    return new Vector2(
      this.x + v.x,
      this.y + v.y
    )
  }

  addScalar(s: f32): Vector2 {
    return new Vector2(
      this.x + s,
      this.y + s
    )
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(
      this.x - v.x,
      this.y - v.y
    )
  }

  subScalar(s: f32): Vector2 {
    return new Vector2(
      this.x - s,
      this.y - s
    )
  }

  multiply(v: Vector2): Vector2 {
    return new Vector2(
      this.x * v.x,
      this.y * v.y
    )
  }

  multiplyScalar(s: f32): Vector2 {
    return new Vector2(
      this.x * s,
      this.y * s
    )
  }

  devide (v: Vector2): Vector2 {
    return new Vector2(
      this.x / v.x,
      this.y / v.y
    )
  }

  devideScalar(s: f32): Vector2 {
    return new Vector2(
      this.x / s,
      this.y / s
    )
  }

  normalize(): Vector2 {
    const len = this.length()
    if (len === 0) {
      return this.clone()
    }
    return this.devideScalar(len)
  }

  distanceTo(v: Vector2): f32 {
    return Math.sqrt(this.distanceToSquared(v))
  }

  distanceToSquared(v: Vector2): f32 {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return (Math.pow(dx, 2) + Math.pow(dy, 2)) as f32
  }

  dot(v: Vector2): f32 {
    return this.x * v.x + this.y * v.y
  }

  cross(v: Vector2): f32 {
    return this.x * v.y - this.y * v.x
  }
}