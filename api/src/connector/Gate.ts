export default class Gate {
  wasmInstance: WebAssembly.Instance
  wasmMemory: WebAssembly.Memory
  setWasm (instance: WebAssembly.Instance) {
    this.wasmInstance = instance
    if (!instance.exports.memory) {
      throw new Error('No memory export.')
    }
    this.wasmMemory = instance.exports.memory as WebAssembly.Memory
  }
  malloc (len: number): number {
    const u = new Uint8Array(this.wasmMemory.buffer)
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
    const u = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < u.length; i++) {
      if (u[ptr + i] === 0) {
        break
      } else {
        u[i] = 0
      }
    }
  }

  onStart () {
    (this.wasmInstance.exports as any).start()
  }

  onUpdate () {
    (this.wasmInstance.exports as any).update()
  }

  onAbort (message: string | null,
    fileName: string | null,
    lineNumber: number,
    columnNumber: number) {
  }

  _logString (ptr: number, len: number) {
    const strArray = new Uint8Array(this.wasmMemory.buffer.slice(ptr, ptr + len))
    this.logString(String.fromCharCode.apply(null, strArray))
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
  createImport () {
    return {
      logString: this._logString.bind(this),
      logInt: this.logInt.bind(this),
      logFloat: this.logFloat.bind(this),
      _callEngine_i_i: this._callEngine_i_i.bind(this),
      _callEngine_i_ii: this._callEngine_i_ii.bind(this),
      _callEngine_i_s: this._callEngine_i_s.bind(this),
      _callEngine_i_ifff: this._callEngine_i_ifff.bind(this),
      _callEngine_i_iffff: this._callEngine_i_iffff.bind(this),
      _callEngine_fff_i: this._callEngine_fff_i.bind(this)
    }
  }

  callEngine_i_i (funcId: number,
    i0: number): Uint8Array {
    return new Uint8Array()
  }
  callEngine_i_ii (funcId: number,
    i0: number
    ,
    i1: number): Uint8Array {
    return new Uint8Array()
  }
  callEngine_i_s (funcId: number,
    sPtr0: number, sLen0: number): Uint8Array {
    return new Uint8Array()
  }
  callEngine_i_ifff (funcId: number,
    i0: number
    ,
    f1: number
    ,
    f2: number
    ,
    f3: number): Uint8Array {
    return new Uint8Array()
  }
  callEngine_i_iffff (funcId: number,
    i0: number
    ,
    f1: number
    ,
    f2: number
    ,
    f3: number
    ,
    f4: number): Uint8Array {
    return new Uint8Array()
  }
  callEngine_fff_i (funcId: number,
    i0: number): Uint8Array {
    return new Uint8Array()
  }

  _callEngine_i_i (funcId: number,
    i0: number): number {
    const mLen = 1 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_i_i(funcId,
      i0)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
  _callEngine_i_ii (funcId: number,
    i0: number
    ,
    i1: number): number {
    const mLen = 1 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_i_ii(funcId,
      i0
      ,
      i1)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
  _callEngine_i_s (funcId: number,
    sPtr0: number, sLen0: number): number {
    const mLen = 1 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_i_s(funcId,
      sPtr0, sLen0)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
  _callEngine_i_ifff (funcId: number,
    i0: number
    ,
    f1: number
    ,
    f2: number
    ,
    f3: number): number {
    const mLen = 1 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_i_ifff(funcId,
      i0
      ,
      f1
      ,
      f2
      ,
      f3)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
  _callEngine_i_iffff (funcId: number,
    i0: number
    ,
    f1: number
    ,
    f2: number
    ,
    f3: number
    ,
    f4: number): number {
    const mLen = 1 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_i_iffff(funcId,
      i0
      ,
      f1
      ,
      f2
      ,
      f3
      ,
      f4)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
  _callEngine_fff_i (funcId: number,
    i0: number): number {
    const mLen = 3 * 4
    const ptr = this.malloc(mLen)
    const valueArr = this.callEngine_fff_i(funcId,
      i0)
    const memArr = new Uint8Array(this.wasmMemory.buffer)
    for (let i = 0; i < valueArr.length; i++) {
      memArr[i] = valueArr[i]
    }
    return ptr
  }
}
