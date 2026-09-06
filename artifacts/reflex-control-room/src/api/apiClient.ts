import { API_BASE_URL } from "../config/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

const REQUEST_TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    status = 0,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export default async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    token,
    headers,
    ...fetchOptions
  } = options;

  const controller = new AbortController();

  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  const requestHeaders = new Headers(headers);

  requestHeaders.set(
    "Accept",
    "application/json"
  );

  if (
    fetchOptions.body &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  const storedToken =
    token ||
    window.localStorage.getItem(
      "reflex_token"
    );

  if (storedToken) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${storedToken}`
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    const data = contentType.includes(
      "application/json"
    )
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      const body =
        data &&
        typeof data === "object"
          ? data as {
              error?: {
                message?: string;
                code?: string;
              };
              message?: string;
            }
          : undefined;

      throw new ApiError(
        body?.error?.message ||
          body?.message ||
          `Request failed with status ${response.status}.`,
        response.status,
        body?.error?.code
      );
    }

    return data as T;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new ApiError(
        "The request timed out. Please try again.",
        408
      );
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Unable to connect to the Reflex server.",
        0
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}