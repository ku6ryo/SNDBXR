import { TypeScriptSandbox } from "./TypeScriptSandbox"
import {
  Group,
} from "three"
import { ObjectService } from "./ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  GET_MATERIAL_OF_OBJECT,
  GET_OBJECT_POSITION,
  SET_MATERIAL_COLOR,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
} from "./function_ids"
import { MaterialService } from "./MaterialService"

export class Sandbox extends TypeScriptSandbox {

  id: number
  container: Group
  objectService: ObjectService
  materialService: MaterialService
  wasmInstance: WebAssembly.Instance | null = null
  wasmMemory: WebAssembly.Memory | null = null

  callEngineFuncMap = new Map<number, (arg: Uint8Array) => Uint8Array>()

  constructor(id: number, container: Group) {
    super()
    this.id = id
    this.container = container

    this.materialService = new MaterialService()
    this.objectService = new ObjectService(this.container, this.materialService)

    this.callEngineFuncMap.set(CREATE_PRIMITIVE_OBJECT, this.objectService.createPrimitive.bind(this.objectService))
    // Legacy
    this.callEngine_i_i_Map.set(GET_MATERIAL_OF_OBJECT, this.objectService.getMaterial.bind(this.objectService))
    this.callEngine_fff_i_Map.set(GET_OBJECT_POSITION, this.objectService.getObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_POSITION, this.objectService.setObjectPosition.bind(this.objectService))
    this.callEngine_i_ifff_Map.set(SET_OBJECT_SCALE, this.objectService.setObjectScale.bind(this.objectService))
    this.callEngine_i_iffff_Map.set(SET_MATERIAL_COLOR, this.materialService.setColor.bind(this.materialService))
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

  getWasmMemory (): WebAssembly.Memory {
    const instance = this.getWasmInstance()
    if (instance.exports.memory) {
      return instance.exports.memory as WebAssembly.Memory
    }
    throw new Error('No memory export.')
  }

  onStart () {
    (this.getWasmInstance().exports as any).start()
  }

  onUpdate () {
    (this.getWasmInstance().exports as any).update()
  }

  onAbort (message: string | null,
    fileName: string | null,
    lineNumber: number,
    columnNumber: number) {
  }

  _callEngine32(p: number, funcId: number) {
    const headerArray = new Int32Array(this.getWasmMemory().buffer, p, 2)
    const numArgs = headerArray[0]
    const numReturns = headerArray[1]
    const totalLength = 2 + numArgs * 2 + numReturns * 2;
    const iArray = new Int32Array(this.getWasmMemory().buffer, p, totalLength)
    const fArray = new Float32Array(this.getWasmMemory().buffer, p, totalLength)
    const iTypes: number[] = []
    iArray.slice(2, 2 + numArgs).forEach(v => {
      iTypes.push(v)
    })
    const oTypes: number[] = []
    iArray.slice(2 + numArgs, 2 + numArgs + numReturns).forEach(v => {
      oTypes.push(v)
    })
    const inputs: number[] = []
    iTypes.forEach((t, i) => {
      if (t === 1) {
        inputs.push(iArray[2 + numArgs + numReturns + i])
      } else if (t == 2) {
        inputs.push(fArray[2 + numArgs + numReturns + i])
      } else {
        throw new Error("Unknown type")
      }
    })
    const outs = this.callEngine32(iTypes, oTypes, inputs, funcId)
    const iMemory = new Int32Array(this.getWasmMemory().buffer)
    const fMemory = new Float32Array(this.getWasmMemory().buffer)
    let outIndex32 = (p >> 2) + 2 + numArgs * 2 + numReturns;
    oTypes.forEach((t, i) => {
      if (t === 1) {
        iMemory[outIndex32] = outs[i]
      } else if (t === 2) {
        fMemory[outIndex32] = outs[i]
      } else {
        throw new Error("Unknown type")
      }
      outIndex32 += 1
    })
  }
  createImports () {
    return {
      env: {
        abort: this.onAbort.bind(this)
      },
      interface: {
        callEngineImport: (funcId: number, ptr: number) => {
          const aLen = new Uint32Array(this.getWasmMemory().buffer)[(ptr >> 2) - 1]
          const aData = new Uint8Array(this.getWasmMemory().buffer).subarray(ptr, ptr + aLen)
          const func = this.callEngineFuncMap.get(funcId)
          if (!func) {
            throw new Error("Unknown func: " + funcId)
          }
          const rData = func(aData)
          const rPtr = (this.getWasmInstance().exports.malloc as (len: number) => number)(rData.byteLength)
          ;(new Uint8Array(this.getWasmMemory().buffer)).set(rData, rPtr)
          return rPtr
        }
      },
      proto: {
        _callEngine32: this._callEngine32.bind(this),
      }
    }
  }
}