import { decodeMulti, encode } from "@msgpack/msgpack"
import { LOAD_RESOURCE_ON_COMPLETE } from "./function_ids"
import { Sandbox } from "../Sandbox"
import { TextureService } from "../services/TextureService"
import {
  LOAD_RESOURCE,
} from "./function_ids"

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
    private textureService: TextureService
  ) {}

  registerFuncs(sandbox: Sandbox) {
    sandbox.registerFunc(LOAD_RESOURCE, this.load.bind(this))
  }

  load(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const filePath = decoded.next().value as string
    const type = decoded.next().value as number
    const loaderId = this.nextLoaderId
    ;(async () => {
      if (type === ResourceType.Texture) {
        const status = 0
        const texId = await this.textureService.createTexture(filePath)
        this.sandbox.callSanbdbox(LOAD_RESOURCE_ON_COMPLETE, encode([loaderId, status, texId]))
      }
    })()
    this.nextLoaderId += 1
    return encode(loaderId)
  }
}