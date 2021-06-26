/**
 * When extends this library, please do not use numbers less than this
 * or equal to this value as IDs.
 */
export const PREVERVED_MAX_ID = 1000_000_000

export const LOG = 100

// OBJECT/GENERAL
export const GET_OBJECT_ID_BY_NAME = 1000
export const CREATE_PRIMITIVE_OBJECT = 1001
export const SET_OBJECT_POSITION = 1100
export const GET_OBJECT_POSITION = 1101
export const SET_OBJECT_ROTATION = 1110
export const GET_OBJECT_ROTATION = 1111
export const SET_OBJECT_QUATERNION = 1112
export const GET_OBJECT_QUATERNION = 1113
export const SET_OBJECT_SCALE = 1120
export const GET_OBJECT_SCALE = 1121
export const SET_OBJECT_NAME = 1130
export const GET_OBJECT_NAME = 1131

// OBJECT/MATERIAL
export const GET_MATERIAL_OF_OBJECT = 1200
export const SET_MATERIAL_OF_OBJECT = 1201

// OBJECT/EVENT
export const SET_OBJECT_EVENT_LISTENER = 1300

// MATERIAL/GENERAL
export const GET_MATERIAL_ID_BY_NAME = 2000
export const CREATE_MATERIAL = 2001
// MATERIAL/COLOR
export const SET_MATERIAL_COLOR = 2100
export const SET_MATERIAL_COLOR_MAP = 2110

// Loader
export const LOAD_SKY = 4000

export const LOAD_RESOURCE = 5000
export const LOAD_RESOURCE_ON_PROGRESS = 5001
export const LOAD_RESOURCE_ON_COMPLETE = 5002

// FROM Sandbox
export const SANDBOX_ON_OBJECT_EVENT = 10000
export const SANDBOX_ON_GLTF_LOADED = 10010
export const SANDBOX_ON_SKY_LOADED = 10020