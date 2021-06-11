export const initialCode = `
import { MeshObject, Primitive, } from "sndbxr/objects/MeshObject"
import { Vector2 } from "sndbxr/Vector2"
import { Vector3 } from "sndbxr/Vector3"

const objects: MeshObject[] = [];
let speed: Vector2 = new Vector2(0, 0.6)
const g: f32 = 0.01
const mEarth: f32 = 1
const mSun: f32 = 100
let sunPos = new Vector2(1, 0)
let earthPos = new Vector2(3, 0)

const dt: f32 = 0.01
let sunR: f32 = 0
const sunDR: f32 = 0.0005

export function update(): void {
  const sun = objects[0]
  const earth = objects[1]
  const a = g * mSun * mEarth / sunPos.distanceToSquared(earthPos)
  const fn = sunPos.sub(earthPos).normalize()
  const av = fn.multiplyScalar(a as f32)
  earthPos = earthPos.add(speed.multiplyScalar(dt))
  earth.setPosition(new Vector3(earthPos.x, earthPos.y, 0))
  speed = speed.add(av.multiplyScalar(dt))
  sunPos = new Vector2(Math.cos(sunR) as f32, Math.sin(sunR) as f32)
  sun.setPosition(new Vector3(sunPos.x, sunPos.y, 0))
  sunR += sunDR
}

export function start(): void {
  const sun = MeshObject.createPrimitive(Primitive.Sphere)
  const earth = MeshObject.createPrimitive(Primitive.Sphere)
	sun.setPosition(new Vector3(sunPos.x, sunPos.y, 0))
	objects.push(sun)
	earth.setPosition(new Vector3(earthPos.x, earthPos.y, 0))
	earth.setScale(new Vector3(0.2, 0.2, 0.2))
	objects.push(earth)
}
`