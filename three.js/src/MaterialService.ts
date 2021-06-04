import {
  Material,
  MeshPhysicalMaterial,
  Color,
} from "three"

/**
 * Service to handle materials.
 */
export class MaterialService {

  nextMaterialId = 0
  materialMap = new Map<number, Material>()

  getMaterial(materialId: number) {
    const m = this.materialMap.get(materialId)
    if (m) {
      return m
    } else {
      throw new Error("Material not found.")
    }
  }

  getMaterialId(material: Material) {
    let id = -1
    this.materialMap.forEach((m, i) => {
      if (m === material) {
        id = i
      }
    })
    return [id]
  }

  createMaterial() {
    const m = new MeshPhysicalMaterial({ color: 0xffffff })
    const id = this.nextMaterialId
    this.materialMap.set(id, m)
    this.nextMaterialId += 1
    return [id]
  }

  setColor(materialId: number, r: number, g: number, b: number, a: number) {
    const m = this.getMaterial(materialId)
    if (m instanceof MeshPhysicalMaterial) {
      m.color = new Color(r, g, b)
      return [0]
    }
    return [1]
  }
}