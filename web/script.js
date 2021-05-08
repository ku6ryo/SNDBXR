
function execute(wasm) {
  require([ "https://cdn.jsdelivr.net/npm/@assemblyscript/loader@0.18.31/umd/index.js" ], (loader) => {
    console.log(loader)
    let objectId = 0;
    const imports = {
      env: {
        getObjectId: (len) => {
          const nameArray = new Uint8Array(wasmModule.exports.memory.buffer.slice(0, len))
          console.log(String.fromCharCode.apply(null, nameArray))
          console.log(wasmModule.exports.memory.buffer)
          objectId += 1;
          return objectId;
        },
        getObjectPosition: (objectId) => {
          return [0, 1, 2]
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
    const wasmModule = loader.instantiateSync(wasm, imports);
    window.m = wasmModule
    console.log(wasmModule.exports.main())
  })
}

require([ "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js" ], ({ asc }) => {
  asc.ready.then(async () => {
    console.log("Running simple example...");
    // simpleExample(asc);
    console.log("\nRunning extended example...");
    const promises = files.map(f => {
      return fetch(base + "/" + f).then(res => res.text())
    })
    const results = await Promise.all(promises)
    const texts = results.map(r => {
      return r;
    });
    console.log(texts);
    files.forEach((f, i) => {
      fileMap[f] = texts[i];
    })
    extendedExample(asc, fileMap);
  });
});

let fileMap = {}


const base = "../scripting/assembly"
const files = [
  "index.ts",
  "env.ts",
  "EventManager.ts",
  "EventType.ts",
  "global.ts",
  "object.ts",
  "tool.ts",
]

// This uses `asc.compileString`, a convenience API useful if all one wants to
// do is to quickly compile a single source string to WebAssembly.
function simpleExample(asc) {
  const { text, binary } = asc.compileString(SOURCE_CODE, {
    optimizeLevel: 3,
    runtime: "stub"
  });
  console.log(`>>> TEXT >>>\n${text}`);
  console.log(`>>> BINARY >>>\n${binary.length} bytes`);
}

// The full API works very much like asc on the command line, with additional
// environment bindings being provided to access the (virtual) file system.
function extendedExample(asc) {
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
      console.log(name)
      if (fileMap[name]) return fileMap[name]
      return null
    },
    writeFile(name, data, baseDir) {
      console.log(`>>> WRITE:${name} >>>\n${data.length}`);
      console.log(data)
      if (name.endsWith(".wasm")) {
        execute(data.buffer)
      }
    },
    listFiles(dirname, baseDir) {
      return [];
    }
  }, err => {
    console.log(`>>> STDOUT >>>\n${stdout.toString()}`);
    console.log(`>>> STDERR >>>\n${stderr.toString()}`);
    if (err) {
      console.log(">>> THROWN >>>");
      console.log(err);
    }
  });
}