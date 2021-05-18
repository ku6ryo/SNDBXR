import fs from "fs"
import loader from "@assemblyscript/loader/umd";

export function loadFromFile (path, connector) {
  const imports = connector.createImports()
  const wasmModule = loader.instantiateSync(fs.readFileSync(path), imports);
  connector.setWasmModule(wasmModule)
  return wasmModule
}