// Standard Success Structure
export interface ApiResponse<T> {
  success: true;
  data: T;
}

// Standard Error Structure
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown; // Optional extra debugging info
  };
}

// Helper function for sending success responses
export const sendSuccess = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

// Helper function for sending error responses
export const sendError = (code: string, message: string, details?: unknown): ApiErrorResponse => {
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  // Safely assign details if they exist without using spread syntax
  if (details !== undefined) {
    errorResponse.error.details = details;
  }

  return errorResponse;
};
