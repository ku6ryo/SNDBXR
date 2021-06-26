import "sanitize.css/sanitize.css"
import { Engine } from "./Engine"

declare global {
  interface Window {
    createSandbox: (url: string) => Promise<number>
    deleteSandbox: (sandboxId: number) => void
    deleteAllSandboxes: () => void
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const engine = new Engine()
  window.createSandbox = engine.createSandbox.bind(engine)
  window.deleteSandbox = engine.deleteSandbox.bind(engine)
  window.deleteAllSandboxes = engine.deleteAllSandboxes.bind(engine)
  engine.addToDocument()
  engine.start()
})