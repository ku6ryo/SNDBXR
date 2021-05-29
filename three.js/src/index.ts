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
  window.connector = {
    requestLoad: three.load.bind(three)
  }
});