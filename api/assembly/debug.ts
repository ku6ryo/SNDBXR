import { Encoder, Sizer, Decoder } from "@wapc/as-msgpack" 
import { LOG } from "./function_ids"
import { callEngine } from "./interface"

export function log(text: string): void {
  const sizer = new Sizer()
  sizer.writeString(text)
  const buf = new ArrayBuffer(sizer.length)
  const encoder = new Encoder(buf)
  encoder.writeString(text)
  callEngine(LOG, buf)
}
