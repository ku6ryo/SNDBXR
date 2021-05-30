import * as path from "path"
import { loadFromFile } from "../loader"
import { Sandbox } from "../connector/Sandbox"

class TestSandbox extends Sandbox {
  constructor() {
    super()
    this.callEngine_i_i_Map.set(1001, this.createPrimitive.bind(this))
  }
  logInt(value) {
    expect(value).toBe(100)
  }
  createPrimitive(i0) {
    expect(i0).toBe(0)
    return [100]
  }
}

test("test createPrimitive", async () => {
  const sandbox = new TestSandbox()
  await loadFromFile(
    path.join(__dirname, "../../build_test/createPrimitive.wasm"),
    sandbox,
  )
  sandbox.onStart()
})