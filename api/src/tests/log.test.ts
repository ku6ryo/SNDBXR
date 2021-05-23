import * as path from "path"
import { loadFromFile } from "../loader"
import Gate from "../connector/Gate"

class TestGate extends Gate {
  logString(str) {
    expect(str).toBe("test")
  }
}

test("test logString", async () => {
  const gate = new TestGate()
  await loadFromFile(path.join(__dirname, "../../build_test/log.wasm"), gate)
  gate.onStart()
})