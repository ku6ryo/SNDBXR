// This code is auto-generated please do not edit.
export class TypeScriptSandbox {
  callEngine_i_i_Map = new Map<number, (v0: number) => number[]>()
  callEngine_i_ii_Map = new Map<number, (v0: number, v1: number) => number[]>()
  callEngine_i_ifff_Map = new Map<number, (v0: number, v1: number, v2: number, v3: number) => number[]>()
  callEngine_i_iffff_Map = new Map<number, (v0: number, v1: number, v2: number, v3: number, v4: number) => number[]>()
  callEngine_fff_i_Map = new Map<number, (v0: number) => number[]>()
  callEngine32 (iTypes: number[], oTypes: number[], values: number[], funcId: number): number[] {
    let funcName = 'callEngine_'
    oTypes.forEach(v => {
      if (v === 1) funcName += 'i'
      if (v === 2) funcName += 'f'
    })
    funcName += '_'
    iTypes.forEach(v => {
      if (v === 1) funcName += 'i'
      if (v === 2) funcName += 'f'
    })
    return this[funcName](funcId, ...values)
  }

  callEngine_i_i (funcId: number,
    i0: number): number[] {
    const func = this.callEngine_i_i_Map.get(funcId)
    if (!func) {
      throw new Error('no function')
    }
    return func(i0)
  }
  callEngine_i_ii (funcId: number,
    i0: number,
    i1: number): number[] {
    const func = this.callEngine_i_ii_Map.get(funcId)
    if (!func) {
      throw new Error('no function')
    }
    return func(i0,
      i1)
  }
  callEngine_i_ifff (funcId: number,
    i0: number,
    f1: number,
    f2: number,
    f3: number): number[] {
    const func = this.callEngine_i_ifff_Map.get(funcId)
    if (!func) {
      throw new Error('no function')
    }
    return func(i0,
      f1,
      f2,
      f3)
  }
  callEngine_i_iffff (funcId: number,
    i0: number,
    f1: number,
    f2: number,
    f3: number,
    f4: number): number[] {
    const func = this.callEngine_i_iffff_Map.get(funcId)
    if (!func) {
      throw new Error('no function')
    }
    return func(i0,
      f1,
      f2,
      f3,
      f4)
  }
  callEngine_fff_i (funcId: number,
    i0: number): number[] {
    const func = this.callEngine_fff_i_Map.get(funcId)
    if (!func) {
      throw new Error('no function')
    }
    return func(i0)
  }
}
