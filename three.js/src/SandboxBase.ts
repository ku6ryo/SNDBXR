import { TypeScriptSandbox } from "./TypeScriptSandbox"

export class Sandbox extends TypeScriptSandbox {

  wasmInstance: WebAssembly.Instance | null = null
  wasmMemory: WebAssembly.Memory | null = null
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
  malloc (len: number): number {
    const u = new Uint8Array(this.getWasmMemory().buffer)
    let freeCount = 0
    for (let i = 0; i < u.length; i++) {
      const isFree = u[i] === 0
      if (isFree) {
        freeCount += 1
        if (len + 2 === freeCount) {
          return i - len + 1
        }
      } else {
        freeCount = 0
      }
    }
    throw new Error('No free memory')
  }

  free (ptr: number) {
    const u = new Uint8Array(this.getWasmMemory().buffer)
    for (let i = 0; i < u.length; i++) {
      if (u[ptr + i] === 0) {
        break
      } else {
        u[i] = 0
      }
    }
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

  _logString (ptr: number, len: number) {
    const strArray = new Uint8Array(this.getWasmMemory().buffer.slice(ptr, ptr + len))
    const codeArray: number[] = []
    strArray.forEach(code => codeArray.push(code))
    this.logString(String.fromCharCode(...codeArray))
  }
  logString (str: string) {
    console.log(str)
  }
  logInt (i: number) {
    console.log(i)
  }
  logFloat (f: number) {
    console.log(f)
  }
  createImports () {
    return {
      env: {
        abort: this.onAbort.bind(this)
      },
      debug: {
        logString: this._logString.bind(this),
        logInt: this.logInt.bind(this),
        logFloat: this.logFloat.bind(this),
      },
      proto: {
        _callEngine32: this._callEngine32.bind(this),
      }
    }
  }
}
