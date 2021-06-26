import {
  Material,
  MeshPhysicalMaterial,
  Color,
} from "three"
import { TextureService } from "./TextureService"

export enum MaterialType {
  Unknown = 0,
  Standard = 1,
}

/**
 * Service to handle materials.
 */
export class MaterialService {

  nextMaterialId = 0
  materialMap = new Map<number, Material>()

  constructor(private textureService: TextureService) {}

  checkIfKnown(mat: Material) {
    let knownId = -1
    this.materialMap.forEach((v, k) => {
      if (v === mat) {
        knownId = k
      }
    })
    return knownId
  }

  private register(mat: Material) {
    const existingId = this.checkIfKnown(mat)
    if (existingId === -1) {
      const id = this.nextMaterialId
      this.materialMap.set(id, mat)
      this.nextMaterialId += 1
      return id
    } else {
      return existingId
    }
  }

  createMaterial(type: MaterialType) {
    if (type === MaterialType.Standard) {
      const m = new MeshPhysicalMaterial({ color: 0xffffff })
      return this.register(m)
    } else {
      throw new Error("Not supported material type" + type)
    }
  }

  getMaterialById(materialId: number) {
    const m = this.materialMap.get(materialId)
    if (m) {
      return m
    } else {
      throw new Error("Material not found. ID: " + materialId)
    }
  }

  getMaterialId(material: Material) {
    let id = -1
    this.materialMap.forEach((m, i) => {
      if (m === material) {
        id = i
      }
    })
    if (id === -1) {
      throw new Error("Unknown material")
    }
    return id
  }

  setColor(materialId: number, r: number, g: number, b: number, a: number) {
    const m = this.getMaterialById(materialId)
    if (m instanceof MeshPhysicalMaterial) {
      m.color = new Color(r, g, b)
      return [0]
    }
    return [1]
  }

  setColorMap(materialId: number, textureId: number) {
    const mat = this.getMaterialById(materialId)
    const tex = this.textureService.getTextureById(textureId)
    if (mat.type === "MeshPhysicalMaterial") {
      (mat as MeshPhysicalMaterial).map = tex
    }
  }
}