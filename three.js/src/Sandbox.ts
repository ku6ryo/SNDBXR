import {
  Group,
} from "three"
import { ObjectService } from "./services/ObjectService"
import { MaterialService } from "./services/MaterialService"
import { ObjectServiceInterface } from "./interfaces/ObjectServiceInterface"
import { MaterialServiceInterface } from "./interfaces/MaterialServiceInterface"
import { ResourceManager } from "./ResourceManager"
import { ResourceLoaderInterface } from "./interfaces/ResourceLoaderInterface"
import { TextureService } from "./services/TextureService"

export class Sandbox {

  id: number
  container: Group
  objectService: ObjectService
  materialService: MaterialService
  textureService: TextureService

  objectServiceInterface: ObjectServiceInterface
  materialServiceInterface: MaterialServiceInterface
  resourceLoaderInterface: ResourceLoaderInterface

  wasmInstance: WebAssembly.Instance | null = null
  wasmMemory: WebAssembly.Memory
  resourceManager: ResourceManager

  callEngineFuncMap = new Map<number, (arg: Uint8Array) => Uint8Array>()

  constructor(id: number, container: Group, resourceManager: ResourceManager) {
    this.id = id
    this.container = container

    this.resourceManager = resourceManager
    this.textureService = new TextureService(this.resourceManager)
    this.materialService = new MaterialService(this.textureService)
    this.objectService = new ObjectService(this.container, this.materialService)

    this.materialServiceInterface = new MaterialServiceInterface(this.materialService)
    this.objectServiceInterface = new ObjectServiceInterface(this.objectService)
    this.resourceLoaderInterface = new ResourceLoaderInterface(
      this,
      this.resourceManager,
      this.textureService,
      this.objectService,
    )
    this.materialServiceInterface.registerFuncs(this)
    this.objectServiceInterface.registerFuncs(this)
    this.resourceLoaderInterface.registerFuncs(this)

    this.wasmMemory = new WebAssembly.Memory({ initial: 1, maximum: 10 })
  }

  registerFunc(funcId: number, func: (arg: Uint8Array) => Uint8Array) {
    this.callEngineFuncMap.set(funcId, func)
  }

  getContainer(): Group {
    return this.container
  }

  setWasm (instance: WebAssembly.Instance) {
    this.wasmInstance = instance
  }

  getWasmInstance (): WebAssembly.Instance {
    if (this.wasmInstance) {
      return this.wasmInstance
    }
    throw new Error('WASM instance is not set yet.')
  }

  onStart () {
    (this.getWasmInstance().exports as any).start()
  }

  onUpdate () {
    (this.getWasmInstance().exports as any).update()
  }

  onAbort (
    messagePtr: number,
    filePtr: number,
    line: number,
    column: number
  ) {
    const memory = this.wasmMemory
    const mLen = new Uint32Array(memory.buffer)[(messagePtr >> 2) - 1]
    const fLen = new Uint32Array(memory.buffer)[(filePtr >> 2) - 1]
    const decoder = new TextDecoder()
    const msg = decoder.decode((new Uint8Array(memory.buffer)).subarray(messagePtr, messagePtr + mLen))
    const file = decoder.decode((new Uint8Array(memory.buffer)).subarray(filePtr, filePtr + fLen))
    throw new Error(`${file} ${line}:${column} ${msg}`)
  }

  callSanbdbox(funcId: number, ua: Uint8Array): Uint8Array {
    const memory = this.wasmMemory
    const argPtr = ((this.getWasmInstance().exports as any).malloc as (len: number) => number)(ua.byteLength - 1)
    ;(new Uint8Array(memory.buffer)).set(ua.subarray(1), argPtr)
    const rPtr = ((this.getWasmInstance().exports as any).callSandbox as (funcId: number, ptr: number) => number)(funcId, argPtr)
    const rLen = new Uint32Array(memory.buffer)[(rPtr >> 2) - 1]
    const rData = new Uint8Array(memory.buffer).subarray(rPtr, rPtr + rLen)
    return rData
  }

  createImports () {
    return {
      env: {
        abort: this.onAbort.bind(this),
        memory: this.wasmMemory,
      },
      interface: {
        callEngineImport: (funcId: number, ptr: number) => {
          const memory = this.wasmMemory
          const aLen = new Uint32Array(memory.buffer)[(ptr >> 2) - 1]
          const aData = new Uint8Array(memory.buffer).subarray(ptr, ptr + aLen)
          const func = this.callEngineFuncMap.get(funcId)
          if (!func) {
            throw new Error("Unknown func: " + funcId)
          }
          const rData = func(aData)
          const rPtr = (this.getWasmInstance().exports.malloc as (len: number) => number)(rData.byteLength)
          ;(new Uint8Array(memory.buffer)).set(rData, rPtr)
          return rPtr
        }
      },
    }
  }
}