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
      const json = await res.json()
      return json
    } else {
      const json = await res.json()
      throw new Error(json.message)
    }
  }
}