import { Texture, TextureLoader } from "three"
import { ResourceManager } from "../ResourceManager"

export class TextureService {
  nextTextureId = 0
  textureMap = new Map<number, Texture>()

  constructor(private resourceManagere: ResourceManager) {}

  checkIfKnown(tex: Texture) {
    let knownId = -1
    this.textureMap.forEach((v, k) => {
      if (v === tex) {
        knownId = k
      }
    })
    return knownId
  }

  private register(mat: Texture) {
    const existingId = this.checkIfKnown(mat)
    if (existingId === -1) {
      const id = this.nextTextureId
      this.textureMap.set(id, mat)
      this.nextTextureId += 1
      return id
    } else {
      return existingId
    }
  }

  getTextureById(textureId: number) {
    const t = this.textureMap.get(textureId)
    if (t) {
      return t
    } else {
      throw new Error("Material not found. ID: " + textureId)
    }
  }

  createTexture(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const texture = new TextureLoader().load(url)
    const id = this.register(texture)
    return id
  }
}