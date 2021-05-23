import { Connector } from "./Connector"
import GateUnityImplementation from "./GateUnityImplementation"
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

export class UnityConnector extends Connector {

  unityInstance: UnityInstance
  unityPointers: any

  constructor (unityInstance: UnityInstance, unityPointers: any) {
    super()
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  async load (sandboxId: number, url: string) {
    console.log(sandboxId)
    console.log(url)
    try {
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()

      const gate = new GateUnityImplementation(this)
      const source = await WebAssembly.instantiate(buf, {
        env: {
          abort: gate.onAbort.bind(gate),
        },
        gate: gate.createImport(),
      })
      gate.setWasm(source.instance)
      this.registerGate(sandboxId, gate)
      // return source.instance
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
    this.unregisterGate(sandboxId)
  }

  requestDeleteAll() {
    this.gateMap.forEach((_, sandboxId) => {
      this.requestDelete(sandboxId)
    })
  }
}