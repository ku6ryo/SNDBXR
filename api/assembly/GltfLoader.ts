import { Object } from "./Object"
import {
  LOAD_GLTF
} from "./function_ids"
import { eventManager } from "./global";
import {
  callEngine_i_s
} from "./gate"

export class GltfLoader {

  private callbacks: Map<i32, (obj: Object) => void> = new Map()

  load(url: string, callback: (obj: Object) => void): void {
    const loaderId = callEngine_i_s(LOAD_GLTF, url)
    this.callbacks.set(loaderId, callback)
  }

  onLoaded(loaderId: i32, objectId: i32): void {
    if (this.callbacks.has(loaderId)) {
      const c = this.callbacks.get(loaderId)
      const obj = new Object(objectId, eventManager)
      c.call(null, obj)
      this.callbacks.delete(loaderId)
    }
  }
}