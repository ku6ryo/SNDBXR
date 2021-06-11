import { BaseObject } from "./BaseObject";

export enum Primitive {
  CUBE = 0,
  SPHERE = 1,
}

/**
 * Creates a primitive object.
 */
export function createPrimitive(type: PrimitiveType): Object {
  const id = callEngine_i_i(CREATE_PRIMITIVE_OBJECT, type)[0].vi32;
  return new Object(id, eventManager);
}

export class MeshObject extends BaseObject {
  static createPrimitive(type: Primitive) {

  }
}