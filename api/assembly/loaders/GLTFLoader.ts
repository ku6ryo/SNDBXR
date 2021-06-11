import { GroupObject } from "../objects/GroupObject"
import { gltfLoaderManager } from "./GLTFLoaderManager"

export enum LoadError {
  ERROR_UNKNOWN = 1
}

/**
 * glTF loader
 */
export class GLTFLoader {

  fileId: string
  onLoad: (obj: GroupObject) => void
  onProgress: (loaded: i32, total: i32) => void
  onError: (error: LoadError) => void

  constructor(
    fileId: string,
    onLoad: (obj: GroupObject) => void,
    onProgress: (loaded: i32, total: i32) => void,
    onError: (error: LoadError) => void
  ) {
    this.fileId = fileId
    this.onLoad = onLoad
    this.onError = onError
    this.onProgress = onProgress
  }

  /**
   * Loads a glTF file as an Object asynchronously. 
   */
  load(): void {
    gltfLoaderManager.load(this)
  }
}