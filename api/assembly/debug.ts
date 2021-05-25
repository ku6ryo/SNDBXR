import { allocString } from "./memory"

export declare function logInt(value: i32): void
export declare function logFloat(value: f32): void
export declare function logString(ptr: i32, len: i32): void
export function log(text: string): void {
  const ptr = allocString(text)
  logString(ptr, text.length)
  heap.free(ptr)
}
