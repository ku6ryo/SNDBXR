import asc from "assemblyscript/cli/asc"
import path from "path"
import fs from "fs"
import util from "util"
import recursive from "recursive-readdir"

const apiModuleDir = "node_modules/sndbxr/assembly"
const mpModuleDir = "node_modules/@wapc/as-msgpack/assembly"
const apiDir = path.join(__dirname, "..", apiModuleDir)
const mpDir = path.join(__dirname, "..", mpModuleDir)
const readFile = util.promisify(fs.readFile)

export class CompileError extends Error {}
export class CompileProcessError extends Error {}

export interface ScriptFile {
  path: string
  content: Uint8Array
}

interface CompilerConfig {
  optimizationLevel?: number
  wat?: boolean
  wasm?: boolean
  sourceMap?: boolean
}

export class Compiler {

  entrypoint: string
  config: CompilerConfig
  scripts: ScriptFile[] = []
  wasm: Uint8Array | null = null
  wat: Uint8Array | null = null
  sourceMap: Uint8Array | null = null

  constructor(entrypoint: string, config: CompilerConfig) {
    this.entrypoint = entrypoint
    this.config = config
  }

  addScript(file: ScriptFile) {
    this.scripts.push(file)
  }

  async createInputFileMap () {
    const apiFiles = await recursive(apiDir)
    const apiSources = await Promise.all(apiFiles.map(f => {
      return readFile(f)
    }))
    const mpFiles = await recursive(mpDir)
    const mpSources = await Promise.all(mpFiles.map(f => {
      return readFile(f)
    }))
    const fileMap = {}
    apiFiles.forEach((f, i) => {
      fileMap[f.replace(path.join(__dirname, "../"), "")] = apiSources[i].toString()
    })
    mpFiles.forEach((f, i) => {
      fileMap[f.replace(path.join(__dirname, "../"), "")] = mpSources[i].toString()
    })
    const decoder = new TextDecoder()
    this.scripts.forEach((file) => {
      fileMap[file.path] = decoder.decode(file.content)
    })
    return fileMap
  }

  async compile(): Promise<void> {
    const fileMap = await this.createInputFileMap()
    const optimizationLevel = this.config.optimizationLevel
    const generateBinary = this.config.wasm === false ? false : true
    const generateText = !!this.config.wat
    const generateSourceMap = !!this.config.sourceMap
    const commandParts: string[] = [this.entrypoint]
    if (optimizationLevel) {
      commandParts.push(`-O${optimizationLevel}`)
    }
    if (generateBinary) {
      commandParts.push(`--binaryFile`)
      commandParts.push(`module.wasm`)
    }
    if (generateText) {
      commandParts.push(`--textFile`)
      commandParts.push(`module.wat`)
    }
    if (generateSourceMap) {
      commandParts.push(`--sourceMap`)
    }
    commandParts.push("--importMemory")

    return new Promise((resolve, reject) => {
      const stdout = asc.createMemoryStream();
      const stderr = asc.createMemoryStream();
      const writeFile = (name: string, data: Uint8Array) => {
        switch(name) {
          case "module.wasm":
            this.wasm = data
            break
          case "module.wat":
            this.wat = data
            break
          case "module.wasm.map":
            this.sourceMap = data
            break
          default:
            break
        }
      }
      asc.main(
        commandParts,
        {
          stdout,
          stderr,
          readFile: (name) => {
            return fileMap[name] || null
          },
          writeFile: writeFile.bind(this)
        },
        error => {
          const compileErrorMessage = stderr.toString()
          if (compileErrorMessage) {
            reject(new CompileError(compileErrorMessage))
            return 1
          }
          if (error) {
            reject(new CompileProcessError(error.message))
            return 1
          }
          resolve()
          return 0
        }
      )
    })
  }
}