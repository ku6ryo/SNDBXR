window.require([ "https://cdn.jsdelivr.net/npm/@assemblyscript/loader@0.18.31/umd/index.js" ], (loader) => {
  window.wasmLoader = loader
})

window.addEventListener("message", (e) => {
  const { subject, wasm } = e.data
  if (subject === "COMPILED") {
      const connector = new Connector(window.unityInstance, window.unityPointers)
      const wasmModule = window.wasmLoader.instantiateSync(wasm, connector.createImports())
      connector.connectWasm(wasmModule)
      console.log("init: " + connector.init())
      window.connector = connector
  }
})