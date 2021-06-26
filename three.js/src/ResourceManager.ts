import { ZipEntry } from "unzipit"

const RESOURCE_FOOLDER_NAME = "resources"

/**
 * Resource manager. Currently jsut a wrapper of unzipit.
 */
export class ResourceManager {

  constructor(private resources: { [name: string]: ZipEntry }) {}

  private getResources() {
    return this.resources
  }

  private getRaw(path: string) {
    const fullPath = RESOURCE_FOOLDER_NAME + "/" + path
    const resources = this.getResources()
    if (resources[fullPath]) {
      return resources[fullPath]
    } else {
      throw new Error("No entry with name: " + path)
    }
  }

  async get(path: string) {
    return await this.getRaw(path).arrayBuffer()
  }

  async getAsBlob(path: string) {
    return await this.getRaw(path).blob()
  }
}