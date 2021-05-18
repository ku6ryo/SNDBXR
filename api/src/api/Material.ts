import { Color } from "./Color"
import {
  SET_MATERIAL_COLOR,
  GET_MATERIAL_ID_BY_NAME,
  execI_IV4,
  execI_S,
} from "./env"
import { allocString } from "./memory"

export const MATERIAL_NOT_FOUND_ID = -1

export function getMaterialByName(name: string): Material | null {
  const ptr = allocString(name)
  const id = execI_S(GET_MATERIAL_ID_BY_NAME, ptr, name.length)
  heap.free(ptr)
  if (id === MATERIAL_NOT_FOUND_ID) {
    return null
  } 
  return new Material(id)
}

export class Material {
  id: i32

  constructor (id: i32) {
    this.id = id;
  }

  setColor(color: Color): i32 {
    return execI_IV4(
      SET_MATERIAL_COLOR,
      this.id,
      color.r,
      color.g,
      color.b,
      color.a
    )
  }
}