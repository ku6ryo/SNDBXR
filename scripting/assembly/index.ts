import { eventManager, gltfLoader, skyManager } from "./global"
import { log, SANDBOX_ON_OBJECT_EVENT, SANDBOX_ON_GLTF_LOADED, SANDBOX_ON_SKY_LOADED } from "./env"
import { createPrimitiveObject, Object, PrimitiveType, } from "./Object"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

let speed: Vector2 = new Vector2(0, 0.6)
const g: f32 = 0.01
const mEarth: f32 = 1
const mSun: f32 = 100
let sunPos = new Vector2(1, 0)
let earthPos = new Vector2(3, 0)

const dt: f32 = 0.01
let sunR: f32 = 0
const sunDR: f32 = 0.0005

let sun: Object | null = null
let earth: Object | null = null

export function update(): void {
  if (sun && earth) {
    const a = g * mSun * mEarth / sunPos.distanceToSquared(earthPos)
    const fn = sunPos.sub(earthPos).normalize()
    const av = fn.multiplyScalar(a as f32)
    earthPos = earthPos.add(speed.multiplyScalar(dt))
    earth!.setPosition(new Vector3(earthPos.x, sunPos.y, earthPos.y))
    speed = speed.add(av.multiplyScalar(dt))
    sunPos = new Vector2(Math.cos(sunR) as f32, Math.sin(sunR) as f32)
    sun!.setPosition(new Vector3(sunPos.x, sunPos.y, 0))
    sunR += sunDR
  }
}

export function start(): i32 {
  skyManager.load("https://cdn.eso.org/images/wallpaper2/eso0932a.jpg", () => {
    log("sky loaded")
  })
  const sunGlbUrl = "http://192.168.1.5:8080/assets/sun.glb"
  gltfLoader.load(sunGlbUrl, (obj) => {
    sun = obj
    sun!.setScale(new Vector3(0.5, 0.5, 0.5))
    log("sun loaded")
  })
  const earthGlbUrl = "http://192.168.1.5:8080/assets/earth.glb"
  gltfLoader.load(earthGlbUrl, (obj) => {
    earth = obj
    earth!.setPosition(new Vector3(earthPos.x, 0, earthPos.y))
    earth!.setScale(new Vector3(0.2, 0.2, 0.2))
    log("earth loaded")
  })
  return 0
}

// Please do not remove following.
export function sandboxExecV_I(funcId: i32, i0: i32): void {
  switch(funcId) {
    case SANDBOX_ON_SKY_LOADED:
      skyManager.onLoaded(i0)
  }
}

export function sandboxExecV_II(funcId: i32, i0: i32, i1: i32): void {
  switch(funcId) {
    case SANDBOX_ON_OBJECT_EVENT:
      eventManager.onEvent(i0, i1)
      break;
    case SANDBOX_ON_GLTF_LOADED:
      gltfLoader.onLoaded(i0, i1)
      break;
  }
}