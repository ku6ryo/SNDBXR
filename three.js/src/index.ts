import "sanitize.css/sanitize.css"
import { Three } from "./Three"

declare global {
  interface Connector {
    requestLoad: (utl: string) => Promise<void>
  }
  interface Window {
    connector: Connector    
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const three = new Three()
  three.setup()
  await three.load("http://localhost:8080/artifacts/ba1e6b05-7b57-4cc1-8307-3334314a4164.wasm")
  window.connector = {
    requestLoad: three.load.bind(three)
  }
});