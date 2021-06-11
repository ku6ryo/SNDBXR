import { Decoder, Encoder, Sizer } from "@wapc/as-msgpack";
import { callEngine } from "../interface";
import { GLTFLoader } from "./GLTFLoader";
import { LOAD_GLTF } from "../function_ids"
import { objectEventManager } from "../global"
import { GroupObject } from "../objects/GroupObject";

enum CompleteStatus {
  SUCCESS = 0
}

class GLTFLoaderManager {

  loaderMap = new Map<i32, GLTFLoader>()

  load(loader: GLTFLoader) {
    const sizer = new Sizer()
    sizer.writeString(loader.fileId)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeString(loader.fileId)
    const rBuf = callEngine(LOAD_GLTF, buf)
    const decoder = new Decoder(rBuf)
    const sessionId = decoder.readInt32()
    this.loaderMap.set(sessionId, loader)
  }

  onProgress(sessionId: i32, loaded: i32, total: i32): void {
    if (this.loaderMap.has(sessionId)) {
      const loader = this.loaderMap.get(sessionId)
      loader.onProgress(loaded, total)
    } else {
      throw new Error("No session: " + sessionId.toString())
    }
  }

  /**
   * Callback on loading session completed. 
   * @param sessionId ID of a loading session. 
   * @param status Session status 
   * @param objectId ID of object. If object is not created, -1.
   */
  onComplete(sessionId: i32, status: i32, objectId: i32): void {
    if (this.loaderMap.has(sessionId)) {
      const loader = this.loaderMap.get(sessionId)
      if (status === CompleteStatus.SUCCESS) {
        const obj = new GroupObject(objectId, objectEventManager)
        loader.onLoad(obj)
      } else {
        loader.onError(status)
      }
      this.loaderMap.delete(sessionId)
    } else {
      throw new Error("No session: " + sessionId.toString())
    }
  }
}

export const gltfLoaderManager = new GLTFLoaderManager()