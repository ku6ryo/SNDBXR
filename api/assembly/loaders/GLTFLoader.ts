import { objectEventManager } from "../global"
import { GroupObject } from "../objects/GroupObject"
import { ResourceLoader } from "./ResourceLoader"
import { ResourceType } from "./ResourceType"

/**
 * glTF loader
 */
export class GLTFLoader extends ResourceLoader {

  onLoadProvided: (obj: GroupObject) => void
  onProgressProvided: (loaded: i32, total: i32) => void
  onErrorProvided: (code: i32) => void

  constructor(
    filePath: string,
    onLoad: (obj: GroupObject) => void,
    onProgress: (loaded: i32, total: i32) => void,
    onError: (code: i32) => void
  ) {
    super(filePath, ResourceType.Gltf)
    this.onLoadProvided = onLoad
    this.onProgressProvided = onProgress
    this.onErrorProvided = onError
  }

  onError(code: i32): void {
    this.onErrorProvided(code)
  }

  onProgress(loaded: i32, total: i32): void {
    this.onProgressProvided(loaded, total)
  }

  onLoad(resourceId: i32): void {
    const obj = new GroupObject(resourceId, objectEventManager)
    this.onLoadProvided(obj)
  }
}