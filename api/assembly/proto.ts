export const I32 = 1
export const F32 = 2

export declare function _callEngine32(p: usize, funcId: i32): void

// In AssemblyScript we cannot use type or interface to define structure quickly.
// So created this class to hold values.
export class ValueContainer32 {
  vi32: i32 = 0
  vf32: f32 = 0

  static i32(v: i32): ValueContainer32 {
    const c = new ValueContainer32()
    c.vi32 = v
    return c
  }

  static f32(v: f32): ValueContainer32 {
    const c = new ValueContainer32()
    c.vf32 = v
    return c
  }
}

export function callEngine32(
  iTypes: i32[],
  oTypes: i32[],
  inputs: ValueContainer32[],
  funcId: i32
): ValueContainer32[] {
  const ni = iTypes.length
  const no = oTypes.length
  const i32Len = 1 + 1 + ni * 2 + no * 2
  const p = heap.alloc(i32Len * 4)
  let offset: usize = 0
  store<i32>(p, ni)
  store<i32>(p + 4, no)
  offset = 8
  for (let i = 0; i < ni; i++) {
    store<i32>(p + offset, iTypes[i])
    offset += 4
  }
  for (let i = 0; i < no; i++) {
    store<i32>(p + offset, oTypes[i])
    offset += 4
  }
  for (let i = 0; i < ni; i++) {
    const type = iTypes[i]
    if (type === I32) {
      store<i32>(p + offset, inputs[i].vi32)
    } else if (type === F32) {
      store<f32>(p + offset, inputs[i].vf32)
    }
    offset += 4
  }

  _callEngine32(p, funcId)

  const outs: ValueContainer32[] = []
  for (let i = 0; i < no; i++) {
    const type = oTypes[i]
    if (type === I32) {
      outs.push(ValueContainer32.i32(load<i32>(p + offset + i * 4)))
    } else (type === F32) {
      outs.push(ValueContainer32.f32(load<f32>(p + offset + i * 4)))
    }
  }
  heap.free(p)
  return outs
}