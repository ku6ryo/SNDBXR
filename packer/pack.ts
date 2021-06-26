import fs from "fs"
import path from "path"
import util from "util"
import recursive from "recursive-readdir"
import { Packer } from "./src/Packer"
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const buildRoot = path.join(__dirname, "build")

try {
  if (!fs.existsSync(buildRoot)) {
    fs.mkdirSync(buildRoot)
  }
} catch (e) {
  throw e
}

;(async () => {
  const args = process.argv.slice(2)
  const packageDir = args[0] || "unpacked"
  const packageRoot = path.join(__dirname, packageDir)
  const scriptRoot = path.join(packageRoot, "scripts/")
  const resourceRoot = path.join(packageRoot, "resources/")
  const packer = new Packer()
  const scriptFiles = await recursive(scriptRoot)
  const scriptReadPromises: Promise<void>[] = []
  scriptFiles.forEach(f => {
    scriptReadPromises.push((async () => {
      const content = await readFile(f)
      packer.addScript({
        path: f.replace(scriptRoot, ""),
        content,
      })
    })())
  })
  await Promise.all(scriptReadPromises)
  const resourceFiles = await recursive(resourceRoot)
  const resourceReadPromises: Promise<void>[] = []
  resourceFiles.forEach(f => {
    resourceReadPromises.push((async () => {
      const content = await readFile(f)
      packer.addResource({
        path: f.replace(resourceRoot, ""),
        content,
      })
    })())
  })
  await Promise.all(resourceReadPromises)
  await packer.compileScripts()
  const zip = await packer.pack()
  writeFile(path.join(__dirname, "build", new Date().getTime() + ".zip"), zip) 
})()