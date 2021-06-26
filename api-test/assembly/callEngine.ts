import { malloc as mallocInternal, callEngine } from "sndbxr/interface"
import { Encoder, Decoder, Sizer, Writer } from "@wapc/as-msgpack" 

export function malloc(len: i32): usize {
  return mallocInternal(len)
}

function write(writer: Writer, i: i32, f: f32, s: string): void {
  writer.writeInt32(i)
  writer.writeFloat32(f)
  writer.writeString(s)
}

function createEncoded(): ArrayBuffer {
  const i = 1234
  const f: f32 = 12.34
  const s = "1234"
  const sizer = new Sizer()
  write(sizer, i, f, s)
  const returnBuf = new ArrayBuffer(sizer.length)
  const encoder = new Encoder(returnBuf)
  write(encoder, i, f, s)
  return returnBuf
}

declare function assertInt(i: i32): void
declare function assertFloat(f: f32): void
declare function assertString(buf: ArrayBuffer, len: i32): void
function assertStringInternal(s: string): void {
  const len = String.UTF8.byteLength(s)
  const buf = String.UTF8.encode(s)
  assertString(buf, len)
}

export function main(): void {
  const buf = callEngine(9999, createEncoded())
  const decoder = new Decoder(buf)
  const i = decoder.readInt32()
  const f = decoder.readFloat32()
  const s = decoder.readString()
  assertInt(i)
  assertFloat(f)
  assertStringInternal(s)
}