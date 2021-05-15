import { createPrimitiveObject, Object, PrimitiveType, } from "./Object";
import { eventManager } from "./global"

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
  const ball = createPrimitiveObject(PrimitiveType.SPHERE)
  if (ball) {
    ball.setPosition(0, y, 0)
    objects.push(ball)
  }
  return 0
}

export function onEvent (objectId: i32, type: i32): void {
  eventManager.onEvent(objectId, type)
}