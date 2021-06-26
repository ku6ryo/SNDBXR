import { decodeMulti, encode } from "@msgpack/msgpack"
import { LOAD_RESOURCE_ON_COMPLETE } from "./function_ids"
import { Sandbox } from "../Sandbox"
import { TextureService } from "../services/TextureService"
import {
  LOAD_RESOURCE,
} from "./function_ids"
import { ObjectService } from "../services/ObjectService"
import { ResourceManager } from "../ResourceManager"

export enum ResourceType {
  Unknown = 0,
  Texture = 1,
  Gltf = 2,
}

/**
 * Resource related API interfaces.
 */
export class ResourceLoaderInterface {

  nextLoaderId = 0

  constructor(
    private sandbox: Sandbox,
    private resourceManager: ResourceManager,
    private textureService: TextureService,
    private objectService: ObjectService,
  ) {}

  registerFuncs(sandbox: Sandbox) {
    sandbox.registerFunc(LOAD_RESOURCE, this.load.bind(this))
  }

  load(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const filePath = decoded.next().value as string
    const type = decoded.next().value as number
    const loaderId = this.nextLoaderId
    if (type === ResourceType.Texture) {
      this.loadTexture(loaderId, filePath)
    } else if (type === ResourceType.Gltf) {
      this.loadGltf(loaderId, filePath)
    } else {
      throw new Error("The type not supported. " + type)
    }
    this.nextLoaderId += 1
    return encode(loaderId)
  }
  
  async loadGltf(loaderId: number, filePath: string) {
    const status = 0
    const blob = await this.resourceManager.getAsBlob(filePath)
    const texId = await this.objectService.loadGltf(blob)
    this.sandbox.callSanbdbox(LOAD_RESOURCE_ON_COMPLETE, encode([loaderId, status, texId]))
  }

  async loadTexture(loaderId: number, filePath: string) {
    const status = 0
    const blob = await this.resourceManager.getAsBlob(filePath)
    const texId = await this.textureService.createTexture(blob)
    this.sandbox.callSanbdbox(LOAD_RESOURCE_ON_COMPLETE, encode([loaderId, status, texId]))
  }
}