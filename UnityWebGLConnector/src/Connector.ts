
interface UnityInstance {
}

export class Connector {

  unityInstance: UnityInstance
  unityPointers: any

  wasmModuleMap = new Map()

  constructor (unityInstance: UnityInstance, unityPointers: any) {
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  onStart (id: number) {
    const module = this.wasmModuleMap.get(id)
    if (module) {
      module.exports.start()
    }
  }

  onUpdate () {
    this.wasmModuleMap.forEach((module, id) => {
      module.exports.update()
    })
  }

  async load (sandboxId: number, url: string) {
    console.log(sandboxId)
    console.log(url)
    try {
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const imports = this.createImports(sandboxId)
      const source = await WebAssembly.instantiate(file, imports)

      // return source.instance
      const wasmModule = await window.wasmLoader.instantiate(buf, connector.createImports(sandboxId))
      this.wasmModuleMap.set(sandboxId, wasmModule)
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

  createFunctionImports (sandboxId: number) {
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
        console.log(funcId, i0, i1)
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
        console.log(funcId, i0)
        const ptr8 = this.unityInstance.Module.dynCall_iii(this.unityPointers.execV3_I, funcId, i0)
        const ptr32 = ptr8 / 4
        console.log(this.unityInstance.Module.HEAP32[ptr32]);
        console.log(this.unityInstance.Module.HEAP32[ptr32 + 1]);
        console.log(this.unityInstance.Module.HEAP32[ptr32 + 2]);
        console.log(new Float32Array((new Uint32Array([this.unityInstance.Module.HEAP32[ptr32 + 2]])).buffer)[0]);
        const module = this.wasmModuleMap.get(sandboxId)
        console.log(module.exports.memory)
        return 0
      },
    }
  }

  createImports (sandboxId: number) {
    return {
      env: this.createFunctionImports(sandboxId)
    }
  }

  requestLoad(url) {
    const strArray = (new TextEncoder()).encode(url + String.fromCharCode(0))
    const uPtr = this.unityInstance.Module._malloc(strArray.length)
    this.unityInstance.Module.HEAP8.set(strArray, uPtr)
    this.unityInstance.Module.dynCall_vi(this.unityPointers.onLoadRequested, uPtr)
  }

  requestDelete(id) {
    this.wasmModuleMap.delete(id)
    this.unityInstance.Module.dynCall_vi(this.unityPointers.onDeleteRequested, id)
  }

  requestDeleteAll() {
    this.wasmModuleMap.forEach((v, id) => {
      this.requestDelete(id)
    })
  }
}