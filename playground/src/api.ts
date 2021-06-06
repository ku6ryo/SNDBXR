export class ApiClient {

  host: string

  constructor(host: string) {
    this.host = host
  }

  async compile(code: string) {
    const res = await fetch(this.host + "/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: code
    })
    if (res.status === 200) {
      return await res.json() as {
        id: string,
        wasm: {
          path: string,
          size: number
        },
        wat: {
          path: string,
          size: number
        }
      }
    } else {
      const json = await res.json()
      throw new Error(json.message)
    }
  }
}