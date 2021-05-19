import express from "express"
import {
  UnknownError,
  BadRequestError,
  ApiError,
} from "./errors"

export default function handleApiError(
  error: Error,
  _: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (error instanceof ApiError) {
    if (error instanceof UnknownError) {
      res.status(500)
    } else if (error instanceof BadRequestError) {
      res.status(400)
    } else {
      res.status(500)
    }
    res.json({
      code: error.code,
      message: error.message
    })
  } else {
    next(error)
  }
}
