import "sanitize.css/sanitize.css"
import { Three } from "./Three"

declare global {
  interface Window {
    createSandbox: (utl: string) => Promise<void>
    deleteSandbox: (sandboxId: number) => void
    deleteAllSandboxes: () => void
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const three = new Three()
  three.setup()
  window.createSandbox = three.load.bind(three)
  window.deleteSandbox = three.deleteSandbox.bind(three)
  window.deleteAllSandboxes = three.deleteAllSandboxes.bind(three)
});