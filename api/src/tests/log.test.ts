import * as path from "path"
import assert from "assert"
import { loadFromFile } from "../loader"
import { Connector } from "../connector/Connector"

class TestConnector extends Connector {
  logString(str) {
    expect(str).toBe("test")
  }
}

test("test logString", () => {
  const m = loadFromFile(path.join(__dirname, "../../build_test/log.wasm"), new TestConnector()) as any
  m.exports.main()
})