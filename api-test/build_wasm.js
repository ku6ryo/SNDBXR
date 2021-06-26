const parseArgs = require("minimist")
const path = require("path")
const fs = require("fs")
const childProcess = require("child_process")
const util = require("util")

const readdir = util.promisify(fs.readdir)
const testFileDir = path.join(__dirname, "assembly")
const testBuildDir = path.join(__dirname, "build")

/**
 * Promisify wrapper of spawn.
 * https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @param {string} cmd The command to run.
 * @param {args[]} args List of string arguments.
 */
function spawn(cmd, args) {
  return new Promise((resolve, reject) => {
    let p = childProcess.spawn(cmd, args, { shell: true })

    p.on("exit", code => {
      if (code == 0) {
        resolve()
      } else {
        const error = new Error(`Command "${cmd}" exited with non-zero status.`)
        reject(error)
      }
    })
    p.on("error", e => {
      console.error(e)
    })
    p.stdout.setEncoding("utf-8")
    p.stdout.on("data", data => {
      console.log(data.toString())
    })
    p.stderr.on("data", data => {
      console.error(data.toString())
    })
  })
}

if (!fs.existsSync(testFileDir)){
  fs.mkdirSync(testFileDir);
}

;(async () => {
  const argv = parseArgs(process.argv.slice(2))
  const filterText = argv["filter"] || null
  let files = await readdir(testFileDir)
  if (filterText) {
    files = files.filter((f => {
      return f.includes(filterText)
    }))
  }
  const promises = files.map(function (file) {
    const ext = path.extname(file);
    if (ext !== ".ts") {
      return null
    }
    const fullPath = path.join(testFileDir, file)
    const wasmFile = file.replace(/\.ts$/, ".wasm")
    const wasmPath = path.join(testBuildDir, wasmFile)
    console.log(wasmPath)
    const args = []
    args.push("asc")
    args.push(fullPath)
    args.push("-b", wasmPath)
    return spawn("yarn", args)
  }).filter(p => p !== null)
  await Promise.all(promises)
})()