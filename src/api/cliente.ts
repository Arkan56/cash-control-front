const BASE_URL = "http://localhost:3000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

type FetchOptions = RequestInit & { skipAuth?: boolean };

export const apiFetch = async (path: string, options: FetchOptions = {}) => {
  const { skipAuth, headers, ...rest } = options;
  const token = getToken();

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
    ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = "/";
    throw new ApiError("No autorizado", 401);
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(errData?.message ?? "Error en la petición", response.status);
  }

  return response.json();
};