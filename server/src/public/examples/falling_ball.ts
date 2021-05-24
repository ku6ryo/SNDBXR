import { createPrimitive, Object, PrimitiveType, } from "sndbxr/Object";

const objects: Object[] = [];

const g: f32 = -1
const dt: f32 = 0.01
let y: f32 = 5
let v: f32 = 0
export function update(): void {
  y += v * dt + 1 / 2 * g * dt * dt
  v = v + g * dt
  const ball = objects[0]
  ball.setPosition(0, y, 0)
}

export function start(): i32 {
  const ball = createPrimitive(PrimitiveType.SPHERE)
  ball.setPosition(0, y, 0)
  objects.push(ball)
  return 0
}