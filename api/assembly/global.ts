import { ObjectEventManager } from "./objects/ObjectEventManager"

import { GltfLoader } from "./GltfLoader"
import { SkyManager } from "./SkyManager"

export const objectEventManager = new ObjectEventManager()
export const gltfLoader = new GltfLoader()
export const skyManager = new SkyManager()