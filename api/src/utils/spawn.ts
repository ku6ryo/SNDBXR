import * as childProcess from "child_process"

/**
 * Promisify wrapper of spawn.
 * https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @param {string} cmd The command to run.
 * @param {args[]} args List of string arguments.
 */
export default function spawn(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let p = childProcess.spawn(cmd, args)

    p.on('exit', code => {
      if (code == 0) {
        resolve()
      } else {
        const error = new Error(`Command "${cmd}" exited with non-zero status.`)
        reject(error)
      }
    })
    p.on('error', e => {
      console.error(e)
    })
    p.stdout.setEncoding('utf-8')
    p.stdout.on('data', data => {
      console.log(data)
    })
    p.stderr.on('data', data => {
      console.error(data)
    })
  })
}