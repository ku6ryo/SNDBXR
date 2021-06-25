import { Texture } from "../Texture"
import { ResourceLoader, LoadError } from "./ResourceLoader"
import { ResourceType } from "./ResourceType"

/**
 * Texture loader
 */
export class TextureLoader extends ResourceLoader {

  onLoadProvided: (texture: Texture) => void
  onProgressProvided: (loaded: i32, total: i32) => void
  onErrorProvided: (code: i32) => void

  constructor(
    filePath: string,
    onLoad: (texture: Texture) => void,
    onProgress: (loaded: i32, total: i32) => void,
    onError: (error: LoadError) => void
  ) {
    super(filePath, ResourceType.Texture)
    this.onLoadProvided = onLoad
    this.onProgressProvided = onProgress
    this.onErrorProvided = onError
  }

  onLoad(resourceId: i32) {
    const obj = new Texture(resourceId)
    this.onLoadProvided(obj)
  }
}