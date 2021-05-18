// OBJECT/GENERAL
export const GET_OBJECT_ID_BY_NAME = 1000
export const CREATE_PRIMITIVE_OBJECT = 1001
export const SET_OBJECT_POSITION = 1100
export const GET_OBJECT_POSITION = 1101
export const SET_OBJECT_ROTATION = 1110
export const GET_OBJECT_ROTATION = 1111
export const SET_OBJECT_SCALE = 1120
export const GET_OBJECT_SCALE = 1121

// OBJECT/MATERIAL
export const GET_MATERIAL_OF_OBJECT = 1200
// OBJECT/EVENT
export const SET_OBJECT_EVENT_LISTENER = 1300

// MATERIAL/GENERAL
export const GET_MATERIAL_ID_BY_NAME = 2000
// MATERIAL/COLOR
export const SET_MATERIAL_COLOR = 2100

// Loader
export const LOAD_GLTF = 3000

export const LOAD_SKY = 4000

// FROM Sandbox
export const SANDBOX_ON_OBJECT_EVENT = 10000
export const SANDBOX_ON_GLTF_LOADED = 10010
export const SANDBOX_ON_SKY_LOADED = 10020

export class Connector {

  wasmModule: any = null;

  setWasmModule(module: any) {
    this.wasmModule = module;
  }

  execI_I(funcId: number, i0: number) {
    return 0;
  }

  execI_II(funcId: number, i0: number, i1: number) {
    return 0;
  }

  execI_S(funcId: number, ptr: number, len: number) {
    const strArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(ptr, ptr + len))
    const str = String.fromCharCode.apply(null, strArray)
    return 0;
  }

  execI_IV3(funcId: number, i0: number, f0: number, f1: number, f2: number) {
    return 0;
  }

  execI_IV4(funcId: number, i0: number, f0: number, f1: number, f2: number, f3: number) {
    return 0;
  }

  _logString(ptr: number, len: number) {
    const strArray = new Uint8Array(this.wasmModule.exports.memory.buffer.slice(ptr, ptr + len))
    this.logString(String.fromCharCode.apply(null, strArray))
  }

  logString(str: string) {
    console.log(str)
    return;
  }

  logInt(i: number) {
    console.log(i)
    return;
  }

  logFloat(f: number) {
    console.log(f)
    return;
  }

  createImports() {
    const imports = {
      env: {
        execI_I: this.execI_I.bind(this),
        execI_II: this.execI_II.bind(this),
        execI_S: this.execI_S.bind(this),
        execI_IV3: this.execI_IV3.bind(this),
        execI_IV4: this.execI_IV4.bind(this),
        logString: this._logString.bind(this),
        logInt: this.logInt.bind(this),
        logFloat: this.logFloat.bind(this),
      },
    };
    return imports
  }
}