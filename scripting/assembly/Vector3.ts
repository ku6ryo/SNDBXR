export class Vector3 {
  x: f32
  y: f32
  z: f32

  constructor(x: f32, y: f32, z: f32) {
    this.x = x
    this.y = y
    this.z = z
  }

  length(): f32 {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
}