interface CustomError {
  status: number;
  message: string;
  data?: any;
}

type Res<T> = { data?: T; message?: string };

async function http<T>(url: string, config: RequestInit = {}): Promise<Res<T>> {
  const headers = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  try {
    const response = await fetch(url, { ...config, headers });

    // Safely parse the response (JSON or text)
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Reject with a custom error object so your catch blocks get useful info
      return Promise.reject({
        status: response.status,
        message: response.statusText,
        data,
      } as CustomError);
    }

    return data as Res<T>;
  } catch (error) {
    // Catch network errors (e.g., no internet, CORS issues)
    return Promise.reject(error);
  }
}

// Convenience methods so you don't have to manually stringify bodies or set methods
export const api = {
  get: <T>(url: string, config?: RequestInit) =>
    http<T>(url, { ...config, method: "GET" }),

  post: <T, U = any>(url: string, body: U, config?: RequestInit) =>
    http<T>(url, { ...config, method: "POST", body: JSON.stringify(body) }),

  put: <T, U = any>(url: string, body: U, config?: RequestInit) =>
    http<T>(url, { ...config, method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(url: string, config?: RequestInit) =>
    http<T>(url, { ...config, method: "DELETE" }),
};
