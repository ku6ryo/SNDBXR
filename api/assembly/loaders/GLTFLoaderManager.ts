import { Decoder, Encoder, Sizer } from "@wapc/as-msgpack";
import { callEngine, registerCallSandboxFunc } from "../interface";
import { GLTFLoader } from "./GLTFLoader";
import { LOAD_GLTF, LOAD_GLTF_ON_COMPLETE, LOAD_GLTF_ON_PROGRESS } from "../function_ids"
import { objectEventManager } from "../global"
import { GroupObject } from "../objects/GroupObject";

const SUCCESS_STATUS = 0

class GLTFLoaderManager {

  private static instanceCreated: boolean = false
  private loaderMap: Map<i32, GLTFLoader> = new Map<i32, GLTFLoader>()

  constructor() {
    if (GLTFLoaderManager.instanceCreated) {
      throw new Error("Already created")
    }
  }

  load(loader: GLTFLoader): void {
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
      if (status === SUCCESS_STATUS) {
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

function onComplete(buf: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(buf)
  const sessionId = decoder.readInt32()
  const status = decoder.readInt32()
  const objectId = decoder.readInt32()
  gltfLoaderManager.onComplete(sessionId, status, objectId)
  return (new Uint8Array(0)).buffer
}
function onProgress(buf: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(buf)
  const sessionId = decoder.readInt32()
  const loaded = decoder.readInt32()
  const total = decoder.readInt32()
  gltfLoaderManager.onProgress(sessionId, loaded, total)
  return (new Uint8Array(0)).buffer
}

registerCallSandboxFunc(LOAD_GLTF_ON_COMPLETE, onComplete)
registerCallSandboxFunc(LOAD_GLTF_ON_PROGRESS, onProgress)