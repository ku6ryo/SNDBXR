import { decode, decodeMulti, encode } from "@msgpack/msgpack"
import { Sandbox } from "../Sandbox"
import { ObjectService } from "../services/ObjectService"
import {
  CREATE_PRIMITIVE_OBJECT,
  GET_OBJECT_POSITION,
  SET_OBJECT_POSITION,
  SET_OBJECT_SCALE,
  GET_OBJECT_SCALE,
  SET_MATERIAL_OF_OBJECT,
  GET_OBJECT_BY_NAME,
  SET_OBJECT_NAME,
  GET_OBJECT_NAME,
  SET_OBJECT_QUATERNION,
  GET_OBJECT_QUATERNION,
} from "./function_ids"

/**
 * Object related API interfaces.
 */
export class ObjectServiceInterface {

  constructor(private objectService: ObjectService) {}

  registerFuncs(sandbox: Sandbox) {
    sandbox.registerFunc(CREATE_PRIMITIVE_OBJECT, this.createPrimitive.bind(this))
    sandbox.registerFunc(SET_MATERIAL_OF_OBJECT, this.setMaterial.bind(this))
    sandbox.registerFunc(GET_OBJECT_POSITION, this.getPosition.bind(this))
    sandbox.registerFunc(SET_OBJECT_POSITION, this.setPosition.bind(this))
    sandbox.registerFunc(GET_OBJECT_SCALE, this.getScale.bind(this))
    sandbox.registerFunc(SET_OBJECT_SCALE, this.setScale.bind(this))
    sandbox.registerFunc(GET_OBJECT_BY_NAME, this.getByName.bind(this))
    sandbox.registerFunc(SET_OBJECT_NAME, this.setName.bind(this))
    sandbox.registerFunc(GET_OBJECT_NAME, this.getName.bind(this))
    sandbox.registerFunc(SET_OBJECT_QUATERNION, this.setQuaternion.bind(this))
    sandbox.registerFunc(GET_OBJECT_QUATERNION, this.getQuaternion.bind(this))
  }

  createPrimitive(ua: Uint8Array) {
    const type = decode(ua) as number
    const id = this.objectService.createPrimitive(type)
    return encode(id)
  }

  setMaterial(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const materialId = decoded.next().value as number
    this.objectService.setMaterial(objectId, materialId)
    return encode(0)
  }

  setPosition(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const x = decoded.next().value as number
    const y = decoded.next().value as number
    const z = decoded.next().value as number
    this.objectService.setPosition(objectId, x, y, z)
    return encode(0)
  }

  getPosition(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const v = this.objectService.getPosition(objectId)
    return encode([v.x, v.y, v.z])
  }

  setScale(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const x = decoded.next().value as number
    const y = decoded.next().value as number
    const z = decoded.next().value as number
    this.objectService.setScale(objectId, x, y, z)
    return encode(0)
  }

  getScale(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const v = this.objectService.getScale(objectId)
    return encode([v.x, v.y, v.z])
  }

  setQuaternion(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const x = decoded.next().value as number
    const y = decoded.next().value as number
    const z = decoded.next().value as number
    const w = decoded.next().value as number
    this.objectService.setQuaternion(objectId, x, y, z, w)
    return encode(0)
  }

  getQuaternion(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const q = this.objectService.getQuaternion(objectId)
    return encode([q.x, q.y, q.z, q.w])
  }

  getByName(ua: Uint8Array) {
    const name = decode(ua) as string
    const id = this.objectService.getByName(name)
    if (id) {
      return encode(id)
    } else {
      return encode(-1)
    }
  }

  getName(ua: Uint8Array) {
    const objectId = decode(ua) as number
    const name = this.objectService.getName(objectId)
    return encode(name)
  }

  setName(ua: Uint8Array) {
    const decoded = decodeMulti(ua)
    const objectId = decoded.next().value as number
    const name = decoded.next().value as string
    this.objectService.setName(objectId, name)
    return encode(0)
  }
}