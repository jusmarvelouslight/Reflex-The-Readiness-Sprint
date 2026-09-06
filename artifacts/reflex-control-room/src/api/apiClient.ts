import API_BASE_URL from "../config/api";
import { ApiError } from "./errors";
interface RequestOptions extends RequestInit {
 token?: string;
}
const REQUEST_TIMEOUT_MS = 20_000;
async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
 const { token, headers, ...fetchOptions } = options;
 const controller = new AbortController();
 const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
 const requestHeaders = new Headers(headers);
 if (!requestHeaders.has("Content-Type") && fetchOptions.body) {
 requestHeaders.set("Content-Type", "application/json");
 }
 if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
 try {
 const response = await fetch(`${API_BASE_URL}${endpoint}`, {
 ...fetchOptions,
 headers: requestHeaders,
 signal: controller.signal,
 });
 const contentType = response.headers.get("content-type") ?? "";
 const responseData: unknown = contentType.includes("application/json")
 ? await response.json().catch(() => null)
 : await response.text().catch(() => "");
 if (!response.ok) {
 const data = responseData && typeof responseData === "object"
 ? (responseData as { message?: string; error?: { message?: string }; code?: string })
 : undefined;
 throw new ApiError(
 data?.message || data?.error?.message || `Request failed with status ${response.status}.`,
 response.status,
 data?.code,
 );
 }
 return responseData as T;
 } catch (error) {
 if (error instanceof DOMException && error.name === "AbortError") {
 throw new ApiError("The request timed out. Please try again.", 408);
 }
 if (error instanceof TypeError) {
 throw new ApiError("Unable to connect to the Reflex server.", 0);
 }
 throw error;
 } finally {
 window.clearTimeout(timeoutId);
 }
}
export default apiClient;