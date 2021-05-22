class ConnectorBase {

  connectWasm (wasmModule) {
    this.wasmModule = wasmModule
  }

  disconnectWasm () {
    this.wasmModule = null
  }

  createImports () {
  }
  
  load (url) {
    console.log(url)
    return 0;
  }

  onStart () {
    return this.wasmModule.exports.start()
  }

  onUpdate () {
    return this.wasmModule.exports.update()
  }
}