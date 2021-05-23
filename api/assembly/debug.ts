import {
  log as gateLog,
  logFloat as gateLogFloat,
  logInt as gateLogInt
} from "./gate"

// Just aliases.
export function log(message: string): void {
  gateLog(message)
}

export function logInt(value: i32): void {
  gateLogInt(value)
}

export function logFloat(value: f32): void {
  gateLogFloat(value)
}
