import { gltfLoader } from "sndbxr/global"
import { log } from "sndbxr/debug"
import { Vector3 } from "sndbxr/Vector3"
import { Object } from "sndbxr/Object"

let loadedObj: Object | null = null
const objPos = new Vector3(0, 0, 0)
let t: f32 = 0
const dt: f32 = 0.01
export function update(): void {
  if (loadedObj) {
    objPos.setX(Math.sin(t) as f32)
    loadedObj!.setPosition(objPos)
    t += dt
  }
}

export function start(): i32 {
  const glbUrl = "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
  gltfLoader.load(glbUrl, (obj) => {
    loadedObj = obj
    log("glb loaded")
  })
  return 0
}