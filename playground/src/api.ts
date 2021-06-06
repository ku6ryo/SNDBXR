import axios from "axios"
import { UploadedFile, UploadedFileType } from "./models/UploadedFile"

export class ApiClient {

  host: string

  constructor(host: string) {
    this.host = host
  }

  async compile(code: string) {
    const res = await fetch(this.host + "/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: code
    })
    if (res.status === 200) {
      return await res.json() as {
        id: string,
        wasm: {
          path: string,
          size: number
        },
        wat: {
          path: string,
          size: number
        }
      }
    } else {
      const json = await res.json()
      throw new Error(json.message)
    }
  }

  async uploadFile(file: File) {
    const params = new FormData()
    params.append("asset", file)
    const res = await axios.post<{
      id: string,
      name: string,
      path: string
    }>(this.host + "/api/upload", params)
    return {
      id: res.data.id,
      name: res.data.name,
      path: res.data.path,
      type: UploadedFileType.GLTF
    } as UploadedFile
  }
}