
class Connector extends ConnectorBase {

  constructor (unityInstance, unityPointers) {
    super()
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  passStringFromWasmToUnity(wasmPtr, len) {
    const strArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(wasmPtr, wasmPtr + len))
    const uPtr = this.unityInstance.Module._malloc(len)
    this.unityInstance.Module.HEAP8.set(strArray, uPtr)
  }

  createFunctionImports () {
    return {
      logString: (str) => {
        console.log(str)
      },
      logInt: (i) => {
        console.log(i)
      },
      logFloat: (f) => {
        console.log(f)
      },
      execI_II: (funcId, i0, i1) => {
        return 0
      },
      execI_I: (funcId, i0) => {
        return 0
      },
      execI_S: (funcId, ptr, len) => {
        this.passStringFromWasmToUnity(ptr, len)
        return 0
      },
      execI_IV3: (funcId, funcId, f0, f1, f2) => {
        return 0
      },
      execI_IV4: (funcId, i0, f0, f1, f2, f4) => {
        return 0
      },
      execV3_I: (funcId, i0) => {
        return 0
      },
      getObjectId: (readPtr, len) => {
        const nameArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(readPtr, readPtr + len))
        const name = String.fromCharCode.apply(null, nameArray)
        const encoder = new TextEncoder()
        const buffer = encoder.encode(name + String.fromCharCode(0))
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
      getTime: () => {
        return Math.round(new Date().getTime() / 1000)
      },
    }
  }

  createImports () {
    return {
      env: this.createFunctionImports()
    }
  }

  connectWasm (wasmModule) {
    super.connectWasm(wasmModule)
    this.unityInstance.Module.dynCall_v(this.unityPointers.connect);
  }
}