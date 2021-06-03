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

/**
 * Connects Unity and WasmRunner.
 */
export class UnityConnector {

  private unityInstance: UnityInstance | null = null
  unityPointers: any = null
  private runnerMap = new Map<number, WasmRunner>()

  /**
   * Called when Unity WebGL has been loaded and starts.
   * @param instance Unity instance 
   * @param pointers Pointers of Unity static functions
   */
  onUnityLoad(instance: UnityInstance, pointers: any) {
    this.unityInstance = instance
    this.unityPointers = pointers
  }

  getUnityInstance() {
    if (!this.unityInstance) {
      throw new Error("Unity instance is not set.")
    }
    return this.unityInstance
  }

  getUnityModule() {
    return this.getUnityInstance().Module
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
    if (!this.unityInstance) {
      throw new Error("Unity instance is not set.")
    }
    try {
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const runner = new WasmRunner(this, sandboxId)
      await runner.createWasm(buf)
      this.registerRunner(sandboxId, runner)
      this.getUnityModule().dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 0)
    } catch(e) {
      console.log(e)
      this.getUnityModule().dynCall_vii(this.unityPointers.onLoadCompleted, sandboxId, 1)
    }
  }

  requestLoad(url: string) {
    const strArray = (new TextEncoder()).encode(url + String.fromCharCode(0))
    const uPtr = this.getUnityModule()._malloc(strArray.length)
    this.getUnityModule().HEAP8.set(strArray, uPtr)
    this.getUnityModule().dynCall_vi(this.unityPointers.onLoadRequested, uPtr)
  }

  /**
   * Requests to delete all sandboxes.
   */
  requestDelete(sandboxId: number) {
    this.getUnityModule().dynCall_vi(this.unityPointers.onDeleteRequested, sandboxId)
    this.unregisterRunner(sandboxId)
  }

  /**
   * Requests to delete a sandbox.
   */
  requestDeleteAll() {
    this.runnerMap.forEach((_, sandboxId) => {
      this.requestDelete(sandboxId)
    })
  }
}