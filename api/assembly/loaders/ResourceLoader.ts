import { resourceLoaderManager } from "./ResourceLoaderManager"
import { ResourceType } from "./ResourceType"

export enum ResourceLoadError {
  ERROR_UNKNOWN = 1
}

/**
 * Resource loader
 */
export class ResourceLoader {

  filePath: string
  resourceType: i32

  constructor(
    filePath: string,
    type: i32
  ) {
    this.filePath = filePath
    this.resourceType = type
  }

  onProgress(loaded: i32, total: i32): void {}

  onLoad(resourceId: i32): void {}

  onError(code: i32): void {}

  /**
   * Loads a resource file as a resource asynchronously. 
   */
  load(): void {
    resourceLoaderManager.load(this)
  }
}