import { WasmRunner } from "./WasmRunner"
export interface UnityModule {
  HEAP8: Int8Array
  HEAP16: Int16Array
  HEAP32: Int32Array
  HEAPF32: Float32Array
  HEAPF64: Float64Array
  HEAPU8: Uint8Array
  HEAPU16: Uint16Array
  HEAPU32: Uint32Array
  _malloc: (len: number) => number
  dynCall_viii: any
  dynCall_vii: any
  dynCall_vi: any
  dynCall_iii: any
  dynCall_iiii: any
  dynCall_iiifff: any
  dynCall_iiiffff: any
}

export interface UnityInstance {
  Module: UnityModule
  frameworkUrl: string
  SendMessage: (name: string, value: string | number) => void
  SetFullscreen: (fullscreen: boolean) => void
}

export class UnityConnector {

  unityInstance: UnityInstance
  unityPointers: any
  runnerMap = new Map<number, WasmRunner>()

  constructor (unityInstance: UnityInstance, unityPointers: any) {
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  registerRunner(sandboxId: number, runner: WasmRunner) {
    this.runnerMap.set(sandboxId, runner)
  }

  unregisterRunner(sandboxId: number) {
    this.runnerMap.delete(sandboxId)
  }

  getRunner(sandboxId: number): WasmRunner {
    if (!this.runnerMap.has(sandboxId)) {
      throw new Error("get does not exist for sandbox: " + sandboxId)
    }
    return this.runnerMap.get(sandboxId)!
  }

  onStart (sandboxId: number) {
    console.log(sandboxId)
    const runner = this.getRunner(sandboxId)
    runner.onStart()
  }

  onUpdate (sandboxId: number) {
    const runner = this.getRunner(sandboxId)
    runner.onUpdate()
  }

  async load (sandboxId: number, url: string) {
    try {
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const runner = new WasmRunner(this, sandboxId)
      await runner.createWasm(buf)
      this.registerRunner(sandboxId, runner)
      this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 0)
    } catch(e) {
      console.log(e)
      this.unityInstance.Module.dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 1)
    }
  }

  requestLoad(url: string) {
    const strArray = (new TextEncoder()).encode(url + String.fromCharCode(0))
    const uPtr = this.unityInstance.Module._malloc(strArray.length)
    this.unityInstance.Module.HEAP8.set(strArray, uPtr)
    this.unityInstance.Module.dynCall_vi(this.unityPointers.onLoadRequested, uPtr)
  }

  requestDelete(sandboxId: number) {
    this.unityInstance.Module.dynCall_vi(this.unityPointers.onDeleteRequested, sandboxId)
    this.unregisterRunner(sandboxId)
  }

  requestDeleteAll() {
    this.runnerMap.forEach((_, sandboxId) => {
      this.requestDelete(sandboxId)
    })
  }
}