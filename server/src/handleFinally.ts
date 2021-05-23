import express from "express"

export default function handleFinally(
  req: express.Request,
  res: express.Response,
  _: express.NextFunction,
) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("not_found", { url: req.url })
    return
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" })
    return
  }

  // default to plain-text. send()
  res.type("txt").send("Not found")
}