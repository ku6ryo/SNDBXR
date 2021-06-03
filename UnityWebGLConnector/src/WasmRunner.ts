import { UnityConnector  } from "./UnityConnector"

export class WasmRunner {

  sandboxId: number
  connector: UnityConnector
  wasmInstance: WebAssembly.Instance | null = null
  wasmMemory: WebAssembly.Memory | null = null

  constructor(connector: UnityConnector, sandboxId: number) {
    this.connector = connector
    this.sandboxId = sandboxId
  }

  async createWasm (buf: BufferSource) {
    const source = await WebAssembly.instantiate(buf, {
      ...this.createImports(),
    })
    this.setWasmInstance(source.instance)
  }

  setWasmInstance (instance: WebAssembly.Instance) {
    this.wasmInstance = instance
  }

  getWasmInstance (): WebAssembly.Instance {
    if (this.wasmInstance) {
      return this.wasmInstance
    }
    throw new Error('WASM instance is not set yet.')
  }

  getWasmMemory (): WebAssembly.Memory {
    const instance = this.getWasmInstance()
    if (instance.exports.memory) {
      return instance.exports.memory as WebAssembly.Memory
    }
    throw new Error('No memory export.')
  }

  getUnityPointers() {
    return this.connector.unityPointers
  }

  onStart () {
    (this.getWasmInstance().exports as any).start()
  }

  onUpdate () {
    (this.getWasmInstance().exports as any).update()
  }

  onAbort (
    message: string | null,
    fileName: string | null,
    lineNumber: number,
    columnNumber: number
  ) {
    console.log("aborted")
  }

  createImports () {
    return {
      env: {
        abort: this.onAbort.bind(this),
      },
      proto: {
        _callEngine32: this._callEngine32.bind(this),
      },
    }
  }

  _callEngine32(p: number, funcId: number) {
    const unityModule = this.connector.getUnityModule()
    const header = new Uint32Array(this.getWasmMemory().buffer.slice(p, p + 2 * 4))
    const numArgs = header[0]
    const numReturns = header[1]
    const total32Units = 2 + numArgs * 2 + numReturns * 2
    const totalBytes = total32Units * 4
    const uPtr = unityModule._malloc(totalBytes)
    const wData = new Uint8Array(this.getWasmMemory().buffer.slice(p, p + totalBytes))
    this.connector.getUnityModule().HEAPU8.set(wData, uPtr)
    unityModule.dynCall_viii(this.getUnityPointers().callEngine32, uPtr, funcId, this.sandboxId)

    const wBuffer = new Uint32Array(this.getWasmMemory().buffer)
    const wPtrReturn = (p >> 2) + 2 + numArgs * 2 + numReturns
    const uPtrReturn = (uPtr >> 2) + 2 + numArgs * 2 + numReturns
    for(let i = 0; i < numReturns; i++) {
      wBuffer[wPtrReturn] = this.connector.getUnityModule().HEAPU32[uPtrReturn]
    }
  }

  passStringFromWasmToUnity(wasmPtr: number, len: number) {
    const strArray = new Uint8Array(this.getWasmMemory().buffer.slice(wasmPtr, wasmPtr + len))
    const uPtr = this.connector.getUnityModule()._malloc(len)
    this.connector.getUnityModule().HEAP8.set(strArray, uPtr)
    return uPtr
  }
  //return new Uint8Array(this.getUnityModule().HEAP32.buffer.slice(ptr32, ptr32 + 2))
}
