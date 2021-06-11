import { ObjectEventManager } from "./objects/ObjectEventManager"
import { GLTFLoaderManager } from "./loaders/GLTFLoaderManager"
import { SkyManager } from "./SkyManager"

export const objectEventManager = new ObjectEventManager()
export const gltfLoaderManager = new GLTFLoaderManager()
export const skyManager = new SkyManager()