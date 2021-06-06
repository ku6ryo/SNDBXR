import style from "./style.scss"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Sandbox } from "./Sandbox"


export class Three {

  scene: THREE.Scene | null = null
  renderer: THREE.Renderer | null = null
  camera: THREE.PerspectiveCamera | null = null

  nextSandboxId = 0
  sandboxMap = new Map<number, Sandbox>()

  getScene(): THREE.Scene {
    if (this.scene === null) {
      throw new Error("No scene")
    }
    return this.scene
  }

  getRenderer(): THREE.Renderer {
    if (this.renderer === null) {
      throw new Error("No renderer")
    }
    return this.renderer
  }

  getCamera(): THREE.PerspectiveCamera {
    if (this.camera === null) {
      throw new Error("No camera")
    }
    return this.camera
  }

  onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.getRenderer().setSize(width, height);
    this.getCamera().aspect = width / height
    this.getCamera().updateProjectionMatrix()
  }

  setup() {
    window.addEventListener("resize", this.onWindowResize.bind(this))

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setSize(width, height);
    renderer.setPixelRatio(2)
    renderer.domElement.className = style.threeCanvas
    document.body.appendChild(renderer.domElement);
    this.renderer = renderer

    const scene = new THREE.Scene();
    this.scene = scene
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 30)
    camera.lookAt(0, 0, 0)
    this.camera = camera

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

  async loadGltf(url: string) {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url)
    const scene = gltf.scene
    if (scene.children.length > 0) {
      this.getScene().add(scene)
    }
  }

  async load (url: string) {
    const sandboxId = this.nextSandboxId
    try {
      const group = new THREE.Group()
      const sandbox = new Sandbox(sandboxId, group)
      const res = await fetch(url)
      const blob  = await res.blob()
      const buf = await blob.arrayBuffer()
      const source = await WebAssembly.instantiate(buf, {
        ...sandbox.createImports(),
      })
      this.getScene().add(group)
      sandbox.setWasm(source.instance)
      sandbox.onStart()
      this.sandboxMap.set(sandboxId, sandbox)
      this.nextSandboxId += 1
    } catch(e) {
      console.log(e)
    }
  }

  deleteSandbox(sandboxId: number) {
    const sandbox = this.sandboxMap.get(sandboxId)
    if (sandbox) {
      this.getScene().remove(sandbox.getContainer())
    } else {
      throw new Error("No sandbox ID: " + sandboxId)
    }
  }

  deleteAllSandboxes() {
    for (let sandbox of this.sandboxMap.values()) {
      this.getScene().remove(sandbox.getContainer())
    }
    this.sandboxMap = new Map<number, Sandbox>()
  }
}