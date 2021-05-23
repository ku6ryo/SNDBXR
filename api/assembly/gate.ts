import { allocString } from './memory'
export declare function logInt(value: i32): void
export declare function logFloat(value: f32): void
export declare function logString(ptr: i32, len: i32): void
export function log (text: string): void {
  const ptr = allocString(text)
  logString(ptr, text.length)
  heap.free(ptr)
}
export declare function _callEngine_i_i (
  funcId: i32,
  i0: i32
): i32
export function callEngine_i_i (funcId: i32,
  i0: i32): i32 {
  const ptr = _callEngine_i_i(funcId,
    i0)
  const result: i32[] = []
  for (let i = 0; i < 1; i++) {
    result.push(load<i32>((ptr >> 2) + 4 * i))
  }
  return result[0]
}
export declare function _callEngine_i_ii (
  funcId: i32,
  i0: i32
  ,
  i1: i32
): i32
export function callEngine_i_ii (funcId: i32,
  i0: i32
  ,
  i1: i32): i32 {
  const ptr = _callEngine_i_ii(funcId,
    i0
    ,
    i1)
  const result: i32[] = []
  for (let i = 0; i < 1; i++) {
    result.push(load<i32>((ptr >> 2) + 4 * i))
  }
  return result[0]
}
export declare function _callEngine_i_s (
  funcId: i32,
  sPtr0: i32, sLen0: i32
): i32
export function callEngine_i_s (funcId: i32,
  s0: string): i32 {
  const sPtr0 = allocString(s0)
  const ptr = _callEngine_i_s(funcId,
    sPtr0, s0.length)
  const result: i32[] = []
  for (let i = 0; i < 1; i++) {
    result.push(load<i32>((ptr >> 2) + 4 * i))
  }
  return result[0]
}
export declare function _callEngine_i_ifff (
  funcId: i32,
  i0: i32
  ,
  f1: f32
  ,
  f2: f32
  ,
  f3: f32
): i32
export function callEngine_i_ifff (funcId: i32,
  i0: i32
  ,
  f1: f32
  ,
  f2: f32
  ,
  f3: f32): i32 {
  const ptr = _callEngine_i_ifff(funcId,
    i0
    ,
    f1
    ,
    f2
    ,
    f3)
  const result: i32[] = []
  for (let i = 0; i < 1; i++) {
    result.push(load<i32>((ptr >> 2) + 4 * i))
  }
  return result[0]
}
export declare function _callEngine_i_iffff (
  funcId: i32,
  i0: i32
  ,
  f1: f32
  ,
  f2: f32
  ,
  f3: f32
  ,
  f4: f32
): i32
export function callEngine_i_iffff (funcId: i32,
  i0: i32
  ,
  f1: f32
  ,
  f2: f32
  ,
  f3: f32
  ,
  f4: f32): i32 {
  const ptr = _callEngine_i_iffff(funcId,
    i0
    ,
    f1
    ,
    f2
    ,
    f3
    ,
    f4)
  const result: i32[] = []
  for (let i = 0; i < 1; i++) {
    result.push(load<i32>((ptr >> 2) + 4 * i))
  }
  return result[0]
}
export declare function _callEngine_fff_i (
  funcId: i32,
  i0: i32
): i32
export function callEngine_fff_i (funcId: i32,
  i0: i32): f32[] {
  const ptr = _callEngine_fff_i(funcId,
    i0)
  const result: f32[] = []
  for (let i = 0; i < 3; i++) {
    result.push(load<f32>((ptr >> 2) + 4 * i))
  }
  return result
}
