
class Connector extends ConnectorBase {

  constructor (unityInstance, unityPointers) {
    super()
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  createImports () {
    return {
      env: {
        getObjectId: (len) => {
          const nameArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(0, len))
          const name = String.fromCharCode.apply(null, nameArray)
          const encoder = new TextEncoder()
          const buffer = encoder.encode(name + String.fromCharCode(0))
          const ptr = this.unityInstance.Module._malloc(len)
          this.unityInstance.Module.HEAP8.set(buffer, ptr)
          return this.unityInstance.Module.dynCall_ii(this.unityPointers.getObjectByName, ptr)
        },
        getObjectPosition: (objectId) => {
          return [0, 1, 2]
        },
        setObjectPosition: (objectId, x, y, z) => {
          return this.unityInstance.Module.dynCall_iifff(this.unityPointers.setObjectPosition, objectId, x, y, z) 
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
    }
  }

  connectWasm (wasmModule) {
    super.connectWasm(wasmModule)
    this.unityInstance.Module.dynCall_v(this.unityPointers.connect);
  }
}