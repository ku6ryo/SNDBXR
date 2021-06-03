import { UnityConnector } from "./UnityConnector";

declare global {
  interface Window {
    connector: UnityConnector
    createSandbox: (url: string) => void
    deleteSandbox: (sandboxId: number) => void
    deleteAllSandboxes: () => void
  }
}
;(() => {
  const connector = new UnityConnector()
  window.connector = connector
  window.createSandbox = connector.requestLoad.bind(connector)
  window.deleteSandbox = connector.requestDelete.bind(connector)
  window.deleteAllSandboxes = connector.requestDeleteAll.bind(connector)
})()