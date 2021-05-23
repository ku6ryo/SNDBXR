import * as path from "path"
import { loadFromFile } from "../loader"
import Gate from "../connector/Gate"

class TestGate extends Gate {
  logInt(value) {
    console.log(value)
    expect(value).toBe(100)
  }
  callEngine_i_i(funcId, i0) {
    console.log(funcId)
    expect(funcId).toBe(1001)
    console.log(i0)
    expect(i0).toBe(0)
    const value = new Uint32Array(1)
    value[0] = 100
    return new Uint8Array(value.buffer)
  }
}

test("test createPrimitive", async () => {
  const gate = new TestGate()
  await loadFromFile(
    path.join(__dirname, "../../build_test/createPrimitive.wasm"),
    gate,
  )
  gate.onStart()
})