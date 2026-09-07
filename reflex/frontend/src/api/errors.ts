
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function getUserFriendlyError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "The information provided is not valid.";

      case 401:
        return "Your session has expired. Please sign in again.";

      case 403:
        return "You do not have permission to perform this action.";

      case 404:
        return "The requested delivery could not be found.";

      case 409:
        return "This action conflicts with the current delivery state.";

      case 408:
        return "The request took too long. Please try again.";

      default:
        if (error.status >= 500) {
          return "Reflex is temporarily unavailable. Please try again.";
        }

        return error.message;
    }
  }

  if (error instanceof TypeError) {
    return "Unable to connect to the Reflex server.";
  }

  return "Something went wrong. Please try again.";
}

