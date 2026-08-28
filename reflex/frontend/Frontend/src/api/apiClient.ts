```typescript
import API_BASE_URL from "../config/api";
import { ApiError } from "./errors";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const requestHeaders = new Headers(headers);

  requestHeaders.set("Content-Type", "application/json");

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  let responseData: unknown = null;

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const data = responseData as {
      message?: string;
      code?: string;
    };

    throw new ApiError(
      data?.message || "The request could not be completed.",
      response.status,
      data?.code,
    );
  }

  return responseData as T;
}

export default apiClient;
```
