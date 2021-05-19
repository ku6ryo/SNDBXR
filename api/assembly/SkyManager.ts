import { Object } from "./Object"
import { execI_S, LOAD_SKY } from "./env"
import { allocString } from "./memory"
import { eventManager } from "./global";

export class SkyManager {

  private callbacks: Map<i32, () => void> = new Map()

  load(url: string, callback: () => void): void {
    const ptr = allocString(url)
    const loaderId = execI_S(LOAD_SKY, ptr, url.length)
    this.callbacks.set(loaderId, callback)
  }

  onLoaded(loaderId: i32): void {
    if (this.callbacks.has(loaderId)) {
      const c = this.callbacks.get(loaderId)
      c.call(null)
    }
  }
}