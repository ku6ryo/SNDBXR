export enum AssetType {
  SCRIPT = "SCRIPT",
  GLTF = "GLTF"
}

export type Asset = {
  id: string
  type: AssetType
  name: string
}