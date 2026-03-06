export type ApiErrorPayload = {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiRequestError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.errors = errors
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unexpected error."
}

