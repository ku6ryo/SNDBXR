import asc from "assemblyscript/cli/asc"
import path from "path"
import fs from "fs"
import util from "util"
import recursive from "recursive-readdir"

const apiUserDir = "node_modules/sndbxr/assembly"
const apiModuleDir = "node_modules/sndbxr-wasm-api/assembly"
const mpModuleDir = "node_modules/@wapc/as-msgpack/assembly"
const apiDir = path.join(__dirname, "..", apiModuleDir)
const mpDir = path.join(__dirname, "..", mpModuleDir)
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const recursiveReaddir = util.promisify(recursive)

export async function createFileSourceMap (userScript: string) {
  const apiFiles = await recursive(apiDir)
  const apiSources = await Promise.all(apiFiles.map(f => {
    return readFile(f)
  }))
  const mpFiles = await recursiveReaddir(mpDir)
  const mpSources = await Promise.all(mpFiles.map(f => {
    return readFile(f)
  }))
  const sourceMap = {}
  apiFiles.forEach((f, i) => {
    sourceMap[f.replace(path.join(__dirname, "../"), "").replace("sndbxr-wasm-api", "sndbxr")] = apiSources[i].toString()
  })
  mpFiles.forEach((f, i) => {
    sourceMap[f.replace(path.join(__dirname, "../"), "")] = mpSources[i].toString()
  })
  const indexSourceBuf = await readFile(path.join(__dirname, "../assembly/entrypoint.ts"))
  sourceMap["userScript.ts"] = userScript
  sourceMap["index.ts"] = indexSourceBuf.toString()
  Object.keys(sourceMap).forEach(f => console.log(f))
  return sourceMap
}

export class CompileError extends Error {}
export class CompileProcessError extends Error {}

type CompileResult = {
  wasm: Uint8Array,
  wat: Uint8Array,
  sourceMap: Uint8Array,
}

export function compile(fileSourceMap): Promise<CompileResult> {
  let wasm: Uint8Array | null = null
  let wat: Uint8Array | null = null
  let sourceMap: Uint8Array | null = null
  return new Promise((resolve, reject) => {
    const stdout = asc.createMemoryStream();
    const stderr = asc.createMemoryStream();
    asc.main([
      "index.ts",
      "-O3",
      "--binaryFile", "module.wasm",
      "--textFile", "module.wat",
      "--sourceMap"
    ],
    {
      stdout,
      stderr,
      readFile(name, baseDir) {
        return fileSourceMap[name] || null
      },
      writeFile(name, data, baseDir) {
        switch(name) {
          case "module.wasm":
            wasm = data
            break
          case "module.wat":
            wat = data
            break
          case "module.wasm.map":
            sourceMap = data
            break
          default:
            break
        }
      },
    },
    error => {
      console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
      const compileErrorMessage = stderr.toString()
      if (compileErrorMessage) {
        reject(new CompileError(compileErrorMessage))
        return 1
      }
      if (error) {
        reject(new CompileProcessError(error.message))
        return 1
      }
      resolve({
        wasm,
        wat,
        sourceMap,
      })
      return 0
    });
  })
}