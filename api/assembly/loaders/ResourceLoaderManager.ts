import { Decoder, Encoder, Sizer } from "@wapc/as-msgpack"
import { callEngine, registerCallSandboxFunc } from "../interface"
import { ResourceLoader } from "./ResourceLoader"
import { LOAD_GLTF, LOAD_GLTF_ON_COMPLETE, LOAD_GLTF_ON_PROGRESS } from "../function_ids"

const SUCCESS_STATUS = 0

class ResourceLoaderManager {

  private static instanceCreated: boolean = false
  private loaderMap: Map<i32, ResourceLoader> = new Map<i32, ResourceLoader>()

  constructor() {
    if (ResourceLoaderManager.instanceCreated) {
      throw new Error("Already created")
    }
  }

  load(loader: ResourceLoader): void {
    const sizer = new Sizer()
    sizer.writeString(loader.filePath)
    sizer.writeInt32(loader.resourceType)
    const buf = new ArrayBuffer(sizer.length)
    const encoder = new Encoder(buf)
    encoder.writeString(loader.filePath)
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
  onComplete(sessionId: i32, status: i32, resourceId: i32): void {
    if (this.loaderMap.has(sessionId)) {
      const loader = this.loaderMap.get(sessionId)
      if (status === SUCCESS_STATUS) {
        loader.onLoad(resourceId)
      } else {
        loader.onError(status)
      }
      this.loaderMap.delete(sessionId)
    } else {
      throw new Error("No session: " + sessionId.toString())
    }
  }
}

export const resourceLoaderManager = new ResourceLoaderManager()

function onComplete(buf: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(buf)
  const sessionId = decoder.readInt32()
  const status = decoder.readInt32()
  const resourceId = decoder.readInt32()
  resourceLoaderManager.onComplete(sessionId, status, resourceId)
  return (new Uint8Array(0)).buffer
}
function onProgress(buf: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(buf)
  const sessionId = decoder.readInt32()
  const loaded = decoder.readInt32()
  const total = decoder.readInt32()
  resourceLoaderManager.onProgress(sessionId, loaded, total)
  return (new Uint8Array(0)).buffer
}

registerCallSandboxFunc(LOAD_GLTF_ON_COMPLETE, onComplete)
registerCallSandboxFunc(LOAD_GLTF_ON_PROGRESS, onProgress)