
export enum UploadedFileType {
  WASM = "WASM",
  WAT = "WAT",
  GLTF = "GLTF"
}

export type UploadedFile = {
  id: string
  type: UploadedFileType
  name: string
  path: string
}