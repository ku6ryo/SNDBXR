import Gate from "./Gate"
import { UnityConnector  } from "./UnityConnector"

export default class GateUnityImplementation extends Gate {

  connector: UnityConnector

  constructor(connector: UnityConnector) {
    super()
    this.connector = connector
  }

  getUnityInstance() {
    return this.connector.unityInstance
  }

  getUnityModule() {
    return this.getUnityInstance().Module
  }

  getUnityPointers() {
    return this.connector.unityPointers
  }

  passStringFromWasmToUnity(wasmPtr: number, len: number) {
    const strArray = new Uint8Array(this.getWasmMemory().buffer.slice(wasmPtr, wasmPtr + len))
    const uPtr = this.getUnityModule()._malloc(len)
    this.getUnityModule().HEAP8.set(strArray, uPtr)
    return uPtr
  }
  
  callEngine_i_ii(funcId: number, i0: number, i1: number) {
    console.log(funcId, i0, i1)
    const value = this.getUnityModule().dynCall_iiii(this.getUnityPointers().execI_II, funcId, i0, i1)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_i_i(funcId: number, i0: number) {
    const value = this.getUnityModule().dynCall_iii(this.getUnityPointers().execI_I, funcId, i0)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_i_s(funcId: number, ptr: number, len: number) {
    const uPtr = this.passStringFromWasmToUnity(ptr, len)
    const value = this.getUnityModule().dynCall_iii(this.getUnityPointers().execI_S, funcId, uPtr)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_i_ifff(funcId: number, i0: number, f0: number, f1: number, f2: number) {
    const value = this.getUnityModule().dynCall_iiifff(this.getUnityPointers().execI_IV3, funcId, i0, f0, f1, f2)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_i_iffff(funcId: number, i0: number, f0: number, f1: number, f2: number, f3: number) {
    const value = this.getUnityModule().dynCall_iiiffff(this.getUnityPointers().execI_IV4, funcId, i0, f0, f1, f2, f3)
    return new Uint8Array((new Uint32Array([value])).buffer)
  }
  callEngine_fff_i(funcId: number, i0: number) {
    const ptr8 = this.getUnityModule().dynCall_iii(this.getUnityPointers().execV3_I, funcId, i0)
    const ptr32 = ptr8 >> 2
    return new Uint8Array(this.getUnityModule().HEAP32.buffer.slice(ptr32, ptr32 + 2))
  }
}
