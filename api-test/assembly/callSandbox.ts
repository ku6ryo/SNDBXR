import { malloc, registerCallSandboxFunc, callSandbox as callSandboxInternal } from "sndbxr-wasm-api/interface"
import { Encoder, Decoder, Sizer, Writer } from "@wapc/as-msgpack" 

function encode(writer: Writer, i: i32, f: f32, s: string): void {
  writer.writeInt32(i)
  writer.writeFloat32(f)
  writer.writeString(s)
}

function receive(buf: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(buf)
  const i = decoder.readInt32()
  const f = decoder.readFloat32()
  const s = decoder.readString()
  const sizer = new Sizer()
  encode(sizer, i, f, s)
  const returnBuf = new ArrayBuffer(sizer.length)
  const encoder = new Encoder(returnBuf)
  encode(encoder, i, f, s)
  return returnBuf
}

export function main(len: i32): usize {
  registerCallSandboxFunc(1234, receive)
  return malloc(len)
}
export function callSandbox(funcId: i32, ptr: i32): ArrayBuffer {
  return callSandboxInternal(funcId, ptr)
}