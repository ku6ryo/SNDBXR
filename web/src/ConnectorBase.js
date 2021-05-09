class ConnectorBase {

  connectWasm (wasmModule) {
    this.wasmModule = wasmModule
  }

  disconnectWasm () {
    this.wasmModule = null
  }

  createImports () {
  }

  init () {
    return this.wasmModule.exports.init()
  }

  onUpdate () {
    return this.wasmModule.exports.update()
  }
}