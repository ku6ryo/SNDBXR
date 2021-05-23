import { callEngine_i_s } from "./gate"
import {
  LOAD_SKY
} from "./function_ids"

export class SkyManager {

  private callbacks: Map<i32, () => void> = new Map()

  load(url: string, callback: () => void): void {
    const loaderId = callEngine_i_s(LOAD_SKY, url)
    this.callbacks.set(loaderId, callback)
  }

  onLoaded(loaderId: i32): void {
    if (this.callbacks.has(loaderId)) {
      const c = this.callbacks.get(loaderId)
      c.call(null)
    }
  }
}