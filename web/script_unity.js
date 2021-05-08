const { accessSync } = require("fs");

/**
 * @param {ArrayBuffer} wasm Binary data
 */
function createModule(wasm, imports) {
  return new Promise((resolve, reject) => {
    require([ "https://cdn.jsdelivr.net/npm/@assemblyscript/loader@0.18.31/umd/index.js" ], (loader) => {
      const module = loader.instantiateSync(wasm, imports);
      resolve(module)
    })
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

function loadAsc() {
  return new Promise((resolve, reject) => {
    require([ "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js" ], ({ asc }) => {
      resolve(asc)
    })
  })
}

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
      if (error) {
        console.log(">>> THROWN >>>");
        console.log(error);
        reject(error)
      }
    });
  })
}


;(async () => {
  const base = "../../../scripting/assembly"
  const files = [
    "index.ts",
    "env.ts",
    "EventManager.ts",
    "EventType.ts",
    "global.ts",
    "object.ts",
    "tool.ts",
  ]
  const imports = {
    env: {
      getObjectId: (len) => {
        return unityInstance.Module.dynCall_i(window.unityPointers.getObjectByName)
      },
      getObjectPosition: (objectId) => {
        return [0, 1, 2]
      },
      setObjectPosition: (objectId, x, y, z) => {
        return unityInstance.Module.dynCall_iiiii(window.unityPointers.setObjectPosition, objectId, x, y, z) 
      },
      setEventListener: (objectId, type) => {
      },
      log: (type) => {
        console.log(type)
      },
      getTime: () => {
        return Math.round(new Date().getTime() / 1000)
      },
    },
  };
  const asc = await loadAsc()
  await asc.ready()
  const sourceMap = await createFileSourceMap(base, files)
  const wasmBinary = await compile(asc, sourceMap)
  const module = await createModule(wasmBinary, imports)
  module.exports.main()
  setInterval(() => {
    module.exports.update()
  }, 30)
})()