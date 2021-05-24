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
  // await three.load("http://localhost:8080/artifacts/54d4f9e5-4b02-45fe-ac6c-2f30b4d0db35.wasm")
  window.connector = {
    requestLoad: three.load.bind(three)
  }
});