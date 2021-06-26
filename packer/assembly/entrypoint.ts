import { start as userStart, update as userUpdate } from "./userScript"

export function malloc(len: i32): usize {
  return heap.alloc(len)
}

export function free(ptr: usize): void {
  heap.free(ptr)
}

export function start(): i32 {
  userStart()
  return 0
}

export function update(): void {
  userUpdate()
}