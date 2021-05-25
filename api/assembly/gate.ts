// This file is auto-generated. Please dot not edit.
import { ValueContainer32, callEngine32, I32, F32 } from './proto'
export function callEngine_i_i (funcId: i32,
  i0: i32): ValueContainer32[] {
  return callEngine32([I32],
    [I32],
    [ValueContainer32.i32(i0)],
    funcId)
}
export function callEngine_i_ii (funcId: i32,
  i0: i32,
  i1: i32): ValueContainer32[] {
  return callEngine32([I32, I32],
    [I32],
    [ValueContainer32.i32(i0), ValueContainer32.i32(i1)],
    funcId)
}
export function callEngine_i_ifff (funcId: i32,
  i0: i32,
  f1: f32,
  f2: f32,
  f3: f32): ValueContainer32[] {
  return callEngine32([I32, F32, F32, F32],
    [I32],
    [ValueContainer32.i32(i0), ValueContainer32.f32(f1), ValueContainer32.f32(f2), ValueContainer32.f32(f3)],
    funcId)
}
export function callEngine_i_iffff (funcId: i32,
  i0: i32,
  f1: f32,
  f2: f32,
  f3: f32,
  f4: f32): ValueContainer32[] {
  return callEngine32([I32, F32, F32, F32, F32],
    [I32],
    [ValueContainer32.i32(i0), ValueContainer32.f32(f1), ValueContainer32.f32(f2), ValueContainer32.f32(f3), ValueContainer32.f32(f4)],
    funcId)
}
export function callEngine_fff_i (funcId: i32,
  i0: i32): ValueContainer32[] {
  return callEngine32([I32],
    [F32, F32, F32],
    [ValueContainer32.i32(i0)],
    funcId)
}
