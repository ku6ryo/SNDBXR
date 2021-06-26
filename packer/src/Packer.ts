import path from "path"
import Zip from "jszip"
import { Compiler } from "./Compiler"

export interface UserFile {
  path: string
  content: Uint8Array
}

const ASSET_FILE_DIR = "files"
const SCRIPT_WASM_FILE = "script.wasm"

export class Packer {
  #assetFiles: UserFile[] = []
  #scriptFiles: UserFile[] = []
  #compiledScript: Uint8Array | null = null

  addAssetFile(file: UserFile) {
    this.#assetFiles.push(file)
  }

  addScriptFile(file: UserFile) {
    this.#scriptFiles.push(file)
  }

  async compileScripts() {
    const compiler = new Compiler("index.ts", 3)
    await compiler.compile()
    this.#compiledScript = compiler.wasm
  }

  async pack() {
    if (!this.#compiledScript) {
      throw new Error("Not compiled yet. Please compile first.")
    }
    const zipper = new Zip()
    zipper.folder(ASSET_FILE_DIR)
    this.#assetFiles.forEach((f) => {
      zipper.file(path.join(ASSET_FILE_DIR, f.path), f.content)
    })
    zipper.file(SCRIPT_WASM_FILE, this.#compiledScript)
    return await zipper.generateAsync({
      type: "uint8array"
    })
  }
}