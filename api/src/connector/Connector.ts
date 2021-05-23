import Gate from "./Gate"

export class Connector {

  gateMap = new Map<number, Gate>()

  registerGate(sandboxId: number, gate: Gate) {
    this.gateMap.set(sandboxId, gate)
  }

  unregisterGate(sandboxId: number) {
    this.gateMap.delete(sandboxId)
  }

  getGate(sandboxId: number): Gate {
    if (!this.gateMap.has(sandboxId)) {
      throw new Error("get does not exist for sandbox: " + sandboxId)
    }
    return this.gateMap.get(sandboxId)!
  }

  onStart (sandboxId: number) {
    const gate = this.getGate(sandboxId)
    gate.onStart()
  }

  onUpdate (sandboxId: number) {
    const gate = this.getGate(sandboxId)
    gate.onUpdate()
  }
}