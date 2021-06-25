import { resourceLoaderManager } from "./ResourceLoaderManager"
import { ResourceType } from "./ResourceType"

export enum LoadError {
  ERROR_UNKNOWN = 1
}

/**
 * Resource loader
 */
export class ResourceLoader {

  filePath: string
  resourceType: ResourceType.Unknown

  constructor(
    filePath: string,
    type: i32
  ) {
    this.filePath = filePath
    this.resourceType = type
  }

  onProgress(loaded: i32, total: i32): void {}

  onLoad(resourceId: i32) {}

  onError(code: i32) {}

  /**
   * Loads a resource file as a resource asynchronously. 
   */
  load(): void {
    resourceLoaderManager.load(this)
  }
}