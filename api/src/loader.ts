import fs from "fs"
import Gate from "./connector/Gate";

export async function loadFromFile (path: string, gate: Gate) {
  const file = fs.readFileSync(path)
  const source = await WebAssembly.instantiate(file, {
    env: {
      abort: gate.onAbort.bind(this),
    },
    gate: gate.createImport(),
  })
  gate.setWasm(source.instance)
  return source.instance
}