import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001").replace(
  /\/$/,
  ""
);
const csrfEndpoint = process.env.NEXT_PUBLIC_CSRF_ENDPOINT ?? "/api/csrf-cookie";
const xsrfCookieName = "XSRF-TOKEN";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  xsrfCookieName,
  xsrfHeaderName: "x-csrf-token",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
}

function extractErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object") {
    const data = payload as {
      message?: unknown;
      errors?: {
        fieldErrors?: Record<string, string[]>;
        formErrors?: string[];
      };
    };

    const fieldError = data.errors?.fieldErrors
      ? Object.values(data.errors.fieldErrors).flat().find(Boolean)
      : undefined;
    const formError = data.errors?.formErrors?.find(Boolean);

    if (typeof fieldError === "string") {
      return fieldError;
    }

    if (typeof formError === "string") {
      return formError;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Terjadi kesalahan saat menghubungi server";
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const details = error.response?.data;
      const message = details
        ? extractErrorMessage(details)
        : error.message || "Tidak dapat terhubung ke server";

      if (typeof window !== "undefined" && status === 401 && !window.location.pathname.startsWith("/login")) {
        const nextPath = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/login?next=${encodeURIComponent(nextPath)}`);
      }

      return Promise.reject(new ApiError(message, status, details));
    }

    return Promise.reject(error);
  }
);

export async function ensureCsrfCookie() {
  if (!csrfEndpoint || typeof window === "undefined") {
    return;
  }

  if (!readCookie(xsrfCookieName)) {
    await http.get(csrfEndpoint);
  }

  const token = readCookie(xsrfCookieName);
  if (token) {
    http.defaults.headers.common["x-csrf-token"] = token;
  }
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}
