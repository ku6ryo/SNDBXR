import { UnityConnector, UnityInstance } from "./UnityConnector";

declare global {
  interface Window {
    Connector: typeof UnityConnector
  }
}
window.Connector = UnityConnector