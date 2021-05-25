import fs from "fs"
import { Sandbox } from "./connector/Sandbox";

export async function loadFromFile (path: string, sandbox: Sandbox) {
  const file = fs.readFileSync(path)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: sandbox.onAbort.bind(this),
    },
    ...sandbox.createImports()
  })
  sandbox.setWasm(source.instance)
  return source.instance
}