import { Object } from "./Object"
import { execI_S, LOAD_GLTF, logInt } from "./env"
import { allocString } from "./memory"
import { eventManager } from "./global";

export class GltfLoader {

  private callbacks: Map<i32, (obj: Object) => void> = new Map()

  load(url: string, callback: (obj: Object) => void): void {
    const ptr = allocString(url)
    const loaderId = execI_S(LOAD_GLTF, ptr, url.length)
    this.callbacks.set(loaderId, callback)
  }

  onLoaded(loaderId: i32, objectId: i32): void {
    logInt(loaderId)
    if (this.callbacks.has(loaderId)) {
      const c = this.callbacks.get(loaderId)
      const obj = new Object(objectId, eventManager)
      c.call(null, obj)
    }
  }
}