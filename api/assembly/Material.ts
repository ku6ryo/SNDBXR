import { Color } from "./Color"
import {
  callEngine_i_iffff,
  // callEngine_i_s,
} from "./gate"
import {
  SET_MATERIAL_COLOR,
  GET_MATERIAL_ID_BY_NAME,
} from "./function_ids"

export const MATERIAL_NOT_FOUND_ID = -1

/*
export function getMaterialByName(name: string): Material | null {
  const id = callEngine_i_s(GET_MATERIAL_ID_BY_NAME, name)
  if (id === MATERIAL_NOT_FOUND_ID) {
    return null
  } 
  return new Material(id)
}
*/

export class Material {
  id: i32

  constructor (id: i32) {
    this.id = id;
  }

  setColor(color: Color): i32 {
    return callEngine_i_iffff(
      SET_MATERIAL_COLOR,
      this.id,
      color.r,
      color.g,
      color.b,
      color.a
    )[0].vi32
  }
}