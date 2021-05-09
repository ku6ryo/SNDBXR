require([ "https://cdn.jsdelivr.net/npm/@assemblyscript/loader@0.18.31/umd/index.js" ], (loader) => {
  window.loader = loader
})

require([ "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js" ], ({ asc }) => {
  asc.ready.then(() => {
    window.asc = asc
  })
})

function compile(asc, fileSourceMap) {
  return new Promise((resolve, reject) => {
    const stdout = asc.createMemoryStream();
    const stderr = asc.createMemoryStream();
    asc.main([
      "index.ts",
      "-O3",
      "--runtime", "stub",
      "--binaryFile", "module.wasm",
      "--textFile", "module.wat",
      "--sourceMap"
    ], {
      stdout,
      stderr,
      readFile(name, baseDir) {
        return fileSourceMap[name] || null
      },
      writeFile(name, data, baseDir) {
        console.log(`>>> WRITE:${name} >>>\n${data.length}`);
        console.log(data)
        if (name.endsWith(".wasm")) {
          resolve(data.buffer)
        }
      },
      listFiles(dirname, baseDir) {
        return [];
      }
    }, error => {
      console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
      console.log(`>>> STDERR >>>\n${stderr.toString()}`);
      if (errror) {
        console.log(">>> THROWN >>>");
        console.log(error);
        reject(error)
      }
    });
  })
}

async function createFileSourceMap (basePath, files) {
  const sourceMap = {} 
  const promises = files.map(f => {
    return fetch(basePath + "/" + f).then(res => res.text())
  })
  const results = await Promise.all(promises)
  files.forEach((f, i) => {
    sourceMap[f] = results[i];
  })
  return sourceMap
}

const initialCode = `
export function init (): i32 {
  const obj = getObjectByName("Cube")
  if (obj) {
    obj.setPosition(0, 0, 0);
  }
  return 0
}


let x: f64 = 0
export function update(): void {
  const obj = getObjectByName("Cube")
  if (obj) {
    obj.setPosition(Math.sin(x) as f32, 0, 0);
    x += 0.01
  }
  return
}`

window.addEventListener("DOMContentLoaded", async () => {
  const editor = document.getElementById("editor")
  editor.value = initialCode
  const base = "../../scripting/assembly"
  const files = [
    "env.ts",
    "EventManager.ts",
    "EventType.ts",
    "global.ts",
    "object.ts",
    "tool.ts",
  ]
  const sourceMap = await createFileSourceMap(base, files)
  document.getElementById("compileButton").addEventListener("click", async () => {
    const code = editor.value
    const indexCode = `
      import { eventManager } from "./global"
      import { EventType } from "./EventType"
      import { getObjectByName, log, getTime, } from "./tool"
      import { Object } from "./object"

      ${code}

      export function onEvent (objectId: i32, type: EventType): void {
        eventManager.onEvent(objectId, type)
      }
    `
    sourceMap["index.ts"] = indexCode
    const wasm = await compile(window.asc, sourceMap)
    window.parent.postMessage({
      subject: "COMPILED",
      wasm,
    }, "*")

  })
})