export function allocString(str: string): i32 {
  const ptr = heap.alloc(str.length) as i32;
  for (let i = 0; i < str.length; i++) {
    store<u8>(ptr + i, str.charCodeAt(i))
  }
  return ptr
}