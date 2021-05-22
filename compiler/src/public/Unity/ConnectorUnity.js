
class Connector extends ConnectorBase {

  constructor (unityInstance, unityPointers) {
    super()
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  async load (sandboxId, url) {
    console.log(sandboxId)
    console.log(url)
    try {
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const wasmModule = await window.wasmLoader.instantiate(buf, connector.createImports())
      this.connectWasm(wasmModule)
      this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 0)
    } catch(e) {
      console.log(e)
      this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 1)
    }
  }

  passStringFromWasmToUnity(wasmPtr, len) {
    const strArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(wasmPtr, wasmPtr + len))
    const uPtr = this.unityInstance.Module._malloc(len)
    this.unityInstance.Module.HEAP8.set(strArray, uPtr)
    return uPtr
  }

  createFunctionImports () {
    return {
      logString: (ptr, len) => {
        const strArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(ptr, ptr + len))
        const str = (new TextDecoder).decode(strArray)
        console.log(str)
      },
      logInt: (i) => {
        console.log(i)
      },
      logFloat: (f) => {
        console.log(f)
      },
      execI_II: (funcId, i0, i1) => {
        return this.unityInstance.Module.dynCall_iiii(this.unityPointers.execI_II, funcId, i0, i1)
      },
      execI_I: (funcId, i0) => {
        return this.unityInstance.Module.dynCall_iii(this.unityPointers.execI_I, funcId, i0)
      },
      execI_S: (funcId, ptr, len) => {
        const uPtr = this.passStringFromWasmToUnity(ptr, len)
        return this.unityInstance.Module.dynCall_iii(this.unityPointers.execI_S, funcId, uPtr)
      },
      execI_IV3: (funcId, i0, f0, f1, f2) => {
        return this.unityInstance.Module.dynCall_iiifff(this.unityPointers.execI_IV3, funcId, i0, f0, f1, f2)
      },
      execI_IV4: (funcId, i0, f0, f1, f2, f3) => {
        return this.unityInstance.Module.dynCall_iiiffff(this.unityPointers.execI_IV4, funcId, i0, f0, f1, f2, f3)
      },
      execV3_I: (funcId, i0) => {
        return 0
      },
    }
  }

  createImports () {
    return {
      env: this.createFunctionImports()
    }
  }

  requestLoad(url) {
    const strArray = (new TextEncoder()).encode(url)
    const uPtr = this.unityInstance.Module._malloc(strArray.length)
    this.unityInstance.Module.HEAP8.set(strArray, uPtr)
    this.unityInstance.Module.dynCall_vi(this.unityPointers.onLoadRequested, uPtr)
  }

  connectWasm (wasmModule) {
    super.connectWasm(wasmModule)
  }
}