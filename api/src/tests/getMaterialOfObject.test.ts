import * as path from "path"
import { loadFromFile } from "../loader"
import Gate from "../connector/Gate"
import { GET_MATERIAL_OF_OBJECT, CREATE_PRIMITIVE_OBJECT } from "../../assembly/function_ids"

class TestGate extends Gate {
  logInt(value) {
    console.log(value)
    expect(value).toBe(23)
  }
  callEngine_i_i(funcId, i0) {
    switch (funcId) {
      case CREATE_PRIMITIVE_OBJECT:
        expect(i0).toBe(0)
        let val1 = new Uint32Array(1)
        val1[0] = 10
        return new Uint8Array(val1.buffer)
      case GET_MATERIAL_OF_OBJECT:
        expect(i0).toBe(10)
        const val2 = new Uint32Array(1)
        val2[0] = 23
        return new Uint8Array(val2.buffer)
      default:
        super.callEngine_i_i(funcId, i0)
        break
    }
  }
}

test("test createPrimitive", async () => {
  const gate = new TestGate()
  await loadFromFile(
    path.join(__dirname, "../../build_test/getMaterialOfObject.wasm"),
    gate
  )
  gate.onStart()
})