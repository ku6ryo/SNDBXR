import { createPrimitiveObject, Object, PrimitiveType, } from "./Object"
import { eventManager } from "./global"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

const planets = 10
const objects: Object[] = []
const positions: Vector2[] = []
const velocities: Vector2[] = []
const g: f32 = 0.01
const mEarth: f32 = 1
const mSun: f32 = 100
const sunPos = new Vector2(0, 0)

const dt: f32 = 0.01

export function update(): void {
  for (let i = 0; i < planets; i++) {
    const pos = positions[i]
    const velocity = velocities[i]
    const planet = objects[i]
    const a = g * mSun * mEarth / sunPos.distanceToSquared(pos)
    const fn = sunPos.sub(pos).normalize()
    const av = fn.multiplyScalar(a as f32)
    const newPos = pos.add(velocity.multiplyScalar(dt))
    planet.setPosition(new Vector3(newPos.x, newPos.y, 0))
    velocities[i] = velocity.add(av.multiplyScalar(dt))
    positions[i] = newPos
  }
}

export function start(): i32 {
  const sun = createPrimitiveObject(PrimitiveType.SPHERE)
  if (sun) {
    sun.setPosition(new Vector3(sunPos.x, sunPos.y, 0))
  }
  for (let i = 0; i < planets; i++) {
    const planet = createPrimitiveObject(PrimitiveType.SPHERE)
    if (planet) {
      const size = 0.2 + 0.05 * i
      const pos = new Vector2(2 + 0.5 * (i as f32), 0)
      const velocity = new Vector2(0, 0.6)
      planet.setPosition(new Vector3(pos.x, pos.y, 0))
      planet.setScale(new Vector3(size as f32, size as f32, size as f32))
      objects.push(planet)
      positions.push(pos)
      velocities.push(velocity)
    }
  }
  return 0
}

export function onEvent (objectId: i32, type: i32): void {
  eventManager.onEvent(objectId, type)
}