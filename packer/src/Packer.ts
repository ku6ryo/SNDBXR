import Zip from "jszip"
import { Compiler } from "./Compiler"

export interface UserFile {
  path: string
  content: Uint8Array
}

const RESOURCE_FILE_DIR = "resources"
const SCRIPT_WASM_FILE = "script.wasm"

/**
 * Package bundler.
 * Package is a zip file and structure is like the below.
 * - script.wasm
 * - resources
 *  - resource files ...
 */
export class Packer {
  #resourceFiles: UserFile[] = []
  #scriptFiles: UserFile[] = []
  #compiledScript: Uint8Array | null = null

  addResource(file: UserFile) {
    this.#resourceFiles.push(file)
  }

  addScript(file: UserFile) {
    this.#scriptFiles.push(file)
  }

  async compileScripts() {
    const compiler = new Compiler("index.ts", {})
    this.#scriptFiles.forEach(f => {
      compiler.addScript(f)
    })
    await compiler.compile()
    this.#compiledScript = compiler.wasm
  }

  async pack() {
    if (!this.#compiledScript) {
      throw new Error("Not compiled yet. Please compile first.")
    }
    const zipper = new Zip()
    const resourceFolder = zipper.folder(RESOURCE_FILE_DIR)
    this.#resourceFiles.forEach((f) => {
      resourceFolder.file(f.path, f.content)
    })
    zipper.file(SCRIPT_WASM_FILE, this.#compiledScript)
    return await zipper.generateAsync({
      type: "uint8array"
    })
  }
}