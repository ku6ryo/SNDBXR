export class Vector2 {
  x: f32
  y: f32
  constructor(x: f32, y: f32) {
    this.x = x
    this.y = y
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  length(): f32 {
    return Math.sqrt(this.lengthSquared())
  }

  lengthSquared(): f32 {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2)
  }

  add(v: Vector2): Vector2 {
    this.x += v.x
    this.y += v.y
    return this
  }

  addScalar(s: f32): Vector2 {
    this.x += s
    this.y += s
    return this
  }

  sub(v: Vector2): Vector2 {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  subScalar(s: f32): Vector2 {
    this.x -= s
    this.y -= s
    return this
  }

  multiply(v: Vector2): Vector2 {
    this.x *= v.x
    this.y *= v.y
    return this
  }

  multiplyScalar(s: f32): Vector2 {
    this.x *= s
    this.y *= s
    return this
  }

  devide (v: Vector2): Vector2 {
    this.x *= v.x
    this.y *= v.y
    return this
  }

  devideScalar(s: f32): Vector2 {
    this.x /= s
    this.y /= s
    return this
  }

  normalize(): Vector2 {
    const len = this.length()
    if (len === 0) {
      return this
    }
    return this.devideScalar(len)
  }

  distanceTo(v: Vector2): f32 {
    return Math.sqrt(this.distanceToSquared(v))
  }

  distanceToSquared(v: Vector2): f32 {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.pow(dx, 2) + Math.pow(dy, 2)
  }

  dot(v: Vector2): f32 {
    return this.x * v.x + this.y * v.y
  }

  cross(v: Vector2): f32 {
    return this.x * v.y - this.y * v.x
  }
}