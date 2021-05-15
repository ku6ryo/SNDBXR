import { allocString } from "./memory"
// OBJECT/GENERAL
export const GET_OBJECT_ID_BY_NAME = 1000
export const CREATE_PRIMITIVE_OBJECT = 1001
export const SET_OBJECT_POSITION = 1100
export const GET_OBJECT_POSITION = 1101
export const SET_OBJECT_ROTATION = 1110
export const GET_OBJECT_ROTATION = 1111
export const SET_OBJECT_SCALE = 1120
export const GET_OBJECT_SCALE = 1121

// OBJECT/MATERIAL
export const GET_MATERIAL_OF_OBJECT = 1200
// OBJECT/EVENT
export const SET_OBJECT_EVENT_LISTENER = 1300

// MATERIAL/GENERAL
export const GET_MATERIAL_ID_BY_NAME = 2000
// MATERIAL/COLOR
export const SET_MATERIAL_COLOR = 2100


export declare function execI_II(funcId: i32, arg1: i32, arg2: i32): i32;
export declare function execI_I(funcId: i32, arg1: i32): i32;
export declare function execI_S(funcId: i32, ptr: i32, len: i32): i32
export declare function execI_IV3(funcId: i32, id: i32, x: f32, y: f32, z: f32): i32
export declare function execI_IV4(funcId: i32, id: i32, x: f32, y: f32, z: f32, w: f32): i32
export declare function execV3_I(funcId: i32, i1: i32): i32

export declare function logInt(value: i32): void
export declare function logFloat(value: f32): void
export declare function logString(ptr: i32, len: i32): void
export function log(text: string): void {
  const ptr = allocString(text)
  logString(ptr, text.length)
  heap.free(ptr)
}