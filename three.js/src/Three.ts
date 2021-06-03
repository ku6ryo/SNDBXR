import style from "./style.scss"
import * as THREE from "three"
import { Sandbox } from "./Sandbox"

export class Three {

  scene: THREE.Scene | null = null

  nextSandboxId = 0
  sandboxMap = new Map<number, Sandbox>()

  getScene(): THREE.Scene {
    if (this.scene === null) {
      throw new Error("no scene")
    }
    return this.scene
  }

  setup() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setSize(width, height);
    renderer.domElement.className = style.threeCanvas
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    this.scene = scene
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 1000)
    camera.lookAt(0, 0, 0)

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    const tick = (): void => {
      requestAnimationFrame(tick);
      this.sandboxMap.forEach((s) => {
        s.onUpdate()
      })
      renderer.render(scene, camera);
    }
    tick()
  }

  async load (url: string) {
    const sandboxId = this.nextSandboxId
    try {
      const sandbox = new Sandbox(sandboxId, this.scene!)
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const source = await WebAssembly.instantiate(buf, {
        ...sandbox.createImports(),
      })
      sandbox.setWasm(source.instance)
      sandbox.onStart()
      this.sandboxMap.set(sandboxId, sandbox)
      this.nextSandboxId += 1
    } catch(e) {
      console.log(e)
    }
  }

  deleteSandbox(sandboxId: number) {
  }

  deleteAllSandboxes() {
  }
}