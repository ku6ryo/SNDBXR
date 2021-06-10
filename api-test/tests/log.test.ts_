import * as path from "path"
import { loadFromFile } from "../loader"
import { Sandbox } from "../connector/Sandbox"

class TestSandbox extends Sandbox {
  logString(str) {
    expect(str).toBe("test")
  }
}

test("test logString", async () => {
  const sandbox = new TestSandbox()
  await loadFromFile(path.join(__dirname, "../../build_test/log.wasm"), sandbox)
  sandbox.onStart()
})