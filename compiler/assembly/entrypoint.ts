import { eventManager, gltfLoader, skyManager } from "sndbxr/global"
import { SANDBOX_ON_OBJECT_EVENT, SANDBOX_ON_GLTF_LOADED, SANDBOX_ON_SKY_LOADED } from "sndbxr/env"
import { start as userStart, update as userUpdate } from "./userScript"


export function start(): i32 {
  userStart()
  return 0
}

export function update(): void {
  userUpdate()
}

export function sandboxExecV_I(funcId: i32, i0: i32): void {
  switch(funcId) {
    case SANDBOX_ON_SKY_LOADED:
      skyManager.onLoaded(i0)
      break
  }
}

export function sandboxExecV_II(funcId: i32, i0: i32, i1: i32): void {
  switch(funcId) {
    case SANDBOX_ON_OBJECT_EVENT:
      eventManager.onEvent(i0, i1)
      break
    case SANDBOX_ON_GLTF_LOADED:
      gltfLoader.onLoaded(i0, i1)
      break
  }
}