
export enum ApiErrorCode {
  UNKNOWN = "api/general/0",
  BAD_REQUEST = "api/general/1",
  NOT_FOUND = "api/general/2",
  INTERNAL_SERVER_ERROR = "api/general/3",
}

export class ApiError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
}

export class UnknownError extends ApiError {
  constructor(message?: string) {
    super("Unknown Error: " + message || "", ApiErrorCode.UNKNOWN)
  }
}

export class BadRequestError extends ApiError {
  constructor(message?: string) {
    super("Bad Request: " + message || "", ApiErrorCode.BAD_REQUEST)
  }
}

export class NotFoundError extends ApiError {
  constructor(message?: string) {
    super("Not Found: " + message || "", ApiErrorCode.NOT_FOUND)
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string) {
    super("Bad Request: " + message || "", ApiErrorCode.INTERNAL_SERVER_ERROR)
  }
}
