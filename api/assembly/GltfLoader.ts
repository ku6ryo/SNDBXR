import { Object } from "./Object"
import {
  LOAD_GLTF
} from "./function_ids"
import { eventManager } from "./global"
import { callEngine } from "./interface"
import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 

enum LoadStatus {
  SUCCESS = 0,
  ERROR_UNKNOWN = 10
}

/**
 * glTF loader
 */
export class GltfLoader {

  private callbacks: Map<i32, (status: i32, obj: Object | null) => void> = new Map()

  /**
   * Loads a glTF file as an Object asynchronously. 
   * @param id glTF file ID 
   * @param callback callback
   */
  load(id: string, callback: (status: i32, obj: Object | null) => void): void {
    const sizer = new Sizer()
    sizer.writeString(id)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeString(id)
    const rBuf = callEngine(LOAD_GLTF, buf)
    const decoder = new Decoder(rBuf)
    const sessionId = decoder.readInt32()
    this.callbacks.set(sessionId, callback)
  }

  /**
   * Callback on loading session completed. 
   * @param sessionId ID of a loading session. 
   * @param status Session status 
   * @param objectId ID of object. If object is not created, -1.
   */
  onComplete(sessionId: i32, status: i32, objectId: i32): void {
    if (this.callbacks.has(sessionId)) {
      const c = this.callbacks.get(sessionId)
      if (status === LoadStatus.SUCCESS) {
        const obj = new Object(objectId, eventManager)
        c.call(null, status, obj)
      } else {
        c.call(null, status, null)
      }
      this.callbacks.delete(sessionId)
    } else {
      throw new Error("No loader. id: " + sessionId.toString())
    }
  }
}