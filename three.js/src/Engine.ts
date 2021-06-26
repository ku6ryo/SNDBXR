import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import { SandboxManager } from "./SandboxManager"
import style from "./style.scss"

/**
 * The root controller of rendering scene by three.js
 */
export class Engine {

  private renderer: WebGLRenderer
  private scene: Scene
  private camera: PerspectiveCamera
  private sandboxManager: SandboxManager

  constructor() {
    this.renderer = new WebGLRenderer({ alpha: true });
    window.addEventListener("resize", this.onWindowResize.bind(this))
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(2)
    this.renderer.domElement.className = style.threeCanvas

    this.scene = new Scene();

    const camera = new PerspectiveCamera(45, width / height, 1, 10000)
    camera.position.set(0, 0, 30)
    camera.lookAt(0, 0, 0)
    this.camera = camera

    const light = new DirectionalLight(0xffffff)
    light.position.set(1, 1, 1);
    this.scene.add(light);

    this.sandboxManager = new SandboxManager(this.scene)
  }

  /**
   * Adds canvas to HTML document.
   */
  addToDocument() {
    document.body.appendChild(this.renderer.domElement)
  }

  /**
   * Starts rendering.
   */
  start() {
    const tick = (): void => {
      requestAnimationFrame(tick)
      this.renderer.render(this.scene, this.camera)
      this.sandboxManager.update()
    }
    tick()
  }

  onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  async createSandbox(url: string) {
    return this.sandboxManager.create(url)
  }

  deleteSandbox(id: number) {
    this.sandboxManager.delete(id)
  }

  deleteAllSandboxes() {
    this.sandboxManager.deleteAll()
  }
}