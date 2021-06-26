import { unzip } from "unzipit"
import { Group, Scene } from "three"
import { Sandbox } from "./Sandbox"
import { ResourceManager } from "./ResourceManager"

/**
 * Manages sandboxes.
 */
export class SandboxManager {
  scene: Scene
  nextSandboxId = 0
  sandboxMap = new Map<number, Sandbox>()

  constructor(scene: Scene) {
    this.scene = scene
  }

  async create(url: string) {
    const zipInfo = await unzip(url)
    const sandboxId = this.nextSandboxId
    const group = new Group()
    const sandbox = new Sandbox(sandboxId, group, new ResourceManager(zipInfo.entries))
    const buf = await zipInfo.entries["script.wasm"].arrayBuffer()
    const source = await WebAssembly.instantiate(buf, {
      ...sandbox.createImports(),
    })
    this.scene.add(group)
    sandbox.setWasm(source.instance)
    sandbox.onStart()
    this.sandboxMap.set(sandboxId, sandbox)
    this.nextSandboxId += 1
    return sandboxId
  }

  update() {
    this.sandboxMap.forEach((sandbox) => {
      sandbox.onUpdate()
    })
  }

  delete(sandboxId: number) {
    const sandbox = this.sandboxMap.get(sandboxId)
    if (sandbox) {
      this.scene.remove(sandbox.getContainer())
    } else {
      throw new Error("No sandbox ID: " + sandboxId)
    }
  }

  deleteAll() {
    for (let sandbox of this.sandboxMap.values()) {
      this.scene.remove(sandbox.getContainer())
    }
    this.sandboxMap = new Map<number, Sandbox>()
  }
}