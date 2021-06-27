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
  console.log("Packing start")
  const startTime = new Date().getTime()
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
  const scriptReadDoneTime = new Date().getTime()
  console.log("Scripts' read. Took " + Math.floor((scriptReadDoneTime - startTime) / 1000 * 10) / 10 + " sec")
  console.log("Compiling ...")
  await packer.compileScripts()
  const compileDoneTime = new Date().getTime()
  console.log("Compiled. Took " + Math.floor((compileDoneTime - scriptReadDoneTime) / 1000 * 10) / 10 + " sec")
  console.log("Reading resources ...")
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
  const resourceReadDoneTime = new Date().getTime()
  console.log("Resources' read. Took " + Math.floor((resourceReadDoneTime - compileDoneTime) / 1000 * 10) / 10 + " sec")
  console.log("Zipping ...")
  const zip = await packer.pack()
  writeFile(path.join(__dirname, "build", new Date().getTime() + ".zip"), zip) 
})()